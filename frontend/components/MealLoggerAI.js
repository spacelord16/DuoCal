"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

// Cloudflare Worker URL - Update this to your deployed worker URL
// For local development with wrangler dev, use: http://localhost:8787
// For production, use your deployed worker URL
const WORKER_URL =
  process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";
const USER_ID = "user1"; // In a real app, this would come from authentication

const MealLoggerAI = ({ onBack, onMealLogged }) => {
  const [mealDescription, setMealDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);

  const handleLogMeal = async () => {
    if (!mealDescription.trim()) {
      setError("Please describe what you ate.");
      return;
    }

    setLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const response = await fetch(`${WORKER_URL}/api/log-meal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: USER_ID,
          mealDescription: mealDescription.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to log meal: ${response.statusText}`
        );
      }

      const result = await response.json();
      setAiResponse(result.meal);
      setSuccess(true);

      setTimeout(() => {
        if (onMealLogged) {
          onMealLogged(); // Refresh parent data
        }
        onBack(); // Go back to dashboard
      }, 2000);
    } catch (error) {
      console.error("Error logging meal:", error);
      setError(error.message || "Failed to log meal. Please try again.");
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
            Meal Logged Successfully!
          </h2>
          {aiResponse && (
            <div className="mt-4 p-5 bg-gradient-to-br from-gray-800/60 to-gray-800/40 rounded-xl text-left border border-gray-700/50">
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Meal Name</p>
                <p className="text-white font-semibold text-base">
                  {aiResponse.meal_name}
                </p>
              </div>
              <div className="mb-3 pb-3 border-b border-gray-700/50">
                <p className="text-xs text-gray-400 mb-1">Estimated Calories</p>
                <p className="text-indigo-400 font-bold text-2xl">
                  {aiResponse.estimated_calories.toLocaleString()} kcal
                </p>
              </div>
              {aiResponse.macronutrients && (
                <div className="grid grid-cols-3 gap-3">
                  {aiResponse.macronutrients.protein && (
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Protein</p>
                      <p className="text-white font-semibold">
                        {aiResponse.macronutrients.protein}g
                      </p>
                    </div>
                  )}
                  {aiResponse.macronutrients.carbs && (
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Carbs</p>
                      <p className="text-white font-semibold">
                        {aiResponse.macronutrients.carbs}g
                      </p>
                    </div>
                  )}
                  {aiResponse.macronutrients.fat && (
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Fat</p>
                      <p className="text-white font-semibold">
                        {aiResponse.macronutrients.fat}g
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <p className="text-gray-300 mt-4">Returning to dashboard...</p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={24} />
            AI Meal Logger
          </h2>
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

          {/* Info Message */}
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
            <p className="text-indigo-300 text-sm">
              <span className="font-semibold">✨ Powered by AI:</span> Just
              describe what you ate in natural language, and our AI will
              calculate the calories for you!
            </p>
          </div>

          {/* Meal Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              What did you eat?
            </label>
            <textarea
              value={mealDescription}
              onChange={(e) => setMealDescription(e.target.value)}
              placeholder="Describe what you ate in natural language...&#10;&#10;Example: 'I had a bowl of oatmeal with blueberries and a coffee'"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none transition-all duration-200 min-h-[140px] resize-none font-sans"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleLogMeal();
                }
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs">
                  Cmd/Ctrl + Enter
                </kbd>{" "}
                to submit
              </p>
              <p className="text-xs text-gray-600">
                {mealDescription.length} characters
              </p>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>Try these examples:</span>
            </p>
            <div className="space-y-2">
              {[
                "A chicken sandwich and a side salad",
                "Bowl of oatmeal with blueberries and a coffee",
                "Grilled salmon with rice and steamed broccoli",
                "Two slices of pizza and a soda",
              ].map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMealDescription(example)}
                  disabled={loading}
                  className="w-full text-left text-xs text-gray-400 hover:text-gray-300 p-2 rounded-lg hover:bg-gray-700/30 transition-colors duration-200 border border-transparent hover:border-gray-600/50"
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogMeal}
            disabled={loading || !mealDescription.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? (
              <>
                <Sparkles className="animate-pulse" size={20} />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Log Meal with AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealLoggerAI;
