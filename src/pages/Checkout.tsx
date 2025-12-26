import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Truck, Store, MapPin, Banknote, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useStoreSettings } from '@/hooks/useMenu';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type OrderType = 'delivery' | 'pickup';
type PaymentMethod = 'cash' | 'card';

interface FormData {
  name: string;
  phone: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  district: string;
  street: string;
  mapsLink: string;
  generalNotes: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { items, getSubtotal, clearCart } = useCart();
  const { data: settings } = useStoreSettings();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    orderType: 'delivery',
    paymentMethod: 'cash',
    district: '',
    street: '',
    mapsLink: '',
    generalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = formData.orderType === 'delivery' ? (settings?.delivery_fee || 15) : 0;
  const total = subtotal + deliveryFee;
  const whatsappNumber = settings?.whatsapp_number || '966552065055';

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error(language === 'ar' ? 'الرجاء إدخال الاسم' : 'Please enter your name');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error(language === 'ar' ? 'الرجاء إدخال رقم الجوال' : 'Please enter your phone number');
      return false;
    }
    if (formData.orderType === 'delivery' && !formData.district.trim()) {
      toast.error(language === 'ar' ? 'الرجاء إدخال الحي' : 'Please enter the district');
      return false;
    }
    return true;
  };

  const buildWhatsAppMessage = (orderNumber: string): string => {
    const isArabic = language === 'ar';
    const orderDate = new Date().toLocaleString(isArabic ? 'ar-SA' : 'en-US');
    
    let message = '';
    
    // Header
    message += `طلب جديد — مطعم الرومنسية 🍕\n\n`;
    message += `رقم الطلب: ${orderNumber}\n`;
    message += `التاريخ: ${orderDate}\n`;
    message += `————————————\n\n`;
    
    // Order Details
    message += `تفاصيل الطلب:\n`;
    items.forEach((item, index) => {
      const itemName = item.name_ar;
      message += `${index + 1}. ${itemName} x${item.quantity}`;
      
      if (item.modifiers.length > 0) {
        const modifierNames = item.modifiers.map((m) => m.name_ar).join('، ');
        message += ` (${modifierNames})`;
      }
      
      message += ` - ${item.totalPrice.toFixed(2)} ر.س\n`;
      
      if (item.notes) {
        message += `   ملاحظة: ${item.notes}\n`;
      }
    });
    
    message += `\n————————————\n\n`;
    
    // Financial Summary
    message += `ملخص الحساب:\n`;
    message += `المجموع الفرعي: ${subtotal.toFixed(2)} ر.س\n`;
    message += `رسوم التوصيل: ${deliveryFee.toFixed(2)} ر.س\n`;
    message += `الإجمالي: ${total.toFixed(2)} ر.س\n`;
    message += `\n————————————\n\n`;
    
    // Order Type
    const orderTypeText = formData.orderType === 'delivery' ? 'توصيل' : 'استلام من الفرع';
    message += `نوع الطلب: ${orderTypeText}\n`;
    
    // Payment Method
    const paymentText = formData.paymentMethod === 'cash' ? '💵 كاش' : '💳 شبكة (يحتاج جهاز الدفع)';
    message += `طريقة الدفع: ${paymentText}\n`;
    
    // Address (if delivery)
    if (formData.orderType === 'delivery') {
      message += `\nموقع العميل:\n`;
      message += `الحي: ${formData.district}\n`;
      if (formData.street) {
        message += `الشارع: ${formData.street}\n`;
      }
      if (formData.mapsLink) {
        message += `رابط الموقع: ${formData.mapsLink}\n`;
      }
    }
    
    // General Notes
    if (formData.generalNotes) {
      message += `\nملاحظات:\n${formData.generalNotes}\n`;
    }
    
    message += `\n————————————\n\n`;
    
    // Customer Data
    message += `بيانات العميل:\n`;
    message += `الاسم: ${formData.name}\n`;
    message += `الجوال: ${formData.phone}\n`;
    message += `\nتم الإرسال عبر تطبيق الرومنسية`;
    
    return message;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error(language === 'ar' ? 'السلة فارغة' : 'Cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: `ROM-${Date.now()}`,
          customer_name: formData.name,
          customer_phone: formData.phone,
          order_type: formData.orderType as 'delivery' | 'pickup',
          payment_method: formData.paymentMethod,
          district: formData.district || null,
          street: formData.street || null,
          address_notes: null,
          google_maps_link: formData.mapsLink || null,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          total: total,
          general_notes: formData.generalNotes || null,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      for (const item of items) {
        const { data: orderItemData, error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderData.id,
            menu_item_id: item.menuItemId,
            item_name_ar: item.name_ar,
            item_name_en: item.name_en,
            quantity: item.quantity,
            base_price: item.basePrice,
            modifiers_price: item.modifiersPrice,
            total_price: item.totalPrice,
            notes: item.notes || null,
          })
          .select()
          .single();

        if (itemError) throw itemError;

        // Create order item modifiers
        if (item.modifiers.length > 0) {
          const modifierInserts = item.modifiers.map((m) => ({
            order_item_id: orderItemData.id,
            modifier_id: m.id,
            modifier_name_ar: m.name_ar,
            modifier_name_en: m.name_en,
            price: m.price,
          }));

          const { error: modifiersError } = await supabase
            .from('order_item_modifiers')
            .insert(modifierInserts);

          if (modifiersError) throw modifiersError;
        }
      }

      // Build WhatsApp message and URL
      const message = buildWhatsAppMessage(orderData.order_number);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Save order to local storage for order history
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      savedOrders.unshift({
        id: orderData.id,
        order_number: orderData.order_number,
        total: total,
        created_at: orderData.created_at,
        items: items.map((i) => ({
          name_ar: i.name_ar,
          name_en: i.name_en,
          quantity: i.quantity,
        })),
      });
      localStorage.setItem('orders', JSON.stringify(savedOrders.slice(0, 50)));

      // Clear cart
      clearCart();

      toast.success(
        language === 'ar'
          ? 'تم إنشاء الطلب بنجاح! يتم فتح واتساب...'
          : 'Order created successfully! Opening WhatsApp...'
      );

      // Open WhatsApp in new tab - triggered directly by user click
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Navigate after a small delay
      setTimeout(() => {
        navigate('/orders');
      }, 500);

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ في إنشاء الطلب'
          : 'Error creating order'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle>{t('checkout.customer_info')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t('checkout.name')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('checkout.name_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {t('checkout.phone')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={t('checkout.phone_placeholder')}
                      dir="ltr"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Type */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle>{t('checkout.order_type')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.orderType}
                  onValueChange={(value) => handleInputChange('orderType', value as OrderType)}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="delivery"
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      formData.orderType === 'delivery'
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Truck className="h-5 w-5" />
                    <span className="font-medium">{t('checkout.delivery')}</span>
                  </Label>
                  <Label
                    htmlFor="pickup"
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      formData.orderType === 'pickup'
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Store className="h-5 w-5" />
                    <span className="font-medium">{t('checkout.pickup')}</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Address (Delivery only) */}
            {formData.orderType === 'delivery' && (
              <Card className="card-gradient border-border/50 animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('checkout.address')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">
                        {t('checkout.district')} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder={t('checkout.district_placeholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="street">{t('checkout.street')}</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        placeholder={t('checkout.street_placeholder')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mapsLink">{t('checkout.maps_link')}</Label>
                    <Input
                      id="mapsLink"
                      value={formData.mapsLink}
                      onChange={(e) => handleInputChange('mapsLink', e.target.value)}
                      placeholder={t('checkout.maps_placeholder')}
                      dir="ltr"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                  <span className="text-destructive"> *</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange('paymentMethod', value as PaymentMethod)}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="cash"
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      formData.paymentMethod === 'cash'
                        ? "border-green-500 bg-green-500/10"
                        : "border-border hover:border-green-500/50"
                    )}
                  >
                    <RadioGroupItem value="cash" id="cash" />
                    <Banknote className="h-5 w-5 text-green-500" />
                    <span className="font-medium">{language === 'ar' ? 'كاش' : 'Cash'}</span>
                  </Label>
                  <Label
                    htmlFor="card"
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      formData.paymentMethod === 'card'
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-border hover:border-blue-500/50"
                    )}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{language === 'ar' ? 'شبكة' : 'Card'}</span>
                  </Label>
                </RadioGroup>
                {formData.paymentMethod === 'card' && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {language === 'ar' 
                      ? 'سيحضر السائق جهاز الدفع معه' 
                      : 'The driver will bring the payment device'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* General Notes */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle>{t('checkout.general_notes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.generalNotes}
                  onChange={(e) => handleInputChange('generalNotes', e.target.value)}
                  placeholder={t('checkout.general_notes_placeholder')}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-gradient border-border/50 sticky top-20">
              <CardHeader>
                <CardTitle>{t('checkout.order_summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => {
                    const name = language === 'ar' ? item.name_ar : item.name_en;
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {name} x{item.quantity}
                        </span>
                        <span>{item.totalPrice.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('cart.subtotal')}</span>
                    <span>{subtotal.toFixed(2)} {t('menu.sar')}</span>
                  </div>
                  {formData.orderType === 'delivery' && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t('cart.delivery_fee')}</span>
                      <span>{deliveryFee.toFixed(2)} {t('menu.sar')}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Payment Method Display */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'طريقة الدفع' : 'Payment'}
                  </span>
                  <span className="flex items-center gap-2 font-medium">
                    {formData.paymentMethod === 'cash' ? (
                      <>
                        <Banknote className="h-4 w-4 text-green-500" />
                        {language === 'ar' ? 'كاش' : 'Cash'}
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        {language === 'ar' ? 'شبكة' : 'Card'}
                      </>
                    )}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{total.toFixed(2)} {t('menu.sar')}</span>
                </div>

                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  <MessageCircle className="h-5 w-5" />
                  {isSubmitting
                    ? t('common.loading')
                    : t('checkout.send_whatsapp')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;