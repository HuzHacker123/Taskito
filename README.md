# Taskito

Taskito is a Flask-based task management application with user authentication, task categories, progress tracking, and achievements.

## Features
- Flask web application with SQLAlchemy ORM
- User authentication using Flask-Login
- Database migrations with Flask-Migrate
- Task and category management
- Progress and achievement tracking

## Requirements
- Python 3.11+ recommended
- Virtual environment recommended
- Dependencies are listed in `requirements.txt`

## Setup
1. Open a terminal in the project root:
   ```bash
   cd "/Users/huzefa/CodeWithHuzefa/Taskito"
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

4. Set environment variables as needed:
   ```bash
   export SESSION_SECRET="your_secret_key"
   export DATABASE_URL="sqlite:///taskito.db"
   export PORT=5000
   export FLASK_DEBUG=false
   ```

## Running Locally
Start the app locally with:
```bash
python main.py
```

Open `http://127.0.0.1:5000` in your browser.

## Production Deployment
When deploying to a production host, use a WSGI server such as Gunicorn:
```bash
gunicorn main:app --bind 0.0.0.0:$PORT
```

This project includes a `Procfile` for platforms like Heroku:
```text
web: gunicorn main:app --bind 0.0.0.0:$PORT
```

## Database
The default database is SQLite and is configured as:
```python
sqlite:///taskito.db
```

For production, set a database URL, for example:
```bash
export DATABASE_URL="postgresql://user:password@host:port/dbname"
```

## Production Notes
- `main.py` now reads `PORT` and `FLASK_DEBUG` from the environment.
- Do not run the app with `debug=True` in production.
- Add a secure `SESSION_SECRET` before deploying.
- Use `flask db migrate` and `flask db upgrade` if you are using Flask-Migrate.

## Git
The project now includes a `.gitignore` file to omit local artifacts such as `.venv/`, `__pycache__/`, and `instance/taskito.db`.

## License
This repository includes a `LICENSE` file. Refer to it for the project license details.
