'use client';

import * as React from 'react';
import { Input, type InputProps } from './input';

function isoToDisplay(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y}`;
}

function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('/');
}

function displayToIso(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (digits.length !== 8) return '';
  const day = parseInt(digits.slice(0, 2), 10);
  const month = parseInt(digits.slice(2, 4), 10);
  const year = parseInt(digits.slice(4, 8), 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return '';
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}`;
}

export interface DateInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, name, ...props }, ref) => {
    const [display, setDisplay] = React.useState(() => isoToDisplay(value));

    React.useEffect(() => {
      setDisplay(isoToDisplay(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskDate(e.target.value);
      setDisplay(masked);
      onChange?.({ target: { value: displayToIso(masked), name } });
    };

    return (
      <Input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        maxLength={10}
        value={display}
        onChange={handleChange}
        name={name}
        ref={ref}
        {...props}
      />
    );
  }
);
DateInput.displayName = 'DateInput';

export { DateInput };
