# Graph Report - amazon-referral  (2026-11-25)

## Corpus Check
- 42 files · ~9,090 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 193 nodes · 439 edges · 8 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1036f1d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- next
- compilerOptions
- [asin]/page.tsx
- actions.ts
- affiliate.ts
- creators-api.ts
- session.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 20 edges
2. `compilerOptions` - 17 edges
3. `isValidAsin()` - 11 edges
4. `getCatalog()` - 11 edges
5. `adminRest()` - 10 edges
6. `getItems()` - 10 edges
7. `server-only` - 9 edges
8. `saveProductAction()` - 9 edges
9. `react` - 8 edges
10. `refreshSession()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `LoginForm()` --indirect_call--> `loginAction()`  [INFERRED]
  src/app/admin/login/LoginForm.tsx → src/app/admin/actions.ts
- `logoutAction()` --calls--> `signOut()`  [EXTRACTED]
  src/app/admin/actions.ts → src/lib/admin/session.ts
- `adminOrThrow()` --calls--> `requireSession()`  [EXTRACTED]
  src/app/admin/actions.ts → src/lib/admin/session.ts
- `saveProductAction()` --calls--> `resolveAsin()`  [EXTRACTED]
  src/app/admin/actions.ts → src/lib/admin/resolve.ts
- `saveProductAction()` --calls--> `isValidAsin()`  [EXTRACTED]
  src/app/admin/actions.ts → src/lib/affiliate.ts

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (33): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, server-only@^0.0.1, devDependencies, eslint@^9 (+25 more)

### Community 1 - "next"
Cohesion: 0.11
Nodes (15): nextConfig, next, metadata, metadata, Page(), metadata, Page(), body (+7 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 3 - "[asin]/page.tsx"
Cohesion: 0.20
Nodes (16): generateMetadata(), ProductPage(), Home(), CatalogBrowser(), normalize(), Price(), ProductCard(), ProductImage() (+8 more)

### Community 4 - "actions.ts"
Cohesion: 0.17
Nodes (26): react, server-only, adminOrThrow(), deleteAction(), FormState, keep(), lines(), logoutAction() (+18 more)

### Community 5 - "affiliate.ts"
Cohesion: 0.22
Nodes (10): GET(), generateStaticParams(), resolveAsin(), SHORT_HOSTS, AMAZON_DOMAIN, buildAffiliateUrl(), DEFAULT_PARTNER_TAG, extractAsin() (+2 more)

### Community 6 - "creators-api.ts"
Cohesion: 0.24
Nodes (15): GET(), partnerTag(), creatorsApiConfigured(), credentialVersion(), getItems(), getToken(), lastCreatorsError, RESOURCES (+7 more)

### Community 7 - "session.ts"
Cohesion: 0.22
Nodes (13): loginAction(), LoginForm(), LoginPage(), GET(), authRequest(), decode(), readSession(), refreshSession() (+5 more)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `[asin]/page.tsx`, `actions.ts`, `affiliate.ts`, `creators-api.ts`, `session.ts`?**
  _High betweenness centrality (0.349) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._
- **Why does `server-only` connect `actions.ts` to `package.json`, `[asin]/page.tsx`, `affiliate.ts`, `creators-api.ts`, `session.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._
- **Why does `react` connect `actions.ts` to `package.json`, `[asin]/page.tsx`, `session.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._