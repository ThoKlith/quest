export const MAX_POINTS = 1000;
export const ERROR_PENALTY = 100;
export const UNLOCK_PENALTY = 50;
export const LETTER_UNLOCK_PENALTY = 100;
export const MIN_POINTS = 10;

export const AUDIO_STEPS = [0.5, 1, 2, 4, 10];

export function calculatePoints(errors: number, unlocks: number): number {
    const penalty = (errors * ERROR_PENALTY) + (unlocks * UNLOCK_PENALTY);
    return Math.max(MIN_POINTS, MAX_POINTS - penalty);
}

export function getAudioDuration(step: number): number {
    return AUDIO_STEPS[Math.min(step, AUDIO_STEPS.length - 1)];
}

export function formatScoreSummary(day: number, points: number, attempts: number): string {
    const emoji = points > 800 ? '🔊🟩' : points > 500 ? '🔊🟨' : '🔊🟥';
    return `Soundle #${day} - Punti: ${points}/1000 - Tentativi: ${attempts} - ${emoji}`;
}
