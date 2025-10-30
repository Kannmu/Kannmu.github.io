let _randomFunc;

/**
 * Creates a pseudo-random number generator using the mulberry32 algorithm.
 * @param {number} a - The seed.
 * @returns {function(): number} A function that returns a random float between 0 and 1.
 */
function mulberry32(a) {
    return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        var t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function init(seed) {
    _randomFunc = mulberry32(seed);
    randomFloatNormal.hasSpare = false;
}

export function random() {
    if (!_randomFunc) {
        throw new Error("Random number generator not initialized. Call init(seed) first.");
    }
    return _randomFunc();
}


export function randomFloat(min, max) {
    return random() * (max - min) + min;
}

export function randomInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
}

export function choice(arr) {
    if (!arr || arr.length === 0) {
        return undefined;
    }
    return arr[Math.floor(random() * arr.length)];
}

export function randomFloatNormal(mean, stdDev) {
    // Box-Muller transform to generate normally distributed random numbers
    // We use a static variable to store the second value for efficiency
    if (randomFloatNormal.hasSpare) {
        randomFloatNormal.hasSpare = false;
        return randomFloatNormal.spare * stdDev + mean;
    }
    
    randomFloatNormal.hasSpare = true;
    
    let u = 0, v = 0;
    while (u === 0) u = random(); // Converting [0,1) to (0,1)
    while (v === 0) v = random();
    
    const mag = stdDev * Math.sqrt(-2.0 * Math.log(u));
    randomFloatNormal.spare = mag * Math.cos(2.0 * Math.PI * v);
    
    return mag * Math.sin(2.0 * Math.PI * v) + mean;
}

export function randomFloatSurprise(mean, stdDev, min = 0, max = 1, surpriseRate = 0.05) {
    // Mixed distribution: normal distribution with small chance of extreme values
    // surpriseRate: probability of getting an extreme value (default 5%)
    
    if (random() < surpriseRate) {
        // Generate extreme value from uniform distribution across full range
        return randomFloat(min, max);
    } else {
        // Generate normal value, but clamp to valid range
        let value = randomFloatNormal(mean, stdDev);
        return Math.max(min, Math.min(max, value));
    }
}


