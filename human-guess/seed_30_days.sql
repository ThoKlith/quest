-- Seed 30 days of sounds for Soundle game
-- Starting from 2026-01-04 (basketball is already there)

INSERT INTO sounds (day_date, audio_url, correct_answer, dictionary) VALUES
-- Day 1-3 already exist
('2026-01-04', 'https://assets.mixkit.co/active_storage/sfx/2096/2096-preview.mp3', 'basketball', ARRAY['basketball', 'court', 'dribble', 'hoop', 'net', 'referee', 'foul', 'timeout']),
('2026-01-05', 'https://actions.google.com/sounds/v1/transportation/subway_train_passing.ogg', 'metro', ARRAY['treno', 'binari', 'stazione', 'viaggio', 'biglietto', 'fermata', 'vagone', 'rotaie']),
('2026-01-06', 'https://actions.google.com/sounds/v1/water/air_woosh_underwater.ogg', 'sub', ARRAY['acqua', 'mare', 'profondo', 'bolle', 'respiro', 'oceano', 'blu', 'pesci']),

-- Day 4 onwards (new sounds)
('2026-01-07', 'https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg', 'pioggia', ARRAY['acqua', 'cielo', 'nuvole', 'gocce', 'ombrello', 'temporale', 'bagnato', 'tempo']),
('2026-01-08', 'https://actions.google.com/sounds/v1/nature/waves_crashing_on_rock_beach.ogg', 'mare', ARRAY['acqua', 'spiaggia', 'onde', 'costa', 'sabbia', 'oceano', 'estate', 'vacanza']),
('2026-01-09', 'https://actions.google.com/sounds/v1/weather/strong_wind_blowing.ogg', 'vento', ARRAY['aria', 'soffio', 'tempesta', 'brezza', 'folata', 'cielo', 'forte', 'freddo']),
('2026-01-10', 'https://actions.google.com/sounds/v1/foley/swoosh.ogg', 'freccia', ARRAY['arco', 'volo', 'veloce', 'punta', 'bersaglio', 'tiro', 'rapida', 'aria']),
('2026-01-11', 'https://actions.google.com/sounds/v1/emergency/ambulance_siren.ogg', 'ambulanza', ARRAY['sirena', 'emergenza', 'ospedale', 'urgenza', 'medico', 'soccorso', 'rosso', 'veloce']),
('2026-01-12', 'https://actions.google.com/sounds/v1/animals/cat_purr.ogg', 'gatto', ARRAY['miao', 'fusa', 'animale', 'pelo', 'zampe', 'cucciolo', 'casa', 'morbido']),
('2026-01-13', 'https://actions.google.com/sounds/v1/animals/dog_bark.ogg', 'cane', ARRAY['bau', 'abbaia', 'animale', 'amico', 'cucciolo', 'zampe', 'fedele', 'casa']),
('2026-01-14', 'https://actions.google.com/sounds/v1/animals/bird_chirping.ogg', 'uccello', ARRAY['cip', 'canto', 'ali', 'volo', 'albero', 'nido', 'piume', 'cielo']),
('2026-01-15', 'https://actions.google.com/sounds/v1/transportation/car_driving_highway.ogg', 'auto', ARRAY['macchina', 'strada', 'motore', 'viaggio', 'ruote', 'veloce', 'guida', 'benzina']),
('2026-01-16', 'https://actions.google.com/sounds/v1/transportation/helicopter_out.ogg', 'elicottero', ARRAY['volo', 'rotore', 'cielo', 'pale', 'rumore', 'alto', 'aria', 'veloce']),
('2026-01-17', 'https://actions.google.com/sounds/v1/foley/door_creak.ogg', 'porta', ARRAY['legno', 'casa', 'apri', 'chiudi', 'cigola', 'entrata', 'stanza', 'maniglia']),
('2026-01-18', 'https://actions.google.com/sounds/v1/foley/glass_break.ogg', 'vetro', ARRAY['bicchiere', 'rompe', 'fragile', 'pezzi', 'finestra', 'trasparente', 'cocci', 'attento']),
('2026-01-19', 'https://actions.google.com/sounds/v1/foley/bell_ding.ogg', 'campana', ARRAY['suono', 'ding', 'chiesa', 'torre', 'bronzo', 'rintocco', 'ora', 'festa']),
('2026-01-20', 'https://actions.google.com/sounds/v1/foley/typewriter_keystroke.ogg', 'tastiera', ARRAY['computer', 'tasti', 'scrivere', 'click', 'lavoro', 'digitare', 'ufficio', 'lettere']),
('2026-01-21', 'https://actions.google.com/sounds/v1/foley/paper_crumple.ogg', 'carta', ARRAY['foglio', 'scrivi', 'strappa', 'libro', 'pagina', 'stropiccia', 'bianco', 'rumore']),
('2026-01-22', 'https://actions.google.com/sounds/v1/household/clock_ticking.ogg', 'orologio', ARRAY['tempo', 'tic', 'tac', 'ore', 'minuti', 'secondi', 'muro', 'sveglia']),
('2026-01-23', 'https://actions.google.com/sounds/v1/household/light_switch_click.ogg', 'interruttore', ARRAY['luce', 'click', 'accendi', 'spegni', 'muro', 'stanza', 'buio', 'elettrico']),
('2026-01-24', 'https://actions.google.com/sounds/v1/tools/drill.ogg', 'trapano', ARRAY['forare', 'buco', 'attrezzo', 'muro', 'rumore', 'lavoro', 'costruire', 'elettrico']),
('2026-01-25', 'https://actions.google.com/sounds/v1/tools/saw.ogg', 'sega', ARRAY['legno', 'tagliare', 'attrezzo', 'lavoro', 'lama', 'rumore', 'costruire', 'denti']),
('2026-01-26', 'https://actions.google.com/sounds/v1/weapons/sword_draw.ogg', 'spada', ARRAY['lama', 'metallo', 'arma', 'affilata', 'acciaio', 'cavaliere', 'duello', 'guerra']),
('2026-01-27', 'https://actions.google.com/sounds/v1/foley/footsteps_wood.ogg', 'passi', ARRAY['camminare', 'scarpe', 'piedi', 'pavimento', 'rumore', 'legno', 'andare', 'movimento']),
('2026-01-28', 'https://actions.google.com/sounds/v1/impacts/bottle_hits_floor.ogg', 'bottiglia', ARRAY['vetro', 'acqua', 'vino', 'birra', 'tappo', 'bere', 'liquido', 'cade']),
('2026-01-29', 'https://actions.google.com/sounds/v1/household/washing_machine.ogg', 'lavatrice', ARRAY['lavare', 'panni', 'acqua', 'centrifuga', 'casa', 'pulito', 'elettrico', 'sapone']),
('2026-01-30', 'https://actions.google.com/sounds/v1/household/vacuum_short.ogg', 'aspirapolvere', ARRAY['pulire', 'polvere', 'casa', 'rumore', 'pavimento', 'elettrico', 'tubo', 'sporco']),
('2026-01-31', 'https://actions.google.com/sounds/v1/foley/phone_vibrate.ogg', 'telefono', ARRAY['cellulare', 'vibrazione', 'chiamata', 'messaggio', 'squilla', 'smartphone', 'tasca', 'suono']),
('2026-02-01', 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm.ogg', 'sveglia', ARRAY['mattina', 'ora', 'allarme', 'suono', 'sonno', 'orologio', 'beep', 'alzarsi']),
('2026-02-02', 'https://actions.google.com/sounds/v1/foley/coins_drop_table.ogg', 'monete', ARRAY['soldi', 'euro', 'cent', 'metallo', 'clink', 'denaro', 'tasca', 'spiccioli']),
('2026-02-03', 'https://actions.google.com/sounds/v1/foley/camera_click.ogg', 'fotocamera', ARRAY['foto', 'click', 'scatto', 'immagine', 'ricordo', 'obiettivo', 'flash', 'digitale'])

ON CONFLICT (day_date) DO NOTHING;
