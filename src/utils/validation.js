// Validation utilities for transaction forms
export const validateTransaction = (formData) => {
  const errors = {};

  // Title validation
  if (!formData.title) {
    errors.title = 'عنوان المعاملة مطلوب';
  } else if (formData.title.length < 3) {
    errors.title = 'العنوان يجب أن يكون 3 أحرف على الأقل';
  }

  // Description validation
  if (!formData.description) {
    errors.description = 'وصف المعاملة مطلوب';
  } else if (formData.description.length < 10) {
    errors.description = 'الوصف يجب أن يكون 10 أحرف على الأقل';
  }

  // Importance validation
  if (!formData.importance) {
    errors.importance = 'مستوى الأهمية مطلوب';
  }

  // File validation
  if (!formData.file) {
    errors.file = 'الملف مطلوب';
  } else {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'];
    if (!allowedTypes.includes(formData.file.type)) {
      errors.file = 'نوع الملف غير مدعوم. يرجى استخدام صور، PDF، أو مستندات Word';
    }
    if (formData.file.size > 10 * 1024 * 1024) { // 10MB limit
      errors.file = 'حجم الملف يجب أن يكون أقل من 10 ميجابايت';
    }
  }

  // Approval chain validation
  if (!formData.approvalChain?.length) {
    errors.approvalChain = 'يجب تحديد سلسلة الموافقات';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};