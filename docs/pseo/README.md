# pSEO — where the content actually lives

The programmatic-SEO **content is code**: it is wired into the Astro build and IS the sitemap, so
it does not live here in `docs/`. This folder holds only loose pSEO notes. Use the pointers below.

## Wired content (do NOT move — moving changes URLs/sitemap)
| What | Path |
|---|---|
| "YouTube For" niche data (29 pages) | `src/data/niches.ts` |
| "YouTube Vs" comparison data (20 pages) | `src/data/comparisons.ts` |
| Video-ideas topic data | `src/data/topics.ts` |
| `/youtube-for/` templates + hub | `src/pages/youtube-for/` |
| `/youtube-vs/` templates + hub | `src/pages/youtube-vs/` |
| `/youtube-video-ideas/` templates | `src/pages/youtube-video-ideas/` |

## Process / playbooks
| What | Path |
|---|---|
| pSEO manager agent (routing, workflow) | `agents/06-pseo-manager.md` |
| Comparison / alternatives / best-tools page standard | `agents/references/comparison-content-playbook.md` |
| Content depth + word-count tiers | `docs/blog/content-depth-framework.md` |

## Loose notes in this folder
- `youtube-for-audit.txt` — ad-hoc audit notes for the `/youtube-for/` cluster.
