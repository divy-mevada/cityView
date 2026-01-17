# Ahmedabad Urban Intelligence Platform - Backend API

Django REST Framework backend for the Ahmedabad Urban Intelligence Platform. Provides APIs for interactive maps, AQI monitoring, traffic analysis, healthcare/education metrics, forecasting, and what-if simulations.

## 🏗️ Architecture

This backend follows a **modular, scalable architecture** with clear separation of concerns:

- **Apps**: Django apps for each domain (auth, map, aqi, traffic, healthcare, etc.)
- **Services**: Business logic services for data processing and calculations
- **Utils**: Utility functions for geocoding, helpers, etc.
- **Middleware**: Role-based access control
- **Mock Data**: Hardcoded Ahmedabad-specific datasets (PostgreSQL integration later)

## 📁 Project Structure

```
backend/
├── manage.py
├── config/
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL routing
│   ├── jwt.py               # JWT token utilities
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── auth_app/            # Authentication (JWT)
│   ├── map/                 # Map reverse geocoding & area metrics
│   ├── aqi/                 # Air Quality Index APIs
│   ├── traffic/             # Traffic congestion data
│   ├── healthcare/          # Healthcare capacity APIs
│   ├── education/           # School infrastructure APIs
│   ├── urban_dev/           # Urban development projects
│   ├── forecasting/         # Timeline-based predictions
│   ├── demand/              # Footfall & demand estimation
│   ├── simulation/          # What-if scenario simulations
│   └── scenarios/           # Scenario management
├── services/
│   ├── aqi_service.py       # AQI data logic
│   ├── traffic_service.py   # Traffic data logic
│   ├── healthcare_service.py
│   ├── education_service.py
│   ├── urban_dev_service.py
│   ├── forecast_service.py  # Forecasting logic
│   ├── demand_service.py    # Demand estimation
│   ├── simulation_service.py # What-if simulation engine
│   └── scenarios_service.py # Scenario storage/retrieval
├── middleware/
│   └── role_permissions.py  # Role-based access control
├── utils/
│   ├── geocoding.py         # TomTom reverse geocoding (mocked)
│   └── helpers.py           # General utilities
└── mock_data/               # Hardcoded Ahmedabad datasets
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- pip

### Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (creates SQLite database - not used for data, only for Django admin)
python manage.py migrate

# Create superuser (optional, for Django admin)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## 🔐 Authentication

### Test Credentials

**Citizen User:**
- Email: `tirthpatel1356@gmail.com`
- Password: `1234`

**Government User:**
- Email: `tirthpatel3129@gmail.com`
- Password: `1234`

### Login Endpoint

```bash
POST /api/auth/login/
Content-Type: application/json

{
  "email": "tirthpatel1356@gmail.com",
  "password": "1234"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "1",
    "email": "tirthpatel1356@gmail.com",
    "role": "citizen",
    "name": "Tirth Patel"
  }
}
```

Use the `access` token in subsequent requests:
```
Authorization: Bearer <access_token>
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login/` - User login (returns JWT tokens)
- `GET /api/auth/profile/` - Get current user profile (requires authentication)

### Map Services

- `POST /api/map/reverse-geocode/` - Convert lat/lng to locality information
- `POST /api/map/area-metrics/` - Get comprehensive metrics for a location

### AQI (Air Quality Index)

- `GET /api/aqi/current/` - Get current city-wide AQI
- `POST /api/aqi/by-location/` - Get AQI for specific location

### Traffic

- `GET /api/traffic/current/` - Get current city-wide traffic congestion

### Healthcare

- `GET /api/healthcare/capacity/` - Get healthcare capacity data

### Education

- `GET /api/education/capacity/` - Get school infrastructure data

### Urban Development

- `GET /api/urban-dev/activity/` - Get urban development activity

### Forecasting

- `POST /api/forecast/area/` - Get timeline-based predictions (1/3/6 months)

### Demand Estimation

- `POST /api/demand/estimate/` - Estimate footfall and demand index

### What-If Simulations (Government Only)

- `POST /api/simulation/run/` - Run what-if simulation from natural language query
- `POST /api/simulation/explain/` - Get detailed explanation of simulation

### Scenario Management (Government Only)

- `POST /api/scenarios/save/` - Save a simulation scenario
- `GET /api/scenarios/list/` - List all saved scenarios
- `POST /api/scenarios/compare/` - Compare multiple scenarios side-by-side

## 🎯 Example API Requests

### 1. Reverse Geocode Location

```bash
POST /api/map/reverse-geocode/
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 23.0225,
  "longitude": 72.5714
}
```

**Response:**
```json
{
  "locality": "SG Highway",
  "ward": "Vastrapur",
  "zone": "West Zone",
  "address": "SG Highway, Vastrapur, Ahmedabad"
}
```

### 2. Get Area Metrics

```bash
POST /api/map/area-metrics/
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 23.0225,
  "longitude": 72.5714
}
```

**Response:** Comprehensive metrics including AQI, traffic, healthcare, education, and urban development data.

### 3. Run What-If Simulation (Government Only)

```bash
POST /api/simulation/run/
Authorization: Bearer <government_token>
Content-Type: application/json

{
  "query": "What if a new bridge is built near SG Highway?",
  "timeline": "6months"
}
```

**Response:** Detailed simulation results with projected impacts on all metrics.

### 4. Get Forecast

```bash
POST /api/forecast/area/
Authorization: Bearer <token>
Content-Type: application/json

{
  "zone": "West Zone",
  "ward": "Vastrapur",
  "locality": "SG Highway",
  "timeline": "3months"
}
```

## 🗺️ TomTom Integration

The backend is designed to integrate with TomTom APIs:

1. **Reverse Geocoding**: `utils/geocoding.py` - Currently mocked, can be replaced with:
   ```
   https://api.tomtom.com/search/2/reverseGeocode/{lat},{lng}.json?key={TOMTOM_API_KEY}
   ```

2. **Traffic Flow**: `services/traffic_service.py` - Can integrate with:
   ```
   https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point={lat},{lng}&key={TOMTOM_API_KEY}
   ```

To enable real TomTom API integration, set `TOMTOM_API_KEY` in environment variables and update the service methods.

## 📊 Data Sources

Currently uses **hardcoded/mocked data** for Ahmedabad city:

- **AQI Data**: Mocked CPCB/OpenAQ-style data (grid-based interpolation)
- **Traffic Data**: Mocked TomTom Traffic Flow data
- **Healthcare**: Simulated hospital capacity data
- **Education**: Simulated school infrastructure data
- **Urban Development**: Mocked project data

All data is Ahmedabad-specific and will be replaced with PostgreSQL integration in future updates.

## 🔒 Role-Based Access Control

- **Citizen**: Read-only access to all public metrics
- **Government**: Full access including what-if simulations and scenario management

Access control is enforced via `middleware/role_permissions.py` using the `IsGovernmentUser` permission class.

## 🧪 Testing

```bash
# Run Django tests (when test files are added)
python manage.py test

# Test API endpoints manually using curl or Postman
```

## 📝 Environment Variables

Create a `.env` file (optional for now):

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# External APIs (optional - mocked if not provided)
TOMTOM_API_KEY=your-tomtom-api-key
OPENAQ_API_KEY=your-openaq-api-key
CPCB_API_KEY=your-cpcb-api-key
```

## 🔮 Future Enhancements

- PostgreSQL database integration
- Real TomTom API integration
- Machine learning-based forecasting
- Real-time data feeds from sensors
- WebSocket support for real-time updates
- Advanced caching with Redis
- Comprehensive test suite

## 📚 Documentation

For detailed API documentation, use Django REST Framework's browsable API at:
`http://localhost:8000/api/` (when logged in)

## 🐛 Troubleshooting

1. **CORS Errors**: Ensure `CORS_ALLOWED_ORIGINS` in `settings.py` includes your frontend URL
2. **Authentication Errors**: Verify JWT token is included in `Authorization: Bearer <token>` header
3. **Permission Errors**: Check user role - some endpoints require `government` role

## 📄 License

This project is part of the Ahmedabad Urban Intelligence Platform.
