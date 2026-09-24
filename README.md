# CardGames

Verzamelkaartspellen in Vue 3, gebouwd met Vite.

## Spellen

- **Pesten** — klassieke 4-persoonlijke actiekaart-spelafhandeling tegen AI-tegenstanders (2 trekt, 7 opnieuw, 8 skipt, Aas keert richting om, J kiest kleur, Joker trekt 5).
- **Oorlog (War)** — het kaartspel zonder jokers; hoogste kaart wint de pot, gelijken gaan in oorlog.

## Ontwikkelen

```
npm install
npm run dev        # start de Vite dev-server op http://localhost:5173
npm run build      # productiebundle naar dist/
```

## Techniek

- Vue 3 (Composition API), vue-router, vue-i18n, SCSS (partials: `game-picker`, `pesten`, `war`), lodash-es, tiny-emitter en @faker-js/faker voor AI-namen.
- Spel-logica leeft los van de UI in `src/lib/games/` (Pesten en War-engines) en wordt via `provide/inject` aan de views doorgegeven, zodat een spel opnieuw gestart kan worden.