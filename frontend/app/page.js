'use client'; // This directive is necessary for using hooks like useState

import React, { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import DashboardWidget from '../components/DashboardWidget';
import MealLogger from '../components/MealLogger';

// Mock Data - This will eventually come from our Python API
const userData = {
  name: 'You',
  target_calories: 2200,
  consumed_calories: 1800,
  meals: [
    { name: 'Lunch', calories: 1000 },
    { name: 'Dinner', calories: 800 },
  ],
};

const partnerData = {
  name: 'Ruchi',
  target_calories: 1400,
  consumed_calories: 1200,
  meals: [
    { name: 'Breakfast', calories: 500 },
    { name: 'Lunch', calories: 700 },
  ],
};

// Main App Component
export default function Home() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'logger'

  const renderView = () => {
    switch (view) {
        case 'logger':
            return <MealLogger onBack={() => setView('dashboard')} />;
        case 'dashboard':
        default:
            return (
                <>
                    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                        <DashboardWidget user={userData} />
                        <DashboardWidget user={partnerData} />
                    </div>
                    <div className="mt-12 text-center">
                        <button 
                            onClick={() => setView('logger')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
                        >
                            <Plus size={24} />
                            Log a New Meal
                        </button>
                    </div>
                </>
            );
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-indigo-900/40 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-purple-900/40 rounded-full filter blur-3xl opacity-50"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <header className="text-center mb-10 w-full max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
            <Zap className="text-indigo-400" size={40}/>
            DuoCal
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Stay healthy, together.</p>
        </header>
        
        <div className="w-full">
            {renderView()}
        </div>
      </div>
    </main>
  );
}