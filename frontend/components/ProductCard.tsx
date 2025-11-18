'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { addToCart } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Debes iniciar sesión',
        description: 'Inicia sesión para agregar productos al carrito',
        variant: 'destructive',
      });
      return;
    }

    setIsAdding(true);
    try {
      const response = await addToCart(user.id, product.id, 1);
      if (response.success) {
        toast({
          title: 'Producto agregado',
          description: `${product.name} se agregó al carrito`,
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

  return (
    <Link 
      href={`/productos/${product.id}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 h-full flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative aspect-square bg-muted overflow-hidden">
          <Image
            src={product.imageUrl || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button size="sm" variant="secondary" className="gap-2 shadow-xl animate-scale-in">
              <Eye className="h-4 w-4" />
              Ver Detalles
            </Button>
          </div>

          {product.stock === 0 && (
            <Badge className="absolute top-3 right-3 shadow-lg animate-slide-in-right" variant="destructive">
              Agotado
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <Badge className="absolute top-3 right-3 shadow-lg bg-accent text-accent-foreground animate-slide-in-right animate-glow">
              Últimas {product.stock} unidades
            </Badge>
          )}
        </div>
        
        <CardContent className="flex-1 p-6 relative">
          <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold gradient-text">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted transition-colors group-hover:bg-primary/10">
              Stock: {product.stock}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0 relative">
          <Button
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdding ? 'Agregando...' : product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
