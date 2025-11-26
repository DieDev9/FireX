'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { categories as categoriesApi } from '@/lib/api-client';
import type { Category } from '@/types/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormValues } from '@/lib/schemas';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadCategories();
  }, [user, router]);

  const loadCategories = async () => {
    try {
      console.log('[Categories] Cargando categorías');
      const response = await categoriesApi.getAll();
      if (response.success && response.data) {
        console.log('[Categories] Categorías cargadas:', response.data.length);
        setCategories(response.data);
      }
    } catch (error) {
      console.error('[Categories] Error al cargar categorías:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar las categorías',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (editingCategory) {
        console.log('[Categories] Actualizando categoría:', editingCategory.id, data);
        const response = await categoriesApi.update(editingCategory.id, data);
        if (response.success) {
          console.log('[Categories] Categoría actualizada exitosamente');
          toast({
            title: 'Éxito',
            description: 'Categoría actualizada exitosamente',
          });
        }
      } else {
        console.log('[Categories] Creando nueva categoría:', data);
        const response = await categoriesApi.create(data);
        if (response.success) {
          console.log('[Categories] Categoría creada exitosamente');
          toast({
            title: 'Éxito',
            description: 'Categoría creada exitosamente',
          });
        }
      }

      setIsDialogOpen(false);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('[Categories] Error al guardar categoría:', error);
      toast({
        title: 'Error',
        description: 'Error al guardar la categoría',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      console.log('[Categories] Eliminando categoría:', id);
      const response = await categoriesApi.delete(id);
      if (response.success) {
        console.log('[Categories] Categoría eliminada exitosamente');
        toast({
          title: 'Éxito',
          description: 'Categoría eliminada',
        });
        loadCategories();
      }
    } catch (error) {
      console.error('[Categories] Error al eliminar categoría:', error);
      toast({
        title: 'Error',
        description: 'Error al eliminar la categoría',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      description: category.description ?? "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    reset({ name: '', description: '' });
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Organiza los productos por categorías</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Nombre de la categoría"
                  {...register('name')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Descripción de la categoría"
                  {...register('description')}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Guardando...' : 'Guardar Categoría'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {categories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No hay categorías registradas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}