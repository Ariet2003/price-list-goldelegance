import { NextResponse } from 'next/server';
import { Pool } from 'pg';

interface OrderData {
  name: string;
  phone: string;
  eventDate: string;
  comment: string;
  contactType: 'phone' | 'whatsapp';
  productName: string;
  productCategory?: string;
  productPrice?: number;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

async function getBotCredentials() {
  const client = await pool.connect();
  try {
    const tokenResult = await client.query(
      'SELECT value FROM settings WHERE key = $1',
      ['telegram_bot_token']
    );
    const adminIdResult = await client.query(
      'SELECT value FROM settings WHERE key = $1',
      ['telegram_admin_id']
    );

    if (!tokenResult.rows.length || !adminIdResult.rows.length) {
      throw new Error('Telegram credentials not found');
    }

    return {
      token: tokenResult.rows[0].value,
      adminId: adminIdResult.rows[0].value
    };
  } finally {
    client.release();
  }
}

function formatMessage(data: OrderData): string {
  const dateStr = data.eventDate 
    ? new Date(data.eventDate).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : 'Не указана';

  return `
🔔 *Новая заявка!*

👤 *Клиент:* ${data.name}
📞 *Телефон:* \`${data.phone}\`
📱 *Способ связи:* ${data.contactType === 'phone' ? '☎️ Звонок' : '💬 WhatsApp'}
📅 *Дата мероприятия:* ${dateStr}

🎯 *Услуга:* ${data.productName}
${data.productCategory ? `📂 *Категория:* ${data.productCategory}\n` : ''}${data.productPrice ? `💰 *Стоимость:* ${data.productPrice.toLocaleString()} сом\n` : ''}
${data.comment ? `\n💭 *Комментарий:*\n${data.comment}` : ''}
`.trim();
}

export async function POST(request: Request) {
  try {
    const data: OrderData = await request.json();
    const { token, adminId } = await getBotCredentials();

    const message = formatMessage(data);
    
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminId,
        text: message,
        parse_mode: 'Markdown'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send Telegram message');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending order:', error);
    return NextResponse.json(
      { error: 'Failed to send order' },
      { status: 500 }
    );
  }
} 