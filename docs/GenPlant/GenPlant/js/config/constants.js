/**
 * 全局配置常量管理模块
 * 统一管理所有硬编码的魔法数字和配置参数
 */

import * as THREE from "https://esm.sh/three";

// ==================== 渲染器配置 ====================
export const RENDERER_CONFIG = {
    // 相机配置
    CAMERA: {
        FOV: 75,
        NEAR: 0.1,
        FAR: 1000,
        INITIAL_POSITION: new THREE.Vector3(0, 5, 60),
        INITIAL_LOOKAT: new THREE.Vector3(0, 0, 0)
    },
    
    // 场景配置
    SCENE: {
        BACKGROUND_COLOR: 0xCDF1AA,
        FOG_NEAR: 100,
        FOG_FAR: 300
    },
    
    // 光照配置
    LIGHTING: {
        HEMISPHERE_LIGHT: {
            SKY_COLOR: 0xffffbb,
            GROUND_COLOR: 0x080820,
            INTENSITY: 1
        },
        AMBIENT_LIGHT: {
            COLOR: 0xffffff,
            INTENSITY: 0.5
        },
        DIRECTIONAL_LIGHT: {
            COLOR: 0xffffff,
            INTENSITY: 3,
            POSITION: { x: 10, y: 20, z: 10 },
            SHADOW_MAP_SIZE: 2048,
            SHADOW_CAMERA: {
                TOP: 30,
                BOTTOM: -30,
                LEFT: -30,
                RIGHT: 30,
                NEAR: 0.1,
                FAR: 100
            }
        }
    },
    
    // 地面配置
    GROUND: {
        RADIUS: 30,
        HEIGHT: 4,
        SEGMENTS: 64,
        COLOR: 0x99b882,
        POSITION_Y: -18
    },
    
    // 控制器配置
    CONTROLS: {
        DAMPING_FACTOR: 0.1,
        MIN_DISTANCE: 10,
        MAX_DISTANCE: 500,
        MAX_POLAR_ANGLE: Math.PI / 2,
        AUTO_ROTATE_SPEED: 3
    },
    
    // 渲染器设置
    RENDERER_SETTINGS: {
        TONE_MAPPING_EXPOSURE: 1.5
    },
    
    // 模型缩放配置
    MODEL_SCALING: {
        DESIRED_SIZE: 50,
        GROUND_OFFSET: 1
    }
};

// ==================== 生成器配置 ====================
export const GENERATOR_CONFIG = {
    // 随机种子配置
    SEED: {
        MIN_VALUE: 1,
        MAX_VALUE: 1e10
    },
    
    // 树结构生成配置
    TREE_STRUCTURE: {
        // 根部长度配置
        ROOT_LENGTH: {
            BASE: 2,
            MIN_RANDOM: 9,
            MAX_RANDOM: 16
        },
        
        // 长度与半径比例
        LENGTH_TO_RADIUS_RATIO: {
            MIN: 0.05,
            MAX: 0.13,
            VARIATION: { MIN: 0.8, MAX: 1.2 }
        },
        
        // 初始方向配置
        INITIAL_ORIENTATION: {
            X_RANGE: { MIN: -0.2, MAX: 0.2 },
            Y_VALUE: 1,
            Z_RANGE: { MIN: -0.2, MAX: 0.2 }
        },
        
        // 分支配置
        BRANCHING: {
            LEADER_LEVEL_THRESHOLD: 2,
            BRANCH_POINT_RANGE: { MIN: 0.5, MAX: 1.0 },
            TIP_BONUS_RANGE: { MIN: 0.5, MAX: 0.5 }, // (branchPointT - 0.5) * 0.5
            RADIUS_VARIATION: { MIN: 0.85, MAX: 1.15 },
            PRUNING_LEVEL_THRESHOLD: 3,
            PRUNING_THRESHOLD: 0.4
        },
        
        // 曲线生成配置
        CURVE: {
            CONTROL_POINT_1_DISTANCE: 0.25,
            CONTROL_POINT_1_VARIATION: { MIN: 0.8, MAX: 1.2 },
            CONTROL_POINT_2_POSITION: 0.75,
            CONTROL_POINT_2_VARIATION: { MIN: 0.5, MAX: 1.0 }
        },
        
        // 方向计算配置
        ORIENTATION: {
            GRAVITY_INFLUENCE: 0.4,
            PHOTO_INFLUENCE: 0.2,
            GRAVITY_THRESHOLD: 0.05,
            PHOTO_THRESHOLD: 0.001
        },
        
        // 长度计算配置
        LENGTH: {
            VARIATION: { MIN: 0.8, MAX: 1.2 }
        }
    }
};

// ==================== 几何体生成配置 ====================
export const GEOMETRY_CONFIG = {
    // 管状几何体配置
    TUBE_MESH: {
        MIN_RADIAL_SEGMENTS: 10,
        RADIAL_SEGMENTS_MULTIPLIER: 15,
        MIN_TUBULAR_SEGMENTS: 10,
        TUBULAR_SEGMENTS_MULTIPLIER: 5,
        MIN_RADIUS: 0.01
    },
    
    // 分支连接配置
    BRANCH_STITCHING: {
        TRANSITION_DISTANCE_MULTIPLIER: 4,
        MIN_TRANSITION_SEGMENTS: 1
    }
};

// ==================== 参数生成配置 ====================
export const PARAMETER_CONFIG = {
    // 原型配置
    ARCHETYPE: {
        AVAILABLE_TYPES: ['tree'],
        SCALE_RANGE: { MIN: 0.5, MAX: 1.5 }
    },
    
    // 环境配置
    ENVIRONMENT: {
        PHOTOTROPISM: {
            X_RANGE: { MIN: -0.5, MAX: 0.5 },
            Y_VALUE: 1,
            Z_RANGE: { MIN: -0.5, MAX: 0.5 }
        },
        GRAVITROPISM_RANGE: { MIN: -1, MAX: 1 }
    },
    
    // 结构配置
    STRUCTURE: {
        TRUNK: {
            TAPER_RANGE: {
                MIN: { MIN: 0.7, MAX: 0.8 },
                MAX: { MIN: 0.6, MAX: 1 }
            },
            CURVINESS: { FREQUENCY: 0.5, AMPLITUDE: 0.1 }
        },
        BRANCHING: {
            LEVELS_RANGE: { MIN: 4, MAX: 6 },
            BRANCHES_PER_SPLIT: { MIN: 2, MAX: 4 },
            SPLIT_ANGLE: {
                MIN: Math.PI / 10,
                MAX: Math.PI / 4.5
            },
            LENGTH_DECAY_RANGE: { MIN: 0.6, MAX: 0.9 },
            CURVINESS: { FREQUENCY: 1.5, AMPLITUDE: 0.2 },
            ROTATION_ANGLE: {
                MIN_RANGE: { MIN: 0, MAX: Math.PI / 2 },
                MAX_RANGE: { MIN: Math.PI / 2, MAX: Math.PI }
            }
        }
    }
};

// ==================== 材质配置 ====================
export const MATERIAL_CONFIG = {
    // 基础颜色
    COLORS: {
        BASE_COLOR: 0x9c7749, // 树干棕色
        TIP_COLOR: 0x808000   // 枝梢绿色
    },
    
    // 材质属性
    PROPERTIES: {
        BASE_ROUGHNESS: 0.5,
        ROUGHNESS_VARIATION: 0.8,
        METALNESS: 0.1
    }
};

// ==================== UI配置 ====================
export const UI_CONFIG = {
    // DOM元素ID
    ELEMENT_IDS: {
        SEED_INPUT: 'seedInput',
        RANDOM_BUTTON: 'randomBtn',
        GENERATE_BUTTON: 'generateBtn',
        RESET_CAMERA_BUTTON: 'resetCameraButton',
        CANVAS: 'three-canvas'
    },
    
    // 错误消息
    ERROR_MESSAGES: {
        PLANT_GENERATION_FAILED: 'Error in Generating Plant:',
        DEFAULT_MODEL_FAILED: 'Error in Loading Default Model:',
        PRESENTING_DEFAULT: 'Presenting Default Plant Model'
    }
};

// ==================== 文件路径配置 ====================
export const PATHS = {
    DEFAULT_MODEL: 'data/defaultModel/glb/defaultModel.glb'
};