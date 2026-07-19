
export function generateWhatsAppLink(phone, message) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildBookingConfirmationMessage(booking) {
  return `🌟 *GlamDoor Booking Confirmation*

Hello ${booking.customer_name}!

Your appointment is confirmed:

📍 ${booking.salon_name || ''}
💅 ${booking.service_name || ''}
📅 ${booking.booking_date} at ${booking.booking_time}
${booking.professional_name ? `👤 ${booking.professional_name}\n` : ''}💰 Total: AED ${booking.total_price || booking.final_price || '—'}

${booking.is_home_service ? `🏠 Home Service\nAddress: ${booking.service_address || 'TBD'}\n` : ''}
Thank you for choosing GlamDoor!
Where Beauty Meets Trust ✨`;
}

export function buildReminderMessage(booking) {
  return `⏰ *GlamDoor Appointment Reminder*

Hello ${booking.customer_name}!

This is a reminder for your upcoming appointment:

📍 ${booking.salon_name || ''}
💅 ${booking.service_name || ''}
📅 ${booking.booking_date} at ${booking.booking_time}

See you soon! ✨`;
}

export function buildOrderConfirmationMessage(order) {
  const itemsList = (order.items || []).map(item => 
    `• ${item.name || item.product_name} x${item.quantity || 1} - AED ${item.price || item.total_price || '—'}`
  ).join('\n');

  return `🛍️ *GlamDoor Order Confirmation*

Hello ${order.customer_name || 'Customer'}!

Your order has been confirmed:

📦 Order #${order.id || '—'}
${itemsList}
💰 Total: AED ${order.total_price || order.final_price || '—'}
📍 Delivery: ${order.delivery_address || 'Store pickup'}

Thank you for shopping with GlamDoor!
Where Beauty Meets Trust ✨`;
}