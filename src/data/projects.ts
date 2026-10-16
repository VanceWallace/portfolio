// Every project card and project page is generated from this list.
// To add a project: copy an entry, give it a unique slug, and fill in the fields.
// Anything in [BRACKETS] is a placeholder to replace.

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  category: string;
  status: string;
  title: string;
  summary: string;
  /** Path under /public, e.g. '/projects/my-game.gif'. Leave empty to show a placeholder. */
  thumbnail?: string;
  /** Path under /public to a short silent .mp4 that autoplays and loops in the card. Takes priority over thumbnail. */
  thumbnailVideo?: string;
  thumbnailLabel: string;
  /** If set, the card links straight out instead of to a project page. */
  externalUrl?: string;
  links: ProjectLink[];
  /** Project page fields (ignored when externalUrl is set) */
  meta?: { label: string; value: string }[];
  /** URL of a playable build to embed in an iframe on the project page. */
  embedUrl?: string;
  /** Give the embed a tall frame (for builds that need more height than 16:9, like full-page web apps). */
  embedTall?: boolean;
  controls?: string;
  idea?: string;
  build?: string;
  learned?: string;
}

export const projects: Project[] = [
  {
    slug: 'remix-games',
    category: 'Browser games',
    status: 'Playable',
    title: 'remix.gg games',
    summary: 'Small games published on remix.gg, each built from a written spec using test-driven development with Claude Code.',
    // Both files are rebuilt daily from the remix.gg previews by .github/workflows/remix-reel.yml.
    thumbnail: '/projects/remix-games.jpg',
    thumbnailVideo: '/projects/remix-games.mp4',
    thumbnailLabel: '[GAMEPLAY LOOP]',
    links: [
      { label: 'Play the games', href: 'https://remix.gg/@ness' },
      { label: 'Source', href: 'https://github.com/VanceWallace' },
    ],
    meta: [
      { label: 'Status', value: 'Playable' },
      { label: 'Built with', value: 'Claude Code' },
      { label: 'Platform', value: 'Web · mobile' },
      { label: 'Year', value: '2026' },
    ],
    idea:
      'Each game is a single mechanic you can pick up in seconds on a phone: pour to the line, water the flowers, spin the sun the right way. Keeping them small meant every game could go from idea to published quickly, and each one became a focused experiment in what makes one interaction feel satisfying.',
    build:
      "Every game starts as a written spec, and the spec's rules become tests before any game code exists. Claude Code builds against those tests in a repo of its own, and a local dev server shows a QR code so I can playtest on my phone after every change. Before anything ships, a pre-commit check strips out debug hooks and code patterns that remix.gg would flag as obfuscated.",
    learned:
      'A spec only directs an AI builder well when it can be checked, so writing the tests first is what lets me judge a build quickly instead of reading every line. And whatever a platform will reject belongs in an automated check, not in my memory: each rule I had to learn the hard way became one more line in the pre-commit hook.',
  },
  {
    slug: 'map-it-out',
    category: 'Edutainment',
    status: 'Playable prototype',
    title: 'Map It Out',
    summary:
      'A geography review game for middle school students: find a place on a cartoon map, learn why it matters, and earn its sticker.',
    thumbnail: '/projects/map-it-out.jpg',
    thumbnailVideo: '/projects/map-it-out.mp4',
    thumbnailLabel: '[GAMEPLAY LOOP]',
    links: [{ label: 'Play full screen', href: '/play/map-it-out/' }],
    meta: [
      { label: 'Status', value: 'Playable prototype' },
      { label: 'Built with', value: 'Claude' },
      { label: 'Platform', value: 'Web · mobile' },
      { label: 'Year', value: '2026' },
    ],
    embedUrl: '/play/map-it-out/',
    embedTall: true,
    controls: 'Tap an answer, then turn the card',
    idea:
      'Each place is a three-sided card: find it on the map, answer why it matters to people, then see a fact and a memory trick. Getting both right earns a sticker.',
    build: '[How you went from the idea to a playable prototype with Claude, and how you checked it against a sixth-grade curriculum.]',
    learned: '[One or two product lessons about designing learning games for this age group.]',
  },
  {
    slug: 'build-pipeline',
    category: 'Tooling',
    status: 'Open source',
    title: 'Spec-driven build pipeline',
    summary:
      'The workflow behind the games: single-game repos, a LAN QR dev server for phone playtests, and pre-commit checks.',
    thumbnail: '/projects/build-pipeline.jpg',
    thumbnailVideo: '/projects/build-pipeline.mp4',
    thumbnailLabel: '[PIPELINE LOOP]',
    links: [{ label: 'GitHub', href: 'https://github.com/VanceWallace' }],
    meta: [
      { label: 'Status', value: 'Open source' },
      { label: 'Built with', value: 'Claude Code · Node' },
      { label: 'Platform', value: 'Local dev' },
      { label: 'Year', value: '2026' },
    ],
    idea: '[The problem this pipeline solves when directing AI-assisted builds.]',
    build: '[How the pieces fit: specs, tests, dev server, pre-commit checks.]',
    learned: '[What it changed about how you evaluate AI-built work.]',
  },
  {
    slug: 'voice-agent',
    category: 'Voice AI',
    status: 'Live',
    title: 'Retell AI voice agent',
    summary: 'A conversational voice agent built on Retell AI. Talk to it right in your browser.',
    thumbnail: '/projects/retell-demo.jpg',
    thumbnailVideo: '/projects/retell-demo.mp4',
    thumbnailLabel: '[AGENT SCREENSHOT]',
    links: [
      {
        label: 'Talk to the agent',
        href: 'https://agent.retellai.com/orb/agent_e6ba52434a7fba58c25e5d91ec?token=5187646f6caecc5c15fb58bd6d465fa2',
      },
    ],
    meta: [
      { label: 'Status', value: 'Live' },
      { label: 'Built with', value: 'Retell AI' },
      { label: 'Platform', value: 'Web · voice' },
      { label: 'Year', value: '2026' },
    ],
    embedUrl:
      'https://agent.retellai.com/orb/agent_e6ba52434a7fba58c25e5d91ec?token=5187646f6caecc5c15fb58bd6d465fa2',
    controls: 'Click the orb and allow your microphone',
    idea: '[What the agent does and who it is for.]',
    build: '[How you designed the prompt, voice and conversation flow, and how you tested it.]',
    learned: '[One or two product lessons about designing for voice.]',
  },
  // Hidden until the channel is ready — uncomment and add the URL to bring it back.
  // {
  //   slug: 'fox-in-the-shell',
  //   category: 'Video',
  //   status: 'Ongoing',
  //   title: 'Fox in the Shell',
  //   summary: 'A YouTube channel documenting the AI-assisted build process, one project at a time.',
  //   thumbnailLabel: '[VIDEO THUMBNAIL]',
  //   externalUrl: '[YOUTUBE URL]',
  //   links: [{ label: 'Watch', href: '[YOUTUBE URL]' }],
  // },
];

export const pageProjects = projects.filter((p) => !p.externalUrl);
