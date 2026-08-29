import type { VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

export function setCorsHeaders(res: VercelResponse, origin?: string)
{
    if (origin && ALLOWED_ORIGINS.includes(origin))
    {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function handleCorsPreflight(res: VercelResponse, origin?: string)
{
    setCorsHeaders(res, origin);

    if ('status' in res && typeof res.status === 'function')
    {
        return res.status(204).end();
    }

    res.statusCode = 204;
    res.end();
}