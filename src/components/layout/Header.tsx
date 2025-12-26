import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingCart, ClipboardList, MapPin, Globe, LogIn, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { getItemCount } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const itemCount = getItemCount();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/menu', icon: UtensilsCrossed, label: t('nav.menu') },
    { path: '/cart', icon: ShoppingCart, label: t('nav.cart'), badge: itemCount },
    { path: '/orders', icon: ClipboardList, label: t('nav.orders') },
    { path: '/location', icon: MapPin, label: t('nav.location') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full pizza-gradient flex items-center justify-center shadow-lg">
                <span className="text-xl">🍕</span>
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block">
                {language === 'ar' ? 'الرومنسية' : 'Al-Romansia'}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    size="sm"
                    className="relative"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Admin/Login Link */}
              {isAdmin ? (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('nav.admin')}</span>
                  </Button>
                </Link>
              ) : !user && (
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border/50 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 relative',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'animate-bounce-subtle')} />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacers */}
      <div className="h-16" /> {/* Top spacer */}
    </>
  );
};

export default Header;
