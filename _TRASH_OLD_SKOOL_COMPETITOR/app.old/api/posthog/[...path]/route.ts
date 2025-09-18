// PostHog reverse proxy to bypass ad blockers
// This routes PostHog events through your own domain

export async function POST(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
  
  const url = `${posthogHost}/${path}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: await request.text(),
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
  
  const url = `${posthogHost}/${path}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}