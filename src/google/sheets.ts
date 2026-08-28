import { google } from 'googleapis';

export async function appendPortfolioRow(values: string[])
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

    const sheets = google.sheets({
        version: 'v4',
        auth,
    });

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:F',
        valueInputOption: 'RAW',
        requestBody: {
            values: [values],
        },
    });
}