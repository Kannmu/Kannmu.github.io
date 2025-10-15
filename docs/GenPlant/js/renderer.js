import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { RENDERER_CONFIG, PATHS } from './config/constants.js';
import { scaleAndPositionObject, enableShadows, disposeObject } from './util/geometry.js';

let scene, camera, renderer, controls, plantObject, clock, animationFrameId, ground, stats;

export function init(canvas) {
    initScene();
    initCamera(canvas);
    initRenderer(canvas);
    initStats();
    initLighting();
    initGround();
    initControls();
    
    clock = new THREE.Clock();
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    animate();
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(RENDERER_CONFIG.SCENE.BACKGROUND_COLOR);
    scene.fog = new THREE.Fog(
        RENDERER_CONFIG.SCENE.BACKGROUND_COLOR,
        RENDERER_CONFIG.SCENE.FOG_NEAR,
        RENDERER_CONFIG.SCENE.FOG_FAR
    );
}

function initCamera(canvas) {
    const { CAMERA } = RENDERER_CONFIG;
    camera = new THREE.PerspectiveCamera(
        CAMERA.FOV,
        canvas.clientWidth / canvas.clientHeight,
        CAMERA.NEAR,
        CAMERA.FAR
    );
    camera.position.copy(CAMERA.INITIAL_POSITION);
    camera.lookAt(CAMERA.INITIAL_LOOKAT);
}

function initRenderer(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = RENDERER_CONFIG.RENDERER_SETTINGS.TONE_MAPPING_EXPOSURE;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

function initLighting() {
    const { LIGHTING } = RENDERER_CONFIG;
    
    // 半球光
    const hemisphereLight = new THREE.HemisphereLight(
        LIGHTING.HEMISPHERE_LIGHT.SKY_COLOR,
        LIGHTING.HEMISPHERE_LIGHT.GROUND_COLOR,
        LIGHTING.HEMISPHERE_LIGHT.INTENSITY
    );
    hemisphereLight.castShadow = true;
    scene.add(hemisphereLight);
    
    // 环境光
    const ambientLight = new THREE.AmbientLight(
        LIGHTING.AMBIENT_LIGHT.COLOR,
        LIGHTING.AMBIENT_LIGHT.INTENSITY
    );
    scene.add(ambientLight);
    
    // 平行光
    const directionalLight = new THREE.DirectionalLight(
        LIGHTING.DIRECTIONAL_LIGHT.COLOR,
        LIGHTING.DIRECTIONAL_LIGHT.INTENSITY
    );
    const lightPos = LIGHTING.DIRECTIONAL_LIGHT.POSITION;
    directionalLight.position.set(lightPos.x, lightPos.y, lightPos.z);
    directionalLight.castShadow = true;
    
    // 阴影配置
    directionalLight.shadow.mapSize.width = LIGHTING.DIRECTIONAL_LIGHT.SHADOW_MAP_SIZE;
    directionalLight.shadow.mapSize.height = LIGHTING.DIRECTIONAL_LIGHT.SHADOW_MAP_SIZE;
    
    const shadowCam = LIGHTING.DIRECTIONAL_LIGHT.SHADOW_CAMERA;
    directionalLight.shadow.camera.top = shadowCam.TOP;
    directionalLight.shadow.camera.bottom = shadowCam.BOTTOM;
    directionalLight.shadow.camera.left = shadowCam.LEFT;
    directionalLight.shadow.camera.right = shadowCam.RIGHT;
    directionalLight.shadow.camera.near = shadowCam.NEAR;
    directionalLight.shadow.camera.far = shadowCam.FAR;
    
    scene.add(directionalLight);
}

function initGround() {
    const { GROUND } = RENDERER_CONFIG;
    const groundGeometry = new THREE.CylinderGeometry(
        GROUND.RADIUS,
        GROUND.RADIUS,
        GROUND.HEIGHT,
        GROUND.SEGMENTS
    );
    const groundMaterial = new THREE.MeshStandardMaterial({ color: GROUND.COLOR });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set(0, GROUND.POSITION_Y, 0);
    ground.receiveShadow = true;
    scene.add(ground);
}

function initControls() {
    const { CONTROLS } = RENDERER_CONFIG;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = CONTROLS.DAMPING_FACTOR;
    controls.screenSpacePanning = true;
    controls.enablePan = false;
    controls.minDistance = CONTROLS.MIN_DISTANCE;
    controls.maxDistance = CONTROLS.MAX_DISTANCE;
    controls.maxPolarAngle = CONTROLS.MAX_POLAR_ANGLE;
    controls.autoRotate = true;
    controls.autoRotateSpeed = CONTROLS.AUTO_ROTATE_SPEED;

}

function handleVisibilityChange() {
    if (document.hidden) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (clock && clock.running) {
            clock.stop();
        }
    } else {
        if (clock) {
            clock.start();
        }
        if (!animationFrameId) {
            animate();
        }
    }
}

export function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    controls.update(deltaTime);
    renderer.render(scene, camera);
    stats.update();
}

export function add(object) {
    clear();
    plantObject = object;
    if (plantObject) {
        console.log("Adjusting Model size");
        scaleAndPositionModel();
        enableShadowsForPlant();
        scene.add(plantObject);
        controls.target.copy(ground.position);
        reset();
    }
}

function scaleAndPositionModel() {
    const { MODEL_SCALING, GROUND } = RENDERER_CONFIG;
    scaleAndPositionObject(
        plantObject,
        MODEL_SCALING.DESIRED_SIZE,
        GROUND.POSITION_Y,
        MODEL_SCALING.GROUND_OFFSET
    );
}

function enableShadowsForPlant() {
    enableShadows(plantObject, true, false);
}


export function clear() {
    if (plantObject) {
        scene.remove(plantObject);
        disposeObject(plantObject);
        plantObject = null;
    }
}

export function reset() {
    controls.reset();
}

export function loadDefaultModel() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(PATHS.DEFAULT_MODEL, function (glb) {
            setupDefaultModelMaterials(glb.scene);
            resolve(glb.scene);
        }, undefined, function (error) {
            console.error("Error in Loading Default Model:", error);
            reject(error);
        });
    });
}

function setupDefaultModelMaterials(scene) {
    scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            if (child.material.map) {
                child.material.map.encoding = THREE.sRGBEncoding;
            }
        }
    });
}



