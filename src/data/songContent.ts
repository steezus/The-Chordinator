import { SAMPLE_SONG } from '../sampleSong';

/**
 * Full ChordPro content for songs that have been transcribed.
 * Add more entries as you transcribe; for chord shapes (piano/guitar/ukulele) see e.g. pianochord.org.
 */
export const SONG_CONTENT: Record<string, string> = {
  'so-easy': SAMPLE_SONG,
  'amazing-grace': `
{title: Amazing Grace}

[G]Amazing grace, how [C]sweet the [G]sound
That [D]saved a [G]wretch like [C]me.
I [G]once was [D]lost, but [G]now am [C]found,
Was [G]blind, but [D]now I [G]see.
`.trim(),
  'let-it-be': `
{title: Let It Be — The Beatles}

[C]When I find myself in [G]times of trouble
[Am]Mother Mary [F]comes to [C]me
[C]Speaking words of [G]wisdom, [Am]let it [F]be
`.trim(),
  'stand-by-me': `
{title: Stand By Me — Ben E. King}

[G]When the night has [Em]come
And the [C]land is [D]dark
And the [G]moon is the only [Em]light we'll [C]see
[G]No I won't be a[Em]fraid, no I [C]won't be a[D]fraid
Just as [G]long as you [Em]stand, [C]stand by [D]me
`.trim(),
  'blinding-lights': `
{title: Blinding Lights — The Weeknd}

[F]I've been tryna [Dm]call
I've been on my [Bb]own for long e[C]nough
[F]Maybe you can [Dm]show me how to [Bb]love, maybe [C]
[F]I'm going through a [Dm]down phase
`.trim(),
  default: `
{title: Song}

[C]Lyrics and [G]chords will [Am]appear [F]here.
Transcribe this song in ChordPro format to add full chords.
`.trim(),
};
