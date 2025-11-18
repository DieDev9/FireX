// lib/validators.ts
import type { ServiceRequestCreate, RegisterRequest } from '@/types/api';

/**
 * Validadores básicos reutilizables
 */
export const validators = {
  /**
   * Valida teléfono colombiano (10 dígitos, empieza con 3)
   * Ejemplo válido: 3001234567
   */
  phone: (phone: string): boolean => {
    if (!phone) return false;
    const cleaned = phone.replace(/\s/g, '');
    return /^3[0-9]{9}$/.test(cleaned);
  },

  /**
   * Valida que la fecha sea futura (no puede ser pasada)
   */
  date: (dateString: string): boolean => {
    if (!dateString) return false;
    
    const selected = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Fecha debe ser hoy o futura
    return selected >= today;
  },

  /**
   * Valida que la fecha no sea más de 3 meses en el futuro
   */
  dateNotTooFar: (dateString: string): boolean => {
    if (!dateString) return false;
    
    const selected = new Date(dateString);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    
    return selected <= maxDate;
  },

  /**
   * Valida email básico
   */
  email: (email: string): boolean => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /**
   * Valida nombre (mínimo 3 caracteres, solo letras y espacios)
   */
  name: (name: string): boolean => {
    if (!name) return false;
    const trimmed = name.trim();
    return trimmed.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed);
  },

  /**
   * Valida dirección (mínimo 10 caracteres)
   */
  address: (address: string): boolean => {
    if (!address) return false;
    return address.trim().length >= 10;
  },

  /**
   * Valida contraseña (mínimo 6 caracteres)
   */
  password: (password: string): boolean => {
    if (!password) return false;
    return password.length >= 6;
  },

  /**
   * Valida que un string no esté vacío
   */
  required: (value: string): boolean => {
    return value !== undefined && value !== null && value.trim().length > 0;
  },
};

/**
 * Tipo para errores de validación
 */
export type ValidationErrors = Record<string, string>;

/**
 * Resultado de una validación
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

/**
 * Valida una solicitud de servicio completa
 */
export const validateServiceRequest = (
  data: ServiceRequestCreate
): ValidationResult => {
  const errors: ValidationErrors = {};

  // Validar teléfono
  if (!validators.phone(data.telefono)) {
    errors.telefono = 'Teléfono inválido. Debe ser un celular colombiano (ej: 3001234567)';
  }

  // Validar fecha
  if (!validators.date(data.fecha)) {
    errors.fecha = 'La fecha debe ser hoy o en el futuro';
  } else if (!validators.dateNotTooFar(data.fecha)) {
    errors.fecha = 'La fecha no puede ser más de 3 meses en el futuro';
  }

  // Validar dirección
  if (!validators.address(data.direccion)) {
    errors.direccion = 'La dirección debe tener al menos 10 caracteres';
  }

  // Validar campos requeridos
  if (!validators.required(data.tipo)) {
    errors.tipo = 'Debe seleccionar un tipo de extintor';
  }

  if (!validators.required(data.estadoExtintor)) {
    errors.estadoExtintor = 'Debe indicar el estado del extintor';
  }

  if (!validators.required(data.franja)) {
    errors.franja = 'Debe seleccionar una franja horaria';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valida un formulario de registro
 */
export const validateRegisterForm = (
  data: RegisterRequest
): ValidationResult => {
  const errors: ValidationErrors = {};

  // Validar nombre
  if (!validators.name(data.name)) {
    errors.name = 'El nombre debe tener al menos 3 caracteres y solo letras';
  }

  // Validar email
  if (!validators.email(data.email)) {
    errors.email = 'Email inválido';
  }

  // Validar contraseña
  if (!validators.password(data.password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  // Validar teléfono
  if (!validators.phone(data.phone)) {
    errors.phone = 'Teléfono inválido. Debe ser un celular colombiano (ej: 3001234567)';
  }

  // Validar dirección
  if (!validators.address(data.address)) {
    errors.address = 'La dirección debe tener al menos 10 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valida un formulario de login
 */
export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  const errors: ValidationErrors = {};

  if (!validators.email(email)) {
    errors.email = 'Email inválido';
  }

  if (!validators.required(password)) {
    errors.password = 'La contraseña es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Formatea un teléfono para mostrar (3XX XXX XXXX)
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Limpia un teléfono para enviar al backend (solo números)
 */
export const cleanPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};