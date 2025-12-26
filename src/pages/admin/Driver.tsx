import React from 'react';
import { Car, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const statusLabels: Record<string, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  confirmed: { ar: 'تم التأكيد', en: 'Confirmed' },
  preparing: { ar: 'قيد التحضير', en: 'Preparing' },
  ready: { ar: 'جاهز للتوصيل', en: 'Ready for Delivery' },
  driver_arrived: { ar: 'السائق وصل', en: 'Driver Arrived' },
  delivered: { ar: 'تم التوصيل', en: 'Delivered' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-emerald-500',
  driver_arrived: 'bg-purple-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500',
};

const AdminDriver: React.FC = () => {
  const { language } = useLanguage();
  const { data: allOrders = [], isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

  // Filter orders that are ready for delivery or driver arrived
  const deliveryOrders = allOrders.filter(
    order => 
      order.order_type === 'delivery' && 
      ['ready', 'driver_arrived'].includes(order.status || '')
  );

  const handleDriverArrived = async (orderId: string) => {
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: 'driver_arrived' as any,
      });
      toast.success(
        language === 'ar' 
          ? 'تم إرسال إشعار للعميل!' 
          : 'Customer notified!'
      );
    } catch (error) {
      toast.error(
        language === 'ar' 
          ? 'فشل تحديث الحالة' 
          : 'Failed to update status'
      );
    }
  };

  const handleDelivered = async (orderId: string) => {
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: 'delivered',
      });
      toast.success(
        language === 'ar' 
          ? 'تم تسليم الطلب بنجاح!' 
          : 'Order delivered successfully!'
      );
    } catch (error) {
      toast.error(
        language === 'ar' 
          ? 'فشل تحديث الحالة' 
          : 'Failed to update status'
      );
    }
  };

  return (
    <AdminLayout title={language === 'ar' ? 'واجهة السائق' : 'Driver Interface'}>
      {/* Header Info */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-primary/10 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <Car className="h-8 w-8 text-purple-500" />
          <div>
            <h2 className="font-bold text-lg">
              {language === 'ar' ? 'الطلبات الجاهزة للتوصيل' : 'Orders Ready for Delivery'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'اضغط على "وصلت" عند وصولك لموقع العميل'
                : 'Press "Arrived" when you reach the customer location'}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : deliveryOrders.length === 0 ? (
        <Card className="card-gradient border-border/50">
          <CardContent className="py-12 text-center">
            <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">
              {language === 'ar' 
                ? 'لا توجد طلبات جاهزة للتوصيل حالياً'
                : 'No orders ready for delivery at the moment'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliveryOrders.map((order) => (
            <Card 
              key={order.id} 
              className={`card-gradient border-border/50 transition-all ${
                order.status === 'driver_arrived' 
                  ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-background' 
                  : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl">{order.order_number}</h3>
                      <Badge className={statusColors[order.status || 'ready']}>
                        {statusLabels[order.status || 'ready'][language]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'العميل' : 'Customer'}
                        </p>
                        <p className="font-medium">{order.customer_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'الجوال' : 'Phone'}
                        </p>
                        <a 
                          href={`tel:${order.customer_phone}`} 
                          className="font-medium text-primary hover:underline"
                          dir="ltr"
                        >
                          {order.customer_phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">
                        {language === 'ar' ? 'العنوان' : 'Address'}
                      </p>
                      <p className="font-medium">{order.district}</p>
                      {order.street && <p className="text-muted-foreground">{order.street}</p>}
                      {order.google_maps_link && (
                        <a
                          href={order.google_maps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
                        >
                          <MapPin className="h-4 w-4" />
                          {language === 'ar' ? 'فتح في الخرائط' : 'Open in Maps'}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="font-medium">
                      {language === 'ar' ? 'المبلغ المطلوب' : 'Amount Due'}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {order.total} {language === 'ar' ? 'ر.س' : 'SAR'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {order.status === 'ready' && (
                      <Button
                        onClick={() => handleDriverArrived(order.id)}
                        className="col-span-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-6 text-lg"
                        disabled={updateStatus.isPending}
                      >
                        <Car className="h-6 w-6 mr-2" />
                        {language === 'ar' ? 'وصلت للموقع' : 'I Have Arrived'}
                      </Button>
                    )}
                    
                    {order.status === 'driver_arrived' && (
                      <Button
                        onClick={() => handleDelivered(order.id)}
                        className="col-span-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-6 text-lg"
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-6 w-6 mr-2" />
                        {language === 'ar' ? 'تم التسليم' : 'Delivered'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDriver;