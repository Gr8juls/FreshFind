import connectToDatabase from '@/lib/mongodb';
import Notification from '@/lib/models/Notification';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Initial connection message
  writer.write(
    encoder.encode(
      `data: ${JSON.stringify({ type: 'SYSTEM', message: 'Connected to notifications stream' })}\n\n`
    )
  );

  // Send real DB unread notifications if authenticated
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/auth_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        await connectToDatabase();

        const dbNotifications = await Notification.find({
          userId: payload.userId,
          isRead: false,
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        for (const notif of dbNotifications) {
          writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ type: notif.type, message: `${notif.title}: ${notif.body}` })}\n\n`
            )
          );
        }
      }
    }
  } catch (err) {
    console.error('SSE notification fetch error:', err);
  }

  // Periodic event stream
  const interval = setInterval(() => {
    const mockEvents = [
      { type: 'OFFER_ALERT', message: 'Kigali Artisan Bakery listed 4 fresh croissant boxes!' },
      { type: 'READY_FOR_PICKUP', message: 'Your order #FF-901 is ready for collection.' },
      { type: 'PROMOTION', message: 'Double Eco-Points active today across all partner cafes!' },
    ];
    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];

    writer
      .write(encoder.encode(`data: ${JSON.stringify(randomEvent)}\n\n`))
      .catch(() => {
        clearInterval(interval);
      });
  }, 20000);

  // Clean up on disconnect
  request.signal.addEventListener('abort', () => {
    clearInterval(interval);
    try {
      writer.close();
    } catch {}
  });

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
