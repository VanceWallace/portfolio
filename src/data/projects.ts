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
  /** Path under /public, e.g. '/projects/warp-cube.gif'. Leave empty to show a placeholder. */
  thumbnail?: string;
  thumbnailLabel: string;
  /** If set, the card links straight out instead of to a project page. */
  externalUrl?: string;
  links: ProjectLink[];
  /** Project page fields (ignored when externalUrl is set) */
  meta?: { label: string; value: string }[];
  /** URL of a playable build to embed in an iframe on the project page. */
  embedUrl?: string;
  controls?: string;
  idea?: string;
  build?: string;
  learned?: string;
}

export const projects: Project[] = [
  {
    slug: 'warp-cube',
    category: 'Puzzle game',
    status: 'In development',
    title: 'Warp Cube',
    summary:
      'A spatial puzzle about folding flat hexomino shapes into cubes, built on polyhedral net theory. Headed toward Steam.',
    thumbnailLabel: '[GAMEPLAY GIF]',
    links: [
      { label: 'Play demo', href: '[DEMO URL]' },
      { label: 'Watch trailer', href: '[TRAILER URL]' },
    ],
    meta: [
      { label: 'Status', value: 'In development' },
      { label: 'Built with', value: 'Claude Code · [ENGINE]' },
      { label: 'Platform', value: 'Web demo · Steam' },
      { label: 'Year', value: '2026' },
    ],
    controls: '[CONTROLS]',
    idea:
      "Turn the intuition of folding paper into a puzzle. Levels draw on polyhedral net theory and rigid-origami constraints, so every shape either folds or it doesn't.",
    build: '[Spec → Claude Code → playtest loop: what you specified, how you evaluated builds, and what you cut.]',
    learned: '[One or two product lessons that carry beyond this game.]',
  },
  {
    slug: 'remix-games',
    category: 'Browser games',
    status: 'Playable',
    title: 'remix.gg games',
    summary: 'Small games published on remix.gg, each built test-first from a written spec with Claude Code.',
    thumbnailLabel: '[GAMEPLAY GIF]',
    links: [
      { label: 'Play', href: '[REMIX.GG PROFILE URL]' },
      { label: 'Source', href: 'https://github.com/VanceWallace' },
    ],
    meta: [
      { label: 'Status', value: 'Playable' },
      { label: 'Built with', value: 'Claude Code' },
      { label: 'Platform', value: 'Web · mobile' },
      { label: 'Year', value: '2026' },
    ],
    controls: '[CONTROLS]',
    idea: '[What these games explore, and why small and fast was the point.]',
    build: '[How a written spec becomes a tested, published game.]',
    learned: '[One or two product lessons from shipping many small games.]',
  },
  {
    slug: 'build-pipeline',
    category: 'Tooling',
    status: 'Open source',
    title: 'Spec-driven build pipeline',
    summary:
      'The workflow behind the games: single-game repos, a LAN QR dev server for phone playtests, and pre-commit checks.',
    thumbnailLabel: '[TERMINAL RECORDING]',
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
    slug: 'fox-in-the-shell',
    category: 'Video',
    status: 'Ongoing',
    title: 'Fox in the Shell',
    summary: 'A YouTube channel documenting the AI-assisted build process, one project at a time.',
    thumbnailLabel: '[VIDEO THUMBNAIL]',
    externalUrl: '[YOUTUBE URL]',
    links: [{ label: 'Watch', href: '[YOUTUBE URL]' }],
  },
];

export const pageProjects = projects.filter((p) => !p.externalUrl);
