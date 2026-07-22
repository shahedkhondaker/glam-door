
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
  const itemsList = (order.items || [])
    .map((item) => `- ${item.name || item.title || 'Item'} x${item.quantity || 1}`)
    .join('\n')

  return `🧾 *Order Confirmation*

Hello ${order.customer_name || order.customer || 'Customer'}!

Your order has been confirmed:

${itemsList}

Total: AED ${order.total_price || order.amount || '—'}

Thank you for choosing GlamDoor!`;
}
