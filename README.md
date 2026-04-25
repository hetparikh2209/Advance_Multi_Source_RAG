# RAG Chat — Next.js Frontend

A document Q&A chatbot frontend that connects to your Google Colab RAG backend
(ChromaDB + Sentence Transformers + Llama 3.1 via HuggingFace).

---

## Project Structure

```
src/
├── app/
│   ├── layout.js               # Root layout + fonts
│   ├── globals.css             # CSS variables + base styles
│   ├── page.js                 # Main page (composes all components)
│   ├── page.module.css
│   └── api/
│       ├── chat/route.js       # POST /api/chat   → Colab /chat
│       ├── session/route.js    # POST /api/session → Colab /create_session
│       └── upload/route.js     # POST /api/upload  → Colab /upload
├── components/
│   ├── Sidebar.js / .module.css       # Left panel: URL, files, settings
│   ├── ChatWindow.js / .module.css    # Right panel: messages + input
│   ├── Message.js / .module.css       # Individual chat bubble + sources
│   ├── ChatInput.js / .module.css     # Textarea + send button
│   ├── FileItem.js / .module.css      # Single file row with upload action
│   └── EmptyState.js / .module.css    # Placeholder with suggestion chips
├── hooks/
│   ├── useChat.js              # Chat state, session management
│   └── useFileUpload.js        # File list state + upload logic
└── lib/
    └── colab.js                # Shared Colab URL resolver + fetch helper
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
COLAB_URL=https://xxxx.ngrok-free.app
```

> You can also leave this blank and paste the URL directly in the UI sidebar.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Colab Setup

Add this to the bottom of your Colab notebook to expose the FastAPI endpoints:

```python
!pip install fastapi uvicorn pyngrok nest-asyncio python-multipart

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn, threading, nest_asyncio
from pyngrok import ngrok

nest_asyncio.apply()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    session_id: str
    n_chunks: int = 3

@app.post("/create_session")
def create_session_endpoint():
    sid = create_session()
    return {"session_id": sid}

@app.post("/chat")
def chat(req: ChatRequest):
    response, sources = conversational_rag_query(
        collection, req.query, req.session_id, req.n_chunks
    )
    return {"answer": response, "sources": sources}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    path = f"/content/Docs/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())
    ids, texts, metadatas = process_document(path)
    add_to_collection(collection, ids, texts, metadatas)
    return {"status": "ok", "chunks": len(texts)}

public_url = ngrok.connect(8000)
print(f"✅ Colab URL: {public_url}")

threading.Thread(
    target=lambda: uvicorn.run(app, host="0.0.0.0", port=8000)
).start()
```

Copy the printed URL and paste it into the sidebar (or `.env.local`).

---

## How It Works

```
Browser
  └─▶ Next.js API Route (/api/chat, /api/session, /api/upload)
        └─▶ Google Colab (ngrok tunnel)
              └─▶ ChromaDB semantic search
                    └─▶ Llama 3.1 via HuggingFace router
```

The Next.js API routes act as a proxy — they keep your Colab URL server-side
and add a 30-second timeout via `src/lib/colab.js`.
