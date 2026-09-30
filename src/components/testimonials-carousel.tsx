import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ApprovedTestimonial = {
  id: string;
  name: string;
  text: string;
};

const illustrativeExperiences = [
  {
    id: "example-1",
    title: "Exemplo de experiência",
    text: "Entender minhas respostas por dimensões tornou mais fácil perceber padrões do meu dia a dia e decidir quais pontos eu queria aprofundar.",
  },
  {
    id: "example-2",
    title: "Exemplo de experiência",
    text: "O relatório organiza as respostas de um jeito que ajuda a transformar uma sensação difícil de explicar em temas concretos para conversar com um profissional.",
  },
  {
    id: "example-3",
    title: "Exemplo de experiência",
    text: "Mais do que uma conclusão, a proposta é sair da avaliação com uma visão mais estruturada sobre características que merecem ser exploradas.",
  },
  {
    id: "example-4",
    title: "Exemplo de experiência",
    text: "Ter o histórico e os pontos para explorar reunidos em um relatório facilita revisitar a própria experiência com mais contexto.",
  },
];

export function TestimonialsCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<ApprovedTestimonial[]>([]);

  useEffect(() => {
    if (!supabase) return;
    void supabase
      .from("depoimentos")
      .select("id,name,text")
      .eq("status", "APPROVED")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => setItems((data ?? []) as ApprovedTestimonial[]));
  }, []);

  const cards = items.length > 0
    ? items.map((item) => ({ ...item, title: item.name }))
    : illustrativeExperiences;

  useEffect(() => {
    const el = ref.current;
    if (!el || cards.length < 2) return;

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
  }, [cards.length]);

  const loopItems = [...cards, ...cards];

  return (
    <div>
      {items.length === 0 && (
        <p className="mb-4 text-center text-xs text-muted-foreground">
          Exemplos ilustrativos baseados no tipo de experiência que o relatório foi desenvolvido para organizar. Não são depoimentos de usuários.
        </p>
      )}

      <div ref={ref} className="flex gap-5 overflow-hidden pb-4" aria-label={items.length > 0 ? "Depoimentos aprovados" : "Exemplos de experiências"}>
        {loopItems.map((testimonial, index) => (
          <article
            key={`${testimonial.id}-${index}`}
            className="min-w-[300px] max-w-sm shrink-0 rounded-3xl border border-border bg-card p-6 shadow-soft md:min-w-[360px]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-spectrum/20 font-display text-sm font-semibold text-primary">
                {items.length > 0 ? testimonial.name.slice(0, 1).toUpperCase() : "NS"}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{testimonial.title}</p>
                {items.length > 0 ? (
                  <p className="text-xs text-muted-foreground">Depoimento aprovado</p>
                ) : (
                  <p className="text-xs text-muted-foreground">NeuroSpectro</p>
                )}
              </div>
            </div>
            <Quote className="mt-5 h-7 w-7 text-primary/60" />
            <p className="mt-3 leading-7 text-foreground">“{testimonial.text}”</p>
          </article>
        ))}
      </div>
    </div>
  );
}
