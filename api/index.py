import os
from app import app, create_tables

# Set default environment variables for Vercel
os.environ.setdefault('SESSION_SECRET', 'vercel_deployment_secret_change_this')
os.environ.setdefault('DATABASE_URL', 'sqlite:///taskito.db')
os.environ.setdefault('FLASK_DEBUG', 'false')

# Create database tables on startup
create_tables()

# Export the Flask app as a WSGI application for Vercel
application = app