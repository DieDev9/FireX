'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ValidatedInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'date' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  validator?: (value: string) => boolean;
  errorMessage?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  showValidIcon?: boolean;
  validateOnBlur?: boolean;
  rows?: number;
  min?: string;
  pattern?: string;
}

export function ValidatedInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  validator,
  errorMessage,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  showValidIcon = true,
  validateOnBlur = true,
  rows = 3,
  min,
  pattern,
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Validar cuando cambia el valor
  useEffect(() => {
    if (!touched && !value) {
      setError(null);
      setIsValid(false);
      return;
    }

    if (required && !value.trim()) {
      setError('Este campo es requerido');
      setIsValid(false);
      return;
    }

    if (validator && value) {
      const valid = validator(value);
      setIsValid(valid);
      setError(valid ? null : (errorMessage || 'Valor inválido'));
    } else {
      setIsValid(!!value);
      setError(null);
    }
  }, [value, validator, errorMessage, required, touched]);

  const handleBlur = () => {
    if (validateOnBlur) {
      setTouched(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (!touched) {
      setTouched(true);
    }
  };

  const showError = touched && error;
  const showSuccess = touched && isValid && showValidIcon && value;

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="relative">
        <InputComponent
          id={id}
          type={type === 'textarea' ? undefined : type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={type === 'textarea' ? rows : undefined}
          min={min}
          pattern={pattern}
          className={`
            ${showError ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            ${showSuccess ? 'border-green-500 focus-visible:ring-green-500/20' : ''}
            ${showSuccess ? 'pr-10' : ''}
          `}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={
            showError ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
        />

        {/* Icono de validación */}
        {showSuccess && type !== 'textarea' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {showError && (
        <div
          id={`${id}-error`}
          className="flex items-center gap-2 text-sm text-destructive animate-slide-in-left"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Texto de ayuda */}
      {helperText && !showError && (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}