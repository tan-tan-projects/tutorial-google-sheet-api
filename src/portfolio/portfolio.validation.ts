import type { CreatePortfolioInput } from './portfolio.types.js';

export function validatePortfolioInput(body: unknown):
    | { valid: true; data: CreatePortfolioInput }
    | { valid: false; error: string }
{
    if (
        typeof body !== 'object' ||
        body === null ||
        !('title' in body) ||
        !('description' in body) ||
        !('image' in body) ||
        !('url' in body)
    )
    {
        return {
            valid: false,
            error: 'Invalid request body',
        };
    }

    const { title, description, image, url } = body;

    if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof image !== 'string' ||
        typeof url !== 'string'
    )
    {
        return {
            valid: false,
            error: 'Invalid field type',
        };
    }

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedImage = image.trim();
    const normalizedUrl = url.trim();

    if (
        !normalizedTitle ||
        !normalizedDescription ||
        !normalizedImage ||
        !normalizedUrl
    )
    {
        return {
            valid: false,
            error: 'All fields are required',
        };
    }

    try
    {
        new URL(normalizedImage);
        new URL(normalizedUrl);
    }
    catch
    {
        return {
            valid: false,
            error: 'Invalid URL',
        };
    }

    return {
        valid: true,
        data: {
            title: normalizedTitle,
            description: normalizedDescription,
            image: normalizedImage,
            url: normalizedUrl,
        },
    };
}