import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStoreSettings, useUpdateStoreSettings } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const AdminSettings: React.FC = () => {
  const { language } = useLanguage();
  const { data: settings, isLoading } = useAdminStoreSettings();
  const updateSettings = useUpdateStoreSettings();

  const [formData, setFormData] = useState({
    store_name_ar: '',
    store_name_en: '',
    whatsapp_number: '',
    opening_time: '',
    closing_time: '',
    delivery_fee: 0,
    minimum_order: 0,
    is_open: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        store_name_ar: settings.store_name_ar || '',
        store_name_en: settings.store_name_en || '',
        whatsapp_number: settings.whatsapp_number || '',
        opening_time: settings.opening_time || '',
        closing_time: settings.closing_time || '',
        delivery_fee: settings.delivery_fee || 0,
        minimum_order: settings.minimum_order || 0,
        is_open: settings.is_open ?? true,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings?.id) {
      toast.error(language === 'ar' ? 'لم يتم العثور على الإعدادات' : 'Settings not found');
      return;
    }

    try {
      await updateSettings.mutateAsync({
        id: settings.id,
        ...formData,
      });
      toast.success(language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل حفظ الإعدادات' : 'Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title={language === 'ar' ? 'الإعدادات' : 'Settings'}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={language === 'ar' ? 'الإعدادات' : 'Settings'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Info */}
        <Card className="card-gradient border-border/50">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'معلومات المتجر' : 'Store Information'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)'}</Label>
                <Input
                  value={formData.store_name_ar}
                  onChange={(e) => setFormData({ ...formData, store_name_ar: e.target.value })}
                  placeholder="بيتزا الرومنسية"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'اسم المتجر (إنجليزي)' : 'Store Name (English)'}</Label>
                <Input
                  value={formData.store_name_en}
                  onChange={(e) => setFormData({ ...formData, store_name_en: e.target.value })}
                  placeholder="Al-Romansia Pizza"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'رقم واتساب' : 'WhatsApp Number'}</Label>
              <Input
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="966552065055"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                {language === 'ar'
                  ? 'أدخل الرقم بالصيغة الدولية بدون + أو 00'
                  : 'Enter number in international format without + or 00'}
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Switch
                checked={formData.is_open}
                onCheckedChange={(checked) => setFormData({ ...formData, is_open: checked })}
              />
              <div>
                <Label className="text-base">{language === 'ar' ? 'المتجر مفتوح' : 'Store is Open'}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'عند الإغلاق، لن يتمكن العملاء من تقديم طلبات جديدة'
                    : 'When closed, customers cannot place new orders'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="card-gradient border-border/50">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'وقت الفتح' : 'Opening Time'}</Label>
                <Input
                  type="time"
                  value={formData.opening_time}
                  onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'وقت الإغلاق' : 'Closing Time'}</Label>
                <Input
                  type="time"
                  value={formData.closing_time}
                  onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card className="card-gradient border-border/50">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'إعدادات التوصيل' : 'Delivery Settings'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'رسوم التوصيل (ر.س)' : 'Delivery Fee (SAR)'}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.delivery_fee}
                  onChange={(e) => setFormData({ ...formData, delivery_fee: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الحد الأدنى للطلب (ر.س)' : 'Minimum Order (SAR)'}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minimum_order}
                  onChange={(e) => setFormData({ ...formData, minimum_order: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="pizza" size="lg" disabled={updateSettings.isPending}>
            <Save className="h-4 w-4" />
            {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;
