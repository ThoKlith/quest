import { getCurrentDayNumber, getScoreBar } from './game-logic';

/**
 * Generate shareable text in Wordle style
 */
export function generateShareText(
    dayNumber: number,
    score: number,
    guessValue: number,
    actualValue: number
): string {
    const difference = Math.abs(guessValue - actualValue);
    const scoreBar = getScoreBar(score);

    let accuracyEmoji = '';
    if (score === 100) accuracyEmoji = '🎯';
    else if (score >= 95) accuracyEmoji = '⭐⭐⭐';
    else if (score >= 85) accuracyEmoji = '⭐⭐';
    else if (score >= 70) accuracyEmoji = '⭐';

    return `Human Guess #${dayNumber} ${accuracyEmoji}
Score: ${score}/100

${scoreBar} (±${difference}%)

Play at: human-guess.vercel.app`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}
