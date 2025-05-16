import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <div className="w-full">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={`flex space-x-2 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: TabsTriggerProps & { value?: string; onValueChange?: (value: string) => void }) {
  const isActive = value === (arguments[0] as any).value;
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-t-lg -mb-px ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
      onClick={() => (arguments[0] as any).onValueChange?.(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: TabsContentProps & { value?: string }) {
  const isActive = value === (arguments[0] as any).value;
  
  if (!isActive) return null;
  
  return <div className="py-4">{children}</div>;
}