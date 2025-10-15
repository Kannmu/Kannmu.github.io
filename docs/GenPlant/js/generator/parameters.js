import { init, randomFloat, randomFloatNormal, randomFloatSurprise, randomInt, choice } from '../util/random.js';
import * as THREE from '../three';
import { PARAMETER_CONFIG } from '../config/constants.js';

export function createParameters(seed) {
    init(seed);
    
    return {
        global: {
            seed: Number(seed),
        },
        archetype: createArchetypeParameters(),
        environment: createEnvironmentParameters(),
        structure: createStructureParameters(),
    };
}

function createArchetypeParameters() {
    const { ARCHETYPE } = PARAMETER_CONFIG;
    const { SCALE_RANGE } = ARCHETYPE;
    
    return {
        type: choice(ARCHETYPE.AVAILABLE_TYPES),
        growthForm: randomFloatSurprise(0.5, 0.2, 0, 1, 0.08),
        age: randomFloatSurprise(0.5, 0.25, 0, 1, 0.06),
        scale: new THREE.Vector3(
            randomFloat(SCALE_RANGE.MIN, SCALE_RANGE.MAX),
            randomFloat(SCALE_RANGE.MIN, SCALE_RANGE.MAX),
            randomFloat(SCALE_RANGE.MIN, SCALE_RANGE.MAX)
        ),
    };
}

function createEnvironmentParameters() {
    const { ENVIRONMENT } = PARAMETER_CONFIG;
    const { PHOTOTROPISM, GRAVITROPISM_RANGE } = ENVIRONMENT;
    
    return {
        phototropism: new THREE.Vector3(
            randomFloat(PHOTOTROPISM.X_RANGE.MIN, PHOTOTROPISM.X_RANGE.MAX),
            PHOTOTROPISM.Y_VALUE,
            randomFloat(PHOTOTROPISM.Z_RANGE.MIN, PHOTOTROPISM.Z_RANGE.MAX)
        ),
        gravitropism: randomFloatSurprise(0.5, 0.3, -1, 1, 0.1),
        pruningFactor: randomFloat(0, 1),
        lightIntensity: randomFloat(0, 1),
        temperature: randomFloat(0, 1),
        humidity: randomFloat(0, 1),
    };
}

function createStructureParameters() {
    const { STRUCTURE } = PARAMETER_CONFIG;
    
    return {
        trunk: createTrunkParameters(STRUCTURE.TRUNK),
        branching: createBranchingParameters(STRUCTURE.BRANCHING),
    };
}

function createTrunkParameters(trunkConfig) {
    const { TAPER_RANGE, CURVINESS } = trunkConfig;
    
    return {
        taperRange: {
            min: randomFloat(TAPER_RANGE.MIN.MIN, TAPER_RANGE.MIN.MAX),
            max: randomFloat(TAPER_RANGE.MAX.MIN, TAPER_RANGE.MAX.MAX)
        },
        curviness: new THREE.Vector2(CURVINESS.FREQUENCY, CURVINESS.AMPLITUDE),
    };
}

function createBranchingParameters(branchingConfig) {
    const {
        LEVELS_RANGE,
        BRANCHES_PER_SPLIT,
        SPLIT_ANGLE,
        LENGTH_DECAY_RANGE,
        CURVINESS,
        ROTATION_ANGLE
    } = branchingConfig;
    
    return {
        levels: randomInt(LEVELS_RANGE.MIN, LEVELS_RANGE.MAX),
        branchesPerSplit: {
            min: BRANCHES_PER_SPLIT.MIN,
            max: BRANCHES_PER_SPLIT.MAX
        },
        splitAngleRange: {
            min: SPLIT_ANGLE.MIN,
            max: SPLIT_ANGLE.MAX
        },
        lengthDecay: randomFloatSurprise(0.7, 0.15, 0.3, 0.95, 0.07),
        curviness: new THREE.Vector2(CURVINESS.FREQUENCY, CURVINESS.AMPLITUDE),
        rotationAngleRange: {
            min: randomFloat(ROTATION_ANGLE.MIN_RANGE.MIN, ROTATION_ANGLE.MIN_RANGE.MAX),
            max: randomFloat(ROTATION_ANGLE.MAX_RANGE.MIN, ROTATION_ANGLE.MAX_RANGE.MAX)
        },
    };
}



