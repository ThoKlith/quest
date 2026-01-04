import { supabase } from './src/lib/supabase';

async function seed() {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('sounds').upsert([
        {
            day_date: today,
            audio_url: 'https://assets.mixkit.co/active_storage/sfx/2096/2096-preview.mp3', // Realistic basketball dribble
            correct_answer: 'basketball',
            dictionary: ['basketball', 'court', 'dribble', 'hoop', 'net', 'referee', 'foul', 'timeout']
        }
    ], { onConflict: 'day_date' });

    if (error) console.error('Error seeding:', error);
    else console.log('Seeded successfully!');
}

seed();
