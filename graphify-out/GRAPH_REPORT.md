# Graph Report - amazon-referral  (2026-11-25)

## Corpus Check
- 83 files · ~19,671 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 349 nodes · 1034 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a776a04f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- session.ts
- compilerOptions
- app/p/[asin]/page.tsx
- telegram-actions.ts
- vercel.json
- session.ts
- site.ts
- catalog.ts
- guide/page.tsx

## God Nodes (most connected - your core abstractions)
1. `next` - 38 edges
2. `getCatalog()` - 37 edges
3. `adminRest()` - 20 edges
4. `compilerOptions` - 17 edges
5. `SITE` - 17 edges
6. `ProductCard()` - 16 edges
7. `isValidAsin()` - 15 edges
8. `react` - 15 edges
9. `Category` - 13 edges
10. `hueStyle()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/c/[slug]/page.tsx → src/lib/catalog.ts
- `generateStaticParams()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/p/[asin]/page.tsx → src/lib/catalog.ts
- `saveGuideAction()` --indirect_call--> `isValidAsin()`  [INFERRED]
  src/app/admin/guide-actions.ts → src/lib/affiliate.ts
- `Editor()` --calls--> `TelegramButton()`  [EXTRACTED]
  src/app/admin/guide/[slug]/page.tsx → src/app/admin/TelegramButton.tsx
- `Editor()` --calls--> `guard()`  [EXTRACTED]
  src/app/admin/guide/[slug]/page.tsx → src/app/admin/guard.ts

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (33): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, server-only@^0.0.1, devDependencies, eslint@^9 (+25 more)

### Community 1 - "session.ts"
Cohesion: 0.27
Nodes (12): server-only, GET(), authRequest(), decode(), readSession(), refreshSession(), requireSession(), Session (+4 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 3 - "app/p/[asin]/page.tsx"
Cohesion: 0.10
Nodes (43): nextConfig, next, metadata, CategoryPage(), generateMetadata(), generateStaticParams(), getCategory(), generateMetadata() (+35 more)

### Community 4 - "telegram-actions.ts"
Cohesion: 0.11
Nodes (33): react, guard(), NotAdmin(), Editor(), Page(), adminOrNull(), logManual(), publishDealsNowAction() (+25 more)

### Community 6 - "session.ts"
Cohesion: 0.12
Nodes (25): adminOrThrow(), deleteAction(), FormState, keep(), lines(), loginAction(), logoutAction(), saveProductAction() (+17 more)

### Community 7 - "site.ts"
Cohesion: 0.08
Nodes (31): alt, contentType, Image(), size, metadata, Page(), alt, contentType (+23 more)

### Community 8 - "catalog.ts"
Cohesion: 0.10
Nodes (36): GET(), GET(), GET(), SEED_GUIDES, CATEGORIES, SEED_PRODUCTS, partnerTag(), Catalog (+28 more)

### Community 9 - "guide/page.tsx"
Cohesion: 0.16
Nodes (28): adminOrThrow(), deleteGuideAction(), keep(), saveGuideAction(), toggleGuideAction(), GuideToggle(), MissingTable(), Guides() (+20 more)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `app/p/[asin]/page.tsx` to `package.json`, `session.ts`, `telegram-actions.ts`, `session.ts`, `site.ts`, `catalog.ts`, `guide/page.tsx`?**
  _High betweenness centrality (0.280) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._
- **Why does `getCatalog()` connect `catalog.ts` to `app/p/[asin]/page.tsx`, `telegram-actions.ts`, `session.ts`, `site.ts`, `guide/page.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `server-only` connect `session.ts` to `package.json`, `telegram-actions.ts`, `session.ts`, `catalog.ts`, `guide/page.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `app/p/[asin]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09696969696969697 - nodes in this community are weakly interconnected._
- **Should `telegram-actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11414141414141414 - nodes in this community are weakly interconnected._