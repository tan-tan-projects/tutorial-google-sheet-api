import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPortfolioById } from "../../src/google/sheets";
import { json } from "../../src/utils/response";

export default async function handler(req: VercelRequest, res: VercelResponse)
{

    // GET /api/portfolio/:id
    if (req.method === 'GET')
    {
        try
        {

            const id = typeof req?.query?.id === 'string'
                ? req?.query?.id
                : undefined;

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
            console.error('Failed to get portfolios', error);

            return json(res, { success: false, error: 'Failed to get portfolios' }, 500);
        }
    }
}