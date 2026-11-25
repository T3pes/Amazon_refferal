# Graph Report - amazon-referral  (2026-11-25)

## Corpus Check
- 69 files · ~15,852 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 292 nodes · 813 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2cb37e8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- admin/layout.tsx
- compilerOptions
- app/p/[asin]/page.tsx
- actions.ts
- session.ts
- site.ts
- catalog.ts
- guide-actions.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 33 edges
2. `getCatalog()` - 30 edges
3. `adminRest()` - 18 edges
4. `compilerOptions` - 17 edges
5. `ProductCard()` - 15 edges
6. `SITE` - 15 edges
7. `isValidAsin()` - 13 edges
8. `react` - 13 edges
9. `Category` - 12 edges
10. `Guides()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `saveGuideAction()` --indirect_call--> `isValidAsin()`  [INFERRED]
  src/app/admin/guide-actions.ts → src/lib/affiliate.ts
- `LoginForm()` --indirect_call--> `loginAction()`  [INFERRED]
  src/app/admin/login/LoginForm.tsx → src/app/admin/actions.ts
- `logoutAction()` --calls--> `signOut()`  [EXTRACTED]
  src/app/admin/actions.ts → src/lib/admin/session.ts
- `adminOrThrow()` --calls--> `AdminDbError`  [EXTRACTED]
  src/app/admin/actions.ts → src/lib/admin/db.ts
- `adminOrThrow()` --calls--> `isAdmin()`  [EXTRACTED]
  src/app/admin/actions.ts → src/lib/admin/db.ts

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (34): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, server-only@^0.0.1, devDependencies, eslint@^9 (+26 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 3 - "app/p/[asin]/page.tsx"
Cohesion: 0.12
Nodes (36): nextConfig, next, CategoryPage(), generateMetadata(), generateStaticParams(), getCategory(), generateMetadata(), GuideContent() (+28 more)

### Community 4 - "actions.ts"
Cohesion: 0.17
Nodes (25): react, logoutAction(), toggleAction(), guard(), toggleGuideAction(), GuideToggle(), MissingTable(), Guides() (+17 more)

### Community 6 - "session.ts"
Cohesion: 0.16
Nodes (21): adminOrThrow(), deleteAction(), FormState, keep(), lines(), loginAction(), saveProductAction(), LoginForm() (+13 more)

### Community 7 - "site.ts"
Cohesion: 0.08
Nodes (31): alt, contentType, Image(), size, metadata, Page(), alt, contentType (+23 more)

### Community 8 - "catalog.ts"
Cohesion: 0.08
Nodes (36): GET(), GET(), SEED_GUIDES, CATEGORIES, SEED_PRODUCTS, resolveAsin(), SHORT_HOSTS, AMAZON_DOMAIN (+28 more)

### Community 9 - "guide-actions.ts"
Cohesion: 0.23
Nodes (16): adminOrThrow(), deleteGuideAction(), keep(), saveGuideAction(), Field(), GuideForm(), P, AdminDbError (+8 more)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `app/p/[asin]/page.tsx` to `package.json`, `admin/layout.tsx`, `actions.ts`, `session.ts`, `site.ts`, `catalog.ts`, `guide-actions.ts`?**
  _High betweenness centrality (0.326) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07301587301587302 - nodes in this community are weakly interconnected._
- **Why does `getCatalog()` connect `app/p/[asin]/page.tsx` to `catalog.ts`, `guide-actions.ts`, `actions.ts`, `site.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `server-only` connect `package.json` to `catalog.ts`, `actions.ts`, `session.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `app/p/[asin]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1187980433263452 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07928118393234672 - nodes in this community are weakly interconnected._