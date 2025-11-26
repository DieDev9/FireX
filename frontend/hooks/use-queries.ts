import { useQuery } from '@tanstack/react-query';
import { products, categories, serviceRequests } from '@/lib/api-client';
import type { Product, Category, ServiceRequest } from '@/types/api';

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            console.log('[Query] Fetching all products');
            const response = await products.getAll();
            console.log('[Query] Products fetched:', response.data?.length || 0);
            return response.data || [];
        },
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            console.log('[Query] Fetching product:', id);
            const response = await products.getById(id);
            console.log('[Query] Product fetched:', response.data?.name);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            console.log('[Query] Fetching all categories');
            const response = await categories.getAll();
            console.log('[Query] Categories fetched:', response.data?.length || 0);
            return response.data || [];
        },
    });
}

export function useServiceRequests() {
    return useQuery({
        queryKey: ['serviceRequests'],
        queryFn: async () => {
            console.log('[Query] Fetching all service requests');
            const response = await serviceRequests.getAll();
            console.log('[Query] Service requests fetched:', response.data?.length || 0);
            return response.data || [];
        },
    });
}

export function useServiceRequestsByStatus(status: string) {
    return useQuery({
        queryKey: ['serviceRequests', status],
        queryFn: async () => {
            console.log('[Query] Fetching service requests by status:', status);
            const response = await serviceRequests.getByStatus(status);
            console.log('[Query] Service requests fetched:', response.data?.length || 0);
            return response.data || [];
        },
        enabled: !!status,
    });
}
