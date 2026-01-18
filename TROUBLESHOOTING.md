# 🔧 Troubleshooting Guide for Predict API

## Issue: 401 Unauthorized Error

If you're getting `401 Unauthorized` when calling `/api/predict/`, here's how to fix it:

### ✅ Solution 1: Check Backend Server

1. **Make sure Django backend is running:**
   ```bash
   cd backend
   venv\Scripts\activate
   python manage.py runserver
   ```

2. **Verify the endpoint is accessible:**
   - Open browser to: `http://localhost:8000/api/predict/`
   - You should see a Django REST Framework page (or JSON response if using curl)

### ✅ Solution 2: Check AI Server

The `/api/predict/` endpoint forwards requests to the FastAPI AI server on port 8001.

**Start the AI server:**
```bash
cd ai
python api_server.py
```

The AI server should run on port 8001. You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### ✅ Solution 3: Check Error Details

Add better error logging in the frontend:
```javascript
if (!response.ok) {
  const errorText = await response.text();
  console.error('API Error:', response.status, errorText);
  // This will show the actual error message
}
```

### ✅ Solution 4: Verify URL Pattern

The endpoint is registered at: `path('api/predict/', simulation_views.predict, name='predict_api')`

Make sure you're calling: `http://localhost:8000/api/predict/` (note the trailing slash)

### ✅ Solution 5: Check Permissions

The `predict` view uses `@permission_classes([AllowAny])` which should allow unauthenticated requests.

If you still get 401, check:
1. The import: `from rest_framework.permissions import AllowAny`
2. Django REST Framework settings in `backend/config/settings.py`

### ✅ Solution 6: Test with curl

Test the endpoint directly:
```bash
curl -X POST http://localhost:8000/api/predict/ \
  -H "Content-Type: application/json" \
  -d '{"lat": 23.0225, "lon": 72.5714, "scenario": "test", "duration_months": 1}'
```

If this works but the frontend doesn't, it's likely a CORS issue.

## 🔍 Common Issues

### Issue: "AI server (FastAPI) is not running on port 8001"

**Solution:** Start the AI server:
```bash
cd ai
pip install fastapi uvicorn requests
python api_server.py
```

### Issue: CORS Errors

**Solution:** Check `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py` includes your frontend URL.

### Issue: Location Not Selected

**Solution:** Make sure to click on the map first to select a location. The coordinates will be automatically used when you click "Generate Predictions".

## 📋 Quick Checklist

- [ ] Django backend running on port 8000
- [ ] AI server (FastAPI) running on port 8001
- [ ] Frontend running on port 5173
- [ ] Location selected on map (or default will be used)
- [ ] No CORS errors in browser console
- [ ] Network tab shows actual error response

## 🐛 Debug Steps

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Click "Generate Predictions"**
4. **Find the `/api/predict/` request**
5. **Check:**
   - Request URL
   - Request Method (should be POST)
   - Request Payload (should include lat, lon, scenario, duration_months)
   - Response Status
   - Response Body (click on the request to see full details)

## 📞 Still Having Issues?

1. Check backend terminal for Django errors
2. Check AI server terminal for FastAPI errors  
3. Share the full error message from browser console
4. Share the response body from Network tab
