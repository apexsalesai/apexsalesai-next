'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'dark' | 'light') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--bg-primary', '#0d1321');
      document.documentElement.style.setProperty('--bg-secondary', '#1a202c');
      document.documentElement.style.setProperty('--text-primary', '#e2e8f0');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--bg-primary', '#ffffff');
      document.documentElement.style.setProperty('--bg-secondary', '#f7fafc');
      document.documentElement.style.setProperty('--text-primary', '#1a202c');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-700 rounded-full p-1 transition-colors duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00c2cb] focus:ring-offset-2 focus:ring-offset-[#0d1321]"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          theme === 'light' ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-gray-700" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </div>
    </button>
  );
}
