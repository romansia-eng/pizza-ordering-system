import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart, CartModifier } from '@/contexts/CartContext';
import { useModifierGroups } from '@/hooks/useMenu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { MenuItem, Modifier } from '@/hooks/useMenu';
import { cn } from '@/lib/utils';

interface ProductModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ item, open, onClose }) => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const { data: modifierGroups = [], isLoading } = useModifierGroups(item?.id || '');

  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, Modifier[]>>({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setSelectedModifiers({});
      setNotes('');
    }
  }, [open, item?.id]);

  if (!item) return null;

  const name = language === 'ar' ? item.name_ar : item.name_en;
  const description = language === 'ar' ? item.description_ar : item.description_en;

  const handleModifierToggle = (groupId: string, modifier: Modifier, isMultiple: boolean) => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || [];
      const exists = current.some((m) => m.id === modifier.id);

      if (isMultiple) {
        if (exists) {
          return {
            ...prev,
            [groupId]: current.filter((m) => m.id !== modifier.id),
          };
        } else {
          return {
            ...prev,
            [groupId]: [...current, modifier],
          };
        }
      } else {
        if (exists) {
          return {
            ...prev,
            [groupId]: [],
          };
        } else {
          return {
            ...prev,
            [groupId]: [modifier],
          };
        }
      }
    });
  };

  const isModifierSelected = (groupId: string, modifierId: string) => {
    return (selectedModifiers[groupId] || []).some((m) => m.id === modifierId);
  };

  const calculateModifiersPrice = () => {
    return Object.values(selectedModifiers)
      .flat()
      .reduce((sum, m) => sum + Number(m.price), 0);
  };

  const calculateTotal = () => {
    return (Number(item.base_price) + calculateModifiersPrice()) * quantity;
  };

  const handleAddToCart = () => {
    const cartModifiers: CartModifier[] = Object.values(selectedModifiers)
      .flat()
      .map((m) => ({
        id: m.id,
        name_ar: m.name_ar,
        name_en: m.name_en,
        price: Number(m.price),
      }));

    addItem({
      menuItemId: item.id,
      name_ar: item.name_ar,
      name_en: item.name_en,
      basePrice: Number(item.base_price),
      quantity,
      modifiers: cartModifiers,
      modifiersPrice: calculateModifiersPrice(),
      notes: notes || undefined,
      image_url: item.image_url || undefined,
    });

    toast.success(language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Image Header */}
        <div className="relative aspect-video">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-8xl">🍕</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          {item.calories && (
            <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full glass text-sm font-medium">
              {item.calories} {t('menu.calories')}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold">{name}</DialogTitle>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
            <p className="text-2xl font-bold text-primary">
              {item.base_price} {t('menu.sar')}
            </p>
          </DialogHeader>

          {/* Modifier Groups */}
          {!isLoading && modifierGroups.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <h3 className="font-bold text-lg">{t('product.select_modifiers')}</h3>
              
              {modifierGroups.map((group) => (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {language === 'ar' ? group.name_ar : group.name_en}
                    </h4>
                    {group.is_required && (
                      <span className="text-xs text-destructive font-medium">
                        {t('checkout.required')}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {group.modifiers.map((modifier) => {
                      const isSelected = isModifierSelected(group.id, modifier.id);
                      return (
                        <button
                          key={modifier.id}
                          type="button"
                          onClick={() => handleModifierToggle(group.id, modifier, group.is_multiple)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                            )}>
                              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className="text-sm font-medium">
                              {language === 'ar' ? modifier.name_ar : modifier.name_en}
                            </span>
                          </div>
                          {Number(modifier.price) > 0 && (
                            <span className="text-sm text-primary font-bold">
                              +{modifier.price}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('product.notes')}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('product.notes_placeholder')}
              className="resize-none"
              rows={2}
            />
          </div>

          <Separator />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t('product.quantity')}</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold text-lg">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Total & Add Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-muted-foreground">{t('product.total')}</span>
              <p className="text-2xl font-bold text-primary">
                {calculateTotal().toFixed(2)} {t('menu.sar')}
              </p>
            </div>
            <Button variant="pizza" size="lg" onClick={handleAddToCart}>
              <Plus className="h-5 w-5" />
              {t('product.add')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
