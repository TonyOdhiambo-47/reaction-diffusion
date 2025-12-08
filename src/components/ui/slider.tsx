import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../lib/utils';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-yellow-400 mb-2">
        {label}
      </label>
    )}
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-700">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-yellow-500 to-yellow-400" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-yellow-400 bg-yellow-500 ring-offset-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg shadow-yellow-500/50" />
    </SliderPrimitive.Root>
  </div>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
