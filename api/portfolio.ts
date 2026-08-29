import type { VercelRequest, VercelResponse } from '@vercel/node';
import { json, jsonCached } from '../src/utils/response.js';
import { validatePortfolioInput } from '../src/portfolio/portfolio.validation.js';
import { createPortfolio, getPortfolios } from '../src/portfolio/portfolio.service.js';
import { handleCorsPreflight } from '../src/utils/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse)
{
    const origin = req.headers.origin;

    if (req.method === 'OPTIONS') return handleCorsPreflight(res, origin);

    // GET /api/portfolio
    if (req.method === 'GET')
    {
        try
        {
            const portfolios = await getPortfolios();

            return jsonCached(res, { success: true, data: portfolios }, origin);
        }
        catch (error)
        {
            console.error('Failed to get portfolios', error);

            return json(res, { success: false, error: 'Failed to get portfolios' }, 500, origin);
        }
    }

    // POST /api/portfolio
    if (req.method === 'POST')
    {
        const validation = validatePortfolioInput(req.body);

        if (!validation.valid)
        {
            console.error('Portfolio validation failed:', validation.error);

            return json(res, { success: false, error: validation.error }, 400, origin);
        }

        try
        {
            const portfolio = await createPortfolio(validation.data);

            return json(res, { success: true, data: portfolio }, 201, origin);
        }
        catch (error)
        {
            console.error('Failed to save portfolio', error);

            return json(res, { success: false, error: 'Failed to save portfolio' }, 500, origin);
        }
    }

    return json(res, { success: false, error: 'Method Not Allowed' }, 405, origin);
}