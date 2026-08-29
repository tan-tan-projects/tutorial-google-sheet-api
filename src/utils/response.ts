import type { VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './cors.js';
import { setNoStore, setPublicCache } from './cache.js';

export function json(res: VercelResponse, data: unknown, status = 200, origin?: string)
{
    setCorsHeaders(res, origin);
    setNoStore(res)

    if ('status' in res && typeof res.status === 'function')
    {
        return res.status(status).json(data);
    }

    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

export function jsonCached(res: VercelResponse, data: unknown, origin?: string)
{
    setCorsHeaders(res, origin);
    setPublicCache(res)

    if ('status' in res && typeof res.status === 'function')
    {
        return res.status(200).json(data);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}