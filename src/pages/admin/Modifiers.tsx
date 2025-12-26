import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  useAdminModifierGroups,
  useCreateModifierGroup,
  useUpdateModifierGroup,
  useDeleteModifierGroup,
  useCreateModifier,
  useUpdateModifier,
  useDeleteModifier,
} from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface GroupFormData {
  name_ar: string;
  name_en: string;
  is_required: boolean;
  is_multiple: boolean;
  min_selections: number;
  max_selections: number;
}

interface ModifierFormData {
  name_ar: string;
  name_en: string;
  price: number;
  is_available: boolean;
}

const initialGroupData: GroupFormData = {
  name_ar: '',
  name_en: '',
  is_required: false,
  is_multiple: false,
  min_selections: 0,
  max_selections: 1,
};

const initialModifierData: ModifierFormData = {
  name_ar: '',
  name_en: '',
  price: 0,
  is_available: true,
};

const AdminModifiers: React.FC = () => {
  const { language } = useLanguage();
  const { data: groups = [], isLoading } = useAdminModifierGroups();
  const createGroup = useCreateModifierGroup();
  const updateGroup = useUpdateModifierGroup();
  const deleteGroup = useDeleteModifierGroup();
  const createModifier = useCreateModifier();
  const updateModifier = useUpdateModifier();
  const deleteModifier = useDeleteModifier();

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
  // Group dialogs
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupFormData, setGroupFormData] = useState<GroupFormData>(initialGroupData);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  // Modifier dialogs
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [editingModifierId, setEditingModifierId] = useState<string | null>(null);
  const [modifierGroupId, setModifierGroupId] = useState<string | null>(null);
  const [modifierFormData, setModifierFormData] = useState<ModifierFormData>(initialModifierData);
  const [deleteModifierDialogOpen, setDeleteModifierDialogOpen] = useState(false);
  const [deletingModifierId, setDeletingModifierId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  // Group handlers
  const handleCreateGroup = () => {
    setEditingGroupId(null);
    setGroupFormData(initialGroupData);
    setGroupDialogOpen(true);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroupId(group.id);
    setGroupFormData({
      name_ar: group.name_ar,
      name_en: group.name_en,
      is_required: group.is_required ?? false,
      is_multiple: group.is_multiple ?? false,
      min_selections: group.min_selections ?? 0,
      max_selections: group.max_selections ?? 1,
    });
    setGroupDialogOpen(true);
  };

  const handleDeleteGroup = (id: string) => {
    setDeletingGroupId(id);
    setDeleteGroupDialogOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (!deletingGroupId) return;
    try {
      await deleteGroup.mutateAsync(deletingGroupId);
      toast.success(language === 'ar' ? 'تم حذف المجموعة بنجاح' : 'Group deleted successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل حذف المجموعة' : 'Failed to delete group');
    }
    setDeleteGroupDialogOpen(false);
    setDeletingGroupId(null);
  };

  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormData.name_ar.trim() || !groupFormData.name_en.trim()) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingGroupId) {
        await updateGroup.mutateAsync({ id: editingGroupId, ...groupFormData });
        toast.success(language === 'ar' ? 'تم تحديث المجموعة بنجاح' : 'Group updated successfully');
      } else {
        await createGroup.mutateAsync(groupFormData);
        toast.success(language === 'ar' ? 'تم إنشاء المجموعة بنجاح' : 'Group created successfully');
      }
      setGroupDialogOpen(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  // Modifier handlers
  const handleCreateModifier = (groupId: string) => {
    setEditingModifierId(null);
    setModifierGroupId(groupId);
    setModifierFormData(initialModifierData);
    setModifierDialogOpen(true);
  };

  const handleEditModifier = (modifier: any) => {
    setEditingModifierId(modifier.id);
    setModifierGroupId(modifier.group_id);
    setModifierFormData({
      name_ar: modifier.name_ar,
      name_en: modifier.name_en,
      price: modifier.price ?? 0,
      is_available: modifier.is_available ?? true,
    });
    setModifierDialogOpen(true);
  };

  const handleDeleteModifier = (id: string) => {
    setDeletingModifierId(id);
    setDeleteModifierDialogOpen(true);
  };

  const confirmDeleteModifier = async () => {
    if (!deletingModifierId) return;
    try {
      await deleteModifier.mutateAsync(deletingModifierId);
      toast.success(language === 'ar' ? 'تم حذف الإضافة بنجاح' : 'Modifier deleted successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل حذف الإضافة' : 'Failed to delete modifier');
    }
    setDeleteModifierDialogOpen(false);
    setDeletingModifierId(null);
  };

  const handleSubmitModifier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifierFormData.name_ar.trim() || !modifierFormData.name_en.trim() || !modifierGroupId) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingModifierId) {
        await updateModifier.mutateAsync({ id: editingModifierId, ...modifierFormData });
        toast.success(language === 'ar' ? 'تم تحديث الإضافة بنجاح' : 'Modifier updated successfully');
      } else {
        await createModifier.mutateAsync({ ...modifierFormData, group_id: modifierGroupId });
        toast.success(language === 'ar' ? 'تم إنشاء الإضافة بنجاح' : 'Modifier created successfully');
      }
      setModifierDialogOpen(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  return (
    <AdminLayout title={language === 'ar' ? 'إدارة الإضافات' : 'Modifiers Management'}>
      <div className="mb-6">
        <Button onClick={handleCreateGroup} variant="pizza">
          <Plus className="h-4 w-4" />
          {language === 'ar' ? 'إضافة مجموعة' : 'Add Group'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : groups.length === 0 ? (
        <Card className="card-gradient border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد مجموعات إضافات بعد' : 'No modifier groups yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Collapsible
              key={group.id}
              open={expandedGroups.includes(group.id)}
              onOpenChange={() => toggleExpand(group.id)}
            >
              <Card className="card-gradient border-border/50">
                <CardContent className="p-4">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-4 cursor-pointer">
                      <Button variant="ghost" size="icon" className="shrink-0">
                        {expandedGroups.includes(group.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{group.name_ar}</h3>
                          {group.is_required && (
                            <Badge variant="destructive" className="text-xs">
                              {language === 'ar' ? 'مطلوب' : 'Required'}
                            </Badge>
                          )}
                          {group.is_multiple && (
                            <Badge variant="secondary" className="text-xs">
                              {language === 'ar' ? 'متعدد' : 'Multiple'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{group.name_en}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {group.modifiers?.length || 0} {language === 'ar' ? 'إضافة' : 'modifiers'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => handleEditGroup(group)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(group.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          {language === 'ar' ? 'الإضافات' : 'Modifiers'}
                        </h4>
                        <Button size="sm" variant="outline" onClick={() => handleCreateModifier(group.id)}>
                          <Plus className="h-3 w-3" />
                          {language === 'ar' ? 'إضافة' : 'Add'}
                        </Button>
                      </div>

                      {group.modifiers && group.modifiers.length > 0 ? (
                        <div className="space-y-2">
                          {group.modifiers.map((modifier: any) => (
                            <div
                              key={modifier.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-medium">{modifier.name_ar}</p>
                                  <p className="text-xs text-muted-foreground">{modifier.name_en}</p>
                                </div>
                                {!modifier.is_available && (
                                  <Badge variant="outline" className="text-xs">
                                    {language === 'ar' ? 'غير متاح' : 'Unavailable'}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-primary">
                                  +{modifier.price || 0} ر.س
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => handleEditModifier(modifier)}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteModifier(modifier.id)}>
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          {language === 'ar' ? 'لا توجد إضافات في هذه المجموعة' : 'No modifiers in this group'}
                        </p>
                      )}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Group Form Dialog */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGroupId
                ? (language === 'ar' ? 'تعديل المجموعة' : 'Edit Group')
                : (language === 'ar' ? 'إضافة مجموعة جديدة' : 'Add New Group')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitGroup} className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'} *</Label>
              <Input
                value={groupFormData.name_ar}
                onChange={(e) => setGroupFormData({ ...groupFormData, name_ar: e.target.value })}
                placeholder="إضافات الجبن"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'} *</Label>
              <Input
                value={groupFormData.name_en}
                onChange={(e) => setGroupFormData({ ...groupFormData, name_en: e.target.value })}
                placeholder="Cheese Add-ons"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الحد الأدنى' : 'Min Selections'}</Label>
                <Input
                  type="number"
                  min="0"
                  value={groupFormData.min_selections}
                  onChange={(e) => setGroupFormData({ ...groupFormData, min_selections: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الحد الأقصى' : 'Max Selections'}</Label>
                <Input
                  type="number"
                  min="1"
                  value={groupFormData.max_selections}
                  onChange={(e) => setGroupFormData({ ...groupFormData, max_selections: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={groupFormData.is_required}
                  onCheckedChange={(checked) => setGroupFormData({ ...groupFormData, is_required: checked })}
                />
                <Label>{language === 'ar' ? 'مطلوب' : 'Required'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={groupFormData.is_multiple}
                  onCheckedChange={(checked) => setGroupFormData({ ...groupFormData, is_multiple: checked })}
                />
                <Label>{language === 'ar' ? 'متعدد الاختيارات' : 'Multiple'}</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGroupDialogOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" variant="pizza" disabled={createGroup.isPending || updateGroup.isPending}>
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modifier Form Dialog */}
      <Dialog open={modifierDialogOpen} onOpenChange={setModifierDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingModifierId
                ? (language === 'ar' ? 'تعديل الإضافة' : 'Edit Modifier')
                : (language === 'ar' ? 'إضافة جديدة' : 'Add New Modifier')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitModifier} className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'} *</Label>
              <Input
                value={modifierFormData.name_ar}
                onChange={(e) => setModifierFormData({ ...modifierFormData, name_ar: e.target.value })}
                placeholder="زيادة جبن"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'} *</Label>
              <Input
                value={modifierFormData.name_en}
                onChange={(e) => setModifierFormData({ ...modifierFormData, name_en: e.target.value })}
                placeholder="Extra Cheese"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'السعر (ر.س)' : 'Price (SAR)'}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={modifierFormData.price}
                onChange={(e) => setModifierFormData({ ...modifierFormData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={modifierFormData.is_available}
                onCheckedChange={(checked) => setModifierFormData({ ...modifierFormData, is_available: checked })}
              />
              <Label>{language === 'ar' ? 'متاح' : 'Available'}</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModifierDialogOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" variant="pizza" disabled={createModifier.isPending || updateModifier.isPending}>
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Group Confirmation */}
      <AlertDialog open={deleteGroupDialogOpen} onOpenChange={setDeleteGroupDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar'
                ? 'سيتم حذف هذه المجموعة وجميع الإضافات المرتبطة بها نهائياً.'
                : 'This will permanently delete this group and all its modifiers.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'ar' ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGroup} className="bg-destructive hover:bg-destructive/90">
              {language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Modifier Confirmation */}
      <AlertDialog open={deleteModifierDialogOpen} onOpenChange={setDeleteModifierDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar'
                ? 'سيتم حذف هذه الإضافة نهائياً.'
                : 'This will permanently delete this modifier.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'ar' ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteModifier} className="bg-destructive hover:bg-destructive/90">
              {language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminModifiers;
