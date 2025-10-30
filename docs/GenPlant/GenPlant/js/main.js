import * as generator from './generator/index.js';
import * as renderer from './renderer.js';
import { GENERATOR_CONFIG, UI_CONFIG } from './config/constants.js';

let seedInput, randomSeedButton, generateButton, resetCameraButton, exportButton, canvas;

function init() {
    try {
        initDOMElements();
        initRenderer();
        bindEventListeners();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showErrorMessage('应用初始化失败，请刷新页面重试。');
    }
}

function initDOMElements() {
    const { ELEMENT_IDS } = UI_CONFIG;
    
    seedInput = document.getElementById(ELEMENT_IDS.SEED_INPUT);
    randomSeedButton = document.getElementById(ELEMENT_IDS.RANDOM_BUTTON);
    generateButton = document.getElementById(ELEMENT_IDS.GENERATE_BUTTON);
    resetCameraButton = document.getElementById(ELEMENT_IDS.RESET_CAMERA_BUTTON);
    exportButton = document.getElementById(ELEMENT_IDS.EXPORT_BUTTON);
    canvas = document.getElementById(ELEMENT_IDS.CANVAS);
    
    // 验证DOM元素是否存在
    const elements = { seedInput, randomSeedButton, generateButton, resetCameraButton, exportButton, canvas };
    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            throw new Error(`Required DOM element not found: ${name}`);
        }
    }
}

function initRenderer() {
    renderer.init(canvas);
}

function bindEventListeners() {
    generateButton.addEventListener('click', handleGenerateClick);
    randomSeedButton.addEventListener('click', handleRandomSeedClick);
    resetCameraButton.addEventListener('click', handleResetCameraClick);
    exportButton.addEventListener('click', handleExportClick);
}

function handleResetCameraClick() {
    renderer.reset();
}

function handleExportClick() {
    try {
        const seed = validateAndGetSeed();
        renderer.exportGLB(seed);
    } catch (error) {
        console.error('Failed to export model:', error);
        showErrorMessage('模型导出失败，请重试。');
    }
}

function handleRandomSeedClick() {
    try {
        const newSeed = getRandomSeed();
        seedInput.value = newSeed;
        console.log('Random Seed Set to:', newSeed);
        handleGenerateClick();
    } catch (error) {
        console.error('Failed to generate random seed:', error);
        showErrorMessage('生成随机种子失败，请重试。');
    }
}

async function handleGenerateClick() {
    try {
        // 1. 清理旧植物
        renderer.clear();

        // 2. 获取或生成新种子
        const seed = validateAndGetSeed();
        
        // 3. 生成植物
        const plant = await generatePlant(seed);
        
        // 4. 添加到场景
        if (plant) {
            renderer.add(plant);
        } else {
            showErrorMessage('植物生成失败，请尝试其他种子。');
        }
        
    } catch (error) {
        console.error('Plant generation failed:', error);
        showErrorMessage('植物生成过程中发生错误，请重试。');
    }
}

function validateAndGetSeed() {
    let seed = seedInput.value;
    
    // 验证种子有效性
    if (!seed || isNaN(seed) || Number(seed) === 0) {
        seed = getRandomSeed();
        seedInput.value = seed;
    }
    
    // 确保种子在有效范围内
    const numSeed = Number(seed);
    const { SEED } = GENERATOR_CONFIG;
    if (numSeed < SEED.MIN_VALUE || numSeed > SEED.MAX_VALUE) {
        seed = getRandomSeed();
        seedInput.value = seed;
    }
    
    return seed;
}

async function generatePlant(seed) {
    const { ERROR_MESSAGES } = UI_CONFIG;
    
    try {
        // 尝试生成程序化植物
        const plant = generator.generate(seed);
        if (plant) {
            return plant;
        }
    } catch (error) {
        console.error(ERROR_MESSAGES.PLANT_GENERATION_FAILED, error, ERROR_MESSAGES.PRESENTING_DEFAULT);
    }
    
    // 如果程序化生成失败，加载默认模型
    try {
        return await renderer.loadDefaultModel();
    } catch (error) {
        console.error(ERROR_MESSAGES.DEFAULT_MODEL_FAILED, error);
        return null;
    }
}

function getRandomSeed() {
    const { SEED } = GENERATOR_CONFIG;
    return Math.floor(Math.random() * (SEED.MAX_VALUE - SEED.MIN_VALUE + 1)) + SEED.MIN_VALUE;
}

function showErrorMessage(message) {
    // 简单的错误提示，可以根据需要扩展为更复杂的UI组件
    console.warn('User Message:', message);
    // 可以在这里添加UI提示逻辑，比如显示toast或modal
}

init();





