import React from 'react';
import { Banknote, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-green-500',
  driver_arrived: 'bg-purple-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500',
};

const statusLabels: Record<string, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  confirmed: { ar: 'تم التأكيد', en: 'Confirmed' },
  preparing: { ar: 'قيد التحضير', en: 'Preparing' },
  ready: { ar: 'جاهز', en: 'Ready' },
  driver_arrived: { ar: 'السائق وصل', en: 'Driver Arrived' },
  delivered: { ar: 'تم التوصيل', en: 'Delivered' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
};

const AdminOrders: React.FC = () => {
  const { language } = useLanguage();
  const { data: orders = [], isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: newStatus as any,
      });
      toast.success(language === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status');
    }
  };

  return (
    <AdminLayout title={language === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="card-gradient border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="card-gradient border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Order Header */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg">{order.order_number}</h3>
                      <Badge className={statusColors[order.status || 'pending']}>
                        {statusLabels[order.status || 'pending'][language]}
                      </Badge>
                      <Badge variant="outline">
                        {order.order_type === 'delivery'
                          ? (language === 'ar' ? 'توصيل' : 'Delivery')
                          : (language === 'ar' ? 'استلام' : 'Pickup')}
                      </Badge>
                      {/* Payment Method Badge */}
                      <Badge 
                        variant="outline" 
                        className={
                          (order as any).payment_method === 'card' 
                            ? 'border-blue-500 text-blue-500' 
                            : 'border-green-500 text-green-500'
                        }
                      >
                        {(order as any).payment_method === 'card' ? (
                          <>
                            <CreditCard className="h-3 w-3 mr-1" />
                            {language === 'ar' ? 'شبكة' : 'Card'}
                          </>
                        ) : (
                          <>
                            <Banknote className="h-3 w-3 mr-1" />
                            {language === 'ar' ? 'كاش' : 'Cash'}
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">
                          {language === 'ar' ? 'العميل' : 'Customer'}
                        </p>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-muted-foreground" dir="ltr">{order.customer_phone}</p>
                      </div>

                      {order.order_type === 'delivery' && order.district && (
                        <div>
                          <p className="text-muted-foreground mb-1">
                            {language === 'ar' ? 'العنوان' : 'Address'}
                          </p>
                          <p>{order.district}</p>
                          {order.street && <p className="text-muted-foreground">{order.street}</p>}
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === 'ar' ? 'الأصناف' : 'Items'}
                      </p>
                      <div className="space-y-2">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {language === 'ar' ? item.item_name_ar : item.item_name_en}
                              {item.order_item_modifiers?.length > 0 && (
                                <span className="text-muted-foreground">
                                  {' + '}
                                  {item.order_item_modifiers.map((m: any) =>
                                    language === 'ar' ? m.modifier_name_ar : m.modifier_name_en
                                  ).join(', ')}
                                </span>
                              )}
                            </span>
                            <span className="font-medium">{item.total_price} ر.س</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.general_notes && (
                      <div className="mt-3 p-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'ملاحظات' : 'Notes'}
                        </p>
                        <p className="text-sm">{order.general_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Order Summary & Actions */}
                  <div className="lg:w-64 space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          {language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
                        </span>
                        <span>{order.subtotal} ر.س</span>
                      </div>
                      {order.delivery_fee > 0 && (
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            {language === 'ar' ? 'رسوم التوصيل' : 'Delivery'}
                          </span>
                          <span>{order.delivery_fee} ر.س</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2 border-t border-border">
                        <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                        <span className="text-primary">{order.total} ر.س</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
                      </p>
                      <Select
                        value={order.status || 'pending'}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label[language]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      {new Date(order.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
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

export default AdminOrders;
