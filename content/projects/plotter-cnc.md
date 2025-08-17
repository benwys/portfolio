---
title: "Plotter CNC"
subtitle: "Maszyna do rysowania sterowana numerycznie"
description: "Budowa plotera CNC od podstaw – projektowanie, druk 3D, montaż i kalibracja. Sterowanie oparte na Arduino i GRBL."
image: "/assets/images/LogoBW.png"
technologies:
  - Arduino
  - GRBL
  - G-code
  - Silniki krokowe
  - Druk 3D
  - A4988
order: 1
---

Projekt obejmował kompletny proces budowy plotera CNC – od zaprojektowania i wydrukowania w 3D części mechanicznych, po złożenie i kalibrację całej maszyny. Układ sterowania oparty jest na platformie Arduino z wgranym oprogramowaniem GRBL, które w czasie rzeczywistym interpretuje polecenia G-code, sterując silnikami krokowymi osi X i Y za pomocą dedykowanych sterowników A4988.

Projekt obejmował zaprojektowanie mechaniki w oparciu o dostępne komponenty, takie jak prowadnice liniowe, silniki krokowe NEMA17 oraz paski GT2. Wszystkie niestandardowe elementy konstrukcyjne zostały zaprojektowane w oprogramowaniu CAD, a następnie wydrukowane na drukarce 3D, co pozwoliło na szybkie prototypowanie i iteracyjne ulepszanie konstrukcji.

Oto przykład, jak możesz wstawić obrazek o szerokości 300 pikseli:

<img src="/assets/images/LogoBW.png" alt="Przykładowa część CNC" width="300" style="display: block; margin: 20px auto; border: 1px solid var(--border-color);">

Głównym wyzwaniem była precyzyjna kalibracja maszyny, w tym ustawienie odpowiedniej liczby kroków na milimetr dla każdego silnika, aby uzyskać dokładne i niezdeformowane rysunki. Proces ten wymagał wielu testów i dostosowań w oprogramowaniu GRBL. Kolejnym etapem było opanowanie procesu generowania ścieżek narzędzia (G-code) z obrazów wektorowych, co pozwoliło na przekształcenie cyfrowych projektów w fizyczne rysunki. Projekt ten był doskonałym praktycznym wprowadzeniem do świata technologii CNC.
