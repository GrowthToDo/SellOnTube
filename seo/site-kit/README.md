Site kit for SellonTube: site-specific only. Method and rules live in seo-content-system.
Index of `seo/site-kit/`. Created 2026-10-15 from the files cited in each entry.

Excerpts are verbatim except that every em dash and en dash is replaced with " - ".

# SellonTube site kit

| File | What it holds | Source |
|---|---|---|
| `brand-visuals.md` | Callout, table and SVG palette, font sizes, featured-image SVG spec | `blog-production-standard.md`, `agents/04-blog-writer.md` |
| `evidence-entities.md` | Proven citation archetype and canonical entity terms | `ai-seo-guide.md` Rule 2 + Section 19 |
| `comparison-examples.md` | Site examples and own-tool adaptation for comparison posts | `agents/references/comparison-content-playbook.md` |
| `pseo.md` | `/youtube-for/` and `/youtube-vs/` pages, paused drip, vs-page standards | `agents/06-pseo-manager.md`, `docs/sops/pseo-publishing-sop.md`, `growth-strategy.md` |
| `dates.md` | The IST publishDate trap and the code that implements it | `CLAUDE.md`, `src/utils/blog.ts`, `scripts/validate-build.js` |
| `deploy.md` | Commit and push approvals, deploy checklist, Netlify commands | `docs/sops/deploy-checklist.md`, `CLAUDE.md`, `netlify.toml` |
| `scaffold.md` | What `npm run new-post` writes and where it disagrees with the standard | `scripts/new-post.mjs`, `scripts/get-feature-image.mjs` |

Machine config for the tools: `SEO_CONTEXT.md` section "Machine config".
