import React, { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
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
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface CategoryFormData {
  name_ar: string;
  name_en: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const initialFormData: CategoryFormData = {
  name_ar: '',
  name_en: '',
  image_url: null,
  is_active: true,
  sort_order: 0,
};

const AdminCategories: React.FC = () => {
  const { language } = useLanguage();
  const { data: categories = [], isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);

  const handleCreate = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name_ar: category.name_ar,
      name_en: category.name_en,
      image_url: category.image_url,
      is_active: category.is_active ?? true,
      sort_order: category.sort_order ?? 0,
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
      await deleteCategory.mutateAsync(deletingId);
      toast.success(language === 'ar' ? 'تم حذف القسم بنجاح' : 'Category deleted successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل حذف القسم' : 'Failed to delete category');
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ar.trim() || !formData.name_en.trim()) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, ...formData });
        toast.success(language === 'ar' ? 'تم تحديث القسم بنجاح' : 'Category updated successfully');
      } else {
        await createCategory.mutateAsync(formData);
        toast.success(language === 'ar' ? 'تم إنشاء القسم بنجاح' : 'Category created successfully');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateCategory.mutateAsync({ id, is_active: isActive });
      toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل التحديث' : 'Update failed');
    }
  };

  return (
    <AdminLayout title={language === 'ar' ? 'إدارة الأقسام' : 'Categories Management'}>
      <div className="mb-6">
        <Button onClick={handleCreate} variant="pizza">
          <Plus className="h-4 w-4" />
          {language === 'ar' ? 'إضافة قسم' : 'Add Category'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : categories.length === 0 ? (
        <Card className="card-gradient border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد أقسام بعد' : 'No categories yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="card-gradient border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={language === 'ar' ? category.name_ar : category.name_en}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-2xl">🍕</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{category.name_ar}</h3>
                    <p className="text-sm text-muted-foreground">{category.name_en}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'متاح' : 'Active'}
                      </span>
                      <Switch
                        checked={category.is_active ?? true}
                        onCheckedChange={(checked) => handleToggleActive(category.id, checked)}
                      />
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? (language === 'ar' ? 'تعديل القسم' : 'Edit Category')
                : (language === 'ar' ? 'إضافة قسم جديد' : 'Add New Category')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'} *</Label>
              <Input
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                placeholder="بيتزا"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'} *</Label>
              <Input
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="Pizza"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الصورة' : 'Image'}</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="categories"
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
              <Label>{language === 'ar' ? 'متاح' : 'Active'}</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" variant="pizza" disabled={createCategory.isPending || updateCategory.isPending}>
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
                ? 'سيتم حذف هذا القسم نهائياً. لا يمكن التراجع عن هذا الإجراء.'
                : 'This will permanently delete this category. This action cannot be undone.'}
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

export default AdminCategories;
