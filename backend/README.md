# Backend - Trading Strategy Backtesting API

This is the backend API for the Trading Strategy Backtesting Platform, built with FastAPI.

## Structure

```
backend/
├── src/
│   └── backend/          # Main backend application code
│       ├── app.py        # FastAPI application and routes
│       ├── db.py         # Database configuration (SQLAlchemy)
│       ├── models.py     # SQLAlchemy models
│       ├── schemas.py    # Pydantic schemas
│       ├── utils.py      # Utility functions
│       ├── mongo_models.py  # MongoDB models
│       ├── mongo_utils.py   # MongoDB utilities
│       └── strategy_adapter.py  # Strategy execution logic
├── app.py                # Alternative MongoDB-only FastAPI app
├── main.py               # Entry point for running the server
├── run.py                # Alternative entry point
├── setup.py              # Package setup configuration
├── requirements.txt      # Python dependencies
├── test_mongo.py         # MongoDB connection test script
└── trail_backtesting.py  # Standalone backtesting script
```

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables (optional):**
   - `DATABASE_URL`: SQLite database URL (default: `sqlite:///./backtests.db`)
   - `MONGODB_URI`: MongoDB connection string (default: `mongodb://localhost:27017`)
   - `MONGODB_DB`: MongoDB database name (default: `trading_strategy_db`)

3. **Initialize MongoDB (if using MongoDB features):**
   - Make sure MongoDB is running on `localhost:27017`
   - The application will automatically create collections and indexes on first use

## Running the Backend

### Option 1: Using run.py
```bash
cd backend
python run.py
```

### Option 2: Using main.py
```bash
cd backend
python main.py
```

### Option 3: Using uvicorn directly
```bash
cd backend
uvicorn src.backend.app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Backtest Endpoints
- `POST /backtests` - Create a new backtest
- `GET /backtests` - List all backtests
- `GET /backtests/{bt_id}` - Get backtest results by ID
- `GET /downloads/{filename}` - Download backtest result files

### File Management Endpoints
- `POST /api/files/upload/` - Upload a CSV file
- `GET /api/files/` - List uploaded files
- `GET /api/files/{file_id}` - Get file metadata
- `DELETE /api/files/{file_id}` - Delete a file

### Historical Data Endpoints
- `POST /api/historical-data/` - Save historical backtest data
- `GET /api/historical-data/` - List historical backtest data
- `GET /api/historical-data/{data_id}` - Get specific historical data
- `DELETE /api/historical-data/{data_id}` - Delete historical data

## Data Storage

- **SQLite Database**: Stored in `backtests.db` (in project root)
- **MongoDB**: Used for historical data and file metadata
- **Uploaded Files**: Stored in `../data/uploads/` (relative to backend)
- **Processed Files**: Stored in `../data/downloads/` (relative to backend)

## Testing

Test MongoDB connection:
```bash
python test_mongo.py
```

## Notes

- The backend expects the `data/` directory to exist at the project root level (one level up from `backend/`)
- CORS is enabled for all origins in development mode
- The API supports both SQLite (for quick testing) and MongoDB (for production)

