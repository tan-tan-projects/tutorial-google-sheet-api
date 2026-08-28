import { createServer } from 'node:http';
import portfolioHandler from '../api/portfolio.js';

const server = createServer(async (req, res) =>
{
    let body: unknown = undefined;

    if (req.method === 'POST')
    {
        const chunks: Buffer[] = [];

        for await (const chunk of req) chunks.push(Buffer.from(chunk));

        const rawBody = Buffer.concat(chunks).toString('utf-8');

        try
        {
            body = JSON.parse(rawBody);
        }
        catch
        {
            body = undefined;
        }
    }

    (req as any).body = body;

    await portfolioHandler(req as any, res as any);
});

server.listen(3000, () =>
{
    console.log('Server running at http://localhost:3000/');
});