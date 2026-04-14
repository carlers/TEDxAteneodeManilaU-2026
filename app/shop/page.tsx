/**
 * Merchandise Shop
 *
 * Temporary "coming soon" page while the merch catalog is in progress.
 *
 * @route /shop
 */

export default function ShopPage() {
  return (
    <section className="relative min-h-screen overflow-x-hidden bg-tedx-black px-4 pb-16 pt-28 text-tedx-white sm:px-6 sm:pt-32">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-tedx-outline-strong bg-tedx-surface px-6 py-14 text-center sm:px-10 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tedx-muted-text">
          TEDxAteneodeManilaU Merchandise
        </p>
        <h1 className="mt-3 font-league-gothic text-6xl uppercase leading-none tracking-wide sm:text-7xl">
          Coming Soon
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-tedx-muted-text sm:text-base">
          We are still finalizing our merch lineup. Please check back soon for
          official drops and order details.
        </p>
      </div>
    </section>
  );
}
