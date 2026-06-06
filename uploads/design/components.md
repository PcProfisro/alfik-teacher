# Alfík — UI Component patterns

Tieto vzory sú prototypované v mobilnej aplikácii. Pri prenose do
iných aplikácií (Vue/Quasar, React, native) zachovajte tieto
princípy.

---

## 1. Vekový filter v topbare

Šetrí miesto — namiesto stálej lišty stačí jedna ikona vpravo hore.
Po ťuknutí sa otvorí popover/bottom-sheet s 4 možnosťami
(Všetky + 3 vekové kategórie) v mriežke 2×2.

- Tlačidlo: 44×44, radius 14, 2.5px ring vo farbe veku, výplň
  v svetlej variante tej istej farby.
- Voľba "Všetky" namiesto ikony zobrazuje 3 vodorovné pásiky
  vo farbách 3 vekových kategórií.

## 2. Breadcrumbs

`Domov › Zvieratá › Domáce zvieratá` — text 13px bold, ikona
domčeka pred prvou položkou, šípky 12px medzi položkami, posledná
položka v primary (var(--alf-sky-deep)), ostatné v ink-soft.

## 3. Dlaždica kategórie (tile)

- Pozadie: var(--alf-sky-bg)
- Veľký biely "canvas" v hornej časti pre obrázok kategórie
  (90×90 v 2-stĺpcovej mriežke, 60×60 v 3-stĺpcovej)
- Názov pod obrázkom, 18px bold
- Vpravo hore: kruhové biele tlačidlo reproduktora (34×34,
  2px ring v var(--alf-sky-deep))
- Radius xl (22px), shadow card

## 4. Hero banner kategórie

Tmavomodrý gradient (`linear-gradient(135deg, #1E3A8A, #0F2A4A)`),
biele tlačidlo s ikonou kategórie (60×60, radius lg), názov vpravo
24px black, vpravo kruhové biele tlačidlo reproduktora.

## 5. Riadok testu

Poradie stĺpcov zľava doprava:

1. Ikona veku (52×52, originálne SVG)
2. Zelené play tlačidlo (48×48, radius 16, mätový gradient)
3. Názov testu (2 riadky, line-clamp, 14px bold)
4. Hodnotenie testu — rating_great / good / ok (50×50), alebo
   **prázdne miesto** pre nedohrané testy

Karta: biele pozadie, radius 20, shadow card, padding 12.

## 6. Vekové farebné kódovanie

Konzistentne naprieč celou aplikáciou:

- **3-4 roky**: oranžová (#FF8A65) — ikona age_3_4.svg
- **4-5 rokov**: žltá (#FFB400) — ikona age_4_5.svg
- **5-6 rokov**: mätová (#3DD9B0) — ikona age_5_6.svg
- **Všetky**: modrá (#3FA9E0)

V pickeri voliteľne všetky dlaždice môžu mať jednotné svetložlté
pozadie (`--alf-sun-bg`) — odlíšenie aktívnej voľby je len cez
3px ring.

## 7. Login

- Logo edu-alf (130px width)
- 2 input polia (e-mail, heslo) — radius 18, 2px line border,
  malá kruhová biela ikonka vľavo (36×36)
- Primary tlačidlo: korálovo-oranžový gradient, výška 60, radius 20,
  18px extrabold, white shadow
- "Zapamätať" check + "Zabudol som heslo" v jednom riadku

## 8. Splash

- Svetlomodré oblačné pozadie (lineárny gradient zhora-nadol)
- 4-5 mrakov v rôznych pozíciách
- Logo edu-alf vycentrované v hornej tretine
- Maskot (light_background_boy.webp) v dolnej časti so zelenou
  trávnatou pologuľou
- 3 loading dots na spodku
