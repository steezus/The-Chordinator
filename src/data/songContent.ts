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
  'we-belong-together': `
{title: We Belong Together — Mariah Carey}

# Verse 1
[Gm]I didn't mean it when I [Eb]said I didn't [Cm]love you so
[F]I should have held on [Bb]tight, I never [Eb]let you go

# Chorus
[Gm]We belong to[Eb]gether
[Cm]I can't [F]sleep at [Bb]night when you're on my [Eb]mind
[Gm]We belong to[Eb]gether
[Cm]And it's [F]just a [Bb]matter of [Eb]time
`.trim(),
  'hollaback-girl': `
{title: Hollaback Girl — Gwen Stefani}

# Verse 1
[C]I ain't no [G]hollaback [Am]girl
[C]I ain't no [G]hollaback [Am]girl

# Chorus
[C]This my [G]shit, this my [Am]shit
[F]So many [G]times I've been [C]here
[C]This my [G]shit, this my [Am]shit
[F]So many [G]times I've been [C]here
`.trim(),
  'since-u-been-gone': `
{title: Since U Been Gone — Kelly Clarkson}

# Verse 1
[Em]Here's the [C]thing, we started [G]out as friends
[Em]It was cool, but it was [C]all pretend
[G]Yeah, yeah

# Chorus
[G]Since you been [Em]gone
[C]I can breathe for the [G]first time
[G]Since you been [Em]gone
[C]I'm so moving [G]on
`.trim(),
  'gold-digger': `
{title: Gold Digger — Kanye West}

# Verse 1
[F]She take my [C]money when I'm in [Am]need
[F]Yeah she's a [C]trifling friend in[Am]deed
[G]Oh she's a [C]gold digger

# Chorus
[F]Now I ain't sayin' she's a [C]gold digger
[Am]But she ain't messin' with no [G]broke niggas
[F]Now I ain't sayin' she's a [C]gold digger
[Am]But she ain't messin' with no [G]broke niggas
`.trim(),
  'boulevard-of-broken-dreams': `
{title: Boulevard of Broken Dreams — Green Day}

# Verse 1
[Em]I walk a [G]lonely road
[C]The only one that I have [D]ever known
[Em]Don't know where it [G]goes
[C]But it's home to me and I [D]walk alone

# Chorus
[Em]I walk a [G]lonely road
[C]Boulevard of broken [D]dreams
[Em]Where the city [G]sleeps
[C]And I'm the only one and I [D]walk alone
`.trim(),
  default: `
{title: Song}

[C]Lyrics and [G]chords will [Am]appear [F]here.
Transcribe this song in ChordPro format to add full chords.
`.trim(),
};
