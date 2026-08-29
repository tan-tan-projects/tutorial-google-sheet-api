import type { VercelRequest, VercelResponse } from "@vercel/node";
import { deletePortfolio, getPortfolioById, updatePortfolio } from "../../src/portfolio/portfolio.service.js";
import { validatePortfolioInput } from "../../src/portfolio/portfolio.validation.js";
import { json, jsonCached } from "../../src/utils/response.js";
import { handleCorsPreflight } from "../../src/utils/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse)
{
    const origin = req.headers.origin;

    if (req.method === 'OPTIONS') return handleCorsPreflight(res, origin);

    const id = typeof req?.query?.id === 'string'
        ? req?.query?.id
        : undefined;

    if (!id)
    {
        return json(res, { success: false, error: 'Portfolio ID is required' }, 400, origin);
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
                    return json(res, { success: false, error: 'Portfolio not found' }, 404, origin);
                }

                return jsonCached(res, { success: true, data: portfolio }, origin);
            }
        } catch (error)
        {
            console.error('Failed to get portfolio', error);

            return json(res, { success: false, error: 'Failed to get portfolio' }, 500, origin);
        }
    }

    // PUT /api/portfolio/:id
    if (req.method === 'PUT')
    {
        const validation = validatePortfolioInput(req.body);

        if (!validation.valid)
        {
            return json(res, { success: false, error: validation.error }, 400, origin);
        }

        try
        {
            const portfolio = await updatePortfolio(id, validation.data);

            if (!portfolio)
            {
                return json(res, { success: false, error: 'Portfolio not found' }, 404, origin);
            }

            return json(res, { success: true, data: portfolio }, 200, origin);
        }
        catch (error)
        {
            console.error('Failed to update portfolio', error);

            return json(res, { success: false, error: 'Failed to update portfolio', }, 500, origin);
        }
    }

    // DELETE /api/portfolio/:id
    if (req.method === 'DELETE')
    {
        try
        {
            const deleted = await deletePortfolio(id);

            if (!deleted)
            {
                return json(res, { success: false, error: 'Portfolio not found' }, 404, origin);
            }

            return json(res, { success: true, data: { id } }, 200, origin);
        }
        catch (error)
        {
            console.error('Failed to delete portfolio', error);

            return json(res, { success: false, error: 'Failed to delete portfolio' }, 500, origin);
        }
    }

    return json(res, { success: false, error: 'Method Not Allowed' }, 405, origin);
}