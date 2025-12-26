import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight, ArrowLeft, Clock, ChefHat, Truck, Bell, CheckCircle, XCircle, Car } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import DriverArrivedAlert from '@/components/orders/DriverArrivedAlert';

interface SavedOrder {
  id: string;
  order_number: string;
  total: number;
  created_at: string;
  status: string;
  items: Array<{
    name_ar: string;
    name_en: string;
    quantity: number;
  }>;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string }> = {
  pending: { icon: Clock, color: 'bg-yellow-500 text-yellow-50' },
  confirmed: { icon: CheckCircle, color: 'bg-blue-500 text-blue-50' },
  preparing: { icon: ChefHat, color: 'bg-orange-500 text-orange-50' },
  ready: { icon: Truck, color: 'bg-emerald-500 text-emerald-50' },
  driver_arrived: { icon: Car, color: 'bg-purple-500 text-purple-50 animate-pulse' },
  delivered: { icon: CheckCircle, color: 'bg-gray-500 text-gray-50' },
  cancelled: { icon: XCircle, color: 'bg-red-500 text-red-50' },
};

const statusLabels: Record<string, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  confirmed: { ar: 'تم التأكيد', en: 'Confirmed' },
  preparing: { ar: 'قيد التحضير', en: 'Preparing' },
  ready: { ar: 'جاهز / في الطريق', en: 'Ready / On the way' },
  driver_arrived: { ar: 'السائق وصل!', en: 'Driver Arrived!' },
  delivered: { ar: 'تم التوصيل', en: 'Delivered' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
};

const Orders: React.FC = () => {
  const { language, t, dir } = useLanguage();
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [driverArrivedOrder, setDriverArrivedOrder] = useState<SavedOrder | null>(null);
  const previousStatuses = useRef<Record<string, string>>({});

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  // Load orders from localStorage and fetch live status from DB
  useEffect(() => {
    const loadOrders = async () => {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const parsedOrders: SavedOrder[] = JSON.parse(savedOrders);
        
        // Fetch live status from database
        if (parsedOrders.length > 0) {
          const orderIds = parsedOrders.map(o => o.id);
          const { data: dbOrders } = await supabase
            .from('orders')
            .select('id, status')
            .in('id', orderIds);

          if (dbOrders) {
            const statusMap = new Map(dbOrders.map(o => [o.id, o.status]));
            const updatedOrders = parsedOrders.map(order => ({
              ...order,
              status: statusMap.get(order.id) || order.status || 'pending'
            }));
            
            // Store previous statuses for comparison
            updatedOrders.forEach(order => {
              previousStatuses.current[order.id] = order.status;
            });
            
            setOrders(updatedOrders);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
          } else {
            setOrders(parsedOrders);
          }
        }
      }
    };

    loadOrders();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    if (orders.length === 0) return;

    const orderIds = orders.map(o => o.id);
    
    const channel = supabase
      .channel('orders-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const updatedOrder = payload.new as { id: string; status: string };
          
          // Check if this order is in our list
          if (!orderIds.includes(updatedOrder.id)) return;

          const previousStatus = previousStatuses.current[updatedOrder.id];
          
          // Update orders state
          setOrders(prev => {
            const newOrders = prev.map(order => 
              order.id === updatedOrder.id 
                ? { ...order, status: updatedOrder.status }
                : order
            );
            localStorage.setItem('orders', JSON.stringify(newOrders));
            return newOrders;
          });

          // Check if status changed to driver_arrived
          if (updatedOrder.status === 'driver_arrived' && previousStatus !== 'driver_arrived') {
            const arrivedOrder = orders.find(o => o.id === updatedOrder.id);
            if (arrivedOrder) {
              setDriverArrivedOrder({ ...arrivedOrder, status: 'driver_arrived' });
            }
          }

          // Update previous status
          previousStatuses.current[updatedOrder.id] = updatedOrder.status;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orders.length]);

  const handleDismissAlert = () => {
    setDriverArrivedOrder(null);
  };

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t('orders.empty')}</h1>
            <p className="text-muted-foreground mb-6">{t('orders.empty_desc')}</p>
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
        <h1 className="text-3xl font-bold mb-8">{t('orders.title')}</h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString(
              language === 'ar' ? 'ar-SA' : 'en-US',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }
            );

            const status = order.status || 'pending';
            const config = statusConfig[status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const label = statusLabels[status] || statusLabels.pending;

            return (
              <Card 
                key={order.id} 
                className={`card-gradient border-border/50 transition-all ${
                  status === 'driver_arrived' ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-background' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg">
                          {t('orders.order_number')}: {order.order_number}
                        </h3>
                        <Badge className={`${config.color} flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {label[language]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('orders.date')}: {formattedDate}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                          <Badge key={index} variant="outline">
                            {language === 'ar' ? item.name_ar : item.name_en} x{item.quantity}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Driver Arrived Notice */}
                      {status === 'driver_arrived' && (
                        <div className="mt-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                          <div className="flex items-center gap-2 text-purple-500">
                            <Bell className="h-5 w-5 animate-bounce" />
                            <span className="font-bold">
                              {language === 'ar' ? 'السائق في الانتظار!' : 'Driver is waiting!'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t('cart.total')}</p>
                      <p className="text-2xl font-bold text-primary">
                        {order.total.toFixed(2)} {t('menu.sar')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Driver Arrived Alert Modal */}
      {driverArrivedOrder && (
        <DriverArrivedAlert 
          order={driverArrivedOrder} 
          onDismiss={handleDismissAlert} 
        />
      )}
    </Layout>
  );
};

export default Orders;