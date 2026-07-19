# Primat demo catalog

NikFinder's demonstration catalog is assembled by the server endpoint
`/api/public/primat-products?catalog=1`. It makes one request for each query
below, then caches the raw response for 24 hours. This matters because Primat's
demo endpoint returns up to three matches per query and allows 30 requests per
day.

## Discovery queries

`snus`, `nikotin`, `nikotinpåsar`, `tobak`, `vitt snus`, `portionssnus`,
`cigaretter`, `rulltobak`, `vape`, `e-cigarett`, `e-cigg`, `pod`, `velo`,
`zyn`, `loop`, `xqs`, `helwit`, `kelly white`, `skruf`, `knox`, `general`,
`lundgrens`, `ettan`, `grov`, `vont`, `vuse`, `elf bar`, `lost mary`,
`rev pod`, `nicorette`.

Update `PRIMAT_DISCOVERY_QUERIES` in `src/lib/primat-discovery.ts` to add or remove a
query. Keep the list at 30 or fewer items while using the demo API.

## Product safety rules

- A record must contain a nicotine, tobacco, vape, cigarette, or approved
  nicotine-brand signal.
- Explicit accessory names—such as rolling papers, tubes, filters, lighters,
  ashtrays, and grinders—are excluded.
- Listings merge only when they have the same `product_id` **and** the same
  normalized brand, name, and package fingerprint. Everything else remains a
  separate product.

## Local product images

`src/lib/product-images.ts` contains only high-confidence mappings from a
Primat `product_id` to a locally stored image. Each mapping includes the
official source page. Unmapped products intentionally render without an image.
When Primat supplies an official image field, the resolver can prefer it before
this local mapping without changing any component.
