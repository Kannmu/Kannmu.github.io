import * as THREE from "../three";
import { random, randomFloat, randomFloatNormal, randomFloatSurprise, randomInt, choice } from '../util/random.js';
import { GENERATOR_CONFIG } from '../config/constants.js';
import { createPerpendicularVector, safeNormalize } from '../util/geometry.js';
import { clamp } from '../util/math.js';

export function createStructure(parameters) {
    let structure;

    switch (parameters.archetype.type) {
        case "tree":
            structure = generateTreeStructure(parameters);
            break;
        default:
            break;
    }

    return structure;
}


function generateTreeStructure(parameters) {

    let nodeCounter = 0;

    // 1. 首先，计算所有根节点的初始参数
    const { TREE_STRUCTURE } = GENERATOR_CONFIG;
    const { ROOT_LENGTH, LENGTH_TO_RADIUS_RATIO } = TREE_STRUCTURE;
    
    const rootLength = ROOT_LENGTH.BASE + 
        randomFloatNormal(0.5, 0.2) * parameters.archetype.growthForm;

    // 半径与长度相关，更符合物理规律
    const lengthToRadiusRatio = randomFloatNormal(0.05, 0.015);
    const rootStartRadius = rootLength * lengthToRadiusRatio * 
        randomFloatNormal(1.0, 0.2);

    const { min, max } = parameters.structure.trunk.taperRange;
    const rootEndRadius = rootStartRadius * randomFloat(min, max);

    // 提取方向计算，使其更清晰
    const { INITIAL_ORIENTATION } = TREE_STRUCTURE;
    const initialOrientation = new THREE.Vector3(
        randomFloat(INITIAL_ORIENTATION.X_RANGE.MIN, INITIAL_ORIENTATION.X_RANGE.MAX),
        INITIAL_ORIENTATION.Y_VALUE,
        randomFloat(INITIAL_ORIENTATION.Z_RANGE.MIN, INITIAL_ORIENTATION.Z_RANGE.MAX)
    ).normalize();

    const rootStartPoint = new THREE.Vector3(0, 0, 0);
    const rootCurve = calculateBranchCurve(
        rootStartPoint,
        initialOrientation,
        rootLength,
        parameters.structure.trunk.curviness,
        initialOrientation
    );


    // 2. 使用计算好的参数构建根节点
    const root = {
        id: nodeCounter++,
        parentID: null,
        type: "trunk",
        level: 0,
        curve: rootCurve,
        startRadius: rootStartRadius,
        endRadius: rootEndRadius,
        children: [],
        attachments: []
    };

    function _expandNode(parentNode, currentLevel) {
        // 1. 停止条件：检查是否达到最大深度
        const maxLevels = parameters.structure.branching.levels;
        if (currentLevel >= maxLevels) {
            return;
        }

        // 2. 决定分支数量
        const { min, max } = parameters.structure.branching.branchesPerSplit;
        const numBranches = randomInt(min, max);
        if (numBranches === 0) {
            return;
        }
        
        const parentCurve = parentNode.curve;
        const parentLength = parentCurve.getLength();

        // 预计算所有潜在子分支的分支点
        const { BRANCHING } = TREE_STRUCTURE;
        const branchPoints = [];
        for (let i = 0; i < numBranches; i++) {
            const isLeader = (i === 0 && currentLevel < BRANCHING.LEADER_LEVEL_THRESHOLD);
            const branchPointT = isLeader ? 1.0 : randomFloat(BRANCHING.BRANCH_POINT_RANGE.MIN, BRANCHING.BRANCH_POINT_RANGE.MAX);
            branchPoints.push(branchPointT);
        }

        // 管道模型：预计算所有子分支的半径以确保真实的厚度
        const childRadiiSet = [];
        let childAreaSum = 0;
        for (let i = 0; i < numBranches; i++) {
            const branchPointT = branchPoints[i];
            // 靠近父分支顶端的分支获得半径奖励
            // 这促进了更强的主导分支
            const tipBonus = 1 + (branchPointT - BRANCHING.TIP_BONUS_RANGE.MIN) * BRANCHING.TIP_BONUS_RANGE.MAX;

            // 为每个子分支生成"潜在"半径，与父分支成比例
            const radiusRatio = parameters.structure.branching.lengthDecay * 
                randomFloatSurprise(0.8, 0.15, 0.4, 1.2, 0.09);
            const potentialRadius = parentNode.endRadius * radiusRatio * tipBonus;
            childRadiiSet.push(potentialRadius);
            childAreaSum += potentialRadius * potentialRadius;
        }
        const parentArea = parentNode.endRadius * parentNode.endRadius;
        const scaleFactor = childAreaSum > 0 ? parentArea / childAreaSum : 0;

        for (let i = 0; i < numBranches; i++) {

           // 修剪
            if (currentLevel > BRANCHING.PRUNING_LEVEL_THRESHOLD) {
                const pruningRate = parameters.environment.pruningFactor * randomFloat(0, 1);
                if (pruningRate > BRANCHING.PRUNING_THRESHOLD) {
                    continue;
                }
            }

            const branchPointT = branchPoints[i];

            const newPosition = parentCurve.getPointAt(branchPointT);
            const parentOrientationAtBranchPoint = parentCurve.getTangentAt(branchPointT).normalize();

            const {newLength, newLengthRatio} = calculateChildLength(parentLength, parameters, rootLength);

            const newOrientation = calculateChildOrientation(parentOrientationAtBranchPoint, parameters, newLengthRatio, currentLevel,maxLevels);

            // 应用管道模型修正以获得最终半径
            const correctedStartRadius = childRadiiSet[i] * Math.sqrt(scaleFactor);
            const { min: taperMin, max: taperMax } = parameters.structure.trunk.taperRange;
            const taper = randomFloat(taperMin, taperMax);
            const newEndRadius = correctedStartRadius * taper;

            const childCurve = calculateBranchCurve(
                newPosition,
                newOrientation,
                newLength,
                parameters.structure.branching.curviness,
                parentOrientationAtBranchPoint
            );

            const childNode = {
                id: nodeCounter++,
                parentID: parentNode.id,
                type: "branch",
                level: currentLevel + 1,
                curve: childCurve,  
                startRadius: correctedStartRadius,
                endRadius: newEndRadius,
                attachmentT: branchPointT,
                children: [],
                attachments: []
            };
            parentNode.children.push(childNode);

            // 递归调用
            _expandNode(childNode, currentLevel + 1);
        }
    }

    _expandNode(root, 0);

    return root
}

function calculateBranchCurve(startPoint, branchOrientation, length, curviness, parentEndOrientation) {
    const { CURVE } = GENERATOR_CONFIG.TREE_STRUCTURE;
    const endPoint = new THREE.Vector3().copy(startPoint).add(branchOrientation.clone().multiplyScalar(length));

    // 使用弯曲参数定义贝塞尔曲线的控制点
    const curvinessAmplitude = curviness.y;

    // 创建垂直于分支主方向的偏移向量
    const perpendicular = createPerpendicularVector(branchOrientation, random);

    const controlPointOffset = length * curvinessAmplitude;

    // 第一个控制点决定曲线的起始切线
    // 通过使用父分支的方向，我们确保平滑的C1连续性
    const controlPoint1Distance = length * CURVE.CONTROL_POINT_1_DISTANCE * 
        randomFloatNormal(1.0, 0.2);
    const controlPoint1 = new THREE.Vector3()
        .copy(startPoint)
        .add(parentEndOrientation.clone().multiplyScalar(controlPoint1Distance));

    const controlPoint2 = new THREE.Vector3()
        .lerpVectors(startPoint, endPoint, CURVE.CONTROL_POINT_2_POSITION)
        .add(perpendicular.clone().multiplyScalar(-controlPointOffset * 
            randomFloatNormal(1.0, 0.25)));

    return new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
}
function calculateChildOrientation(parentOrientation, parameters,newLengthRatio,currentLevel,maxLevels ) {
    const { splitAngleRange, rotationAngleRange } = parameters.structure.branching;
    const { gravitropism, phototropism } = parameters.environment;

    const splitAngle = randomFloatSurprise((splitAngleRange.min + splitAngleRange.max) / 2, (splitAngleRange.max - splitAngleRange.min) / 6, splitAngleRange.min, splitAngleRange.max, 0.12);
    const rotationAngle = randomFloatSurprise((rotationAngleRange.min + rotationAngleRange.max) / 2, (rotationAngleRange.max - rotationAngleRange.min) / 6, rotationAngleRange.min, rotationAngleRange.max, 0.1);

    let newOrientation = parentOrientation.clone();

    // 要创建分叉，我们需要旋转向量。旋转轴应该垂直于向量本身
    const rotationAxis = createPerpendicularVector(parentOrientation, random);

    // 首先，应用分叉角度旋转
    const splitQuaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, splitAngle);
    newOrientation.applyQuaternion(splitQuaternion);

    // 其次，围绕原始父轴旋转以三维分布分支
    const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(parentOrientation, rotationAngle);
    newOrientation.applyQuaternion(rotationQuaternion);

    const levelProgress = currentLevel / maxLevels;

    const { ORIENTATION } = GENERATOR_CONFIG.TREE_STRUCTURE;
    
    // 向地性
    if (Math.abs(gravitropism) > ORIENTATION.GRAVITY_THRESHOLD) {
        const gravityVector = new THREE.Vector3(0, Math.sign(gravitropism), 0);
        // 水平度：水平分支为1，垂直分支为0
        const horizontalness = 1 - Math.abs(newOrientation.dot(gravityVector));
        const gravityInfluence = Math.abs(gravitropism) * ORIENTATION.GRAVITY_INFLUENCE * 
            newLengthRatio * levelProgress * horizontalness;
        newOrientation.lerp(gravityVector, gravityInfluence).normalize();
    }

    // 向光性
    if (phototropism.lengthSq() > ORIENTATION.PHOTO_THRESHOLD) {
        const photoInfluence = ORIENTATION.PHOTO_INFLUENCE * levelProgress;
        newOrientation.lerp(phototropism.clone().normalize(), photoInfluence).normalize();
    }

    return newOrientation;
}

function calculateChildLength(parentLength, parameters, rootLength) {
    const { LENGTH } = GENERATOR_CONFIG.TREE_STRUCTURE;
    
    const newLength = parentLength * parameters.structure.branching.lengthDecay * 
        randomFloatSurprise(0.8, 0.15, 0.3, 1.5, 0.08);

    const newLengthRatio = newLength / rootLength;

    return { newLength, newLengthRatio };
}












