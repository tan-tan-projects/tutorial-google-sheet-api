import { json } from '../src/utils/response';
import { validatePortfolioInput } from '../src/portfolio/portfolio.validation';
import { createPortfolio } from '../src/portfolio/portfolio.service';

export default async function handler(req: Request)
{
    // 1. Method validation
    if (req.method !== 'POST')
    {
        return json({ success: false, error: 'Method Not Allowed' }, 405);
    }

    // 2. Read JSON body
    let body: unknown;

    try
    {
        body = await req.json();
    }
    catch
    {
        return json({ success: false, error: 'Invalid JSON body' }, 400);
    }

    // 3. Validate input
    const validation = validatePortfolioInput(body);

    if (!validation.valid)
    {
        console.warn('Portfolio validation failed:', validation.error);
        return json({ success: false, error: validation.error }, 400);
    }

    try
    {
        // 4. Create portfolio
        const portfolio = await createPortfolio(validation.data);

        // 5. Success response
        return json({ success: true, data: portfolio }, 201);
    }
    catch (error)
    {
        console.error('Failed to save portfolio', error);

        return json({ success: false, error: 'Failed to save portfolio' }, 500);
    }
}