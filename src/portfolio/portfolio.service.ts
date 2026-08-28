import { appendPortfolioRow, getPortfolioRows } from '../google/sheets.js';
import type { CreatePortfolioInput, Portfolio } from './portfolio.types.js';

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

export async function getPortfolios(): Promise<Portfolio[]>
{
    const rows = await getPortfolioRows();

    return rows.slice(1).map((row): Portfolio => ({
        id: row[0] ?? '',
        title: row[1] ?? '',
        description: row[2] ?? '',
        image: row[3] ?? '',
        url: row[4] ?? '',
        created_at: row[5] ?? '',
    }));
}