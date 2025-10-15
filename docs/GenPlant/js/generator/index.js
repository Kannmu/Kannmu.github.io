import * as THREE from "../three";

import {createParameters} from './parameters.js'
import {createStructure} from './structure.js'
import {createGeometry} from './geometry.js'
import {applyMaterial} from './material.js'


export function generate(seed) {
    // 参数验证
    if (seed === null || seed === undefined) {
        throw new Error('Seed parameter is required');
    }
    
    const numSeed = Number(seed);
    if (isNaN(numSeed)) {
        throw new Error('Seed must be a valid number');
    }
    
    let parameters, structure, geometries, plant;

    try {
        // Create Parameters
        parameters = createParameters(numSeed);
        if (!parameters) {
            throw new Error('Failed to create parameters');
        }
        console.log("Generated Parameters:", parameters);

        // Create Structure
        structure = createStructure(parameters);
        if (!structure) {
            throw new Error('Failed to create structure');
        }
        console.log("Generated Structure:", structure);

        // Create Geometry
        geometries = createGeometry(parameters, structure);
        if (!geometries || !Array.isArray(geometries)) {
            throw new Error('Failed to create geometry');
        }
        console.log("Geometry Created");

        // Create Material
        plant = applyMaterial(parameters, geometries);
        if (!plant || !(plant instanceof THREE.Group)) {
            throw new Error('Failed to apply materials');
        }
        console.log("Material Applied");

        return plant;
        
    } catch (error) {
        console.error('Plant generation failed:', error);
        // 清理可能已创建的资源
        if (plant && typeof plant.dispose === 'function') {
            plant.dispose();
        }
        throw error;
    }
}



