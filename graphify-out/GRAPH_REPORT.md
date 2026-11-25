# Graph Report - amazon-referral  (2026-11-25)

## Corpus Check
- 71 files · ~16,672 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 304 nodes · 870 edges · 10 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c36d5d3a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- next
- compilerOptions
- app/p/[asin]/page.tsx
- actions.ts
- getCatalog
- session.ts
- site.ts
- catalog.ts
- guide-actions.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 35 edges
2. `getCatalog()` - 30 edges
3. `adminRest()` - 18 edges
4. `compilerOptions` - 17 edges
5. `ProductCard()` - 16 edges
6. `SITE` - 15 edges
7. `hueStyle()` - 13 edges
8. `Category` - 13 edges
9. `isValidAsin()` - 13 edges
10. `react` - 13 edges

## Surprising Connections (you probably didn't know these)
- `saveGuideAction()` --indirect_call--> `isValidAsin()`  [INFERRED]
  src/app/admin/guide-actions.ts → src/lib/affiliate.ts
- `getCategory()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/c/[slug]/page.tsx → src/lib/catalog.ts
- `generateStaticParams()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/c/[slug]/page.tsx → src/lib/catalog.ts
- `DealsPage()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/offerte/page.tsx → src/lib/catalog.ts
- `generateStaticParams()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/p/[asin]/page.tsx → src/lib/catalog.ts

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (34): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, server-only@^0.0.1, devDependencies, eslint@^9 (+26 more)

### Community 1 - "next"
Cohesion: 0.15
Nodes (10): nextConfig, next, metadata, metadata, Page(), metadata, Page(), metadata (+2 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 3 - "app/p/[asin]/page.tsx"
Cohesion: 0.14
Nodes (35): CategoryPage(), generateMetadata(), getCategory(), generateMetadata(), GuideContent(), GuidePage(), DealsPage(), metadata (+27 more)

### Community 4 - "actions.ts"
Cohesion: 0.17
Nodes (25): react, toggleAction(), guard(), toggleGuideAction(), GuideToggle(), MissingTable(), Guides(), GuidesAdminPage() (+17 more)

### Community 5 - "getCatalog"
Cohesion: 0.18
Nodes (10): generateStaticParams(), generateStaticParams(), robots(), sitemap(), getCatalog(), applyDealRules(), currentDeals(), Dealish (+2 more)

### Community 6 - "session.ts"
Cohesion: 0.11
Nodes (30): adminOrThrow(), deleteAction(), FormState, keep(), lines(), loginAction(), logoutAction(), saveProductAction() (+22 more)

### Community 7 - "site.ts"
Cohesion: 0.10
Nodes (24): alt, contentType, Image(), size, alt, contentType, Image(), size (+16 more)

### Community 8 - "catalog.ts"
Cohesion: 0.13
Nodes (27): GET(), GET(), SEED_GUIDES, CATEGORIES, SEED_PRODUCTS, partnerTag(), Catalog, GuideWithProducts (+19 more)

### Community 9 - "guide-actions.ts"
Cohesion: 0.26
Nodes (14): adminOrThrow(), deleteGuideAction(), keep(), saveGuideAction(), Field(), GuideForm(), P, isGuideLive() (+6 more)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `app/p/[asin]/page.tsx`, `actions.ts`, `getCatalog`, `session.ts`, `site.ts`, `catalog.ts`, `guide-actions.ts`?**
  _High betweenness centrality (0.333) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07301587301587302 - nodes in this community are weakly interconnected._
- **Why does `getCatalog()` connect `getCatalog` to `app/p/[asin]/page.tsx`, `actions.ts`, `session.ts`, `site.ts`, `catalog.ts`, `guide-actions.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `server-only` connect `package.json` to `catalog.ts`, `actions.ts`, `session.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `app/p/[asin]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396078431372549 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11201079622132254 - nodes in this community are weakly interconnected._