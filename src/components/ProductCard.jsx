import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const onSale = product.compare_at_price && product.compare_at_price > product.price;
  const soldOut = (product.inventory ?? 1) <= 0;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem(product);
    toast({ title: 'Added to cart', description: product.name });
  };

  return (
    <Link to={`/glamshop/product/${product.slug || product.id}`} className="group block">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary/30">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {onSale && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-full">
            Sale
          </span>
        )}
        {soldOut && (
          <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-medium px-2.5 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-medium text-foreground text-sm line-clamp-2 leading-snug min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-lg font-heading font-semibold text-primary">AED {product.price}</span>
          {onSale && <span className="text-sm text-muted-foreground line-through">AED {product.compare_at_price}</span>}
        </div>
        <motion.button
          onClick={handleAdd}
          disabled={soldOut}
          whileTap={{ scale: 0.95 }}
          className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-sm py-2.5 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4" /> Add to Cart
        </motion.button>
      </div>
    </Link>
  );
}