# 🔑 API Keys Setup Guide

## Overview

The application now supports configuring API keys through the Settings page in the navbar. This allows you to set up the **Groq Meta Llama 8B** API key for the **What-If chatbot** feature.

## 🎯 Quick Setup

### 1. Access Settings Page

1. Log in as **Government** user:
   - Username: `divy`
   - Password: `1234`

2. Click on **"Settings"** in the sidebar (gear icon)

3. You'll see the **API Keys Configuration** page

### 2. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create API Key"**
5. Copy the generated key

### 3. Configure in Settings

1. Paste your **Groq Meta Llama 8B API Key** in the settings page
2. Optionally configure other API keys:
   - OpenAI OSS 20B (for standard predictions)
   - Google Gemini (fallback)
   - TomTom (for maps)
   - AQICN (for air quality)
3. Click **"Save API Keys"**

### 4. Use What-If Chatbot

1. Click **"What If"** in the sidebar (message icon)
2. The chatbot will now use your Groq Meta Llama API key
3. Ask questions like:
   - "What if we reduce traffic by 20%?"
   - "What would happen if we improve air quality by 30%?"
   - "How would adding a new hospital affect healthcare load?"

## 🔧 How It Works

### API Key Storage

- **Frontend**: Keys are stored in `localStorage` (browser)
- **Backend**: Keys are stored in environment variables (session-level)
- **AI Server**: Receives API key from requests

### Work Division

- **Groq Meta Llama 8B**: Powers the **What-If chatbot** (primary)
- **OpenAI OSS 20B**: Used for **standard predictions** and dashboard analytics
- **Google Gemini**: **Fallback** if others are unavailable

### Request Flow

```
User Input → Frontend (What-If Chatbot)
           → Django Backend (/api/settings/what-if)
           → FastAPI AI Server (port 8001)
           → Groq API (Meta Llama)
           → Response back to user
```

## ⚙️ Backend Configuration

### Running the AI Server

The AI server runs on **port 8001** (to avoid conflict with Django on port 8000):

```bash
cd ai
python api_server.py
```

### Environment Variables

You can also set API keys as environment variables:

**Windows:**
```cmd
set GROQ_API_KEY=your-groq-api-key
set OPENAI_OSS_API_KEY=your-openai-key
set GEMINI_API_KEY=your-gemini-key
```

**macOS/Linux:**
```bash
export GROQ_API_KEY=your-groq-api-key
export OPENAI_OSS_API_KEY=your-openai-key
export GEMINI_API_KEY=your-gemini-key
```

Or create a `.env` file in the `ai/` directory:
```env
GROQ_API_KEY=your-groq-api-key
OPENAI_OSS_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
```

## 🔒 Security Notes

1. **Development**: API keys stored in localStorage are visible in browser DevTools
2. **Production**: Configure API keys in environment variables on the server
3. **Never commit**: API keys should never be committed to version control
4. **Rotate regularly**: Change API keys periodically for security

## 🐛 Troubleshooting

### What-If Chatbot Not Working

1. **Check API Key**: Verify Groq API key is saved in Settings
2. **Check AI Server**: Ensure AI server is running on port 8001
   ```bash
   cd ai
   python api_server.py
   ```
3. **Check Backend**: Ensure Django backend is running on port 8000
4. **Check Console**: Open browser DevTools → Console for error messages

### API Key Not Saving

1. Check browser console for errors
2. Verify backend is running
3. Check network tab in DevTools for failed requests

### "AI Server Not Running" Error

This means the FastAPI AI server is not running. Start it:

```bash
cd ai
# Install dependencies first
pip install fastapi uvicorn requests google-generativeai

# Start server
python api_server.py
```

## 📝 API Endpoints

- **Settings API Keys**: `POST /api/settings/api-keys`
- **What-If Chatbot**: `POST /api/settings/what-if` (Django proxy)
- **AI Server Direct**: `POST http://localhost:8001/api/what-if` (if accessing directly)

## ✅ Verification

After setup, verify everything works:

1. ✅ Settings page loads
2. ✅ API key saves successfully
3. ✅ What-If chatbot accessible from sidebar
4. ✅ Chatbot responds to queries
5. ✅ AI analysis is generated

---

**Need Help?** Check the browser console and terminal for detailed error messages.
