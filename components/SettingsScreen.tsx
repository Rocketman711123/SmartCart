import React, { useState } from 'react';

// Icons
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;

// Toggle Switch Component
const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; }> = ({ label, enabled, setEnabled }) => {
    return (
        <label htmlFor={label} className="flex items-center justify-between cursor-pointer p-4">
            <span className="text-gray-700">{label}</span>
            <div className="relative">
                <input id={label} type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
                <div className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
            </div>
        </label>
    );
};


const SettingsScreen: React.FC = () => {
    const [expirationReminders, setExpirationReminders] = useState(true);
    const [smartSuggestions, setSmartSuggestions] = useState(true);

  return (
    <div className="p-4 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500">Manage your app preferences</p>
      </header>

      {/* Account Section */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Account</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          <button className="w-full flex items-center p-4 text-left hover:bg-gray-50 transition-colors">
            <UserCircleIcon />
            <span className="flex-grow ml-4">Edit Profile</span>
            <ChevronRightIcon />
          </button>
          <button className="w-full flex items-center p-4 text-left hover:bg-gray-50 transition-colors">
            <KeyIcon />
            <span className="flex-grow ml-4">Change Password</span>
            <ChevronRightIcon />
          </button>
          <button className="w-full flex items-center p-4 text-left hover:bg-gray-50 text-red-600 transition-colors">
            <LogoutIcon />
            <span className="flex-grow ml-4">Log Out</span>
          </button>
        </div>
      </div>
      
      {/* Notifications Section */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Notifications</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
             <ToggleSwitch label="Pantry Expiration Reminders" enabled={expirationReminders} setEnabled={setExpirationReminders} />
             <ToggleSwitch label="Smart Suggestions" enabled={smartSuggestions} setEnabled={setSmartSuggestions} />
        </div>
      </div>

      {/* About Section */}
      <div>
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-center text-gray-800">About SmartCart</h2>
            <p className="text-sm text-gray-500 text-center mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
