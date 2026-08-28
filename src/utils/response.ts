import type { VercelResponse } from '@vercel/node';

export function json(res: VercelResponse, data: unknown, status = 200)
{
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(data));
}