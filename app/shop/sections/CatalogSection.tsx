"use client";

import Link from "next/link";
import posthog from "posthog-js";

import { inter, leagueGothic } from "@/app/fonts";
import { MERCH_ORDER_PLACEHOLDER_URL } from "@/app/shop/constants";

type CatalogItem = {
  id: string;
  title: string;
  price: string;
  imageType: "solid-red";
};

const CATALOG_ITEMS: CatalogItem[] = Array.from({ length: 9 }, (_, index) => ({
  id: `shirt-color-${index + 1}`,
  title: "TEDx Shirt (Color)",
  price: "P250",
  imageType: "solid-red",
}));

function MerchCard({ item }: { item: CatalogItem }) {
  return (
    <article className="w-full max-w-[18.125rem] rounded-[25px] bg-tedx-white/4 p-5">
      <div className="flex flex-col gap-[1.875rem]">
        <div
          aria-hidden="true"
          className="aspect-[249.28/228] w-full rounded-[15.2px] bg-tedx-accent"
        />
        <div className={`${inter.className} flex flex-col items-start text-tedx-white`}>
          <h3 className="text-[1.125rem] font-extrabold leading-[1.15] tracking-[-0.04em]">
            {item.title}
          </h3>
          <p className="mt-1 text-base font-normal leading-none tracking-[-0.04em] text-tedx-white/90">
            {item.price}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function CatalogSection() {
  return (
    <section
      className="relative w-full px-4 pb-16 pt-[4.375rem] text-tedx-white sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
      id="catalog"
    >
      <div className="mx-auto flex w-full max-w-[75.6875rem] flex-col items-center gap-[3.125rem]">
        <div className="flex w-full flex-col items-center gap-[1.875rem] text-center">
          <h2
            className={`${leagueGothic.className} tedx-section-heading-shadow w-full text-center text-[3.75rem] uppercase leading-[0.9] tracking-[-0.03em] text-tedx-white sm:text-[5.5rem] lg:text-[8rem] lg:leading-[8rem] lg:tracking-[-4px]`}
          >
            MOMENTUM MERCH
          </h2>

          <div className="flex w-full max-w-[35.4375rem] flex-col items-center gap-[1.875rem]">
            <p
              className={`${inter.className} max-w-[35.4375rem] text-sm font-normal leading-[1.2] text-tedx-muted-text sm:text-base`}
            >
              Merch can be purchased onsite from March 15 to 18.
              <br />
              For any questions or concerns,
            </p>

            <Link
              className="inline-flex items-center justify-center rounded-[5px] border-2 border-tedx-white px-8 py-4 text-2xl font-normal leading-none text-tedx-white transition duration-200 hover:border-tedx-red hover:text-tedx-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tedx-white"
              href={MERCH_ORDER_PLACEHOLDER_URL}
              rel="noreferrer"
              target="_blank"
              onClick={() => posthog.capture("merch_order_now_clicked")}
            >
              <span className={inter.className}>
                Order Now&nbsp;&rarr;
              </span>
            </Link>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 justify-items-center gap-x-[1.875rem] gap-y-[1.875rem] md:grid-cols-2 xl:grid-cols-3">
          {CATALOG_ITEMS.map((item) => (
            <MerchCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
