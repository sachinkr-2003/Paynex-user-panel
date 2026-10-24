import Swal from 'sweetalert2';

/**
 * PAYNEX User Panel Cyber Themed SweetAlert2
 */
export const PaynexUserSwal = Swal.mixin({
  background: '#0a0d1f',
  color: '#f8fafc',
  customClass: {
    popup: 'cyber-swal-popup',
    title: 'cyber-swal-title',
    htmlContainer: 'cyber-swal-content',
    confirmButton: 'cyber-swal-confirm-btn',
    cancelButton: 'cyber-swal-cancel-btn',
    actions: 'cyber-swal-actions',
  },
  buttonsStyling: false,
  reverseButtons: true,
});

export const PaynexUserToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: '#0a0d1f',
  color: '#f8fafc',
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showUserSuccess = (title, text = '') => {
  return PaynexUserSwal.fire({
    icon: 'success',
    title: `<span style="font-size:19px; font-weight:800; color:#10b981;">${title}</span>`,
    html: `<span style="font-size:14px; color:#cbd5e1;">${text}</span>`,
    confirmButtonText: 'GREAT!',
    iconColor: '#10b981',
  });
};

export const showUserError = (title, text = '') => {
  return PaynexUserSwal.fire({
    icon: 'error',
    title: `<span style="font-size:19px; font-weight:800; color:#ef4444;">${title}</span>`,
    html: `<span style="font-size:14px; color:#cbd5e1;">${text}</span>`,
    confirmButtonText: 'OKAY',
    iconColor: '#ef4444',
  });
};

export const showUserWarning = (title, text = '') => {
  return PaynexUserSwal.fire({
    icon: 'warning',
    title: `<span style="font-size:19px; font-weight:800; color:#f59e0b;">${title}</span>`,
    html: `<span style="font-size:14px; color:#cbd5e1;">${text}</span>`,
    confirmButtonText: 'UNDERSTOOD',
    iconColor: '#f59e0b',
  });
};

export const showUserConfirm = async (title, text = '', confirmText = 'CONFIRM', cancelText = 'CANCEL') => {
  const result = await PaynexUserSwal.fire({
    icon: 'question',
    title: `<span style="font-size:19px; font-weight:800; color:#f8fafc;">${title}</span>`,
    html: `<span style="font-size:14px; color:#cbd5e1;">${text}</span>`,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    iconColor: '#f59e0b',
  });
  return result.isConfirmed;
};

export const showUserToast = (title, icon = 'success') => {
  PaynexUserToast.fire({
    icon,
    title: `<span style="font-size:13.5px; font-weight:600; color:#f8fafc;">${title}</span>`,
  });
};

export default PaynexUserSwal;
