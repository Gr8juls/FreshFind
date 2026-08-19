export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  // Create a TransformStream to send data to the client
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Send an initial connected message
  writer.write(
    encoder.encode(
      `data: ${JSON.stringify({ type: 'SYSTEM', message: 'Connected to notifications' })}\n\n`
    )
  );

  // Simulate a real-time event pushing after a few seconds
  const interval = setInterval(() => {
    const mockEvents = [
      { type: 'OFFER_ALERT', message: 'A bakery near you just listed 5 croissants!' },
      { type: 'READY_FOR_PICKUP', message: 'Your order #FF-992 is ready for pickup.' },
      { type: 'PROMOTION', message: 'Earn double Eco Points today!' }
    ];
    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];

    writer.write(
      encoder.encode(
        `data: ${JSON.stringify(randomEvent)}\n\n`
      )
    ).catch(() => {
      clearInterval(interval);
    });
  }, 15000); // Send a random notification every 15 seconds

  // Handle client disconnect
  request.signal.addEventListener('abort', () => {
    clearInterval(interval);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
