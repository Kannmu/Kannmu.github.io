/**
 * 数学相关的工具函数
 * 提供常用的数学计算和插值功能
 */

/**
 * 将值限制在指定范围内
 * @param {number} value - 输入值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值参数 (0-1)
 * @returns {number} 插值结果
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * 平滑步插值（S曲线）
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值参数 (0-1)
 * @returns {number} 插值结果
 */
export function smoothstep(start, end, t) {
    t = clamp(t, 0, 1);
    t = t * t * (3 - 2 * t);
    return lerp(start, end, t);
}

/**
 * 更平滑的步插值
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值参数 (0-1)
 * @returns {number} 插值结果
 */
export function smootherstep(start, end, t) {
    t = clamp(t, 0, 1);
    t = t * t * t * (t * (t * 6 - 15) + 10);
    return lerp(start, end, t);
}

/**
 * 将值从一个范围映射到另一个范围
 * @param {number} value - 输入值
 * @param {number} inMin - 输入范围最小值
 * @param {number} inMax - 输入范围最大值
 * @param {number} outMin - 输出范围最小值
 * @param {number} outMax - 输出范围最大值
 * @returns {number} 映射后的值
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

/**
 * 计算两点之间的距离
 * @param {number} x1 - 第一个点的x坐标
 * @param {number} y1 - 第一个点的y坐标
 * @param {number} x2 - 第二个点的x坐标
 * @param {number} y2 - 第二个点的y坐标
 * @returns {number} 距离
 */
export function distance2D(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算三维空间中两点之间的距离
 * @param {number} x1 - 第一个点的x坐标
 * @param {number} y1 - 第一个点的y坐标
 * @param {number} z1 - 第一个点的z坐标
 * @param {number} x2 - 第二个点的x坐标
 * @param {number} y2 - 第二个点的y坐标
 * @param {number} z2 - 第二个点的z坐标
 * @returns {number} 距离
 */
export function distance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * 角度转弧度
 * @param {number} degrees - 角度
 * @returns {number} 弧度
 */
export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * 弧度转角度
 * @param {number} radians - 弧度
 * @returns {number} 角度
 */
export function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

/**
 * 检查数值是否接近零
 * @param {number} value - 要检查的值
 * @param {number} epsilon - 容差
 * @returns {boolean} 是否接近零
 */
export function isNearZero(value, epsilon = 0.001) {
    return Math.abs(value) < epsilon;
}

/**
 * 检查两个数值是否近似相等
 * @param {number} a - 第一个值
 * @param {number} b - 第二个值
 * @param {number} epsilon - 容差
 * @returns {boolean} 是否近似相等
 */
export function isNearEqual(a, b, epsilon = 0.001) {
    return Math.abs(a - b) < epsilon;
}

/**
 * 计算数组的平均值
 * @param {number[]} values - 数值数组
 * @returns {number} 平均值
 */
export function average(values) {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * 计算数组的标准差
 * @param {number[]} values - 数值数组
 * @returns {number} 标准差
 */
export function standardDeviation(values) {
    if (values.length === 0) return 0;
    const avg = average(values);
    const squaredDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(average(squaredDiffs));
}

// 随机数函数已移至 random.js 模块以确保确定性生成

/**
 * 从数组中随机选择一个元素
 * @param {Array} array - 数组
 * @param {Function} randomFunc - 随机数生成函数
 * @returns {*} 随机选择的元素
 */
export function randomChoice(array, randomFunc = Math.random) {
    if (!array || array.length === 0) {
        return undefined;
    }
    return array[Math.floor(randomFunc() * array.length)];
}

/**
 * 计算贝塞尔曲线上的点
 * @param {number} t - 参数 (0-1)
 * @param {number[]} points - 控制点数组
 * @returns {number} 曲线上的点
 */
export function bezier(t, points) {
    const n = points.length - 1;
    let result = 0;
    
    for (let i = 0; i <= n; i++) {
        result += binomialCoefficient(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i) * points[i];
    }
    
    return result;
}

/**
 * 计算二项式系数
 * @param {number} n - n
 * @param {number} k - k
 * @returns {number} 二项式系数
 */
function binomialCoefficient(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result = result * (n - i + 1) / i;
    }
    
    return result;
}