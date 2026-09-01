'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  length?: number;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  length = 6,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string into array of digits
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Auto focus first empty input on mount
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    // Handle single digit input
    const cleanDigit = val.replace(/\D/g, '').slice(-1);
    if (!cleanDigit) return;

    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    const newCode = newDigits.join('').slice(0, length);
    onChange(newCode);

    // Auto advance to next input
    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.length === length && onComplete) {
      onComplete(newCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];

      if (newDigits[index]) {
        // Clear current cell
        newDigits[index] = '';
        onChange(newDigits.join(''));
      } else if (index > 0) {
        // Move back and clear previous cell
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasteData) {
      onChange(pasteData);
      const targetIndex = Math.min(pasteData.length, length - 1);
      inputRefs.current[targetIndex]?.focus();
      if (pasteData.length === length && onComplete) {
        onComplete(pasteData);
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => {
        const isFilled = Boolean(digits[index]);
        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[index]}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-black rounded-2xl border transition-all outline-none font-mono ${
              isFilled
                ? 'bg-brand-500/10 border-brand-500 text-white shadow-lg shadow-brand-500/20 scale-105'
                : 'bg-slate-950/80 border-slate-800 text-slate-100 hover:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
          />
        );
      })}
    </div>
  );
}
