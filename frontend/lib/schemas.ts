import { z } from 'zod';

export const profileSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    phone: z.string().optional(),
    address: z.string().optional(),
});

export const productSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
    stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
    categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
    imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
});

export const categorySchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
