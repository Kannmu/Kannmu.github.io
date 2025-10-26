import * as THREE from "https://esm.sh/three";
import { random, randomFloat, randomInt, choice } from '../util/random.js';
import { GEOMETRY_CONFIG } from '../config/constants.js';
import { calculateTubeSegments } from '../util/geometry.js';

// Frenet frames缓存，避免重复计算
const frenetFramesCache = new WeakMap();


export function createGeometry(parameters, structure) {
    const geometries = [];

    function _createBranch(node, parentNode) {
        if (!node.curve) {
            for (const child of node.children) {
                _createBranch(child, node);
            }
            return;
        }

        const startRadius = node.startRadius;
        const endRadius = node.endRadius;
        const { TUBE_MESH } = GEOMETRY_CONFIG;
        const { radialSegments, tubularSegments } = calculateTubeSegments(
            startRadius,
            node.curve.getLength(),
            TUBE_MESH
        );

        const meshData = generateTubeMesh(node.curve, tubularSegments, radialSegments, startRadius, endRadius);

        // 分支与父节点连接的核心逻辑
        if (parentNode && parentNode.curve && typeof node.attachmentT === 'number') {
            // 确保父节点的Frenet框架已计算并缓存，避免重复计算
            if (!parentNode.tubularSegments) {
                const parentSegments = calculateTubeSegments(
                    parentNode.startRadius,
                    parentNode.curve.getLength(),
                    TUBE_MESH
                );
                parentNode.tubularSegments = parentSegments.tubularSegments;
            }
            if (!parentNode.frenetFrames) {
                parentNode.frenetFrames = parentNode.curve.computeFrenetFrames(parentNode.tubularSegments, false);
            }

            const parentFrames = parentNode.frenetFrames;
            const parentTubularSegments = parentNode.tubularSegments;
            const t_parent = node.attachmentT;

            const parentPoint = parentNode.curve.getPointAt(t_parent);
            const parentRadius = THREE.MathUtils.lerp(parentNode.startRadius, parentNode.endRadius, t_parent);

            // Find the closest frame on the parent curve to the attachment point.
            const parentFrameIndex = Math.round(t_parent * parentTubularSegments);
            const parentTangent = parentFrames.tangents[parentFrameIndex];

            // Define a transition length for smoothing the joint.
            const { BRANCH_STITCHING } = GEOMETRY_CONFIG;
            const transitionDistance = parentRadius * BRANCH_STITCHING.TRANSITION_DISTANCE_MULTIPLIER; 

            const childBranchLength = node.curve.getLength();
            const transitionSegments = Math.min(
                tubularSegments,
                Math.max(
                    BRANCH_STITCHING.MIN_TRANSITION_SEGMENTS, 
                    Math.ceil((transitionDistance / childBranchLength) * tubularSegments)
                )
            );

            // Pre-calculate the target normals on the parent surface for each radial angle.
            const targetNormals = [];
            for (let j = 0; j <= radialSegments; j++) {
                const baseVertexIndex = j * 3;
                const baseVertex = new THREE.Vector3().fromArray(meshData.vertices, baseVertexIndex);
                const offsetVector = baseVertex.clone().sub(parentPoint);
                const tangentProjection = parentTangent.clone().multiplyScalar(offsetVector.dot(parentTangent));
                const perpendicularVector = offsetVector.clone().sub(tangentProjection);
                targetNormals.push(perpendicularVector.clone().normalize());
            }

            // Apply the transition over the initial segments of the child branch.
            for (let i = 0; i < transitionSegments; i++) {
                // lerpFactor goes from 1.0 at the base (i=0) to 0.0 at the end of the transition.
                const lerpFactor = (transitionSegments <= 1) ? 1.0 : 1.0 - (i / (transitionSegments - 1));

                const t_child = i / tubularSegments;
                const childCenterPoint = node.curve.getPointAt(t_child);
                const actualRadiusAt_i = Math.max(
                    TUBE_MESH.MIN_RADIUS, 
                    THREE.MathUtils.lerp(node.startRadius, node.endRadius, t_child)
                );

                // Interpolate center point, from parent attachment point to child's curve.
                const interpolatedCenter = childCenterPoint.clone().lerp(parentPoint, lerpFactor);

                for (let j = 0; j <= radialSegments; j++) {
                    const vertexIndex = (i * (radialSegments + 1) + j) * 3;

                    const originalNormal = new THREE.Vector3().fromArray(meshData.normals, vertexIndex);
                    const targetNormal = targetNormals[j];

                    // Interpolate the vertex normal.
                    const newNormal = originalNormal.clone().lerp(targetNormal, lerpFactor).normalize();
                    newNormal.toArray(meshData.normals, vertexIndex);

                    // Interpolate the branch radius.
                    const interpolatedRadius = THREE.MathUtils.lerp(actualRadiusAt_i, parentRadius, lerpFactor);

                    // Calculate the new vertex position from the interpolated properties.
                    const newVertex = interpolatedCenter.clone().add(newNormal.clone().multiplyScalar(interpolatedRadius));
                    newVertex.toArray(meshData.vertices, vertexIndex);
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(meshData.vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(meshData.normals, 3));
        geometry.setIndex(meshData.indices);

        geometries.push({ geometry: geometry, node: node });

        for (const child of node.children) {
            _createBranch(child, node);
        }
    }

    _createBranch(structure, null);
    return geometries;
}

/**
 * Generates the vertices, normals, and indices for a tapered tube geometry along a curve.
 * This function encapsulates the core logic of creating the tube mesh.
 * @param {THREE.Curve} curve - The path of the tube.
 * @param {number} tubularSegments - The number of segments along the curve.
 * @param {number} radialSegments - The number of segments around the tube's circumference.
 * @param {number} startRadius - The radius at the start of the tube.
 * @param {number} endRadius - The radius at the end of the tube.
 * @returns {{vertices: number[], normals: number[], indices: number[]}}
 */
function generateTubeMesh(curve, tubularSegments, radialSegments, startRadius, endRadius) {
    // 检查Frenet frames缓存
    const cacheKey = `${tubularSegments}`;
    let frames;
    
    if (frenetFramesCache.has(curve)) {
        const cachedFrames = frenetFramesCache.get(curve);
        if (cachedFrames[cacheKey]) {
            frames = cachedFrames[cacheKey];
        } else {
            frames = curve.computeFrenetFrames(tubularSegments, false);
            cachedFrames[cacheKey] = frames;
        }
    } else {
        frames = curve.computeFrenetFrames(tubularSegments, false);
        frenetFramesCache.set(curve, { [cacheKey]: frames });
    }
    
    const { normals: frameNormals, binormals } = frames;

    const vertices = [];
    const vertexNormals = [];
    const indices = [];

    for (let i = 0; i <= tubularSegments; i++) {
        const t = i / tubularSegments;
        const point = curve.getPointAt(t);
        const radius = Math.max(0.01, THREE.MathUtils.lerp(startRadius, endRadius, t));

        const normal = frameNormals[i];
        const binormal = binormals[i];

        for (let j = 0; j <= radialSegments; j++) {
            const angle = (j / radialSegments) * Math.PI * 2;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const vertexNormal = new THREE.Vector3(
                cos * normal.x + sin * binormal.x,
                cos * normal.y + sin * binormal.y,
                cos * normal.z + sin * binormal.z
            ).normalize();
            vertexNormals.push(vertexNormal.x, vertexNormal.y, vertexNormal.z);

            const vertex = new THREE.Vector3()
                .copy(point)
                .add(vertexNormal.clone().multiplyScalar(radius));
            vertices.push(vertex.x, vertex.y, vertex.z);
        }
    }

    for (let i = 0; i < tubularSegments; i++) {
        for (let j = 0; j < radialSegments; j++) {
            const a = i * (radialSegments + 1) + j;
            const b = a + 1;
            const c = (i + 1) * (radialSegments + 1) + j;
            const d = c + 1;
            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    return { vertices, normals: vertexNormals, indices };
}
