export function TestimonialSection() {
  return (
    <section className="py-20 md:py-24 bg-forest-900 relative overflow-hidden">
      {/* Decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-forest-700/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sage-900/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Quote mark */}
        <div
          aria-hidden
          className="text-forest-600 text-8xl font-serif leading-none mb-2 select-none"
        >
          &ldquo;
        </div>

        <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
          I&apos;d been told my labs were &ldquo;borderline&rdquo; for three years with no explanation.
          InsulinIQ was the first place that connected my PCOS, fatigue, and blood sugar
          in a way that actually made sense — with sources I could verify.
        </blockquote>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-sage-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S.M.</span>
          </div>
          <p className="text-forest-300 font-semibold text-sm">S.M.</p>
          <p className="text-forest-500 text-sm">Reader · PCOS diagnosis · United Kingdom</p>
        </div>

        {/* Stars */}
        <div className="mt-6 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-5 text-honey-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <p className="mt-5 text-xs text-forest-600/50 max-w-sm mx-auto">
          Individual experience. Lifestyle outcomes vary. This is not medical advice.
        </p>

      </div>
    </section>
  );
}
