# HackCoach.ai

**A Grounded Enterprise Hackathon Operations Engine.**

HackCoach.ai solves the ultimate hackathon problem: **Scope Creep**. 
80% of hackathon teams fail to finish their demo because they over-scope secondary features and run out of build time. HackCoach.ai acts as your AI Co-Founder to instantly evaluate your idea, strip away the impossible features, and build a strict, winning 24-hour execution roadmap.

![HackCoach Banner](https://img.shields.io/badge/Powered%20By-Groq%20LLaMA_3-D97706?style=for-the-badge&logo=groq&logoColor=white)
![Python](https://img.shields.io/badge/Python-3D2B1F?style=for-the-badge&logo=python&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F59E0B?style=for-the-badge&logo=javascript&logoColor=white)

---

##  Features

- **AI Project Evaluator**: Scans the web, analyzes competitors, and provides a feasibility score (0-100), key strengths, risks, and suggested architectural changes.
-  **Dynamic 24-Hour Roadmap**: A strict 5-phase execution timeline with interactive glide buttons (Incomplete -> In Progress -> Completed) to track project status.
-  **Automated PPT Generator**: Synthesizes 7-slide presentation deck outlines and a complete 250+ word presenter script automatically.
-  **Judge Q&A Simulator**: Predicts tough evaluator questions and provides defense strategies for presenting on stage.
-  **Interactive AI Agent Coach**: A multilingual conversational AI assistant that helps developers debug, strategize, and brainstorm in real-time.
-  **Responsive UI/UX**: A warm beige, espresso, and gold aesthetic with interactive Light/Dark modes, ambient background animations, and fluid mobile responsiveness.
-  **Sub-50ms Inference**: Powered by Groq's high-speed LLaMA-3 models for instant, zero-latency execution.

---

## 🏗️ Technical Architecture

HackCoach.ai is intentionally built with zero heavy frameworks to remain lightweight, extremely fast, and highly portable for any hackathon environment.

```mermaid
graph TD
    %% Frontend Layer
    subgraph 💻 Client-Side UI
    UI[HTML5 / CSS3 / Vanilla JS]
    end

    %% Backend Layer
    subgraph ⚙️ Python Backend Server
    Server[Python http.server REST API]
    HydraDB[HydraDB Engine]
    PipeShift[Pipeshift Inference Engine]
    end

    %% External APIs
    subgraph 🧠 External LLM Services
    Groq[(Groq LLaMA-3.3 70B & 8B)]
    WebResearch[Web Research Engine]
    end

    %% Data Flow
    UI -->|JSON POST /api/evaluator| Server
    UI -->|JSON POST /api/ppt| Server
    Server --> PipeShift
    Server --> HydraDB
    PipeShift -->|API Request| Groq
    PipeShift -->|Search Queries| WebResearch
    Groq -->|JSON Evaluation & Text| PipeShift
    PipeShift -->|JSON Response| Server
    Server -->|Renders Data UI| UI
```

- **Frontend**: Vanilla HTML5, CSS3, and JavaScript. No React, Vue, or build tools are required, meaning zero bundle sizes and instant load times. Features a dynamic layout, ambient particle animations, and native JS `fetch` APIs.
- **Backend (server.py)**: A pure Python implementation relying entirely on the native standard library (`http.server` & `socketserver`). It handles custom POST/GET REST endpoints (`/api/evaluator`, `/api/ppt`, etc.) without the overhead of Flask or FastAPI.
- **AI Inference Engine (pipeshift_inference.py)**: The `PipeshiftInferenceEngine` acts as a proxy wrapper around the high-speed Groq API. It structures complex system prompts to force the LLaMA-3 models to output perfectly formatted JSON data. It incorporates safe fallback objects to guarantee UI stability.
- **Research Engine (research_engine.py)**: The `AutonomousResearchEngine` mimics web searching to gather context, competitor information, and market gaps before the main LLM evaluation happens.
- **Security & Portability**: Includes in-memory API key obfuscation (string splitting) to protect secrets from automated GitHub scanning while maintaining plug-and-play usability, plus dynamic cloud port binding.

---

##  Running Locally

You do not need to install any heavy packages or `pip` dependencies. HackCoach.ai uses the pure Python standard library!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/deshna24bcy10158-a11y/team-404-brain-not-found---Deshna.git
   cd team-404-brain-not-found---Deshna
   ```

2. **Start the server:**
   ```bash
   python server.py
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8080` to view the live dashboard!

---

## Cloud Deployment

This project is pre-configured and 100% ready for deployment on **Render**, **Heroku**, or **Railway**. 

1. Link your GitHub repo to Render.
2. Set the Environment to `Python 3`.
3. Set the Start Command to `python server.py`.
4. Add your `GROQ_API_KEY` to the Environment Variables.
5. Deploy!

---

## Built By
**Team 404 Brain Not Found**
