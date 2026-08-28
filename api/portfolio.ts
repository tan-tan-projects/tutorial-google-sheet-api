import type { VercelRequest, VercelResponse } from '@vercel/node';
import { json } from '../src/utils/response.js';
import { validatePortfolioInput } from '../src/portfolio/portfolio.validation.js';
import { createPortfolio, getPortfolios } from '../src/portfolio/portfolio.service.js';

export default async function handler(req: VercelRequest, res: VercelResponse)
{
    // GET /api/portfolio
    if (req.method === 'GET')
    {
        try
        {
            const portfolios = await getPortfolios();

            return json(res, { success: true, data: portfolios });
        }
        catch (error)
        {
            console.error('Failed to get portfolios', error);

            return json(res, { success: false, error: 'Failed to get portfolios' }, 500);
        }
    }

    // POST /api/portfolio
    if (req.method === 'POST')
    {
        const validation = validatePortfolioInput(req.body);

        if (!validation.valid)
        {
            console.error('Portfolio validation failed:', validation.error);

            return json(res, { success: false, error: validation.error }, 400);
        }

        try
        {
            const portfolio = await createPortfolio(validation.data);

            return json(res, { success: true, data: portfolio }, 201);
        }
        catch (error)
        {
            console.error('Failed to save portfolio', error);

            return json(res, { success: false, error: 'Failed to save portfolio' }, 500);
        }
    }

    return json(res, { success: false, error: 'Method Not Allowed' }, 405);
}