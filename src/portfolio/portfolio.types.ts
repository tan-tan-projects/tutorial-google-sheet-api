export interface CreatePortfolioInput
{
    title: string;
    description: string;
    image: string;
    url: string;
}

export interface Portfolio
{
    id: string;
    title: string;
    description: string;
    image: string;
    url: string;
    created_at: string;
}

export interface CreatePortfolioResult
{
    id: string;
    created_at: string;
}