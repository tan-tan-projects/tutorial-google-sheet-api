import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPortfolioById, updatePortfolio } from "../../src/portfolio/portfolio.service.js";
import { validatePortfolioInput } from "../../src/portfolio/portfolio.validation.js";
import { json } from "../../src/utils/response.js";

export default async function handler(req: VercelRequest, res: VercelResponse)
{

    const id = typeof req?.query?.id === 'string'
        ? req?.query?.id
        : undefined;

    if (!id)
    {
        return json(res, { success: false, error: 'Portfolio ID is required' }, 400);
    }

    // GET /api/portfolio/:id
    if (req.method === 'GET')
    {
        try
        {
            if (id)
            {
                const portfolio = await getPortfolioById(id);

                if (!portfolio)
                {
                    return json(res, { success: false, error: 'Portfolio not found' }, 404);
                }

                return json(res, { success: true, data: portfolio });
            }
        } catch (error)
        {
            console.error('Failed to get portfolio', error);

            return json(res, { success: false, error: 'Failed to get portfolio' }, 500);
        }
    }

    // PUT /api/portfolio/:id
    if (req.method === 'PUT')
    {
        const validation = validatePortfolioInput(req.body);

        if (!validation.valid)
        {
            return json(res, { success: false, error: validation.error }, 400);
        }

        try
        {
            const portfolio = await updatePortfolio(id, validation.data);

            if (!portfolio)
            {
                return json(res, { success: false, error: 'Portfolio not found' }, 404);
            }

            return json(res, { success: true, data: portfolio });
        }
        catch (error)
        {
            console.error('Failed to update portfolio', error);

            return json(res, { success: false, error: 'Failed to update portfolio', }, 500);
        }
    }

    return json(res, { success: false, error: 'Method Not Allowed' }, 405);
}