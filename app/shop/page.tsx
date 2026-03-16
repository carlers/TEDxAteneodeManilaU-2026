/**
 * Merchandise Shop
 * 
 * Shop page for TEDx-branded merchandise. Displays products with
 * images, descriptions, and prices. Redirects to google forms for payment.
 * 
 * @route /shop
 */
import Image from "next/image";
import {
  CatalogSection,
  TopPicksSection,
} from "@/app/shop/sections";

export default function ShopPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-black font-sans text-tedx-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-32rem] top-[26rem] z-0 h-[58rem] w-[62rem] opacity-80 sm:right-[-25rem] sm:top-[30rem] sm:h-[66rem] sm:w-[72rem] lg:right-[-18rem] lg:top-[27.5rem] lg:h-[68.4375rem] lg:w-[74.9375rem]"
      >
        <Image
          alt=""
          className="object-contain"
          fill
          priority={false}
          sizes="(min-width: 1024px) 1199px, 100vw"
          src="/merch-page-ellipse.svg"
        />
      </div>

      <div className="relative z-10">
        <TopPicksSection />
        <CatalogSection />
      </div>
    </div>
  );
}
