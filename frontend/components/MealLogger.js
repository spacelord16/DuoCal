'use client';
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const MealLogger = ({ onBack }) => {
    const [mealType, setMealType] = useState('Breakfast');
    const [ingredients, setIngredients] = useState([{ name: '', amount: '', calories: '' }]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '', calories: '' }]);
    };
    
    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const totalCalories = ingredients.reduce((sum, ing) => sum + (Number(ing.calories) || 0), 0);

    return (
        <div className="relative bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl w-full max-w-lg flex flex-col items-center shadow-lg border border-gray-700/50 text-white mx-auto">
            <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-6">Log a Meal</h2>
            
            <div className="w-full mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Meal Type</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Snack</option>
                </select>
            </div>

            <div className="w-full space-y-4 mb-6">
                <h3 className="text-lg font-semibold">Ingredients</h3>
                {ingredients.map((ing, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <input type="text" placeholder="Ingredient Name" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none col-span-1 md:col-span-1" />
                        <input type="text" placeholder="Amount (e.g., 100g)" value={ing.amount} onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        <input type="number" placeholder="Calories" value={ing.calories} onChange={(e) => handleIngredientChange(index, 'calories', e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                ))}
                <button onClick={handleAddIngredient} className="w-full text-indigo-400 font-semibold hover:text-indigo-300 transition-colors py-2 rounded-lg">+ Add Ingredient</button>
            </div>
            
            <div className="w-full mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-xl font-bold">Total: {totalCalories} kcal</span>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                    Log Meal
                </button>
            </div>
        </div>
    );
};

export default MealLogger;