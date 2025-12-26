import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories, useFeaturedItems } from '@/hooks/useMenu';
import Layout from '@/components/layout/Layout';
import MenuItemCard from '@/components/menu/MenuItemCard';
import ProductModal from '@/components/menu/ProductModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { MenuItem } from '@/hooks/useMenu';

const Index: React.FC = () => {
  const { language, t, dir } = useLanguage();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: featuredItems = [], isLoading: featuredLoading } = useFeaturedItems();
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-slide-up">
            <p className="text-secondary font-semibold text-lg mb-2">
              {t('home.welcome')}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-gradient">
                {language === 'ar' ? 'الرومنسية' : 'Al-Romansia'}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('home.tagline')}
            </p>
            <Link to="/menu">
              <Button variant="pizza" size="xl" className="animate-pulse-glow">
                {t('home.order_now')}
                <ArrowIcon className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Pizza */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 opacity-10 pointer-events-none">
          <div className="w-full h-full rounded-full border-8 border-dashed border-primary animate-spin" style={{ animationDuration: '60s' }} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('home.categories')}</h2>
            <Link to="/menu">
              <Button variant="ghost" size="sm">
                {t('home.view_all')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Link key={category.id} to={`/menu?category=${category.id}`}>
                  <Card 
                    className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50 card-gradient border-border/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full pizza-gradient flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        🍕
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {language === 'ar' ? category.name_ar : category.name_en}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Items Section */}
      {featuredItems.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t('home.featured')}</h2>
              <Link to="/menu">
                <Button variant="ghost" size="sm">
                  {t('home.view_all')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredItems.slice(0, 8).map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Product Modal */}
      <ProductModal
        item={selectedItem}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </Layout>
  );
};

export default Index;
