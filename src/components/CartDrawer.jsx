import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, total, count } = useCart();
  const shipping = total >= 200 ? 0 : 25;
  const grandTotal = total + shipping;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/40">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-heading">Your Cart ({count})</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {count === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-6">Your cart is empty</p>
                  <Button asChild onClick={onClose} className="rounded-full bg-primary text-primary-foreground">
                    <Link to="/glamshop">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map(({ product, quantity }) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3 bg-card rounded-xl p-3 border border-border/40"
                      >
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300'}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/glamshop/product/${product.slug || product.id}`}
                            onClick={onClose}
                            className="text-sm font-medium line-clamp-2 hover:text-primary"
                          >
                            {product.name}
                          </Link>
                          <div className="text-primary font-heading font-semibold text-sm mt-1">AED {product.price}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border border-border rounded-full text-xs">
                              <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2 py-1 hover:bg-secondary rounded-l-full">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 py-1 font-medium">{quantity}</span>
                              <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2 py-1 hover:bg-secondary rounded-r-full">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button onClick={() => removeItem(product.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right shrink-0 text-sm font-semibold self-center">
                          AED {(product.price * quantity).toFixed(2)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {count > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-border/40 p-5 space-y-3 bg-card"
              >
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>AED {total.toFixed(2)}</span></div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? <span className="text-accent font-medium">Free</span> : `AED ${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">Add AED {(200 - total).toFixed(2)} more for free shipping</p>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-2 border-t"><span>Total</span><span>AED {grandTotal.toFixed(2)}</span></div>
                </div>
                <Button asChild className="w-full rounded-full h-11 glow-cta">
                  <Link to="/glamshop/checkout" onClick={onClose} className="flex items-center justify-center gap-2">
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Link to="/glamshop/cart" onClick={onClose} className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  View Full Cart
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-1">
                  <Shield className="w-3.5 h-3.5 text-accent" /> GlamShield protected
                </div>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}