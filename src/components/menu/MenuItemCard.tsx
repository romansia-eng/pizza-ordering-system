import React from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { MenuItem } from '@/hooks/useMenu';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onClick }) => {
  const { language, t } = useLanguage();
  const name = language === 'ar' ? item.name_ar : item.name_en;
  const description = language === 'ar' ? item.description_ar : item.description_en;

  return (
    <Card 
      className={cn(
        "group cursor-pointer overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02] hover:border-primary/50",
        "card-gradient border-border/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-6xl">🍕</span>
            </div>
          )}
          
          {/* Calories Badge */}
          {item.calories && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full glass text-xs font-medium">
              {item.calories} {t('menu.calories')}
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full pizza-gradient text-primary-foreground font-bold shadow-lg">
            {item.base_price} {t('menu.sar')}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {description}
            </p>
          )}
          
          <Button 
            variant="pizza" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Plus className="h-4 w-4" />
            {t('menu.add_to_cart')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
