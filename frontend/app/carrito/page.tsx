'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cart as cartApi } from '@/lib/api-client';
import type { Cart } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      const response = await cartApi.get(user.id);
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('❌ Error al cargar carrito:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el carrito',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ ARREGLADO: Función para actualizar cantidad
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (!user || newQuantity < 1) return;

    // Evitar actualizaciones concurrentes del mismo item
    if (updatingItems.has(productId)) {
      console.log('⏳ Ya se está actualizando este item:', productId);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      console.log('🔄 Actualizando carrito:', { productId, newQuantity });

      const response = await cartApi.updateItem(user.id, productId, newQuantity);

      if (response.success && response.data) {
        setCart(response.data);
        console.log('✅ Carrito actualizado exitosamente');
      }
    } catch (error) {
      console.error('❌ Error al actualizar carrito:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo actualizar el carrito',
        variant: 'destructive',
      });
      // Recargar carrito para sincronizar
      await loadCart();
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!user) return;

    try {
      const response = await cartApi.removeItem(user.id, productId);
      if (response.success && response.data) {
        setCart(response.data);
        toast({
          title: 'Producto eliminado',
          description: 'El producto se eliminó del carrito',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        variant: 'destructive',
      });
    }
  };

  const handleClearCart = async () => {
    if (!user || !confirm('¿Estás seguro de vaciar el carrito?')) return;

    try {
      const response = await cartApi.clear(user.id);
      if (response.success && response.data) {
        setCart(response.data);
        toast({
          title: 'Carrito vaciado',
          description: 'Se eliminaron todos los productos del carrito',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo vaciar el carrito',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Inicia sesión</h2>
            <p className="text-muted-foreground mb-6">
              Debes iniciar sesión para ver tu carrito de compras
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">
              Agrega productos desde nuestro catálogo
            </p>
            <Button asChild className="w-full">
              <Link href="/productos">Ver Productos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Carrito de Compras</h1>
            <p className="text-muted-foreground">
              {cart.totalItems} {cart.totalItems === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          {cart.items.length > 0 && (
            <Button variant="outline" onClick={handleClearCart}>
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar Carrito
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const isUpdating = updatingItems.has(item.productId);

              return (
                <Card key={item.productId} className={isUpdating ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/diverse-products-still-life.png"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{item.productName}</h3>
                        <p className="text-primary font-semibold mb-3">
                          ${item.price.toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              if (val >= 1) {
                                handleUpdateQuantity(item.productId, val);
                              }
                            }}
                            className="w-16 h-8 text-center"
                            disabled={isUpdating}
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={isUpdating}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          {isUpdating && (
                            <span className="text-sm text-muted-foreground ml-2">
                              Actualizando...
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-between">
                        <p className="font-bold text-lg">
                          ${item.subtotal.toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-destructive hover:text-destructive"
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${cart.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold">A calcular</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${cart.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" size="lg">
                  Continuar con la Compra
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/productos">Seguir Comprando</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}