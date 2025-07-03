# NeuroCode 🧠💻

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=neurocode)
[![Version](https://img.shields.io/badge/version-0.0.1-green.svg)](https://github.com/PavanCodes05/NeuroCode)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-orange.svg)](https://github.com/PavanCodes05/NeuroCode)

> **Revolutionary AI Pair Programming for VS Code** - Transform your coding experience with intelligent, persona-driven assistance that understands your code in real-time.

## 🚀 Overview

NeuroCode is an advanced AI-powered pair programming extension for Visual Studio Code that revolutionizes how developers write, understand, and refactor code. Unlike traditional AI coding assistants, NeuroCode features **intelligent personas** that adapt to your coding style and provide contextually aware assistance through sophisticated code analysis and real-time monitoring.

## AI PERSONAS REAL-TIME SUGGESTIONS
![AI Persona](https://github.com/user-attachments/assets/cffe2a44-3419-429f-8cbf-409d1ba684cd)


### 🌟 Key Differentiators

- **🎭 AI Personas**: Choose from specialized programming personalities (Rubber Duck, Code Critic, Mentor, Peer Programmer)
- **🔄 Real-time Code Monitoring**: Continuously watches your code and detects when you're stuck
- **🧠 Advanced Pipeline**: Code → AST → Context Analysis → Dynamic Prompts → LLM Processing
- **🎯 Context-Aware Assistance**: Understands your entire project structure for relevant suggestions
- **⚡ Intelligent Fallbacks**: Robust retry mechanisms ensure reliable assistance

## 🛠️ Architecture

NeuroCode employs a sophisticated processing pipeline:

```
User Code Input
    ↓
Abstract Syntax Tree (AST) Generation
    ↓
Information Extraction & Normalization
    ↓
Project Context Analysis
    ↓
Dynamic Prompt Generation
    ↓
LLM Processing with Retries
    ↓
Persona-Filtered Response
    ↓
Intelligent Output Delivery
```

## ✨ Features

### 🎭 AI Personas

- **🦆 Rubber Duck**: Asks insightful questions to help you discover solutions yourself
- **🔍 Code Critic**: Provides constructive feedback and identifies potential issues
- **👨‍🏫 Mentor**: Offers educational guidance and best practices
- **👥 Peer Programmer**: Collaborates as an equal coding partner

### 🔧 Core Commands

| Command | Shortcut | Description |
| **Pair Programming** | `Always On` | Activate real-time AI pair programming mode |
|---------|----------|-------------|
| **Explain Code** | `Ctrl+Shift+E` | Get comprehensive explanations in a new tab |
| **Custom Prompt** | `Ctrl+Shift+X` | Apply custom instructions to selected code |
| **Refactor Code** | `Ctrl+Shift+R` | Intelligent code refactoring with instant replacement |

### 🎯 Smart Features

- **Real-time Code Analysis**: Monitors your coding patterns and detects when assistance is needed
- **Context-Aware Suggestions**: Understands your project structure and dependencies
- **Intelligent Code Extraction**: Automatically identifies relevant code blocks for analysis
- **Fallback Mechanisms**: Ensures reliable responses even when primary LLM calls fail

## 🚀 Getting Started

### Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "NeuroCode"
4. Click Install

### Configuration

1. Open VS Code settings (`Ctrl+,`)
2. Search for "NeuroCode"
3. Configure your preferred AI model and API credentials
4. Select your default persona

### Usage

1. **Select code** you want to work with
2. **Use shortcuts** or command palette (`Ctrl+Shift+P`)
3. **Choose your persona** for contextual assistance
4. **Get intelligent responses** tailored to your needs

## 💡 Use Cases

### 🔍 Code Explanation
```python
// Select complex code and press Ctrl+Shift+E
def process_values(x: int, y: int) -> None:
    """
    Processes two integer values by performing a series of operations.

    Args:
        x (int): The first integer value.
        y (int): The second integer value.
    """
    if not isinstance(x, int) or not isinstance(y, int):
        raise TypeError("Both inputs must be integers")

    if x < 0 or y < 0:
        return  # Early exit for negative values

    result = x + y
    if result > 100:
        result = 100  # Cap result at 100

    print(f"Processed result: {result}")
```

### 🔄 Code Refactoring
```python
// Select outdated code and press Ctrl+Shift+R
```def doStuff(x, y):
    a = 0
    for i in range(0, len(x)):
        if x[i] == y:
            a = a + 1
    for i in range(0, len(x)):
        if x[i] == y:
            print("found at", i)
    if a == 0:
        print("not found")```
// NeuroCode will suggest modern, optimized alternatives
```

### 🎨 Custom Prompts
```python
// Select code and press Ctrl+Shift+X
// Add custom instructions like "Make this more performant"
// Or "Add error handling" for targeted improvements
```

## 🏗️ Technical Stack

- **Frontend**: TypeScript, VS Code Extension API
- **AI Integration**: Cohere AI API
- **Code Analysis**: Custom AST parser
- **Configuration**: dotenv for environment management
- **File Handling**: ignore library for project structure analysis

## 📊 Performance Features

- **⚡ Fast Response Times**: Optimized pipeline for quick assistance
- **🔄 Retry Logic**: Automatic fallbacks for reliability
- **📱 Low Resource Usage**: Efficient memory and CPU utilization
- **🎯 Context Caching**: Smart caching for repeated operations

## 🔧 Development

### Prerequisites
- Node.js 20.x or higher
- TypeScript 5.8.2+
- VS Code 1.99.0+

### Setup
```bash
git clone https://github.com/PavanCodes05/NeuroCode
cd neurocode
npm install
npm run compile
```

## 🎯 Roadmap

- [ ] Additional AI personas (Debugger, Performance Optimizer)
- [ ] Multi-language model support
- [ ] Enhanced context understanding
- [ ] Code generation templates
- [ ] Team collaboration features
- [ ] Plugin marketplace for custom personas

## 📈 Why NeuroCode?

- **🎭 Unique Persona System**: First VS Code extension with AI personalities
- **🧠 Advanced Code Understanding**: Goes beyond simple text completion
- **🔄 Real-time Assistance**: Proactive help when you need it most
- **🎯 Context Intelligence**: Understands your entire project, not just snippets
- **⚡ Production Ready**: Robust error handling and fallback mechanisms

## 🌟 Show Your Support

Give a ⭐️ if this project helped you become a better programmer!

---

**Made with ❤️ by [Pavan Prakash K]** | **Powered by AI** | **Built for Developers**
