// Game logic utilities

/**
 * Calculate the current day number based on UTC time
 * Day 0 = January 1, 2024 (epoch start)
 */
export function getCurrentDayNumber(): number {
    const epoch = new Date('2024-01-01T00:00:00Z');
    const now = new Date();
    const diffTime = now.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Calculate score based on guess accuracy
 * Perfect guess = 100 points
 * Each percentage point off = -1 point
 */
export function calculateScore(guess: number, actual: number): number {
    const difference = Math.abs(guess - actual);
    return Math.max(0, 100 - difference);
}

/**
 * Get or create a guest ID from localStorage
 */
export function getGuestId(): string {
    if (typeof window === 'undefined') return '';

    const storageKey = 'human-guess-guest-id';
    let guestId = localStorage.getItem(storageKey);

    if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(storageKey, guestId);
    }

    return guestId;
}

/**
 * Get accuracy rating based on score
 */
export function getAccuracyRating(score: number): {
    emoji: string;
    text: string;
    color: string;
} {
    if (score === 100) {
        return { emoji: '🎯', text: 'Perfect!', color: 'text-purple-400' };
    } else if (score >= 95) {
        return { emoji: '⭐', text: 'Incredible!', color: 'text-yellow-400' };
    } else if (score >= 85) {
        return { emoji: '🔥', text: 'Amazing!', color: 'text-orange-400' };
    } else if (score >= 70) {
        return { emoji: '👍', text: 'Great!', color: 'text-green-400' };
    } else if (score >= 50) {
        return { emoji: '👌', text: 'Good!', color: 'text-blue-400' };
    } else {
        return { emoji: '💭', text: 'Nice try!', color: 'text-gray-400' };
    }
}

/**
 * Format a visual bar for sharing
 */
export function getScoreBar(score: number): string {
    const filled = Math.floor(score / 20);
    const empty = 5 - filled;
    return '🟩'.repeat(filled) + '⬜'.repeat(empty);
}
