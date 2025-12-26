import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderTree, UtensilsCrossed, ClipboardList, Sparkles } from 'lucide-react';
import { useAdminCategories, useAdminMenuItems, useAdminOrders, useAdminPromotions } from '@/hooks/useAdmin';

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { data: categories = [] } = useAdminCategories();
  const { data: items = [] } = useAdminMenuItems();
  const { data: orders = [] } = useAdminOrders();
  const { data: promotions = [] } = useAdminPromotions();

  const stats = [
    {
      title: language === 'ar' ? 'الأقسام' : 'Categories',
      value: categories.length,
      icon: FolderTree,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: language === 'ar' ? 'الأصناف' : 'Items',
      value: items.length,
      icon: UtensilsCrossed,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      title: language === 'ar' ? 'الطلبات' : 'Orders',
      value: orders.length,
      icon: ClipboardList,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: language === 'ar' ? 'العروض' : 'Promotions',
      value: promotions.length,
      icon: Sparkles,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout title={language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-gradient border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="card-gradient border-border/50">
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'آخر الطلبات' : 'Recent Orders'}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold">{order.total} ر.س</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
