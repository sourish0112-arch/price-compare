"use client";

import { useMemo, useState } from "react";
import offersData from "./data/offers.json";

type Offer = {
  id: string;
  canonicalProductId: string;
  platform: string;
  product: string;
  variant: string;
  price: number;
  mrp: number;
  inStock: boolean;
  url: string;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);

export default function Home() {
  const [query, setQuery] = useState("");

  const productGroups = useMemo(() => {
    const search = query.trim().toLowerCase();

    const matchingOffers = (offersData as Offer[]).filter((offer) => {
      const searchableText =
        `${offer.product} ${offer.variant}`.toLowerCase();

      return searchableText.includes(search);
    });

    const groups = new Map<string, Offer[]>();

    for (const offer of matchingOffers) {
      const currentOffers = groups.get(offer.canonicalProductId) ?? [];
      currentOffers.push(offer);
      groups.set(offer.canonicalProductId, currentOffers);
    }

    return Array.from(groups.values()).map((offers) =>
      offers.sort((a, b) => {
        if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
        return a.price - b.price;
      })
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <p className="font-semibold text-blue-600">
          Shopping Price Comparison
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Find the best smartphone price
        </h1>

        <p className="mt-3 text-slate-600">
          Search by phone name, RAM, storage or colour.
        </p>

        <div className="mt-8 flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Try Samsung, OnePlus or 256 GB"
          />

          <button
            onClick={() => setQuery("")}
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Clear
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          These are demonstration prices, not live prices.
        </div>

        {productGroups.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
            No matching smartphone found.
          </div>
        )}

        {productGroups.map((offers) => {
          const lowestPrice = offers.find(
            (offer) => offer.inStock
          )?.price;

          return (
            <section
              key={offers[0].canonicalProductId}
              className="mt-10"
            >
              <h2 className="text-3xl font-bold">
                {offers[0].product}
              </h2>

              <p className="mt-2 text-slate-600">
                {offers[0].variant}
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {offers.map((offer) => (
                  <article
                    key={offer.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-bold">
                        {offer.platform}
                      </h3>

                      {offer.inStock &&
                        offer.price === lowestPrice && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            Best price
                          </span>
                        )}
                    </div>

                    <p className="mt-6 text-3xl font-bold">
                      {formatPrice(offer.price)}
                    </p>

                    <p className="mt-1 text-slate-500 line-through">
                      {formatPrice(offer.mrp)}
                    </p>

                    <p className="mt-4">
                      {offer.inStock
                        ? "✅ In stock"
                        : "❌ Out of stock"}
                    </p>

                    <a
                      href={offer.url}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="mt-6 block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                    >
                      Visit {offer.platform}
                    </a>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}