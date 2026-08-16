import React, { useState, useRef, useEffect } from 'react';

// ============================================
// 📦 کامپوننت Select
// ============================================
export const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // بستن منو با کلیک خارج
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // پیدا کردن مقدار فعلی برای نمایش
  const getDisplayValue = () => {
    if (!value) return 'انتخاب کنید';
    // پیدا کردن label از بین children
    let label = value;
    React.Children.forEach(children, (child) => {
      if (child.type === SelectContent) {
        React.Children.forEach(child.props.children, (item) => {
          if (item.props.value === value) {
            label = item.props.children;
          }
        });
      }
    });
    return label;
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* ✅ فقط روی کلیک باز می‌شود */}
      <div 
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {getDisplayValue()}
        </span>
        <span className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>
      
      {/* ✅ منو فقط در صورت باز بودن نمایش داده می‌شود */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-input rounded-md shadow-lg overflow-hidden">
          <div className="py-1">
            {React.Children.map(children, child => {
              if (child.type === SelectContent) {
                return React.Children.map(child.props.children, (item) => {
                  return React.cloneElement(item, { 
                    onSelect: (val) => {
                      onValueChange(val);
                      setIsOpen(false); // ✅ بعد از انتخاب بسته می‌شود
                    }
                  });
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// 📦 کامپوننت‌های داخلی (برای سازگاری)
// ============================================
export const SelectTrigger = ({ children, className = '' }) => (
  <div className={`flex-1 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const SelectValue = ({ children, placeholder = 'انتخاب کنید' }) => (
  <span className={children ? 'text-foreground' : 'text-muted-foreground'}>
    {children || placeholder}
  </span>
);

export const SelectContent = ({ children }) => <>{children}</>;

export const SelectItem = ({ children, value, onSelect }) => (
  <div 
    className="px-3 py-2 hover:bg-accent cursor-pointer text-sm transition-colors"
    onClick={() => onSelect && onSelect(value)}
  >
    {children}
  </div>
);