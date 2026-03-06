import { SAMPLE_SONG } from '../sampleSong';

/**
 * Full ChordPro content for songs that have been transcribed.
 * Add more entries as you transcribe; for chord shapes (piano/guitar/ukulele) see e.g. pianochord.org.
 */
export const SONG_CONTENT: Record<string, string> = {
  'so-easy': SAMPLE_SONG,
  'from-the-start': `
{title: From the Start — Laufey}

# Intro
Dm G7 Cmaj7

          Dm     G7
Don't you notice how
Cmaj7                           Dm   G7
I get quiet when there's no one else around?
Cmaj7
Me and you and awkward silence
Dm        G7           Em7     A7
Don't you dare look at me that way
Dm                            G7
I don't need reminders of how you don't feel the same

        Dm      G7
Oh, the burning pain
Cmaj7                               Dm      G7
Listening to you harp on 'bout some new soulmate
Cmaj7
She's so perfect, blah, blah, blah
    Dm    G7               Em7    A7
Oh, how I wish you'll wake up one day
Dm                               G7
Run to me, confess your love, at least just let me say

# Chorus
         Dm          G7
That when I talk to you
        Cmaj7
Oh, Cupid walks right through
        Dm        G7               Cmaj7
And shoots an arrow through my heart
        Dm           G7
And I sound like a loon
        Em7       A7
But don't you feel it too?
       Dm       G7               Cmaj7
Confess I loved you from the start

# Instrumental
Dm G7

# Bridge
             Cmaj7
Bi-ya-ba-da
                Dm     G7     Cmaj7
Ba-ba-da-ba-da, da-da, da-da
          Dm        G7
Bi-ya-di, ya-ba-da
       Em7             A7
Ba-bi, ya-da-ba-da-ba, ba-da-ba-di
          Dm            G7
Ya-ba-bi, ya-da, da-da

         Dm      G7
What's a girl to do
 Cmaj7                     Dm     G7
Lying on my bed, staring into the blue?
Cmaj7
Unrequited, terrifying
Dm      G7           Em7   A7
Love is driving me a bit insane
Dm                             G7
Have to get this off my chest, I'm telling you today

# Chorus
         Dm          G7
That when I talk to you
        Cmaj7
Oh, Cupid walks right through
        Dm        G7               Cmaj7
And shoots an arrow through my heart
        Dm           G7
And I sound like a loon
        Em7       A7
But don't you feel it too?
       Dm       G7               Cmaj7
Confess I loved you from the start

# Outro
       Dm       G7
Confess I loved you
         Em7         A7
Just thinking of you
      Dm          G7               Cmaj7
I know I've loved you from the start
`.trim(),
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

[C]Lyrics and [G]chords for [Am]this song [F]aren't available yet.
`.trim(),
};
