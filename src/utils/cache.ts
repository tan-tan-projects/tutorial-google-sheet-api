import type { Response } from '../types/vercel';

export const CACHE_CONTROL = process.env?.CACHE_CONTROL ?? 'no-store';
export function setCacheHeader(res: Response, value: string)
{
    res.setHeader('Cache-Control', value);
}

export function setPublicCache(res: Response)
{
    setCacheHeader(res, CACHE_CONTROL);
}

export function setNoStore(res: Response)
{
    setCacheHeader(res, 'no-store');
}