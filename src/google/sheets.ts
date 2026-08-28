import { google, type sheets_v4 } from 'googleapis';

function getSheetsClient(): sheets_v4.Sheets
{
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId)
    {
        throw new Error('Google environment variables are missing');
    }

    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
        email: clientEmail,
        key: formattedPrivateKey,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });

    return google.sheets({
        version: 'v4',
        auth,
    });
}

function getSpreadsheetId(): string
{
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId)
    {
        throw new Error('Google environment variables are missing');
    }

    return spreadsheetId;
}

export async function appendPortfolioRow(values: string[])
{
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:F',
        valueInputOption: 'RAW',
        requestBody: {
            values: [values],
        },
    });
}

export async function getPortfolioRows(): Promise<string[][]>
{
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:F',
    });

    return response.data.values ?? [];
}