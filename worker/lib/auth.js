const encoder = new TextEncoder();

function base64UrlDecode(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  return atob(base64);
}

function base64UrlToUint8Array(input) {
  const decoded = base64UrlDecode(input);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i += 1) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

function decodeJson(input) {
  try {
    const decoded = base64UrlDecode(input);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getBearerToken(request) {
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export async function verifyJwt(token, secret) {
  if (!token || !secret) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerPart, payloadPart, signaturePart] = parts;
  const header = decodeJson(headerPart);
  const payload = decodeJson(payloadPart);

  if (!header || !payload || header.alg !== 'HS256') return null;
  if (payload.exp && Date.now() / 1000 >= payload.exp) return null;

  const data = `${headerPart}.${payloadPart}`;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const signature = base64UrlToUint8Array(signaturePart);
  const valid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(data));

  return valid ? payload : null;
}

export async function requireAuth(request, env) {
  const token = getBearerToken(request);
  if (!token) {
    return { ok: false, status: 401, error: 'missing_token' };
  }

  const payload = await verifyJwt(token, env.SUPABASE_JWT_SECRET);
  if (!payload) {
    return { ok: false, status: 401, error: 'invalid_token' };
  }

  if (!payload.sub) {
    return { ok: false, status: 401, error: 'missing_subject' };
  }

  return { ok: true, token, userId: payload.sub, payload };
}
