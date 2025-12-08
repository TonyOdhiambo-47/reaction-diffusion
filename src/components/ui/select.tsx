import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectProps
>(({ value, onValueChange, options, placeholder, className }, ref) => (
  <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-lg border border-yellow-500/30 bg-slate-800/50 backdrop-blur-sm px-3 py-2 text-sm text-yellow-400',
        'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'hover:border-yellow-500/50 hover:bg-slate-700/50',
        className
      )}
    >
      <SelectPrimitive.Value placeholder={placeholder} />
      <SelectPrimitive.Icon>
        <ChevronDown className="h-4 w-4 opacity-70 text-yellow-400" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-yellow-500/30 bg-slate-900 shadow-xl">
        <SelectPrimitive.Viewport className="p-1">
          {options
            .filter((option) => option.value !== '') // Filter out empty string values
            .map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
                  'focus:bg-slate-800 focus:text-yellow-400',
                  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                  'text-gray-300 hover:text-yellow-400'
                )}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
));
Select.displayName = 'Select';

export { Select };
