import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  UtensilsCrossed,
  Sparkles,
  Settings,
  ClipboardList,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Car,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { signOut, user } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: language === 'ar' ? 'الرئيسية' : 'Dashboard' },
    { path: '/admin/categories', icon: FolderTree, label: language === 'ar' ? 'الأقسام' : 'Categories' },
    { path: '/admin/items', icon: UtensilsCrossed, label: language === 'ar' ? 'الأصناف' : 'Items' },
    { path: '/admin/modifiers', icon: Sparkles, label: language === 'ar' ? 'الإضافات' : 'Modifiers' },
    { path: '/admin/promotions', icon: Sparkles, label: language === 'ar' ? 'العروض' : 'Promotions' },
    { path: '/admin/orders', icon: ClipboardList, label: language === 'ar' ? 'الطلبات' : 'Orders' },
    { path: '/admin/driver', icon: Car, label: language === 'ar' ? 'السائق' : 'Driver' },
    { path: '/admin/settings', icon: Settings, label: language === 'ar' ? 'الإعدادات' : 'Settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 h-16 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="font-bold text-lg mx-auto">{title}</span>
        <div className="w-10" />
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full bg-card border-r border-border transition-all duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'lg:w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full pizza-gradient flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-xl">🍕</span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="text-lg font-bold text-gradient block">
                    {language === 'ar' ? 'الرومنسية' : 'Al-Romansia'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Collapse Toggle Button - Desktop Only */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center p-2 mx-2 mt-2 hover:bg-muted rounded-lg transition-colors"
            title={sidebarCollapsed ? (language === 'ar' ? 'توسيع' : 'Expand') : (language === 'ar' ? 'طي' : 'Collapse')}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 mr-auto" />}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-border">
            {!sidebarCollapsed && (
              <div className="text-sm text-muted-foreground mb-2 truncate">
                {user?.email}
              </div>
            )}
            <Button
              variant="outline"
              className={cn("w-full gap-2", sidebarCollapsed ? "justify-center px-2" : "justify-start")}
              onClick={handleSignOut}
              title={sidebarCollapsed ? (language === 'ar' ? 'تسجيل الخروج' : 'Sign Out') : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && (language === 'ar' ? 'تسجيل الخروج' : 'Sign Out')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={cn(
        "pt-16 lg:pt-0 transition-all duration-300",
        sidebarCollapsed ? "lg:mr-16" : "lg:mr-64"
      )}>
        <div className="p-4 lg:p-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
