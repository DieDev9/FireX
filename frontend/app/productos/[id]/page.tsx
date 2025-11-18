'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, addToCart } from '@/lib/api-client';
import type { Product } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

function ProductDetailContent() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadProduct(params.id as string);
    }
  }, [params.id]);

  const loadProduct = async (id: string) => {
    try {
      const response = await getProductById(id);
      if (response.success && response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el producto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Debes iniciar sesión',
        description: 'Inicia sesión para agregar productos al carrito',
        variant: 'destructive',
      });
      return;
    }

    if (!product) return;

    setIsAdding(true);
    try {
      const response = await addToCart(user.id, product.id, quantity);
      if (response.success) {
        toast({
          title: 'Producto agregado',
          description: `${quantity} unidad(es) de ${product.name} agregado al carrito`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo agregar el producto',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
            <Button asChild>
              <Link href="/productos">Volver al catálogo</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/productos" className="text-sm text-muted-foreground hover:text-foreground">
              ← Volver al catálogo
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  {product.stock === 0 && (
                    <Badge variant="destructive">Agotado</Badge>
                  )}
                  {product.stock > 0 && product.stock <= 10 && (
                    <Badge variant="secondary">Últimas {product.stock} unidades</Badge>
                  )}
                  {product.stock > 10 && (
                    <Badge variant="secondary">En stock: {product.stock}</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-3xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>

              {/* Quantity Selector */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Cantidad</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdding}
                  className="w-full"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isAdding ? 'Agregando...' : 'Agregar al Carrito'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductDetailPage() {
  return <ProductDetailContent />;
}
