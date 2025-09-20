import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Store active SSE connections
const clients = new Set<ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Create a custom readable stream
  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Add this controller to active clients
      clients.add(controller);

      // Set up real-time subscription to conversions table
      const subscription = supabase
        .channel('conversions-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'conversions' },
          (payload) => {
            // Send conversion event to this client
            const data = `data: ${JSON.stringify({
              type: 'conversion',
              data: payload.new,
              timestamp: new Date().toISOString()
            })}\n\n`;

            try {
              controller.enqueue(encoder.encode(data));
            } catch (error) {
              console.error('Failed to send SSE:', error);
            }
          }
        )
        .subscribe();

      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        const ping = `data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`;
        try {
          controller.enqueue(encoder.encode(ping));
        } catch (error) {
          clearInterval(heartbeat);
          clients.delete(controller);
        }
      }, 30000);

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        clients.delete(controller);
        subscription.unsubscribe();
      });
    }
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Broadcast function to send events to all connected clients
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Broadcast to all connected clients
    const encoder = new TextEncoder();
    const message = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;

    clients.forEach(controller => {
      try {
        controller.enqueue(encoder.encode(message));
      } catch (error) {
        // Remove dead connections
        clients.delete(controller);
      }
    });

    return NextResponse.json({ success: true, clients: clients.size });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to broadcast' }, { status: 500 });
  }
}