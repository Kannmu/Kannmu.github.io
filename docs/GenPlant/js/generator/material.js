import * as THREE from "https://esm.sh/three";
import { MATERIAL_CONFIG } from '../config/constants.js';

const baseColor = new THREE.Color(MATERIAL_CONFIG.COLORS.BASE_COLOR);
const tipColor = new THREE.Color(MATERIAL_CONFIG.COLORS.TIP_COLOR);

// 材质缓存，避免重复创建相同材质
const materialCache = new Map();

export function applyMaterial(parameters, geometries) {
    let plant = new THREE.Group();
    
    // 清理缓存（每次生成新植物时）
    clearMaterialCache();
    
    geometries.forEach(({ geometry, node }) => {
        if (geometry) {
            const material = generateMaterial(parameters, node);
            plant.add(new THREE.Mesh(geometry, material));
        }
    });
    return plant;
}

function generateMaterial(parameters, node) {
    const { PROPERTIES } = MATERIAL_CONFIG;
    const maxLevels = parameters.structure.branching.levels;
    const levelProgress = node.level / maxLevels;
    
    // 创建材质缓存键
    const cacheKey = `${node.level}_${maxLevels}_${PROPERTIES.BASE_ROUGHNESS}_${PROPERTIES.ROUGHNESS_VARIATION}_${PROPERTIES.METALNESS}`;
    
    // 检查缓存
    if (materialCache.has(cacheKey)) {
        return materialCache.get(cacheKey);
    }
    
    const materialColor = new THREE.Color().lerpColors(baseColor, tipColor, levelProgress);
    const roughness = PROPERTIES.BASE_ROUGHNESS + levelProgress * PROPERTIES.ROUGHNESS_VARIATION;
    
    const material = new THREE.MeshStandardMaterial({
        color: materialColor,
        roughness: roughness,
        metalness: PROPERTIES.METALNESS,
        wireframe: false
    });
    
    // 缓存材质
    materialCache.set(cacheKey, material);
    
    return material;
}

/**
 * 清理材质缓存
 */
function clearMaterialCache() {
    // 释放缓存中的材质资源
    materialCache.forEach(material => {
        if (material && typeof material.dispose === 'function') {
            material.dispose();
        }
    });
    materialCache.clear();
}





