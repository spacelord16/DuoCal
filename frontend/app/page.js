// File: frontend/app/page.js
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Zap, LoaderCircle, AlertTriangle, Settings } from "lucide-react";
import DashboardWidget from "../components/DashboardWidget";
import MealLogger from "../components/MealLogger";
import UserSettings from "../components/UserSettings";

// The API base URL. In a real app, this would be in an environment variable.
const API_URL = "http://127.0.0.1:8001";

// Main App Component
export default function Home() {
  const [view, setView] = useState("dashboard");

  // State for holding user and partner data
  const [userData, setUserData] = useState(null);
  const [partnerData, setPartnerData] = useState(null);

  // State for managing loading and error status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data
  const fetchData = async () => {
    try {
      // Set loading to true before fetching
      setLoading(true);
      setError(null);

      // Fetch user and partner data concurrently
      const [userResponse, partnerResponse] = await Promise.all([
        fetch(`${API_URL}/api/users/me`),
        fetch(`${API_URL}/api/users/partner`),
      ]);

      // Check if the responses are ok
      if (!userResponse.ok || !partnerResponse.ok) {
        throw new Error(
          "Network response was not ok. Is the backend server running?"
        );
      }

      const userDataJson = await userResponse.json();
      const partnerDataJson = await partnerResponse.json();

      // Update state with the fetched data
      setUserData(userDataJson);
      setPartnerData(partnerDataJson);
    } catch (error) {
      // If an error occurs, update the error state
      console.error("Failed to fetch data:", error);
      setError(error.message);
    } finally {
      // Set loading to false after fetching is complete
      setLoading(false);
    }
  };

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // The empty array [] means this effect runs only once when the component mounts

  // Function to refresh data (for use after logging meals)
  const refreshData = async () => {
    await fetchData();
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-white gap-6 py-16">
          <LoaderCircle className="animate-spin text-indigo-400" size={48} />
          <p className="text-xl text-gray-300">Loading your dashboard...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Connection Error
            </h3>
            <p className="text-red-300 mb-6 text-sm leading-relaxed">{error}</p>
            <button
              onClick={refreshData}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (userData && partnerData) {
      return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
            <DashboardWidget user={userData} />
            <DashboardWidget user={partnerData} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <button
              onClick={() => setView("logger")}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 min-w-[200px] justify-center"
            >
              <Plus size={22} />
              Log a New Meal
            </button>
            <button
              onClick={() => setView("settings")}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 min-w-[200px] justify-center border border-gray-600"
            >
              <Settings size={22} />
              Settings
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderView = () => {
    switch (view) {
      case "logger":
        return (
          <MealLogger
            onBack={() => setView("dashboard")}
            onMealLogged={refreshData}
          />
        );
      case "settings":
        return (
          <UserSettings
            onBack={() => setView("dashboard")}
            userData={userData}
            onSettingsUpdated={refreshData}
          />
        );
      case "dashboard":
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <Zap className="text-indigo-400" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              DuoCal
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Stay healthy, together.</p>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-12">{renderView()}</main>
      </div>
    </div>
  );
}
