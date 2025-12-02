let theShader;
let cellSize = 3;
let noiseScale;
let maxDepth;
let noiseSeed;
let flowSpeed = 0.05;
let paletteIndex1;
let paletteIndex2;
let randomScaleSeed;
let rotationAngle;
let noiseOffsetX;
let noiseOffsetY;
let scaleFactor = 30;
let translateX = 0;
let translateY = 0;
let previousMouseX;
let previousMouseY;
let amplitudeValues = [0.1];
let reactionInfluence = 2;
let caInfluence = 0.5; // NEW: Add missing CA influence parameter
let layerNoiseThreshold = 0.65; // NEW: Lower threshold for more visible depth layers
let depthFalloffRate = 0.85; // NEW: More gradual depth falloff (was 0.5 in shader)
let rdParameters = [
    { 'a': 0.5, 'b': 1 },
    { 'a': 0.1, 'b': 0.1 },
    { 'a': 0.8, 'b': 0.2 },
    { 'a': 1, 'b': 1 },
    { 'a': 0.3, 'b': 0.7 },
    { 'a': 1.2, 'b': 1.2 },
    { 'a': 0.05, 'b': 0.9 },
    { 'a': 0.7, 'b': 1.8 },
    { 'a': 0.3, 'b': 0.3 },
    { 'a': 1, 'b': 4 }
];
let paletteThreshold = 0.25;
let freq;
let randomSeed;
let isAnimating = false;
let frameCounter = 0;
const maxFrames = 100;
let hasInitialAnimationRun = false;
let elapsedTime = 0;
let domainWarpIntensity; // NEW: Will be randomly selected from specific values

// NEW: Linework Overlay System
let lineworkEnabled = true; // Toggle for linework (now enabled by default)
let lineworkIntensity = 0.3; // Strength of line overlay (0.0 to 1.0)
let lineworkThreshold = 0.4; // Lower threshold for better line detection (was 0.5)
let lineworkColor = [1.0, 1.0, 1.0]; // White color for lines (was dark [0.1, 0.1, 0.1])
let lineworkWidth = 1.0; // Width of extracted lines
let lineworkBlendMode = 'multiply'; // How lines blend with base
let lineworkType = 'ridges'; // Type of linework: 'edges', 'contours', 'ridges', 'valleys' (ridges work best!)

// NEW: Theme Preset System
let currentTheme; // Will be randomly selected at startup
let themePresets = {
    'filament': {
        name: 'Filament',
        description: 'Thin, thread-like structures',
        constraints: {
            cellSize: [3, 5],        // Smaller cells for thin structures
            maxDepth: [800, 1200],   // Higher depth for detail
            flowSpeed: [0.03, 0.07], // Slower flow for thread formation
            noiseScale: [0.00002, 0.00006], // Finer noise
            frequency: [0.005, 0.01] // Higher frequency for detail
        }
    },
    'bloom': {
        name: 'Bloom', 
        description: 'Soft, expanding cloud-like forms',
        constraints: {
            cellSize: [8, 12],       // Larger cells for soft forms
            maxDepth: [600, 900],    // Lower depth for softer look
            flowSpeed: [0.08, 0.15], // Faster flow for expansion
            noiseScale: [0.00008, 0.00015], // Coarser noise
            frequency: [0.001, 0.005] // Lower frequency for softness
        }
    },
    'cellular': {
        name: 'Cellular',
        description: 'Honeycomb-like cellular patterns',
        constraints: {
            cellSize: [6, 9],        // Medium cells for cellular look
            maxDepth: [700, 1000],   // Balanced depth
            flowSpeed: [0.05, 0.1],  // Balanced flow
            noiseScale: [0.00005, 0.0001], // Balanced noise
            frequency: [0.003, 0.008] // Balanced frequency
        }
    },
    'vortex': {
        name: 'Vortex',
        description: 'Swirling, spiral-like formations',
        constraints: {
            cellSize: [4, 7],        // Smaller cells for tight spirals
            maxDepth: [900, 1300],   // Higher depth for spiral detail
            flowSpeed: [0.12, 0.18], // Fast flow for swirling motion
            noiseScale: [0.00003, 0.00008], // Fine noise for spiral definition
            frequency: [0.008, 0.015] // High frequency for tight spirals
        }
    },
    'crystal': {
        name: 'Crystal',
        description: 'Sharp, geometric crystalline structures',
        constraints: {
            cellSize: [2, 4],        // Very small cells for sharp edges
            maxDepth: [1000, 1500],  // Very high depth for crystal detail
            flowSpeed: [0.02, 0.05], // Very slow flow for crystal formation
            noiseScale: [0.00001, 0.00004], // Very fine noise for sharpness
            frequency: [0.01, 0.02] // Very high frequency for geometric detail
        }
    },
    'organic': {
        name: 'Organic',
        description: 'Natural, flowing biological forms',
        constraints: {
            cellSize: [10, 15],      // Large cells for organic flow
            maxDepth: [500, 800],    // Lower depth for softer organic look
            flowSpeed: [0.06, 0.12], // Medium flow for natural movement
            noiseScale: [0.0001, 0.0002], // Coarse noise for organic texture
            frequency: [0.002, 0.006] // Low frequency for natural curves
        }
    },
    'fractal': {
        name: 'Fractal',
        description: 'Self-similar patterns at multiple scales',
        constraints: {
            cellSize: [3, 6],        // Small cells for fractal detail
            maxDepth: [1200, 1800],  // Very high depth for scale layers
            flowSpeed: [0.04, 0.08], // Slow flow for fractal formation
            noiseScale: [0.00002, 0.00005], // Fine noise for scale detail
            frequency: [0.006, 0.012] // High frequency for fractal repetition
        }
    },
    'liquid': {
        name: 'Liquid',
        description: 'Fluid, droplet-like formations',
        constraints: {
            cellSize: [8, 12],       // Medium-large cells for fluid flow
            maxDepth: [600, 900],    // Balanced depth for liquid detail
            flowSpeed: [0.15, 0.25], // Very fast flow for liquid motion
            noiseScale: [0.00006, 0.00012], // Medium noise for fluid texture
            frequency: [0.003, 0.007] // Medium frequency for liquid curves
        }
    },
    'neural': {
        name: 'Neural',
        description: 'Brain-like network structures',
        constraints: {
            cellSize: [2, 5],        // Very small cells for neural detail
            maxDepth: [1000, 1400],  // High depth for network complexity
            flowSpeed: [0.03, 0.07], // Slow flow for neural growth
            noiseScale: [0.00001, 0.00003], // Very fine noise for neural detail
            frequency: [0.008, 0.016] // High frequency for network branching
        }
    },
    'cosmic': {
        name: 'Cosmic',
        description: 'Space-like nebula formations',
        constraints: {
            cellSize: [8, 14],       // Reduced from 12-18 to 8-14 for better balance
            maxDepth: [500, 800],    // Increased from 400-700 for more detail
            flowSpeed: [0.06, 0.12], // Reduced from 0.08-0.14 for gentler expansion
            noiseScale: [0.00008, 0.00015], // Reduced from 0.00015-0.00025 for finer detail
            frequency: [0.002, 0.006] // Increased from 0.001-0.004 for more structure
        }
    },
    'magnetic': {
        name: 'Magnetic',
        description: 'Field-like, force-directed patterns',
        constraints: {
            cellSize: [5, 8],        // Medium cells for field definition
            maxDepth: [800, 1100],   // Balanced depth for field complexity
            flowSpeed: [0.09, 0.16], // Medium-fast flow for field movement
            noiseScale: [0.00004, 0.00009], // Fine noise for field detail
            frequency: [0.004, 0.009] // Medium frequency for field structure
        }
    },
    'wave': {
        name: 'Wave',
        description: 'Ocean wave-like undulating forms',
        constraints: {
            cellSize: [9, 13],       // Large cells for wave smoothness
            maxDepth: [600, 900],    // Lower depth for wave softness
            flowSpeed: [0.11, 0.19], // Fast flow for wave motion
            noiseScale: [0.00007, 0.00013], // Medium noise for wave texture
            frequency: [0.003, 0.008] // Medium frequency for wave curves
        }
    },
    'particle': {
        name: 'Particle',
        description: 'Dust-like, scattered formations',
        constraints: {
            cellSize: [1, 3],        // Very small cells for particle detail
            maxDepth: [1400, 2000],  // Very high depth for particle density
            flowSpeed: [0.02, 0.05], // Very slow flow for particle settling
            noiseScale: [0.000005, 0.00002], // Extremely fine noise for particles
            frequency: [0.015, 0.025] // Very high frequency for particle distribution
        }
    }
};

// NEW: Function to apply theme parameters
function applyThemeParameters(themeName) {
    if (themeName === 'random' || !themePresets[themeName]) {
        return; // Don't change anything for random
    }
    
    const theme = themePresets[themeName];
    console.log('Applying theme parameters for: ' + theme.name);
    
    // Apply theme constraints to current parameters
    if (theme.constraints.cellSize) {
        cellSize = random(theme.constraints.cellSize[0], theme.constraints.cellSize[1]);
        theShader.setUniform('u_cellSize', cellSize);
        console.log('Cell size set to: ' + cellSize);
    }
    
    if (theme.constraints.maxDepth) {
        maxDepth = random(theme.constraints.maxDepth[0], theme.constraints.maxDepth[1]);
        theShader.setUniform('u_maxDepth', maxDepth);
        console.log('Max depth set to: ' + maxDepth);
    }
    
    if (theme.constraints.flowSpeed) {
        flowSpeed = random(theme.constraints.flowSpeed[0], theme.constraints.flowSpeed[1]);
        theShader.setUniform('u_flowSpeed', flowSpeed);
        console.log('Flow speed set to: ' + flowSpeed);
    }
    
    if (theme.constraints.noiseScale) {
        noiseScale = random(theme.constraints.noiseScale[0], theme.constraints.noiseScale[1]);
        theShader.setUniform('u_noiseScale', noiseScale);
        console.log('Noise scale set to: ' + noiseScale);
    }
    
    if (theme.constraints.frequency) {
        freq = random(theme.constraints.frequency[0], theme.constraints.frequency[1]);
        theShader.setUniform('u_frequency', freq);
        console.log('Frequency set to: ' + freq);
    }
}

function preload() {
    theShader = loadShader('shader.vert', 'shader.frag');
    console.log('Shader loaded:', theShader ? 'SUCCESS' : 'FAILED');
}

function setup() {
    const aspectRatio = 4/5;
    let canvasWidth = windowWidth;
    let canvasHeight = windowWidth / aspectRatio;
    
    if (canvasHeight > windowHeight) {
        canvasHeight = windowHeight;
        canvasWidth = windowHeight * aspectRatio;
    }
    
    createCanvas(canvasWidth, canvasHeight, WEBGL);
    randomSeed = Math.random();
    background(0);
    noStroke();
    pixelDensity(2);
    shader(theShader);
    
    noiseOffsetX = random(2000);
    noiseOffsetY = random(2000);
    
    let randomTranslateX = random(-2000, 2000);
    let randomTranslateY = random(-2000, 2000);
    translate(randomTranslateX, randomTranslateY);
    
    noiseSeed = random(1000);
    let maxDepthOptions = [1500, 2000, 2500]; // Increased depth options for more layers
    maxDepth = random(maxDepthOptions);
    
    paletteIndex1 = int(random(34));
    paletteIndex2 = int(random(34));
    while (paletteIndex2 === paletteIndex1) {
        paletteIndex2 = int(random(34));
    }
    
    randomScaleSeed = random(1000);
    let rotationOptions = [0, 30, 60, 90];
    rotationAngle = rotationOptions[int(random(rotationOptions.length))];
    
    freq = random([0.01, 0.005, 0.001]);
    console.log('Frequency: ' + freq);
    
    // NEW: Randomly select domain-warp intensity from specific values
    let domainWarpOptions = [0.0, 1.0, 3.0, 6.0, 10.0];
    domainWarpIntensity = random(domainWarpOptions);
    console.log('Domain-Warp Intensity: ' + domainWarpIntensity);
    
    // NEW: Randomly select a theme at startup (deterministic with the random seed)
    let themeKeys = Object.keys(themePresets);
    currentTheme = themeKeys[int(random(themeKeys.length))];
    console.log('Selected theme: ' + themePresets[currentTheme].name);
    console.log('Theme description: ' + themePresets[currentTheme].description);
    
    // Apply the selected theme parameters
    applyThemeParameters(currentTheme);
    
    noiseScale = random([0.00001, 0.00004, 0.0001]);
    console.log('NoiseScale: ' + noiseScale);
    
    let selectedAmplitude = amplitudeValues[int(random(amplitudeValues.length))];
    let selectedRdParams = rdParameters[int(random(rdParameters.length))];
    rdParameterA = selectedRdParams['a'];
    rdParameterB = selectedRdParams['b'];
    
    console.log('Selected rdParameterA: ' + rdParameterA + ', rdParameterB: ' + rdParameterB);
    
    theShader.setUniform('u_resolution', [width, height]);
    theShader.setUniform('u_cellSize', cellSize);
    theShader.setUniform('u_flowSpeed', flowSpeed);
    theShader.setUniform('u_paletteIndex1', paletteIndex1);
    theShader.setUniform('u_paletteIndex2', paletteIndex2);
    theShader.setUniform('u_noiseSeed', noiseSeed);
    theShader.setUniform('u_randomScaleSeed', randomScaleSeed);
    theShader.setUniform('u_rotationAngle', radians(rotationAngle));
    theShader.setUniform('u_noiseOffset', [noiseOffsetX, noiseOffsetY]);
    theShader.setUniform('u_amplitude', selectedAmplitude);
    theShader.setUniform('u_maxDepth', maxDepth);
    theShader.setUniform('u_paletteThreshold', paletteThreshold);
    theShader.setUniform('u_reactionInfluence', reactionInfluence);
    theShader.setUniform('u_caInfluence', caInfluence); // NEW: Set missing CA influence uniform
    theShader.setUniform('u_rdParameterA', rdParameterA);
    theShader.setUniform('u_rdParameterB', rdParameterB);
    theShader.setUniform('u_seed', randomSeed);
    theShader.setUniform('u_frequency', freq);
    theShader.setUniform('u_domainWarpIntensity', domainWarpIntensity);
    
    // NEW: Set depth enhancement uniforms
    theShader.setUniform('u_layerNoiseThreshold', layerNoiseThreshold);
    theShader.setUniform('u_depthFalloffRate', depthFalloffRate);
    
    // NEW: Set linework uniforms
    theShader.setUniform('u_lineworkEnabled', lineworkEnabled ? 1.0 : 0.0);
    theShader.setUniform('u_lineworkIntensity', lineworkIntensity);
    theShader.setUniform('u_lineworkThreshold', lineworkThreshold);
    theShader.setUniform('u_lineworkColor', lineworkColor);
    theShader.setUniform('u_lineworkWidth', lineworkWidth);
    theShader.setUniform('u_lineworkType', float(['edges', 'contours', 'ridges', 'valleys'].indexOf(lineworkType)));
    
    // NEW: Debug linework uniform setup
    console.log('Linework uniforms set in setup:');
    console.log('  Enabled:', lineworkEnabled ? 1.0 : 0.0);
    console.log('  Intensity:', lineworkIntensity);
    console.log('  Threshold:', lineworkThreshold);
    console.log('  Color:', lineworkColor);
    console.log('  Width:', lineworkWidth);
    console.log('  Type:', lineworkType, '(index:', ['edges', 'contours', 'ridges', 'valleys'].indexOf(lineworkType) + ')');
    
    // TEST: Verify shader is working
    console.log('Shader uniforms set. Testing basic rendering...');
    
    const gl = this._renderer.GL;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
}

function draw() {
    if (!hasInitialAnimationRun) {
        frameCounter++;
        elapsedTime = millis() / 1000;
        if (frameCounter >= maxFrames) {
            hasInitialAnimationRun = true;
        }
    } else if (isAnimating) {
        elapsedTime = millis() / 1000;
    }
    
    // Simple zoom controls - exactly like the original
    if (keyIsDown(UP_ARROW)) {
        scaleFactor += 10.1;
    }
    if (keyIsDown(DOWN_ARROW)) {
        scaleFactor -= 10.1;
    }
    
    scaleFactor = Math.round(scaleFactor * 10) / 10;
    scaleFactor = constrain(scaleFactor, 2.0, 400);
    
    // Simple panning logic - exactly like the original
    if (mouseIsPressed && mouseButton === LEFT) {
        if (previousMouseX !== undefined && previousMouseY !== undefined) {
            let deltaX = mouseX - previousMouseX;
            let deltaY = mouseY - previousMouseY;
            translateX -= deltaX * scaleFactor;
            translateY += deltaY * scaleFactor;
        }
        previousMouseX = mouseX;
        previousMouseY = mouseY;
    } else {
        previousMouseX = undefined;
        previousMouseY = undefined;
    }
    
    // Apply canvas transformation for panning
    resetMatrix();
    translate(translateX, translateY);
    
    theShader.setUniform('u_scaleFactor', scaleFactor);
    theShader.setUniform('u_translation', [translateX, translateY]);
    theShader.setUniform('u_time', elapsedTime);
    theShader.setUniform('u_noiseScale', noiseScale);
    theShader.setUniform('u_domainWarpIntensity', domainWarpIntensity);
    theShader.setUniform('u_caInfluence', caInfluence);
    
    // DEBUG: Show current values
    if (frameCount % 60 === 0) { // Every 60 frames (once per second)
        let themeInfo = themePresets[currentTheme].name;
        let themeDetails = ' | Cell:' + cellSize + ' | Depth:' + maxDepth + ' | Flow:' + flowSpeed.toFixed(3) + ' | Noise:' + noiseScale.toFixed(6) + ' | Freq:' + freq.toFixed(4);
        let depthInfo = ' | LayerThresh:' + layerNoiseThreshold.toFixed(2) + ' | Falloff:' + depthFalloffRate.toFixed(2);
        let lineworkInfo = lineworkEnabled ? ' | Linework:ON(' + lineworkIntensity.toFixed(2) + ')' : '';
        console.log('Frame:', frameCount, 'Theme:', themeInfo, 'Domain-Warp:', domainWarpIntensity, 'Scale:', scaleFactor + themeDetails + depthInfo + lineworkInfo);
    }
    
    // NEW: Show linework controls reminder
    if (frameCount === 1) {
        console.log('Linework: Enabled by default with ridge lines');
    }
    
    beginShape();
    vertex(-1, -1, 0, 0, 0);
    vertex(1, -1, 0, 1, 0);
    vertex(1, 1, 0, 1, 1);
    vertex(-1, 1, 0, 0, 1);
    endShape(CLOSE);
}

function keyPressed() {
    if (key === '1') {
        paletteThreshold = max(0, paletteThreshold - 0.1);
        } else if (key === '2') {
        paletteThreshold = min(1, paletteThreshold + 0.1);
    } else if (key === 'S' || key === 's') {
        if (hasInitialAnimationRun) {
            isAnimating = !isAnimating;
        }
    } else if (key === 'R' || key === 'r') {
        translateX = 0;
        translateY = 0;
        // Force redraw to show reset position
        redraw();
    }
    
    theShader.setUniform('u_paletteThreshold', paletteThreshold);
}

function windowResized() {
    const aspectRatio = 4/5;
    let newWidth = windowWidth;
    let newHeight = windowWidth / aspectRatio;
    
    if (newHeight > windowHeight) {
        newHeight = windowHeight;
        newWidth = windowHeight * aspectRatio;
    }
    
    resizeCanvas(newWidth, newHeight);
    theShader.setUniform('u_resolution', [newWidth, newHeight]);
}

