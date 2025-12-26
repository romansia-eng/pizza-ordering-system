import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.menu': 'المنيو',
    'nav.cart': 'السلة',
    'nav.orders': 'طلباتي',
    'nav.location': 'موقعنا',
    'nav.admin': 'لوحة التحكم',
    
    // Home
    'home.welcome': 'مرحباً بك في',
    'home.tagline': 'أشهى البيتزا الإيطالية الأصلية',
    'home.order_now': 'اطلب الآن',
    'home.featured': 'الأصناف المميزة',
    'home.categories': 'الأقسام',
    'home.view_all': 'عرض الكل',
    
    // Menu
    'menu.title': 'قائمة الطعام',
    'menu.search': 'ابحث عن صنف...',
    'menu.all': 'الكل',
    'menu.no_items': 'لا توجد أصناف',
    'menu.add_to_cart': 'أضف للسلة',
    'menu.calories': 'سعرة',
    'menu.sar': 'ر.س',
    
    // Product
    'product.select_modifiers': 'اختر الإضافات',
    'product.notes': 'ملاحظات',
    'product.notes_placeholder': 'أي ملاحظات خاصة...',
    'product.quantity': 'الكمية',
    'product.total': 'الإجمالي',
    'product.add': 'إضافة للسلة',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'السلة فارغة',
    'cart.empty_desc': 'ابدأ بإضافة أصناف لذيذة!',
    'cart.browse': 'تصفح المنيو',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.delivery_fee': 'رسوم التوصيل',
    'cart.total': 'الإجمالي',
    'cart.checkout': 'إتمام الطلب',
    'cart.remove': 'حذف',
    'cart.clear': 'إفراغ السلة',
    
    // Checkout
    'checkout.title': 'إتمام الطلب',
    'checkout.customer_info': 'بيانات العميل',
    'checkout.name': 'الاسم',
    'checkout.name_placeholder': 'أدخل اسمك',
    'checkout.phone': 'رقم الجوال',
    'checkout.phone_placeholder': '05xxxxxxxx',
    'checkout.order_type': 'نوع الطلب',
    'checkout.delivery': 'توصيل',
    'checkout.pickup': 'استلام من الفرع',
    'checkout.address': 'العنوان',
    'checkout.district': 'الحي',
    'checkout.district_placeholder': 'اسم الحي',
    'checkout.street': 'الشارع / الوصف',
    'checkout.street_placeholder': 'رقم المبنى، الشارع، معالم قريبة',
    'checkout.maps_link': 'رابط Google Maps (اختياري)',
    'checkout.maps_placeholder': 'الصق رابط الموقع هنا',
    'checkout.general_notes': 'ملاحظات عامة',
    'checkout.general_notes_placeholder': 'أي ملاحظات إضافية...',
    'checkout.order_summary': 'ملخص الطلب',
    'checkout.send_whatsapp': 'إرسال الطلب عبر واتساب',
    'checkout.required': 'مطلوب',
    
    // Orders
    'orders.title': 'طلباتي',
    'orders.empty': 'لا توجد طلبات',
    'orders.empty_desc': 'طلباتك السابقة ستظهر هنا',
    'orders.order_number': 'رقم الطلب',
    'orders.date': 'التاريخ',
    'orders.status': 'الحالة',
    'orders.items': 'الأصناف',
    
    // Order Status
    'status.pending': 'قيد الانتظار',
    'status.confirmed': 'تم التأكيد',
    'status.preparing': 'قيد التحضير',
    'status.ready': 'جاهز / في الطريق',
    'status.driver_arrived': 'السائق وصل!',
    'status.delivered': 'تم التوصيل',
    'status.cancelled': 'ملغي',
    
    // Location
    'location.title': 'موقعنا',
    'location.address': 'العنوان',
    'location.address_text': 'محمد رشيد رضا، العزيزية، الرياض 14515',
    'location.open_maps': 'افتح في خرائط Google',
    'location.working_hours': 'ساعات العمل',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.retry': 'إعادة المحاولة',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.back': 'رجوع',
    
    // WhatsApp Message
    'whatsapp.new_order': 'طلب جديد — الرومنسية',
    'whatsapp.customer_data': 'بيانات العميل',
    'whatsapp.name': 'الاسم',
    'whatsapp.phone': 'الجوال',
    'whatsapp.order_type': 'نوع الطلب',
    'whatsapp.delivery': 'توصيل',
    'whatsapp.pickup': 'استلام من الفرع',
    'whatsapp.address': 'العنوان',
    'whatsapp.city': 'المدينة: الرياض',
    'whatsapp.district': 'الحي',
    'whatsapp.street': 'الشارع/الوصف',
    'whatsapp.maps_link': 'رابط Google Maps',
    'whatsapp.order_details': 'تفاصيل الطلب',
    'whatsapp.modifiers': 'الإضافات',
    'whatsapp.item_notes': 'ملاحظات',
    'whatsapp.item_total': 'سعر العنصر',
    'whatsapp.summary': 'ملخص مالي',
    'whatsapp.subtotal': 'المجموع الفرعي',
    'whatsapp.delivery_fee': 'رسوم التوصيل',
    'whatsapp.total': 'الإجمالي',
    'whatsapp.general_notes': 'ملاحظات عامة',
    'whatsapp.order_time': 'وقت الطلب',
    'whatsapp.order_number': 'رقم الطلب',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.cart': 'Cart',
    'nav.orders': 'My Orders',
    'nav.location': 'Location',
    'nav.admin': 'Admin',
    
    // Home
    'home.welcome': 'Welcome to',
    'home.tagline': 'Authentic Italian Pizza at its finest',
    'home.order_now': 'Order Now',
    'home.featured': 'Featured Items',
    'home.categories': 'Categories',
    'home.view_all': 'View All',
    
    // Menu
    'menu.title': 'Our Menu',
    'menu.search': 'Search for an item...',
    'menu.all': 'All',
    'menu.no_items': 'No items found',
    'menu.add_to_cart': 'Add to Cart',
    'menu.calories': 'cal',
    'menu.sar': 'SAR',
    
    // Product
    'product.select_modifiers': 'Select Modifiers',
    'product.notes': 'Notes',
    'product.notes_placeholder': 'Any special notes...',
    'product.quantity': 'Quantity',
    'product.total': 'Total',
    'product.add': 'Add to Cart',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Cart is Empty',
    'cart.empty_desc': 'Start adding delicious items!',
    'cart.browse': 'Browse Menu',
    'cart.subtotal': 'Subtotal',
    'cart.delivery_fee': 'Delivery Fee',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.clear': 'Clear Cart',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.customer_info': 'Customer Information',
    'checkout.name': 'Name',
    'checkout.name_placeholder': 'Enter your name',
    'checkout.phone': 'Phone Number',
    'checkout.phone_placeholder': '05xxxxxxxx',
    'checkout.order_type': 'Order Type',
    'checkout.delivery': 'Delivery',
    'checkout.pickup': 'Pickup',
    'checkout.address': 'Address',
    'checkout.district': 'District',
    'checkout.district_placeholder': 'District name',
    'checkout.street': 'Street / Description',
    'checkout.street_placeholder': 'Building number, street, nearby landmarks',
    'checkout.maps_link': 'Google Maps Link (optional)',
    'checkout.maps_placeholder': 'Paste location link here',
    'checkout.general_notes': 'General Notes',
    'checkout.general_notes_placeholder': 'Any additional notes...',
    'checkout.order_summary': 'Order Summary',
    'checkout.send_whatsapp': 'Send Order via WhatsApp',
    'checkout.required': 'Required',
    
    // Orders
    'orders.title': 'My Orders',
    'orders.empty': 'No Orders',
    'orders.empty_desc': 'Your previous orders will appear here',
    'orders.order_number': 'Order #',
    'orders.date': 'Date',
    'orders.status': 'Status',
    'orders.items': 'Items',
    
    // Order Status
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.preparing': 'Preparing',
    'status.ready': 'Ready / On the way',
    'status.driver_arrived': 'Driver Arrived!',
    'status.delivered': 'Delivered',
    'status.cancelled': 'Cancelled',
    
    // Location
    'location.title': 'Our Location',
    'location.address': 'Address',
    'location.address_text': 'Mohammed Rashid Rida, Al Aziziyah, Riyadh 14515',
    'location.open_maps': 'Open in Google Maps',
    'location.working_hours': 'Working Hours',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    
    // WhatsApp Message
    'whatsapp.new_order': 'New Order — Al-Romansia',
    'whatsapp.customer_data': 'Customer Information',
    'whatsapp.name': 'Name',
    'whatsapp.phone': 'Phone',
    'whatsapp.order_type': 'Order Type',
    'whatsapp.delivery': 'Delivery',
    'whatsapp.pickup': 'Pickup from Branch',
    'whatsapp.address': 'Address',
    'whatsapp.city': 'City: Riyadh',
    'whatsapp.district': 'District',
    'whatsapp.street': 'Street/Description',
    'whatsapp.maps_link': 'Google Maps Link',
    'whatsapp.order_details': 'Order Details',
    'whatsapp.modifiers': 'Modifiers',
    'whatsapp.item_notes': 'Notes',
    'whatsapp.item_total': 'Item Price',
    'whatsapp.summary': 'Financial Summary',
    'whatsapp.subtotal': 'Subtotal',
    'whatsapp.delivery_fee': 'Delivery Fee',
    'whatsapp.total': 'Total',
    'whatsapp.general_notes': 'General Notes',
    'whatsapp.order_time': 'Order Time',
    'whatsapp.order_number': 'Order Number',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
