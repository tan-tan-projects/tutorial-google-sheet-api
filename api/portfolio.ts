import type { VercelRequest, VercelResponse } from '@vercel/node';
import { json } from '../src/utils/response.js';
import { validatePortfolioInput } from '../src/portfolio/portfolio.validation.js';
import { createPortfolio } from '../src/portfolio/portfolio.service.js';

export default async function handler(req: VercelRequest, res: VercelResponse)
{
    // 1. Method validation
    if (req.method !== 'POST')
    {
        return json(res, { success: false, error: 'Method Not Allowed' }, 405);
    }

    // 2. Read JSON body
    let body: unknown;

    try
    {
        body = req.body;
    }
    catch
    {
        return json(res, { success: false, error: 'Invalid JSON body' }, 400);
    }

    // 3. Validate input
    const validation = validatePortfolioInput(body);

    if (!validation.valid)
    {
        console.warn('Portfolio validation failed:', validation.error);
        return json(res, { success: false, error: validation.error }, 400);
    }

    try
    {
        // 4. Create portfolio
        const portfolio = await createPortfolio(validation.data);

        // 5. Success response
        return json(res, { success: true, data: portfolio }, 201);
    }
    catch (error)
    {
        console.error('Failed to save portfolio', error);

        return json(res, { success: false, error: 'Failed to save portfolio' }, 500);
    }
}