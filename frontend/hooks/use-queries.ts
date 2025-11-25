import { useQuery } from '@tanstack/react-query';
import { products, categories, serviceRequests } from '@/lib/api-client';
import type { Product, Category, ServiceRequest } from '@/types/api';

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await products.getAll();
            return response.data || [];
        },
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await products.getById(id);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categories.getAll();
            return response.data || [];
        },
    });
}

export function useServiceRequests() {
    return useQuery({
        queryKey: ['serviceRequests'],
        queryFn: async () => {
            const response = await serviceRequests.getAll();
            return response.data || [];
        },
    });
}

export function useServiceRequestsByStatus(status: string) {
    return useQuery({
        queryKey: ['serviceRequests', status],
        queryFn: async () => {
            const response = await serviceRequests.getByStatus(status);
            return response.data || [];
        },
        enabled: !!status,
    });
}
