# Claude Code — Operational Instructions

## Purpose

Claude Code must rely on Language Server Protocol (LSP) tools as the primary method for understanding and navigating codebases. LSP provides accurate, real-time information about symbols, types, definitions, and references — eliminating guesswork.

## Core Rules

- **Always prioritize the LSP tool** when working with source code. It is the authoritative source for codebase structure.
- **Use LSP for symbol lookup, definitions, references, and type information.** Do not infer signatures, types, or module exports without querying LSP first.
- **Do not assume file structure or function signatures.** Verify via LSP before acting on assumptions.
- **Before implementing changes, query LSP** to understand existing implementations, call sites, and type constraints.
- **Use LSP navigation to locate relevant files** instead of broad glob/grep searching when the target is a known symbol, class, or function.
- **Fall back to Grep/Glob only** when LSP is unavailable, the target is a string literal or comment, or the query is pattern-based rather than symbol-based.

## Workflow

1. **Locate** — Use LSP to find relevant symbols (functions, classes, variables, types).
2. **Inspect** — Query definitions and references to understand how the symbol is used across the codebase.
3. **Understand** — Check type information, parameter signatures, and dependency relationships via LSP.
4. **Implement** — Modify or write code with full knowledge of the existing structure and contracts.

## New Tool Integration Rule

**Every new tool page must be added to the /tools listing and footer before the task is considered done.** This is not a separate task — it is part of building the tool. After creating any new `src/pages/tools/*.astro` file:
1. Add the tool to the `tools` array in `src/pages/tools/index.astro` (correct workflow position)
2. Add the tool to the `Free Tools` linkGroup in `src/navigation.ts` (matching order)
3. Submit both URLs to Bing via Webmaster API (IndexNow is broken due to Cloudflare — use `curl` to `SubmitUrlbatch` endpoint with API key from `.mcp.json`)
4. Remind the user to submit both URLs in Google Search Console (URL Inspection → Request Indexing)

See `agents/08-microtool-builder.md` Phase 7 for full details.

## Key Principle

> Prioritize using the LSP tool for context-efficient and accurate implementation.

LSP queries are cheaper, faster, and more precise than reading entire files or running broad searches. Use them first, read files second, search broadly last.
