'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { products as productsApi, categories as categoriesApi } from '@/lib/api-client';
import type { Product } from '@/types/api';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormValues } from '@/lib/schemas';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      imageUrl: '',
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  // DEBUG: Ver errores de validación
  console.log('Form Errors:', errors);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll(),
      ]);

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar los datos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    console.log('🚀 onSubmit ejecutado con datos:', data);
    try {
      const productData = {
        ...data,
        imageUrl: data.imageUrl || '/diverse-products-still-life.png',
      };
      console.log('📦 Datos a enviar:', productData);

      if (editingProduct) {
        console.log('🔄 Actualizando producto:', editingProduct.id);
        const response = await productsApi.update(editingProduct.id, productData);
        console.log('✅ Respuesta update:', response);
        if (response.success) {
          toast({
            title: 'Éxito',
            description: 'Producto actualizado exitosamente',
          });
        }
      } else {
        console.log('✨ Creando nuevo producto');
        const response = await productsApi.create(productData);
        console.log('✅ Respuesta create:', response);
        if (response.success) {
          toast({
            title: 'Éxito',
            description: 'Producto creado exitosamente',
          });
        }
      }

      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('❌ Error en onSubmit:', error);
      toast({
        title: 'Error',
        description: 'Error al guardar el producto',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const response = await productsApi.delete(id);
      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Producto eliminado',
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar el producto',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId || '', // Asegurar string vacío si es null
      imageUrl: product.imageUrl || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      imageUrl: '',
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
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
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-muted-foreground">
            Administra el catálogo de productos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Nombre del producto"
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
                  placeholder="Descripción detallada"
                  {...register('description')}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('price')}
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    {...register('stock')}
                    disabled={isSubmitting}
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive">{errors.stock.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría *</Label>
                <select
                  id="categoryId"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  {...register('categoryId')}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de Imagen</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  {...register('imageUrl')}
                  disabled={isSubmitting}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
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
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.categoryId);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${product.stock < 10
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{category?.name || 'Sin categoría'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No se encontraron productos
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}