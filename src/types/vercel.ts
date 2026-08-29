import type { IncomingMessage, ServerResponse } from 'node:http';

export type VercelRequest = IncomingMessage & {
    body?: unknown;
};

export type VercelResponse = ServerResponse & {
    status: (code: number) => VercelResponse;
    json: (data: unknown) => void;
};

export type Response = VercelResponse | ServerResponse;

export type JsonOptions = {
    origin?: string;
    cacheControl?: string;
};