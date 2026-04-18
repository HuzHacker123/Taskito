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
- Dependencies are listed in `requirment.txt`

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
   python -m pip install -r requirment.txt
   ```

4. Set environment variables as needed:
   ```bash
   export FLASK_APP=main.py
   export FLASK_ENV=development
   export SESSION_SECRET="your_secret_key"
   ```

## Run the app
```bash
python main.py
```

Then open `http://127.0.0.1:5000` in your browser.

## Database
The default database is SQLite and is configured as:
```python
sqlite:///taskito.db
```

If you want to use a different database, set:
```bash
export DATABASE_URL="your_database_url"
```

## Notes
- The application file is `app.py` and the entrypoint is `main.py`.
- `requirment.txt` contains the dependency list for this project.

## License
This repository includes a `LICENSE` file. Refer to it for the project license details.
