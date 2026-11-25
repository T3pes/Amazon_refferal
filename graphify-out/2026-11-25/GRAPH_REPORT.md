# Graph Report - amazon-referral  (2026-11-25)

## Corpus Check
- 51 files · ~10,557 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 229 nodes · 548 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1cf253e2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- next
- compilerOptions
- app/p/[asin]/page.tsx
- actions.ts
- affiliate.ts
- session.ts
- site.ts
- catalog.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 25 edges
2. `getCatalog()` - 18 edges
3. `compilerOptions` - 17 edges
4. `SITE` - 12 edges
5. `isValidAsin()` - 11 edges
6. `adminRest()` - 10 edges
7. `getItems()` - 10 edges
8. `Category` - 9 edges
9. `ProductCard()` - 9 edges
10. `saveProductAction()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Image()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/c/[slug]/opengraph-image.tsx → src/lib/catalog.ts
- `generateStaticParams()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/c/[slug]/page.tsx → src/lib/catalog.ts
- `Image()` --calls--> `renderOg()`  [EXTRACTED]
  src/app/opengraph-image.tsx → src/lib/og.tsx
- `Image()` --calls--> `getProduct()`  [EXTRACTED]
  src/app/p/[asin]/opengraph-image.tsx → src/lib/catalog.ts
- `generateStaticParams()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/p/[asin]/page.tsx → src/lib/catalog.ts

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (33): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, server-only@^0.0.1, devDependencies, eslint@^9 (+25 more)

### Community 1 - "next"
Cohesion: 0.15
Nodes (10): nextConfig, next, metadata, metadata, Page(), metadata, Page(), metadata (+2 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 3 - "app/p/[asin]/page.tsx"
Cohesion: 0.16
Nodes (23): CategoryPage(), generateMetadata(), generateStaticParams(), getCategory(), generateMetadata(), generateStaticParams(), ProductPage(), Home() (+15 more)

### Community 4 - "actions.ts"
Cohesion: 0.15
Nodes (27): react, adminOrThrow(), deleteAction(), FormState, keep(), lines(), loginAction(), logoutAction() (+19 more)

### Community 5 - "affiliate.ts"
Cohesion: 0.31
Nodes (5): resolveAsin(), SHORT_HOSTS, buildAffiliateUrl(), DEFAULT_PARTNER_TAG, extractAsin()

### Community 6 - "session.ts"
Cohesion: 0.14
Nodes (25): server-only, GET(), GET(), ClickStat, isAdmin(), authRequest(), decode(), readSession() (+17 more)

### Community 7 - "site.ts"
Cohesion: 0.12
Nodes (20): alt, contentType, Image(), size, body, display, metadata, viewport (+12 more)

### Community 8 - "catalog.ts"
Cohesion: 0.25
Nodes (12): GET(), CATEGORIES, SEED_PRODUCTS, Catalog, fetchCatalogFromSupabase(), headers(), logClick(), ProductRow (+4 more)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `app/p/[asin]/page.tsx`, `actions.ts`, `session.ts`, `site.ts`, `catalog.ts`?**
  _High betweenness centrality (0.384) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._
- **Why does `server-only` connect `session.ts` to `package.json`, `catalog.ts`, `affiliate.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13548387096774195 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._