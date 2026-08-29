import { appendPortfolioRow, deletePortfolioRow, getPortfolioRows, updatePortfolioRow } from '../google/sheets.js';
import type { CreatePortfolioInput, Portfolio } from './portfolio.types.js';

function mapPortfolioRow(row: string[]): Portfolio
{
    return {
        id: row[0] ?? '',
        title: row[1] ?? '',
        description: row[2] ?? '',
        image: row[3] ?? '',
        url: row[4] ?? '',
        created_at: row[5] ?? '',
    };
}

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

    return rows.slice(1).map(mapPortfolioRow);
}

export async function getPortfolioById(id: string): Promise<Portfolio | null>
{
    const rows = await getPortfolioRows();

    const row = rows.slice(1).find(row => row[0] === id);

    if (!row) return null;

    return mapPortfolioRow(row);
}

export async function updatePortfolio(id: string, input: CreatePortfolioInput): Promise<Portfolio | null>
{
    const rows = await getPortfolioRows();

    const rowIndex = rows.slice(1).findIndex(row => row[0] === id);

    if (rowIndex === -1) return null;

    const rowNumber = rowIndex + 2;
    const existingRow = rows[rowIndex + 1];

    const createdAt = existingRow?.[5] ?? new Date().toISOString();

    const updatedPortfolio: Portfolio = {
        id,
        title: input.title,
        description: input.description,
        image: input.image,
        url: input.url,
        created_at: createdAt,
    };

    await updatePortfolioRow(rowNumber, [
        updatedPortfolio.id,
        updatedPortfolio.title,
        updatedPortfolio.description,
        updatedPortfolio.image,
        updatedPortfolio.url,
        updatedPortfolio.created_at,
    ]);

    return updatedPortfolio;
}

export async function deletePortfolio(id: string): Promise<boolean>
{
    const rows = await getPortfolioRows();

    const rowIndex = rows.slice(1).findIndex(row => row[0] === id);

    if (rowIndex === -1) return false;

    const rowNumber = rowIndex + 2;

    await deletePortfolioRow(rowNumber);

    return true;
}