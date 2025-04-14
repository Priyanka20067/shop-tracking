// checked-1
export const sendSMS = (phone, message) => {
  // For demo: Show alert and log to console
  alert(`SMS to ${phone}: ${message}`);
  console.log(`SMS to ${phone}: ${message}`);
  // In production, shopkeepers can copy-paste to SMS app
};

export const sendWhatsApp = (phone, message) => {
  if (!phone) return;
  // Click-to-chat: Free, opens WhatsApp with pre-filled message
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};