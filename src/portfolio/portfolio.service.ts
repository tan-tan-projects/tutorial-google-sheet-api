import { appendPortfolioRow } from '../google/sheets';
import type { CreatePortfolioInput } from './portfolio.types';

export async function createPortfolio(
    input: CreatePortfolioInput,
)
{
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await appendPortfolioRow([
        id,
        input.title,
        input.description,
        input.image,
        input.url,
        createdAt,
    ]);

    return {
        id,
        created_at: createdAt,
    };
}