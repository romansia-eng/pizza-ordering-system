import React, { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Link2 } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdminMenuItems,
  useAdminCategories,
  useAdminModifierGroups,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useMenuItemModifierGroups,
  useLinkModifierGroups,
} from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface ItemFormData {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  base_price: number;
  category_id: string;
  image_url: string | null;
  calories: number | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
}

const initialFormData: ItemFormData = {
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  base_price: 0,
  category_id: '',
  image_url: null,
  calories: null,
  is_available: true,
  is_featured: false,
  sort_order: 0,
};

const AdminItems: React.FC = () => {
  const { language } = useLanguage();
  const { data: items = [], isLoading } = useAdminMenuItems();
  const { data: categories = [] } = useAdminCategories();
  const { data: modifierGroups = [] } = useAdminModifierGroups();
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const linkModifierGroups = useLinkModifierGroups();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [linksDialogOpen, setLinksDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [linkingItemId, setLinkingItemId] = useState<string | null>(null);
  const [selectedModifierGroups, setSelectedModifierGroups] = useState<string[]>([]);
  const [formData, setFormData] = useState<ItemFormData>(initialFormData);

  const { data: currentItemModifierGroups = [] } = useMenuItemModifierGroups(linkingItemId || '');

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      category_id: categories[0]?.id || '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name_ar: item.name_ar,
      name_en: item.name_en,
      description_ar: item.description_ar || '',
      description_en: item.description_en || '',
      base_price: item.base_price,
      category_id: item.category_id,
      image_url: item.image_url,
      calories: item.calories,
      is_available: item.is_available ?? true,
      is_featured: item.is_featured ?? false,
      sort_order: item.sort_order ?? 0,
    });
    setDialogOpen(true);
  };

  const handleLinkModifiers = (itemId: string) => {
    setLinkingItemId(itemId);
    setSelectedModifierGroups([]);
    setLinksDialogOpen(true);
  };

  React.useEffect(() => {
    if (currentItemModifierGroups.length > 0) {
      setSelectedModifierGroups(currentItemModifierGroups);
    }
  }, [currentItemModifierGroups]);

  const handleSaveLinks = async () => {
    if (!linkingItemId) return;
    try {
      await linkModifierGroups.mutateAsync({
        menuItemId: linkingItemId,
        groupIds: selectedModifierGroups,
      });
      toast.success(language === 'ar' ? 'تم ربط الإضافات بنجاح' : 'Modifier groups linked successfully');
      setLinksDialogOpen(false);
      setLinkingItemId(null);
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل ربط الإضافات' : 'Failed to link modifier groups');
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteItem.mutateAsync(deletingId);
      toast.success(language === 'ar' ? 'تم حذف الصنف بنجاح' : 'Item deleted successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل حذف الصنف' : 'Failed to delete item');
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_ar.trim() || !formData.name_en.trim() || !formData.category_id) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateItem.mutateAsync({ id: editingId, ...formData });
        toast.success(language === 'ar' ? 'تم تحديث الصنف بنجاح' : 'Item updated successfully');
      } else {
        await createItem.mutateAsync(formData);
        toast.success(language === 'ar' ? 'تم إنشاء الصنف بنجاح' : 'Item created successfully');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleToggleAvailable = async (id: string, isAvailable: boolean) => {
    try {
      await updateItem.mutateAsync({ id, is_available: isAvailable });
      toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل التحديث' : 'Update failed');
    }
  };

  return (
    <AdminLayout title={language === 'ar' ? 'إدارة الأصناف' : 'Items Management'}>
      <div className="mb-6">
        <Button onClick={handleCreate} variant="pizza">
          <Plus className="h-4 w-4" />
          {language === 'ar' ? 'إضافة صنف' : 'Add Item'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : items.length === 0 ? (
        <Card className="card-gradient border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد أصناف بعد' : 'No items yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="card-gradient border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab hidden md:block" />

                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={language === 'ar' ? item.name_ar : item.name_en}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-2xl">🍕</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{item.name_ar}</h3>
                      {item.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          {language === 'ar' ? 'مميز' : 'Featured'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.name_en}</p>
                    <p className="text-sm font-bold text-primary mt-1">{item.base_price} ر.س</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground hidden sm:inline">
                        {language === 'ar' ? 'متاح' : 'Available'}
                      </span>
                      <Switch
                        checked={item.is_available ?? true}
                        onCheckedChange={(checked) => handleToggleAvailable(item.id, checked)}
                      />
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => handleLinkModifiers(item.id)} title={language === 'ar' ? 'ربط الإضافات' : 'Link Modifiers'}>
                      <Link2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
                ? (language === 'ar' ? 'تعديل الصنف' : 'Edit Item')
                : (language === 'ar' ? 'إضافة صنف جديد' : 'Add New Item')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'} *</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="بيتزا مارغريتا"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'} *</Label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="Margherita Pizza"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}</Label>
              <Textarea
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                placeholder="وصف الصنف بالعربية..."
                dir="rtl"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}</Label>
              <Textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder="Item description in English..."
                dir="ltr"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'السعر (ر.س)' : 'Price (SAR)'} *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'السعرات الحرارية' : 'Calories'}</Label>
                <Input
                  type="number"
                  value={formData.calories || ''}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'القسم' : 'Category'} *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر القسم' : 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {language === 'ar' ? cat.name_ar : cat.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الصورة' : 'Image'}</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="items"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
                <Label>{language === 'ar' ? 'متاح' : 'Available'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label>{language === 'ar' ? 'مميز' : 'Featured'}</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" variant="pizza" disabled={createItem.isPending || updateItem.isPending}>
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Link Modifier Groups Dialog */}
      <Dialog open={linksDialogOpen} onOpenChange={setLinksDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'ربط مجموعات الإضافات' : 'Link Modifier Groups'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {modifierGroups.map((group) => (
              <div key={group.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Checkbox
                  checked={selectedModifierGroups.includes(group.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedModifierGroups([...selectedModifierGroups, group.id]);
                    } else {
                      setSelectedModifierGroups(selectedModifierGroups.filter(id => id !== group.id));
                    }
                  }}
                />
                <div>
                  <p className="font-medium">{language === 'ar' ? group.name_ar : group.name_en}</p>
                  <p className="text-xs text-muted-foreground">
                    {group.modifiers?.length || 0} {language === 'ar' ? 'إضافة' : 'modifiers'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setLinksDialogOpen(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveLinks} variant="pizza" disabled={linkModifierGroups.isPending}>
              {language === 'ar' ? 'حفظ' : 'Save'}
            </Button>
          </DialogFooter>
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
                ? 'سيتم حذف هذا الصنف نهائياً. لا يمكن التراجع عن هذا الإجراء.'
                : 'This will permanently delete this item. This action cannot be undone.'}
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

export default AdminItems;
