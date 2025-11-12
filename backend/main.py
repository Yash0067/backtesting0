import uvicorn
import sys
import os

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    uvicorn.run("src.backend.app:app", host="0.0.0.0", port=8000, reload=True)
