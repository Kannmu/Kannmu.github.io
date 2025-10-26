# GenPlant

🌱 A web-based procedural plant generator that creates unique 3D plant models using deterministic algorithms.

[中文文档 / Chinese Documentation](./README_zh.md)

## ✨ Features

- **Deterministic Generation**: Same seed always generates the same plant, ensuring reproducible results
- **Procedural Modeling**: Plant growth algorithms based on biological principles, simulating realistic plant morphology
- **Real-time Rendering**: High-quality 3D rendering and interaction using Three.js
- **Pure Frontend**: Runs entirely in the browser without server requirements
- **Parametric Control**: Rich parameter system controlling all aspects of plant generation

## 🚀 Quick Start

### Online Experience

Simply open the `GenPlant/index.html` file to start using the application.

### Usage

1. **Input Seed**: Enter any number in the input field as the generation seed
2. **Generate Plant**: Click the "Generate Plant" button to create a plant
3. **Random Generation**: Click the "Random Plant" button to generate a random plant
4. **Camera Control**: Use mouse to drag and rotate view, scroll to zoom, click "Reset Camera" to reset view

## 🏗️ Technical Architecture

### Core Technology Stack

- **Three.js**: 3D rendering engine
- **ES6 Modules**: Modular architecture
- **WebGL**: Hardware-accelerated rendering
- **HTML5 Canvas**: Rendering target

### System Architecture

```
User Interface (UI)
    ↓
Main Controller
    ↓
Generator Core
├── Parameters Generator
├── Structure Engine
├── Geometry Builder
└── Material Generator
    ↓
Renderer Module
    ↓
HTML5 Canvas
```

### Core Algorithms

- **Deterministic Random Number Generation**: Uses Mulberry32 algorithm to ensure reproducibility
- **Hierarchical Parameter System**: Multi-layer parameter control from macro morphology to detail textures
- **Recursive Branch Generation**: Recursive algorithms simulating natural plant branching
- **Procedural Materials**: Parameter-based material and texture generation

## 📁 Project Structure

```
GenPlant/
├── index.html              # Main page
├── style.css              # Stylesheet
├── js/
│   ├── main.js            # Main controller
│   ├── renderer.js        # Renderer module
│   ├── config/
│   │   └── constants.js   # Configuration constants
│   ├── generator/
│   │   ├── index.js       # Generator entry point
│   │   ├── parameters.js  # Parameter generation
│   │   ├── structure.js   # Structure generation
│   │   ├── geometry.js    # Geometry building
│   │   └── material.js    # Material generation
│   └── util/
│       ├── random.js      # Random utilities
│       ├── math.js        # Math utilities
│       └── geometry.js    # Geometry utilities
└── data/
    └── defaultModel/      # Default model resources
```

## 🎯 Parameter System

### Hierarchical Parameter Architecture

1. **Global Seed**: Root of all random processes
2. **Archetype Parameters**: Basic plant type and macro morphology
3. **Environmental Parameters**: Environmental influences like phototropism, gravity, pruning factors
4. **Structural Parameters**: Geometric properties of trunk and branches
5. **Material Parameters**: Colors, textures, surface properties

### Biologically Inspired

- **Phototropism**: Simulates plant growth towards light
- **Gravitropism**: Simulates gravity's effect on plant morphology
- **Apical Dominance**: Simulates trunk's growth advantage over side branches
- **Natural Pruning**: Simulates natural elimination of internal branches

## 🔧 Development Guide

### Local Development

Since ES6 modules are used, run through an HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using Live Server (VS Code extension)
# Right-click index.html -> Open with Live Server
```

### Code Standards

- Use ES6+ syntax
- Modular design with single responsibility principle
- Detailed JSDoc comments
- Unified error handling mechanisms

### Extension Development

- **New Plant Types**: Add new archetype types in `parameters.js`
- **New Growth Algorithms**: Implement new generation logic in `structure.js`
- **New Material Effects**: Add new material types in `material.js`
- **New Geometric Features**: Extend geometry generation in `geometry.js`

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve the project!

## 🔗 Related Links

- [Three.js Official Documentation](https://threejs.org/docs/)
- [WebGL Specification](https://www.khronos.org/webgl/)
- [Procedural Content Generation](https://en.wikipedia.org/wiki/Procedural_generation)

---

*GenPlant - Let every seed bloom into unique life* 🌿
