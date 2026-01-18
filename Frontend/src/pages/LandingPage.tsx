import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from 'react';
import { Building2, Lock, Users, Shield, Globe, BarChart3, CheckCircle } from "lucide-react";
import Threads from "../components/Threads";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "government" ? "/government" : "/citizen");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen text-gray-900 bg-gradient-to-br from-[#E0F2FE] via-[#F9FAFB] to-[#DBEAFE]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 lg:px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden md:block">
            City View
          </h1>
          <h1 className="text-xl font-bold tracking-tight md:hidden">CV</h1>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="nav-pill"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <section className="relative h-screen flex items-center justify-center px-6 lg:px-20">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <Threads
              color={[0.32, 0.15, 1]}
              amplitude={0.7}
              distance={0.2}
              enableMouseInteraction={false}
            />
          </div>

          <div className="text-center max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Live: City Systems Operational
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-gray-900 drop-shadow-sm">
              Empowering Cities with{" "}
              <span className="text-blue-600">Real-Time</span> Intelligence
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              A smart city planning platform that shows current living conditions, allows what-ifs simulations
              and predicts future city health, helping citizens and planners make informed descisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/login/citizen")}
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                Explore Live Map
              </button>
              <button
                onClick={() => navigate("/login/government")}
                className="px-8 py-4 bg-white/80 text-gray-900 font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                View Analytics
              </button>
            </div>
          </div>
        </section>

        {/* Main Portals */}
        <section className="px-6 lg:px-20 py-24" id="features">
          <div className="flex flex-col mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Access Your Portal
            </h2>
            <p className="text-gray-600 mt-2">
              Select the platform tailored to your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Citizen Portal */}
            <div className="portal-card group">
              <div className="portal-card-glow" />
              <div className="absolute top-0 right-0 p-8 text-gray-100">
                <Users className="w-20 h-20" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white mb-6 shadow-md">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Citizen Portal</h3>
                <p className="text-gray-600 mb-8 max-w-sm">
                  Check real-time air quality, track public transport, locate
                  available hospital beds, and report civic issues directly to
                  authorities.
                </p>
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Public Service Access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Real-time Health Monitoring</span>
                  </div>
                  <button
                    onClick={() => navigate('/login/citizen')}
                    className="primary-link"
                  >
                    Enter Citizen Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Government Portal */}
            <div className="portal-card group">
              <div className="portal-card-glow" />
              <div className="absolute top-0 right-0 p-8 text-gray-100">
                <Shield className="w-20 h-20" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white mb-6 shadow-md">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Employee Portal</h3>
                <p className="text-gray-600 mb-8 max-w-sm">
                  Advanced analytics and command tools for city officials. Monitor resource deployment, departmental KPIs, and emergency response.
                </p>
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>Secure Data Analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>Official Resource Deployment</span>
                  </div>
                  <button
                    onClick={() => navigate('/login/government')}
                    className="primary-link"
                  >
                    Admin Secure Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-slate-200 px-6 lg:px-20 py-8">
        <div className="text-center">
          <p className="text-gray-600">Built for smart urban development and healthier cities.</p>
        </div>
      </footer>
    </div>
  );
};
