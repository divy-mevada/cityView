import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from '../components/Sidebar';
import { apiService } from "../services/api";
import { ArrowLeft, LogOut } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const timeRangeOptions = [
  { label: "1 Month", value: 1 },
  { label: "3 Months", value: 3 },
  { label: "5 Months", value: 5 },
];

export const HealthcareLoad: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [selectedRange, setSelectedRange] = useState(1);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [predictedData, setPredictedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine user role based on current path or user data
  const userRole = user?.role || 'citizen';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historical, predicted] = await Promise.all([
          apiService.getKPIHistoricalData("healthcare", selectedRange),
          apiService.getKPIPredictedData("healthcare", selectedRange),
        ]);

        setHistoricalData(historical || []);
        setPredictedData(predicted || []);
      } catch (error) {
        console.error("Error fetching healthcare data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRange]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole={userRole as 'citizen' | 'government'} />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Healthcare Load Analysis
          </h1>
          <p className="text-gray-600">Monitor healthcare capacity and demand trends</p>
        </div>
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Time Range</h3>
          <div className="flex space-x-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedRange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRange === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">
                Current / Historical Healthcare Load
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">
                Predicted / Forecast Healthcare Load
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};