<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Question bank + metadata lives in src/lib/assessment/questions.ts, versioned by ASSESSMENT.version; why: single source until backend DB exists.
- Questionnaire session saved in localStorage keyed by assessment id+version; why: works without login, moves to Cloud with auth step.
- IN_REVIEW items visible during pre-launch (VISIBLE_STATUSES); why: no clinical review yet — restrict to APPROVED before publishing.
- Integration health checks run in a TanStack server fn (src/lib/integrations.functions.ts) with the admin's session, read-only; why: no new Supabase Edge Functions or migrations from Lovable, and private secrets live only in the external Supabase.
