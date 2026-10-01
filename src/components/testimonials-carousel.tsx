import { useEffect, useRef, useState } from "react";
import { Pause, Play, Quote, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Testimonial = {
  id: string;
  name: string;
  age?: number;
  profession?: string;
  text: string;
  rating?: 1 | 2 | 3 | 4 | 5;
};

const testerTestimonials: Testimonial[] = [
  {
    id: "tester-mariana-costa",
    name: "Mariana Costa",
    age: 31,
    profession: "Designer",
    rating: 5,
    text: "Passei anos sentindo que 'não me encaixava' em lugar nenhum e achando que era apenas ansiedade. Adiei a busca por respostas por medo de não dar em nada, mas o teste foi o divisor de águas. O relatório é extremamente claro, acolhedor e profundo. Me trouxe a paz e a validação que eu procurava há mais de uma década.",
  },
  {
    id: "tester-lucas-mendes",
    name: "Lucas Mendes",
    age: 28,
    profession: "Desenvolvedor de Software",
    rating: 5,
    text: "Sempre tive dúvidas sobre minhas reações sociais e sobrecargas sensoriais, mas não sabia por onde começar. A plataforma facilitou tudo de forma muito objetiva e intuitiva. Responder às perguntas me fez sentir compreendido pela primeira vez, e ter o resultado em mãos deu a coragem que faltava para eu agendar minha consulta especializada.",
  },
  {
    id: "tester-camila-rocha",
    name: "Camila Rocha",
    age: 36,
    profession: "Professora",
    rating: 5,
    text: "Eu tinha muito receio de fazer um teste online e encontrar algo genérico ou frio. Fiquei impressionada com o nível de detalhamento e o cuidado na linguagem. Levei o resultado direto para a minha psicóloga e isso acelerou meses de conversa no consultório. Valeu cada segundo!",
  },
  {
    id: "tester-rafael-silveira",
    name: "Rafael Silveira",
    age: 24,
    profession: "Estudante",
    rating: 5,
    text: "Se você está na dúvida se deve ou não fazer, apenas faça. A sensação de tirar essa pulga de trás da orelha e ter um direcionamento prático é libertadora. O teste é direto ao ponto, respeitoso e me ajudou a entender comportamentos meus que eu antes julgava como falhas pessoais.",
  },
];

export function TestimonialsCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [approvedItems, setApprovedItems] = useState<Testimonial[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    void supabase
      .from("depoimentos")
      .select("id,name,text")
      .eq("status", "APPROVED")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setApprovedItems(
          (data ?? []).map((item) => ({
            id: item.id,
            name: item.name,
            text: item.text,
          })),
        );
      });
  }, []);

  const cards =
    approvedItems.length >= 2 ? approvedItems : testerTestimonials;
  const loopItems = [...cards, ...cards];

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track || cards.length < 2) return;

    let frame = 0;
    let last = performance.now();
    let offset = 0;

    const tick = (now: number) => {
      const delta = now - last;
      last = now;

      if (!isPaused && document.visibilityState === "visible") {
        offset += delta * 0.012;
        const loopWidth = track.scrollWidth / 2;

        if (loopWidth > 0 && offset >= loopWidth) {
          offset -= loopWidth;
        }

        track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [cards.length, isPaused]);

  return (
    <div>
      <div
        ref={viewportRef}
        className="overflow-x-hidden pb-4"
        aria-label="Depoimentos de usuários"
      >
        <div
          ref={trackRef}
          className="flex w-max gap-5 will-change-transform"
        >
          {loopItems.map((testimonial, index) => (
            <article
              key={`${testimonial.id}-${index}`}
              className="min-w-[300px] max-w-sm shrink-0 rounded-3xl border border-border bg-card p-6 shadow-soft md:min-w-[360px]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-spectrum/20 font-display text-sm font-semibold text-primary">
                  {testimonial.name.slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {testimonial.name}
                    {testimonial.age ? `, ${testimonial.age} anos` : ""}
                  </p>

                  {testimonial.profession && (
                    <p className="text-xs text-muted-foreground">
                      {testimonial.profession}
                    </p>
                  )}
                </div>
              </div>

              <div
                className="mt-4 flex items-center gap-0.5"
                aria-label="${testimonial.rating ?? 5} estrelas"
              >
                {Array.from({ length: testimonial.rating ?? 5 }).map(
                  (_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-current text-primary"
                    />
                  ),
                )}
              </div>

              <Quote className="mt-5 h-7 w-7 text-primary/60" />

              <p className="mt-3 leading-7 text-foreground">
                “{testimonial.text}”
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-ink transition hover:bg-muted"
          aria-label={
            isPaused
              ? "Continuar rolagem dos depoimentos"
              : "Pausar rolagem dos depoimentos"
          }
          aria-pressed={isPaused}
        >
          {isPaused ? (
            <Play className="h-3.5 w-3.5" />
          ) : (
            <Pause className="h-3.5 w-3.5" />
          )}
          {isPaused ? "Continuar" : "Pausar"}
        </button>
      </div>
    </div>
  );
}
