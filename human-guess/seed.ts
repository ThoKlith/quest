import { supabase } from './src/lib/supabase';

async function seed() {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('sounds')
        .upsert({
            day_date: today,
            audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            correct_answer: 'musica',
            dictionary: ['musica', 'canzone', 'pianoforte', 'chitarra', 'batteria', 'tromba', 'violino', 'flauto', 'canto', 'ritmo', 'jazz', 'rock', 'pop', 'classica', 'opera', 'concerto', 'strumento', 'melodia', 'armonia', 'nota']
        }, { onConflict: 'day_date' });

    if (error) console.error('Error seeding:', error);
    else console.log('Seeded successfully!');
}

seed();
