
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
    .map(item => `${item.quantity}x ${item.name} - AED ${item.price}`)
    .join('\n');
  
  return `🛍️ *GlamDoor Order Confirmation*

Hello ${order.customer_name || 'Valued Customer'}!

Your order has been confirmed:

📦 Order #${order.id || order.order_number || 'N/A'}
📅 ${new Date().toLocaleDateString()}

Items:
${itemsList}

💰 Total: AED ${order.total || '—'}

Thank you for shopping at GlamShop! ✨`;
}

export async function sendBookingNotifications(booking) {
  // This function would send notifications via WhatsApp or other channels
  // For now, it returns the generated message
  const message = buildBookingConfirmationMessage(booking);
  
  // In a real implementation, this would send the message via an API
  // For example: await sendWhatsAppMessage(booking.customer_phone, message);
  
  return {
    success: true,
    message: message,
    whatsappLink: generateWhatsAppLink(booking.customer_phone || '', message)
  };
}

export async function sendOrderNotifications(order) {
  // This function would send order notifications via WhatsApp or other channels
  // For now, it returns the generated message
  const message = buildOrderConfirmationMessage(order);
  
  // In a real implementation, this would send the message via an API
  // For example: await sendWhatsAppMessage(order.customer_phone, message);
  
  return {
    success: true,
    message: message,
    whatsappLink: generateWhatsAppLink(order.customer_phone || '', message)
  };
}