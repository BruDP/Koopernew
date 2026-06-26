import { test } from "node:test";
import assert from "node:assert/strict";
import { buildBreadcrumbList, buildProductSchema } from "./jsonld.ts";

test("buildBreadcrumbList returns correct @type", () => {
  const result = buildBreadcrumbList([{ name: "Home", href: "/" }]);
  assert.equal((result as any)["@type"], "BreadcrumbList");
});

test("buildBreadcrumbList positions items starting at 1", () => {
  const result = buildBreadcrumbList([
    { name: "Home", href: "/" },
    { name: "Categorie", href: "/categorie" },
  ]) as any;
  assert.equal(result.itemListElement[0].position, 1);
  assert.equal(result.itemListElement[1].position, 2);
});

test("buildBreadcrumbList builds full item URL", () => {
  const result = buildBreadcrumbList([{ name: "Home", href: "/" }]) as any;
  assert.ok(result.itemListElement[0].item.startsWith("https://"));
});

test("buildProductSchema returns @type Product", () => {
  const fakeProduct = {
    sku: "TEST01",
    title: "Test Product",
    description: "<p>Nice product</p>",
    price: 99.99,
    specialPrice: undefined,
    images: ["https://example.com/img.jpg"],
    brand: "Kooper",
    link: "https://satur.it/test",
    category: "Elettronica",
    subCategory: "ELETTRODOMESTICI",
    color: "",
    material: "",
    features: "",
  };
  const result = buildProductSchema(fakeProduct as any) as any;
  assert.equal(result["@type"], "Product");
  assert.equal(result.sku, "TEST01");
});

test("buildProductSchema strips HTML from description", () => {
  const fakeProduct = {
    sku: "TEST01",
    title: "Test",
    description: "<p>Nice <b>product</b></p>",
    price: 10,
    specialPrice: undefined,
    images: [],
    brand: "Kooper",
    link: "",
    category: "",
    subCategory: "",
    color: "",
    material: "",
    features: "",
  };
  const result = buildProductSchema(fakeProduct as any) as any;
  assert.equal(result.description, "Nice product");
});

test("buildProductSchema uses specialPrice when present", () => {
  const fakeProduct = {
    sku: "X",
    title: "X",
    description: "",
    price: 100,
    specialPrice: 79,
    images: [],
    brand: "Kooper",
    link: "",
    category: "",
    subCategory: "",
    color: "",
    material: "",
    features: "",
  };
  const result = buildProductSchema(fakeProduct as any) as any;
  assert.equal(result.offers.price, 79);
});
