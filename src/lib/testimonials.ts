export type TestimonialStatus = "PENDING" | "APPROVED" | "HIDDEN";

export interface Testimonial {
  id: string;
  name: string;
  age?: number;
  text: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  status: TestimonialStatus;
  consentedAt?: string;
}

/**
 * Prova social real apenas.
 * Nenhum depoimento fictício deve ser publicado.
 */
export const TESTIMONIALS: Testimonial[] = [];

export const APPROVED_TESTIMONIALS = TESTIMONIALS.filter(
  (testimonial) => testimonial.status === "APPROVED",
);
