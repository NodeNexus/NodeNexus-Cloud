# Development Setup

This guide helps you set up VNAV Cloud for local development without relying heavily on Docker to make hot-reloading faster.

## 1. Backend Setup

The backend requires Python 3.13.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

## 2. Frontend Setup

The frontend uses Vite, React 18, and TailwindCSS v4.

```bash
cd frontend
npm install
npm run dev
```

The UI will be accessible at `http://localhost:5173`. 
Ensure your backend is running so the frontend can successfully authenticate.

## 3. Testing
- **Backend**: Run `pytest` in the backend directory.
- **Frontend**: Run `npm run test` in the frontend directory (uses Vitest).
