# RESULT.md

## Wat er is gedaan

- **Gemigreerd van Vue CLI 4.5 naar Vite 6 + nieuwste dependencies** — Vue CLI 4 is end-of-life; Vite is de moderne standaard met snellere dev-server en build (`vue@3.5.43`, `vue-router@4.6.4`, `vue-i18n@11`, `@faker-js/faker@9`, `sass@1.105`, `tiny-emitter`, `lodash-es`).
- **Volledige UI-rewrite met Composition API (`<script setup>`)** — oude Options API/components/globals vervangen door schone, moderne componenten, zodat de codebase weer onderhoudbaar en uitbreidbaar is.
- **Nieuw design-systeem in SCSS** — `main.scss` met een kleursysteem (CSS-variabelen) en per-spel-partials (`_game-picker`, `_pesten`, `_war`) voor een frisse, consistente uitstraling.
- **Spel-logica losgetrokken van de UI** — nieuwe engines in `src/lib/games/` (Pesten en War) die puur functioneren op een reactive state, via `provide('game', gameRef)` aan de views gegeven. Zo kan een spel netjes opnieuw gestart worden en is de logica testbaar zonder browser.
- **Pesten-regels correct geïmplementeerd volgens de canonieke regels** — 2 trekt/stapelt, 7 nog een keer, 8 skipt, Aas keert richting om, J mag altijd + kies kleur, Joker trekt 5 (stapelbaar), niet kunnen spelen = trek 1 en speel indien mogelijk, eerste kaart zonder effect.
- **War-engine afgemaakt en bugvrij gemaakt** — rondes, oorlog-resolutie met inzet, patstelling-verdeling en juiste pot-uitkering.
- **Engine-bugs gevonden met headless simulatie en opgelost** — de AI stalü na een 7/boete (geen turn-change), Pesten kon in een eindeloze 2/Joker-stapel-loop terechtkomen, War kon deterministisch oneindig blijven lopen en verloor kaarten in multi-way oorlogen. Alle 60 pesten- en 100 war-simulaties renderen nu netjes uit.
- **Dode code opgeruimd** — oude `window.Cards`/`window.GameManager`-engine, ongebruikte MauMau-ruleset, vendored `vue-drag-drop`, `GameView`-wrapper, `OpponentsWrapper`/`GameLog`/`Suit`/`DrawStack`-componenten en `.browserslistrc` verwijderd; README aangepast op Vite.
- **Interactie gemoderniseerd** — klik-om-te-spelen in plaats van drag-and-drop, pauze-toets (P), history-strip (H), toasts en een overlay met spelregels.

## Aanbevelingen

- **Voeg geautomatiseerde tests toe** (bijv. Vitest) voor de engines in `src/lib/games/` — de headless simulaties die hier zijn gebruikt kunnen daarvoor als basis dienen.
- **Verklein de bundle** — faker (alleen AI-namen) en lodash-es nemen veel ruimte in; overweeg route-level code-splitting (`() => import(...)`) en kleinere naam-generator.
- **Maak i18n consequent** — `vue-i18n` is geïnstalleerd maar feitelijk ongebruikt; gebruik `$t` overal óf verwijder de dependency.
- **Voeg echte (multi-)player-support toe via een kleine backend** — de engine is al UI-onafhankelijk en zou daarmee relatief eenvoudig server-side kunnen draaien.
- **Voltooi setting-flow** — het aantal tegenstanders wordt opgeslagen in `localStorage`; bewaar per spel een eigen voorkeur.
- **Regel: winnen met een actiekaart** — sommige varianten verplichten dat de laatste kaart geen actiekaart (2/Joker/8) is; overweeg dat als optie in de instellingen.