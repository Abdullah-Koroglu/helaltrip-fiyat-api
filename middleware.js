// middleware.js
export function middleware(req) {
  const res = new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

  if (req.method === 'OPTIONS') {
    return res;
  }

  return Response.next();
}

export const config = {
  matcher: '/api/:path*', // sadece API route'larını kapsar
};
