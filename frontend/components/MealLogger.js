"use client";
import React, { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";

const API_URL = "http://127.0.0.1:8001";

const MealLogger = ({ onBack, onMealLogged }) => {
  const [mealType, setMealType] = useState("Breakfast");
  const [ingredients, setIngredients] = useState([
    { name: "", amount: "", calories: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", calories: "" }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const totalCalories = ingredients.reduce(
    (sum, ing) => sum + (Number(ing.calories) || 0),
    0
  );

  const handleLogMeal = async () => {
    // Validate ingredients
    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() && ing.amount.trim() && ing.calories
    );

    if (validIngredients.length === 0) {
      setError(
        "Please add at least one valid ingredient with all fields filled."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mealData = {
        name: mealType,
        ingredients: validIngredients.map((ing) => ({
          name: ing.name.trim(),
          amount: ing.amount.trim(),
          calories: parseInt(ing.calories),
        })),
      };

      const response = await fetch(`${API_URL}/api/users/1/meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        throw new Error("Failed to log meal");
      }

      const result = await response.json();

      setSuccess(true);
      setTimeout(() => {
        if (onMealLogged) {
          onMealLogged(); // Refresh parent data
        }
        onBack(); // Go back to dashboard
      }, 1500);
    } catch (error) {
      console.error("Error logging meal:", error);
      setError("Failed to log meal. Please try again.");
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
          <p className="text-gray-300">Returning to dashboard...</p>
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
          <h2 className="text-2xl font-bold text-white">Log a Meal</h2>
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

          {/* Meal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Meal Type
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
              disabled={loading}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          {/* Ingredients Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Ingredients</h3>
              <span className="text-sm text-gray-400">
                {
                  ingredients.filter(
                    (ing) => ing.name && ing.amount && ing.calories
                  ).length
                }{" "}
                added
              </span>
            </div>

            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div
                  key={index}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-medium">
                      Ingredient {index + 1}
                    </span>
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                        disabled={loading}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={ing.name}
                      onChange={(e) =>
                        handleIngredientChange(index, "name", e.target.value)
                      }
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      placeholder="Amount"
                      value={ing.amount}
                      onChange={(e) =>
                        handleIngredientChange(index, "amount", e.target.value)
                      }
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      disabled={loading}
                    />
                    <input
                      type="number"
                      placeholder="Calories"
                      value={ing.calories}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "calories",
                          e.target.value
                        )
                      }
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      disabled={loading}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddIngredient}
              className="w-full mt-4 text-indigo-400 hover:text-indigo-300 font-medium py-3 px-4 rounded-xl border border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-200"
              disabled={loading}
            >
              + Add Another Ingredient
            </button>
          </div>

          {/* Summary and Submit */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-white">
                Total Calories
              </span>
              <span className="text-2xl font-bold text-indigo-400">
                {totalCalories} kcal
              </span>
            </div>

            <button
              onClick={handleLogMeal}
              disabled={loading || totalCalories === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? "Logging Meal..." : "Log Meal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealLogger;
