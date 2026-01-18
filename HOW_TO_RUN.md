# 🚀 How to Run Backend and Frontend

Complete guide to set up and run the Ahmedabad Smart City Platform.

## 📋 Prerequisites

Before starting, make sure you have:

- **Python 3.9+** (check with `python --version`)
- **Node.js 18+** (check with `node --version`)
- **npm** (comes with Node.js, check with `npm --version`)
- **Git** (for cloning, if needed)

## 🔧 Backend Setup (Django)

The backend runs on **port 8000** and provides the REST API.

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
```

**macOS/Linux:**
```bash
python3 -m venv venv
```

### Step 3: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Django
- Django REST Framework
- JWT authentication
- CORS headers
- Requests
- And other required packages

### Step 5: Run Database Migrations

```bash
python manage.py migrate
```

This sets up the database schema (uses SQLite by default, no PostgreSQL needed for basic setup).

### Step 6: Start Django Server

```bash
python manage.py runserver
```

✅ **Backend is now running at:** `http://localhost:8000`

You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

---

## 🎨 Frontend Setup (React + Vite)

The frontend runs on **port 5173** (default Vite port).

### Step 1: Navigate to Frontend Directory

Open a **NEW terminal window** (keep backend running in the first one).

```bash
cd Frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all React, TypeScript, and other frontend dependencies. This may take a few minutes.

### Step 3: Start Development Server

```bash
npm run dev
```

✅ **Frontend is now running at:** `http://localhost:5173`

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🤖 AI Server Setup (FastAPI - Optional but Recommended)

The AI server runs on **port 8000** (same as Django). **Important:** You need to run this on a different port or stop Django first.

### Option A: Run AI Server on Different Port (Recommended)

Edit `ai/api_server.py` line 84:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Changed from 8000 to 8001
```

Then update frontend calls from `localhost:8000/api/predict` to `localhost:8001/api/predict`

### Option B: Stop Django, Run AI Server

Stop Django (Ctrl+C), then:

```bash
cd ai

# Install AI dependencies
pip install -r model_ai1/requirements.txt
pip install -r model_traffic2/requirements.txt

# Install FastAPI and Uvicorn if not already installed
pip install fastapi uvicorn requests

# Run AI server
python api_server.py
```

---

## 🎯 Quick Start (Using Batch Files - Windows Only)

### For Backend:
```bash
run_backend.bat
```

### For Frontend:
```bash
run_frontend.bat
```

These batch files will automatically:
- Create virtual environment
- Install dependencies
- Run migrations
- Start servers

---

## 🌐 Access Points

Once everything is running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Main application UI |
| **Backend API** | http://localhost:8000/api | Django REST API |
| **AI Server** | http://localhost:8000 (or 8001) | AI predictions endpoint |
| **Django Admin** | http://localhost:8000/admin | Admin panel (if configured) |

---

## 🔐 Login Credentials

After accessing the frontend at `http://localhost:5173`:

### Citizen Login:
- **Username:** `tirth`
- **Password:** `1234`
- **URL:** http://localhost:5173/login/citizen

### Government Login:
- **Username:** `divy`
- **Password:** `1234`
- **URL:** http://localhost:5173/login/government

---

## ⚙️ Environment Variables (Optional)

### Backend `.env` file (in `backend/` directory):

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# External API Keys (optional)
TOMTOM_API_KEY=your-tomtom-api-key
AQICN_API_KEY=your-aqicn-api-key
GROQ_API_KEY=your-groq-api-key
OPENAI_OSS_API_KEY=your-openai-oss-api-key
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend `.env` file (in `Frontend/` directory):

```env
VITE_DJANGO_API_URL=http://localhost:8000/api
VITE_TOMTOM_API_KEY=your-tomtom-api-key
VITE_AQICN_API_KEY=your-aqicn-api-key
```

**Note:** The application will work with mock data if API keys are not provided.

---

## 🐛 Troubleshooting

### Issue: `ModuleNotFoundError: No module named 'requests'`

**Solution:**
```bash
cd backend
venv\Scripts\activate  # Activate venv
pip install requests
```

### Issue: Port Already in Use

**Solution:**
- Find process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :8000
  
  # Kill process (replace PID with actual process ID)
  taskkill /PID <PID> /F
  ```

### Issue: Frontend Can't Connect to Backend

**Solution:**
1. Make sure backend is running on port 8000
2. Check CORS settings in `backend/config/settings.py`
3. Verify `VITE_DJANGO_API_URL` in frontend `.env`

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Linux/Mac
rmdir /s node_modules & del package-lock.json  # Windows

# Reinstall
npm install
```

### Issue: Virtual Environment Not Activating

**Windows:**
```bash
# If you get execution policy error
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**macOS/Linux:**
```bash
# Make sure you're using python3
python3 -m venv venv
source venv/bin/activate
```

---

## 📝 Running in Production

For production deployment:

### Backend:
```bash
# Collect static files
python manage.py collectstatic

# Use production server (gunicorn)
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Frontend:
```bash
# Build for production
npm run build

# Serve built files (using a web server like nginx)
# Or use preview
npm run preview
```

---

## 🔄 Stopping Servers

To stop any running server:
- Press `Ctrl + C` in the terminal where it's running
- Close the terminal window

---

## ✅ Verification Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173 in browser
- [ ] Can login with test credentials
- [ ] Dashboard loads without errors
- [ ] Map component displays (may need API keys for full functionality)

---

## 📞 Need Help?

If you encounter issues:
1. Check the error messages in terminal
2. Verify all dependencies are installed
3. Make sure ports are not in use
4. Check that virtual environment is activated (for Python)
5. Ensure Node.js version is 18+

Happy coding! 🎉
