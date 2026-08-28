import portfolioHandler from '../api/portfolio';

const server = Bun.serve({
    port: 3000,

    async fetch(req)
    {
        const url = new URL(req.url);

        if (url.pathname === '/api/portfolio')
        {
            return portfolioHandler(req);
        }

        return new Response(
            JSON.stringify({
                message: 'Bun API is running',
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    },
});

console.log(`Server running at ${server.url}`);