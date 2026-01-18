import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { GovernmentDashboard } from './pages/GovernmentDashboard';
import { AirQualityIndex } from './pages/AirQualityIndex';
import { TrafficCongestion } from './pages/TrafficCongestion';
import { HealthcareLoad } from './pages/HealthcareLoad';
import { SchoolPerformance } from './pages/SchoolPerformance';
import { UrbanDevelopment } from './pages/UrbanDevelopment';
import { AreaDemandPage } from './pages/AreaDemandPage';
import { FootfallEstimationPage } from './pages/FootfallEstimationPage';
import { CitizenMapPage } from './pages/CitizenMapPage';
import { GovernmentChatbotPage } from './pages/GovernmentChatbotPage';
import { ScenarioManagementPage } from './pages/ScenarioManagementPage';
import { GovernmentAnalyticsPage } from './pages/GovernmentAnalyticsPage';
import { GovernmentForecastingPage } from './pages/GovernmentForecastingPage';
import { GovernmentMapPage } from './pages/GovernmentMapPage';
import { TimelineAnalysisPage } from './pages/TimelineAnalysisPage';
import { SettingsPage } from './pages/SettingsPage';
import { AIModelsPage } from './pages/AIModelsPage';
import { PredictDataPage } from './pages/PredictDataPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/register/:role" element={<RegisterPage />} />

            {/* Citizen Routes */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute requiredRole="citizen">
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen/map"
              element={
                <ProtectedRoute>
                  <CitizenMapPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen/area-demand"
              element={
                <ProtectedRoute>
                  <AreaDemandPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen/footfall"
              element={
                <ProtectedRoute>
                  <FootfallEstimationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/air-quality"
              element={
                <ProtectedRoute>
                  <AirQualityIndex />
                </ProtectedRoute>
              }
            />

            <Route
              path="/traffic-congestion"
              element={
                <ProtectedRoute>
                  <TrafficCongestion />
                </ProtectedRoute>
              }
            />

            <Route
              path="/healthcare-load"
              element={
                <ProtectedRoute>
                  <HealthcareLoad />
                </ProtectedRoute>
              }
            />

            <Route
              path="/school-performance"
              element={
                <ProtectedRoute>
                  <SchoolPerformance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/urban-development"
              element={
                <ProtectedRoute>
                  <UrbanDevelopment />
                </ProtectedRoute>
              }
            />

            {/* Government Routes */}
            <Route
              path="/government"
              element={
                <ProtectedRoute requiredRole="government">
                  <GovernmentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/government/analytics"
              element={
                <ProtectedRoute requiredRole="government">
                  <GovernmentAnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/government/forecasting"
              element={
                <ProtectedRoute requiredRole="government">
                  <GovernmentForecastingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/government/chatbot"
              element={
                <ProtectedRoute requiredRole="government">
                  <GovernmentChatbotPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/government/scenarios"
              element={
                <ProtectedRoute requiredRole="government">
                  <ScenarioManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/government/map"
              element={
                <ProtectedRoute requiredRole="government">
                  <GovernmentMapPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/government/timeline"
              element={
                <ProtectedRoute requiredRole="government">
                  <TimelineAnalysisPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/government/ai-models"
              element={
                <ProtectedRoute requiredRole="government">
                  <AIModelsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/government/predict"
              element={
                <ProtectedRoute requiredRole="government">
                  <PredictDataPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/what-if"
              element={
                <ProtectedRoute>
                  <GovernmentChatbotPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
