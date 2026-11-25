# Graph Report - amazon-referral  (2026-11-25)

## Corpus Check
- 64 files · ~14,714 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 280 nodes · 762 edges · 10 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a1f742b4`
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
- guide-actions.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 31 edges
2. `getCatalog()` - 24 edges
3. `adminRest()` - 18 edges
4. `compilerOptions` - 17 edges
5. `SITE` - 14 edges
6. `isValidAsin()` - 13 edges
7. `react` - 13 edges
8. `Guides()` - 12 edges
9. `Category` - 11 edges
10. `ProductCard()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `saveGuideAction()` --indirect_call--> `isValidAsin()`  [INFERRED]
  src/app/admin/guide-actions.ts → src/lib/affiliate.ts
- `adminOrThrow()` --calls--> `AdminDbError`  [EXTRACTED]
  src/app/admin/guide-actions.ts → src/lib/admin/db.ts
- `adminOrThrow()` --calls--> `isAdmin()`  [EXTRACTED]
  src/app/admin/guide-actions.ts → src/lib/admin/db.ts
- `adminOrThrow()` --calls--> `requireSession()`  [EXTRACTED]
  src/app/admin/guide-actions.ts → src/lib/admin/session.ts
- `saveGuideAction()` --calls--> `adminRest()`  [EXTRACTED]
  src/app/admin/guide-actions.ts → src/lib/admin/db.ts

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

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
Cohesion: 0.15
Nodes (27): CategoryPage(), generateMetadata(), generateStaticParams(), getCategory(), GuideContent(), GuidePage(), generateMetadata(), generateStaticParams() (+19 more)

### Community 4 - "actions.ts"
Cohesion: 0.12
Nodes (38): react, server-only, adminOrThrow(), deleteAction(), FormState, keep(), lines(), logoutAction() (+30 more)

### Community 5 - "affiliate.ts"
Cohesion: 0.27
Nodes (7): GET(), resolveAsin(), SHORT_HOSTS, buildAffiliateUrl(), DEFAULT_PARTNER_TAG, extractAsin(), isValidAsin()

### Community 6 - "session.ts"
Cohesion: 0.22
Nodes (13): loginAction(), LoginForm(), LoginPage(), GET(), authRequest(), decode(), readSession(), refreshSession() (+5 more)

### Community 7 - "site.ts"
Cohesion: 0.10
Nodes (26): alt, contentType, Image(), size, alt, contentType, Image(), size (+18 more)

### Community 8 - "catalog.ts"
Cohesion: 0.13
Nodes (27): GET(), SEED_GUIDES, CATEGORIES, SEED_PRODUCTS, AMAZON_DOMAIN, partnerTag(), Catalog, creatorsApiConfigured() (+19 more)

### Community 9 - "guide-actions.ts"
Cohesion: 0.29
Nodes (12): adminOrThrow(), deleteGuideAction(), keep(), saveGuideAction(), Field(), GuideForm(), P, norm() (+4 more)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `app/p/[asin]/page.tsx`, `actions.ts`, `affiliate.ts`, `session.ts`, `site.ts`, `catalog.ts`, `guide-actions.ts`?**
  _High betweenness centrality (0.339) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._
- **Why does `react` connect `actions.ts` to `package.json`, `app/p/[asin]/page.tsx`, `session.ts`, `catalog.ts`, `guide-actions.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `server-only` connect `actions.ts` to `package.json`, `catalog.ts`, `affiliate.ts`, `session.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12244897959183673 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09747899159663866 - nodes in this community are weakly interconnected._