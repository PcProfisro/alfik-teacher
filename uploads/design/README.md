# Alfík — Design package

Zdieľaný balík vizuálnej identity Alfík pre použitie naprieč
aplikáciami v ekosystéme (web portál edualf, mobilná aplikácia,
budúce produkty).

## Obsah

```
assets/
  logo_edu_alf.svg          Hlavné logo
  icon_alfik_sk.svg         Pôvodný Alfík glyph
  light_background_boy.webp Maskot — chlapec

  age_3_4.svg               Vekové ikony (3 vekové kategórie)
  age_4_5.svg
  age_5_6.svg

  rating_great.svg          Hodnotenia výkonu testu (3 úrovne)
  rating_good.svg
  rating_ok.svg

  medal_gold.svg            Medaily (legacy, prípadné použitie)
  medal_silver.svg
  medal_bronze.svg
  diamond.svg

  play_test_icon.svg        Tlačidlo "spusti test"

  icon_*.png                Ikony kategórií (24 tém — abeceda, matematika,
                            zvieratá, príroda, doprava, farby, telo, hudba,
                            logika, rodina, ...).

tokens.css                  CSS premenné: farby, typografia, radius,
                            tiene, spacing.

components.md               Patterny pre kľúčové UI komponenty
                            (vekový filter, breadcrumbs, dlaždica
                            kategórie, riadok testu, hero banner).
```

## Ako použiť

### 1. Skopíruj `assets/` a `tokens.css` do svojho projektu

```html
<link rel="stylesheet" href="design/tokens.css">
```

### 2. Pridaj písma do `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
```

### 3. Body štýl

```css
body {
  font-family: var(--alf-font-body);
  color: var(--alf-ink);
  background: var(--alf-bg);
}
```

### 4. Vekové farebné kódovanie

| Vek   | Hlavná farba         | Pozadie karty       |
|-------|----------------------|---------------------|
| 3–4   | var(--alf-age-3-4)   | var(--alf-orange-bg)|
| 4–5   | var(--alf-age-4-5)   | var(--alf-sun-bg)   |
| 5–6   | var(--alf-age-5-6)   | var(--alf-mint-bg)  |
| Všetky| var(--alf-sky-deep)  | var(--alf-sky-bg)   |

### 5. Dark mode

Prepni triedu `dm-dark` na `<body>`:

```css
body.dm-dark {
  background: var(--alf-dark-bg);
  color: var(--alf-dark-ink);
}
```

## Pre Quasar / Vue 3 projekty (edualf)

Vlož hodnoty do `src/css/quasar.variables.scss`:

```scss
$primary:    #3FA9E0;  // alf-sky-deep
$secondary:  #3DD9B0;  // alf-mint
$accent:     #FFB400;  // alf-sun-deep (age 4-5)
$dark:       #0E1622;
$positive:   #3DD9B0;
$negative:   #FF6B6B;
$warning:    #FFC542;
```
