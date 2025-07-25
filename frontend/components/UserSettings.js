"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8001";

const UserSettings = ({ onBack, userData, onSettingsUpdated }) => {
  const [targetCalories, setTargetCalories] = useState(
    userData?.target_calories || 2000
  );
  const [maintenanceCalories, setMaintenanceCalories] = useState(
    userData?.maintenance_calories || 2200
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveSettings = async () => {
    if (targetCalories <= 0 || maintenanceCalories <= 0) {
      setError("Calories must be greater than 0");
      return;
    }

    if (targetCalories > maintenanceCalories) {
      setError("Target calories should not exceed maintenance calories");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/users/1/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_calories: parseInt(targetCalories),
          maintenance_calories: parseInt(maintenanceCalories),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSettingsUpdated) {
          onSettingsUpdated(); // Refresh parent data
        }
        onBack(); // Go back to dashboard
      }, 1500);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 w-full max-w-md text-center">
          <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Settings Updated!
          </h2>
          <p className="text-gray-300">Returning to dashboard...</p>
        </div>
      </div>
    );
  }

  const calorieDeficit = Math.abs(maintenanceCalories - targetCalories);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl w-full max-w-lg relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            disabled={loading}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-full">
              <Settings className="text-indigo-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
          </div>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle
                className="text-red-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Calorie Settings */}
          <div className="space-y-5">
            {/* Target Calories */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Daily Target Calories
              </label>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-lg font-medium"
                placeholder="e.g., 2000"
                disabled={loading}
                min="1"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your daily calorie goal for weight management
              </p>
            </div>

            {/* Maintenance Calories */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Maintenance Calories
              </label>
              <input
                type="number"
                value={maintenanceCalories}
                onChange={(e) => setMaintenanceCalories(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-lg font-medium"
                placeholder="e.g., 2200"
                disabled={loading}
                min="1"
              />
              <p className="text-xs text-gray-500 mt-2">
                Calories needed to maintain your current weight
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Maintenance</span>
                <span className="text-white font-medium">
                  {maintenanceCalories} kcal
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Target</span>
                <span className="text-white font-medium">
                  {targetCalories} kcal
                </span>
              </div>
              <div className="border-t border-gray-700/50 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Difference</span>
                  <span
                    className={`font-medium ${
                      calorieDeficit > 0 ? "text-orange-400" : "text-green-400"
                    }`}
                  >
                    {calorieDeficit} kcal{" "}
                    {targetCalories < maintenanceCalories
                      ? "deficit"
                      : "surplus"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-indigo-300 mb-2">
              Quick Tips
            </h3>
            <ul className="text-xs text-indigo-200/80 space-y-1">
              <li>• Target calories below maintenance = weight loss</li>
              <li>• 500 kcal deficit ≈ 1 lb/week weight loss</li>
              <li>• Consult a nutritionist for personalized advice</li>
            </ul>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Saving Settings..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
