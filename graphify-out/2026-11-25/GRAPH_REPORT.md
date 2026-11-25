# Graph Report - amazon-referral  (2026-11-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 135 nodes · 247 edges · 8 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c033feb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- next
- compilerOptions
- [asin]/page.tsx
- catalog.ts
- affiliate.ts
- creators-api.ts
- scripts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `next` - 12 edges
3. `getCatalog()` - 11 edges
4. `getItems()` - 8 edges
5. `Prose()` - 7 edges
6. `ProductCard()` - 7 edges
7. `SITE` - 6 edges
8. `scripts` - 6 edges
9. `Category` - 5 edges
10. `ProductPage()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Page()` --calls--> `Prose()`  [EXTRACTED]
  src/app/come-funziona/page.tsx → src/components/Prose.tsx
- `Page()` --calls--> `Prose()`  [EXTRACTED]
  src/app/informativa-affiliazione/page.tsx → src/components/Prose.tsx
- `Page()` --calls--> `Prose()`  [EXTRACTED]
  src/app/privacy/page.tsx → src/components/Prose.tsx
- `generateMetadata()` --calls--> `getProduct()`  [EXTRACTED]
  src/app/p/[asin]/page.tsx → src/lib/catalog.ts
- `generateStaticParams()` --calls--> `getCatalog()`  [EXTRACTED]
  src/app/p/[asin]/page.tsx → src/lib/catalog.ts

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.09
Nodes (28): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, server-only@^0.0.1, devDependencies, eslint@^9 (+20 more)

### Community 1 - "next"
Cohesion: 0.12
Nodes (14): nextConfig, next, metadata, Page(), metadata, Page(), body, display (+6 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 3 - "[asin]/page.tsx"
Cohesion: 0.29
Nodes (11): generateMetadata(), generateStaticParams(), ProductPage(), Home(), CatalogBrowser(), normalize(), Price(), ProductCard() (+3 more)

### Community 4 - "catalog.ts"
Cohesion: 0.26
Nodes (12): server-only, CATEGORIES, SEED_PRODUCTS, Catalog, fetchCatalogFromSupabase(), headers(), logClick(), ProductRow (+4 more)

### Community 5 - "affiliate.ts"
Cohesion: 0.31
Nodes (6): GET(), AMAZON_DOMAIN, buildAffiliateUrl(), DEFAULT_PARTNER_TAG, extractAsin(), isValidAsin()

### Community 6 - "creators-api.ts"
Cohesion: 0.33
Nodes (9): partnerTag(), creatorsApiConfigured(), credentialVersion(), getItems(), getToken(), RESOURCES, TOKEN_URLS, toLive() (+1 more)

### Community 7 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `[asin]/page.tsx`, `catalog.ts`, `affiliate.ts`?**
  _High betweenness centrality (0.321) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Why does `server-only` connect `catalog.ts` to `package.json`, `creators-api.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._