import React, { useState } from 'react';

export const Tabs = ({ children, defaultValue, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab, className = '' }) => (
  <div className={`flex space-x-1 rounded-lg bg-muted p-1 ${className}`}>
    {React.Children.map(children, child => {
      if (child.type === TabsTrigger) {
        return React.cloneElement(child, { activeTab, setActiveTab });
      }
      return child;
    })}
  </div>
);

export const TabsTrigger = ({ children, value, activeTab, setActiveTab, className = '' }) => (
  <button
    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
      activeTab === value 
        ? 'bg-background text-foreground shadow-sm' 
        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
    } ${className}`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

export const TabsContent = ({ children, value, activeTab, className = '' }) => {
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
};