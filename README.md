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

## Vercel Deployment

This project is configured for deployment on Vercel using serverless functions.

### Deploy Steps

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts to link your GitHub repository.

4. **Set Environment Variables** in Vercel Dashboard:
   - `SESSION_SECRET`: A secure random string
   - `DATABASE_URL`: Your database URL (SQLite works for simple deployments)
   - `FLASK_DEBUG`: Set to `false`

5. **Redeploy** after setting environment variables:
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The `vercel.json` file configures:
- Python runtime for serverless functions
- Routes all requests to `api/index.py`
- Environment variables
- Function timeout settings

### Database Notes

For Vercel deployment:
- SQLite works for simple deployments but data may not persist between function calls
- For production, consider PostgreSQL or another cloud database
- Database files are ephemeral on Vercel - data may not persist between deployments
- Consider using a database service like Railway or PlanetScale for persistent data

### Important Vercel Notes

- Serverless functions have execution time limits (10 seconds for hobby plan)
- File system is read-only except for `/tmp`
- Static files in `static/` folder should work automatically
- Templates in `templates/` folder are supported
- Environment variables must be set in Vercel dashboard, not in code

## Alternative Deployments

If Vercel doesn't work well for your Flask app, consider:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo, auto-deploys
- **Render**: Web service with persistent database

## License
This repository includes a `LICENSE` file. Refer to it for the project license details.