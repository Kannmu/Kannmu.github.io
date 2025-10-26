/**
 * 几何体相关的工具函数
 * 提供常用的几何计算和操作
 */

import * as THREE from "https://esm.sh/three";

/**
 * 计算模型的边界框信息
 * @param {THREE.Object3D} object - 3D对象
 * @returns {Object} 包含边界框、中心点、尺寸等信息
 */
export function getBoundingBoxInfo(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    
    return {
        box,
        center,
        size,
        maxSize
    };
}

/**
 * 缩放和定位3D对象
 * @param {THREE.Object3D} object - 要处理的3D对象
 * @param {number} targetSize - 目标尺寸
 * @param {number} groundY - 地面Y坐标
 * @param {number} groundOffset - 地面偏移量
 */
export function scaleAndPositionObject(object, targetSize, groundY, groundOffset = 0) {
    // 获取初始边界框并居中
    let { center } = getBoundingBoxInfo(object);
    object.position.sub(center);
    
    // 计算并应用缩放
    const { size, maxSize } = getBoundingBoxInfo(object);
    if (maxSize > 0) {
        const scale = targetSize / maxSize;
        object.scale.set(scale, scale, scale);
    }
    
    // 更新世界矩阵并重新定位
    object.updateMatrixWorld(true);
    const { box, center: newCenter } = getBoundingBoxInfo(object);
    
    // 在XZ平面居中，并将最低点放在地面上
    object.position.x -= newCenter.x;
    object.position.y -= (box.min.y - groundY + groundOffset);
    object.position.z -= newCenter.z;
}

/**
 * 为对象启用阴影
 * @param {THREE.Object3D} object - 3D对象
 * @param {boolean} castShadow - 是否投射阴影
 * @param {boolean} receiveShadow - 是否接收阴影
 */
export function enableShadows(object, castShadow = true, receiveShadow = false) {
    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
        }
    });
}

/**
 * 创建垂直于给定向量的随机向量
 * @param {THREE.Vector3} vector - 参考向量
 * @param {Function} randomFunc - 随机数生成函数
 * @returns {THREE.Vector3} 垂直向量
 */
export function createPerpendicularVector(vector, randomFunc = Math.random) {
    const randomVec = new THREE.Vector3(
        randomFunc() * 2 - 1,
        randomFunc() * 2 - 1,
        randomFunc() * 2 - 1
    ).normalize();
    
    let perpendicular = new THREE.Vector3().crossVectors(vector, randomVec).normalize();
    
    // 处理平行向量的情况
    if (perpendicular.lengthSq() < 0.001) {
        perpendicular.set(1, 0, 0);
    }
    
    return perpendicular;
}

/**
 * 计算两个向量之间的插值
 * @param {THREE.Vector3} start - 起始向量
 * @param {THREE.Vector3} end - 结束向量
 * @param {number} t - 插值参数 (0-1)
 * @returns {THREE.Vector3} 插值结果
 */
export function lerpVectors(start, end, t) {
    return start.clone().lerp(end, t);
}

/**
 * 安全地标准化向量（避免零向量）
 * @param {THREE.Vector3} vector - 要标准化的向量
 * @param {THREE.Vector3} fallback - 备用向量
 * @returns {THREE.Vector3} 标准化后的向量
 */
export function safeNormalize(vector, fallback = new THREE.Vector3(0, 1, 0)) {
    if (vector.lengthSq() < 0.001) {
        return fallback.clone().normalize();
    }
    return vector.clone().normalize();
}

/**
 * 计算管状几何体的分段数
 * @param {number} radius - 半径
 * @param {number} length - 长度
 * @param {Object} config - 配置参数
 * @returns {Object} 包含径向和管状分段数
 */
export function calculateTubeSegments(radius, length, config) {
    // 参数验证
    if (typeof radius !== 'number' || radius <= 0) {
        throw new Error('Radius must be a positive number');
    }
    if (typeof length !== 'number' || length <= 0) {
        throw new Error('Length must be a positive number');
    }
    if (!config || typeof config !== 'object') {
        throw new Error('Config must be a valid object');
    }
    
    const requiredProps = ['MIN_RADIAL_SEGMENTS', 'RADIAL_SEGMENTS_MULTIPLIER', 'MIN_TUBULAR_SEGMENTS', 'TUBULAR_SEGMENTS_MULTIPLIER'];
    for (const prop of requiredProps) {
        if (typeof config[prop] !== 'number') {
            throw new Error(`Config.${prop} must be a number`);
        }
    }
    
    const radialSegments = Math.max(
        config.MIN_RADIAL_SEGMENTS,
        Math.round(radius * config.RADIAL_SEGMENTS_MULTIPLIER)
    );
    
    const tubularSegments = Math.max(
        config.MIN_TUBULAR_SEGMENTS,
        Math.floor(length * config.TUBULAR_SEGMENTS_MULTIPLIER)
    );
    
    return { radialSegments, tubularSegments };
}

/**
 * 释放几何体和材质资源
 * @param {THREE.Object3D} object - 要释放的对象
 */
export function disposeObject(object) {
    if (!object) return;
    
    object.traverse(function (child) {
        if (child.geometry) {
            child.geometry.dispose();
        }
        
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(material => {
                    disposeMaterial(material);
                });
            } else {
                disposeMaterial(child.material);
            }
        }
    });
}

/**
 * 释放材质资源
 * @param {THREE.Material} material - 要释放的材质
 */
function disposeMaterial(material) {
    if (!material) return;
    
    // 释放所有可能的纹理贴图
    const textureProperties = [
        'map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap',
        'bumpMap', 'displacementMap', 'specularMap', 'envMap', 'lightMap',
        'alphaMap', 'gradientMap', 'clearcoatMap', 'clearcoatNormalMap',
        'clearcoatRoughnessMap', 'transmissionMap', 'thicknessMap'
    ];
    
    textureProperties.forEach(prop => {
        if (material[prop] && typeof material[prop].dispose === 'function') {
            material[prop].dispose();
        }
    });
    
    // 释放材质本身
    if (typeof material.dispose === 'function') {
        material.dispose();
    }
}