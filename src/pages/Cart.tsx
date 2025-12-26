import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useStoreSettings } from '@/hooks/useMenu';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Cart: React.FC = () => {
  const { language, t, dir } = useLanguage();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCart();
  const { data: settings } = useStoreSettings();

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const subtotal = getSubtotal();
  const deliveryFee = settings?.delivery_fee || 15;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-6">{t('cart.empty_desc')}</p>
            <Link to="/menu">
              <Button variant="pizza" size="lg">
                {t('cart.browse')}
                <ArrowIcon className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <Trash2 className="h-4 w-4" />
            {t('cart.clear')}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const name = language === 'ar' ? item.name_ar : item.name_en;
              return (
                <Card key={item.id} className="card-gradient border-border/50">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-3xl">🍕</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1">{name}</h3>
                        
                        {/* Modifiers */}
                        {item.modifiers.length > 0 && (
                          <div className="text-sm text-muted-foreground mb-2">
                            {item.modifiers.map((m) => (
                              <span key={m.id} className="inline-block mr-2">
                                + {language === 'ar' ? m.name_ar : m.name_en}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {item.notes && (
                          <p className="text-sm text-muted-foreground italic mb-2">
                            "{item.notes}"
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-bold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-primary">
                              {item.totalPrice.toFixed(2)} {t('menu.sar')}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-gradient border-border/50 sticky top-20">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">{t('checkout.order_summary')}</h2>
                
                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('cart.subtotal')}</span>
                    <span>{subtotal.toFixed(2)} {t('menu.sar')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('cart.delivery_fee')}</span>
                    <span>{deliveryFee.toFixed(2)} {t('menu.sar')}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{total.toFixed(2)} {t('menu.sar')}</span>
                </div>

                <Link to="/checkout" className="block">
                  <Button variant="pizza" size="lg" className="w-full">
                    {t('cart.checkout')}
                    <ArrowIcon className="h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
