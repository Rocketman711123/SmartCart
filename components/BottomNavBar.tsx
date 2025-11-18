import React from 'react';
import type { Screen } from '../App';

interface BottomNavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const HomeIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955a.75.75 0 01-.53 1.28H19.5v7.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 20.25V13.28H2.78a.75.75 0 01-.53-1.28z" />
    </svg>
);


const PantryIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.5}><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zM12 5a1 1 0 11-2 0 1 1 0 012 0zM5 8h10v1H5V8z" /></svg>
);

const SettingsIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);


const NavItem: React.FC<{
  label: string;
  screen: Screen;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  children: React.ReactNode;
}> = ({ label, screen, currentScreen, onNavigate, children }) => {
  const isActive = currentScreen === screen;
  return (
    <button
      onClick={() => onNavigate(screen)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${
        isActive ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
      }`}
    >
      {children}
      <span className="text-xs">{label}</span>
    </button>
  );
};


const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white border-t border-gray-200 shadow-t-lg flex justify-around items-center">
      <NavItem label="Home" screen="home" currentScreen={currentScreen} onNavigate={onNavigate}>
        <HomeIcon active={currentScreen === 'home'} />
      </NavItem>
      <NavItem label="Pantry" screen="pantry" currentScreen={currentScreen} onNavigate={onNavigate}>
        <PantryIcon active={currentScreen === 'pantry'} />
      </NavItem>
      <NavItem label="Settings" screen="settings" currentScreen={currentScreen} onNavigate={onNavigate}>
        <SettingsIcon active={currentScreen === 'settings'} />
      </NavItem>
    </nav>
  );
};

export default BottomNavBar;
