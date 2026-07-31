import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'bottom' | 'top' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'bottom',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  let positionClasses = 'top-full mt-2 left-1/2 -translate-x-1/2';
  let arrowClasses = '-top-1.5 left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent';

  if (position === 'top') {
    positionClasses = 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    arrowClasses = '-bottom-1.5 left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent';
  } else if (position === 'left') {
    positionClasses = 'right-full mr-2 top-1/2 -translate-y-1/2';
    arrowClasses = '-right-1.5 top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent';
  } else if (position === 'right') {
    positionClasses = 'left-full ml-2 top-1/2 -translate-y-1/2';
    arrowClasses = '-left-1.5 top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent';
  }

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 ${positionClasses} w-64 p-3 bg-white dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-slate-700/80 rounded-2xl shadow-2xl text-slate-700 dark:text-slate-200 text-xs leading-relaxed pointer-events-none animate-fadeIn`}
        >
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses}`} />
          {content}
        </div>
      )}
    </div>
  );
};
