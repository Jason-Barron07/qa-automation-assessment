/**
 * Converts displayed dollar amounts into integer cents.
 * @param text Visible price or total label.
 * @returns The amount in cents.
 */
export function moneyToCents(text: string): number
{
    const match = /\$(\d+)\.(\d{2})\s*$/.exec(text.trim());
    if (!match)
    {
        throw new Error(`Invalid money format: ${text}`);
    }
    return Number(match[1]) * 100 + Number(match[2]);
}
