import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Category } from '@/hooks/useMenu';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  const { language, t } = useLanguage();

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-4">
        <Button
          variant={selectedCategory === null ? 'pizza' : 'outline'}
          size="sm"
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0",
            selectedCategory === null && "shadow-lg"
          )}
        >
          {t('menu.all')}
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'pizza' : 'outline'}
            size="sm"
            onClick={() => onSelect(category.id)}
            className={cn(
              "shrink-0",
              selectedCategory === category.id && "shadow-lg"
            )}
          >
            {language === 'ar' ? category.name_ar : category.name_en}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;
