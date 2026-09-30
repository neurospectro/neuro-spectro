import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";
import { APPROVED_TESTIMONIALS } from "@/lib/testimonials";

export function TestimonialsCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || APPROVED_TESTIMONIALS.length < 2) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      if (document.visibilityState === "visible") {
        el.scrollLeft += delta * 0.035;
        const loopWidth = el.scrollWidth / 2;
        if (loopWidth > 0 && el.scrollLeft >= loopWidth) el.scrollLeft = 0;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (APPROVED_TESTIMONIALS.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
        <Quote className="mx-auto h-8 w-8 text-primary/60" />
        <p className="mt-4 font-display text-lg font-semibold text-ink">Este espaço será preenchido por experiências reais.</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Os depoimentos passam por aprovação antes de aparecerem publicamente.
        </p>
      </div>
    );
  }

  const items = [...APPROVED_TESTIMONIALS, ...APPROVED_TESTIMONIALS];

  return (
    <div ref={ref} className="flex gap-5 overflow-hidden pb-4" aria-label="Depoimentos aprovados">
      {items.map((testimonial, index) => (
        <article key={`${testimonial.id}-${index}`} className="min-w-[300px] max-w-sm shrink-0 rounded-3xl border border-border bg-card p-7 shadow-soft md:min-w-[360px]">
          <Quote className="h-7 w-7 text-primary/60" />
          <p className="mt-5 leading-7 text-foreground">“{testimonial.text}”</p>
          <p className="mt-5 text-sm font-semibold text-ink">
            {testimonial.name}{testimonial.age ? `, ${testimonial.age} anos` : ""}
          </p>
        </article>
      ))}
    </div>
  );
}
