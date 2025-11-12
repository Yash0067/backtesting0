#!/bin/bash
# Start script for Render deployment

# Run the application
# PORT is automatically set by Render
uvicorn src.backend.app:app --host 0.0.0.0 --port ${PORT:-8000}

