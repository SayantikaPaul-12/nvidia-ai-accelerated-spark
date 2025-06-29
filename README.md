````markdown
# AI Tutor – Accelerated Learning System for Data Science

An AI-powered tutoring system designed to accelerate learning in **Data Science** and **GPU Acceleration**, using a multi-agent architecture built on **Ollama LLM**. This platform supports interactive modes including Socratic guidance, real-time quizzes, GPU benchmarking, and video-based learning.

Developed as part of the **AI Spark Challenge** with NVIDIA and AZNext.

---

## Features

### Mode-Based AI Tutoring
- **Socratic Tutor**  
  Encourages learners to reason through questions via guided prompts rather than direct answers.

- **General Assistant**  
  Provides concise, code-ready answers and explanations for technical topics in ML, data science, and programming.

- **GPU Accelerator**  
  Helps users convert CPU-bound code (e.g., NumPy, Pandas) to GPU-accelerated versions using CuPy, cuDF, etc. Includes benchmarking tools.

- **Quiz Mode**  
  Time-bound 10-question multiple-choice quizzes with instant scoring, answer explanations, weak point analysis, and upskilling recommendations.

- **Video Tutor**  
  Fetches and summarizes relevant tutorial videos from trusted sources (e.g., NVIDIA YouTube, technical conference talks).

---

## Architecture Overview


* Frontend: Angular UI (Netlify-hosted)
* Backend: Node.js or FastAPI (Python)
* LLM Agent: Ollama
* Document Ingestion: LangChain loaders + vector chunking
* Knowledge Source: NVIDIA documents, YouTube transcripts, benchmark papers
* Persistence: FAISS vector store + user session DB

View full architecture diagram: [`architecture-diagram.png`](./architecture-diagram.png)

---

## Tech Stack

| Layer             | Technology                               |
| ----------------- | ---------------------------------------- |
| Frontend          | Angular 17                               |
| Backend           | Node.js (Express) / Python (FastAPI)     |
| AI Core           | Ollama LLM + LangChain                   |
| Document DB       | FAISS / Chroma                           |
| Transcript Engine | Whisper for audio/video transcription    |
| Hosting           | Netlify (Frontend) |


---

## Project Structure

```
├── backend/
│   ├── api/
│   ├── agents/
│   └── vectorstore/
├── frontend/
│   └── angular-app/
├── sol/
│   └── ollama-llm/
├── assets/
│   └── knowledge_base/
├── architecture-diagram.png
├── deploy-instructions.md
└── README.md
```

---

## Local Development Setup

### Prerequisites

* Node.js (v18+)
* Python 3.10+
* Angular CLI
* Ollama installed locally or connected via API
* FAISS or Chroma setup for vector storage

### Quickstart

```bash
# Clone the repository
git clone https://github.com/<your-org>/ai-tutor-gpu.git
cd ai-tutor-gpu

# Start backend
cd backend
npm install             # or pip install -r requirements.txt
npm run dev             # or uvicorn main:app --reload

# Start frontend
cd ../frontend/angular-app
npm install
ng serve
```



## Demo Walkthrough
 [Watch Video Demo](#)
*(Link to Netlify-deployed app demo or hosted video)*




 

---

