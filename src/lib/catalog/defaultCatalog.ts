import { primatProductProvider } from "@/lib/primat";
import { PRODUCTS } from "@/lib/products";
import { createProductCatalog } from "@/lib/catalog/service";

// This is the only composition point for the active retail provider.
// Replace primatProductProvider here when another retailer becomes available.
export const productCatalog = createProductCatalog(primatProductProvider, PRODUCTS);
