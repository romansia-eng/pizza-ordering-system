import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useAdminPromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface PromotionFormData {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const initialFormData: PromotionFormData = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  image_url: null,
  is_active: true,
  sort_order: 0,
};

const AdminPromotions: React.FC = () => {
  const { language } = useLanguage();
  const { data: promotions = [], isLoading } = useAdminPromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PromotionFormData>(initialFormData);

  const handleCreate = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  const handleEdit = (promotion: any) => {
    setEditingId(promotion.id);
    setFormData({
      title_ar: promotion.title_ar,
      title_en: promotion.title_en,
      description_ar: promotion.description_ar || '',
      description_en: promotion.description_en || '',
      image_url: promotion.image_url,
      is_active: promotion.is_active ?? true,
      sort_order: promotion.sort_order ?? 0,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deletePromotion.mutateAsync(deletingId);
      toast.success(language === 'ar' ? 'تم حذف العرض بنجاح' : 'Promotion deleted successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل حذف العرض' : 'Failed to delete promotion');
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_ar.trim() || !formData.title_en.trim()) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await updatePromotion.mutateAsync({ id: editingId, ...formData });
        toast.success(language === 'ar' ? 'تم تحديث العرض بنجاح' : 'Promotion updated successfully');
      } else {
        await createPromotion.mutateAsync(formData);
        toast.success(language === 'ar' ? 'تم إنشاء العرض بنجاح' : 'Promotion created successfully');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updatePromotion.mutateAsync({ id, is_active: isActive });
      toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل التحديث' : 'Update failed');
    }
  };

  return (
    <AdminLayout title={language === 'ar' ? 'إدارة العروض' : 'Promotions Management'}>
      <div className="mb-6">
        <Button onClick={handleCreate} variant="pizza">
          <Plus className="h-4 w-4" />
          {language === 'ar' ? 'إضافة عرض' : 'Add Promotion'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : promotions.length === 0 ? (
        <Card className="card-gradient border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد عروض بعد' : 'No promotions yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <Card key={promo.id} className="card-gradient border-border/50 overflow-hidden">
              {promo.image_url && (
                <img
                  src={promo.image_url}
                  alt={language === 'ar' ? promo.title_ar : promo.title_en}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold">{promo.title_ar}</h3>
                  <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                    {promo.is_active
                      ? (language === 'ar' ? 'نشط' : 'Active')
                      : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {promo.description_ar || promo.title_en}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'نشط' : 'Active'}
                    </span>
                    <Switch
                      checked={promo.is_active ?? true}
                      onCheckedChange={(checked) => handleToggleActive(promo.id, checked)}
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(promo)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(promo.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? (language === 'ar' ? 'تعديل العرض' : 'Edit Promotion')
                : (language === 'ar' ? 'إضافة عرض جديد' : 'Add New Promotion')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'} *</Label>
              <Input
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                placeholder="عرض خاص"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'} *</Label>
              <Input
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Special Offer"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}</Label>
              <Textarea
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                placeholder="وصف العرض بالعربية..."
                dir="rtl"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}</Label>
              <Textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder="Promotion description in English..."
                dir="ltr"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الصورة' : 'Image'}</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="promotions"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الترتيب' : 'Sort Order'}</Label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>{language === 'ar' ? 'نشط' : 'Active'}</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" variant="pizza" disabled={createPromotion.isPending || updatePromotion.isPending}>
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar'
                ? 'سيتم حذف هذا العرض نهائياً. لا يمكن التراجع عن هذا الإجراء.'
                : 'This will permanently delete this promotion. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'ar' ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              {language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPromotions;
