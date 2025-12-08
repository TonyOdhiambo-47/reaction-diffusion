import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400',
          'disabled:pointer-events-none disabled:opacity-50',
          'transform hover:scale-105 active:scale-95',
          {
            'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 shadow-lg shadow-yellow-500/50': variant === 'default',
            'border-2 border-yellow-400/50 bg-slate-800/50 backdrop-blur-sm text-yellow-400 hover:bg-slate-700/50 hover:border-yellow-400 shadow-md': variant === 'outline',
            'text-gray-300 hover:bg-slate-700/50': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
