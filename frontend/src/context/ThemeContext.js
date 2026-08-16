import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================
// 🎯 ایجاد Context
// ============================================
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// ============================================
// 🏭 Provider
// ============================================
export const ThemeProvider = ({ children }) => {
  // خواندن تم ذخیره شده از localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // اگر سیستمی دارک است، از آن استفاده کن
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // ذخیره تم در localStorage
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    // اضافه/حذف کلاس dark به html
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};