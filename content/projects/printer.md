---
title: "Inteligentny Serwer Druku"
subtitle: "Stara drukarka USB z nowym życiem dzięki Raspberry Pi"
description: "Projekt przekształcenia starej drukarki USB w nowoczesne urządzenie sieciowe za pomocą Raspberry Pi, CUPS oraz dedykowanego interfejsu webowego w Pythonie."
technologies:
  - Raspberry Pi
  - Linux
  - CUPS
  - Python
  - Flask
  - Gunicorn
  - Systemd
order: 3
---

Celem projektu było przywrócenie do życia starej drukarki USB, czyniąc ją dostępną w sieci dla wszystkich domowników. Jako serwer wykorzystałem minikomputer Raspberry Pi, na którym wdrożyłem dwa niezależne rozwiązania: serwer druku CUPS oraz własny interfejs webowy.

### Zastosowane technologie

-   **CUPS (Common UNIX Printing System):** Podstawa systemu, która zamieniła Raspberry Pi w serwer druku. Kluczowe było rozwiązanie problemu ze sterownikami (zmiana z PostScript na PCL) i konfiguracja domyślnych ustawień, jak druk dwustronny.
-   **Aplikacja webowa (Python + Flask):** Stworzony dodatkowo interfejs, który umożliwia przesyłanie plików do druku przez przeglądarkę. Aplikacja potrafi automatycznie konwertować pliki `.docx` przy użyciu LibreOffice.
-   **Wdrożenie produkcyjne:** Aplikacja została uruchomiona na serwerze **Gunicorn** i zarządzana przez **systemd**, co zapewnia jej stabilne działanie i automatyczny start. Kod był wersjonowany za pomocą **Git** i wdrażany z repozytorium GitHub.

### Wyzwania i zdobyta wiedza

Projekt był przekrojowym doświadczeniem, od konfiguracji sprzętu po development i wdrożenie.

1.  **Rozwiązywanie problemów ze sterownikami:** Diagnoza i zmiana sterowników w CUPS była kluczowa dla stabilności systemu.
2.  **Profesjonalne wdrożenie:** Zastosowanie wirtualnego środowiska (`venv`) do ominięcia zabezpieczeń systemowych (PEP 668) oraz użycie Gunicorn i systemd do uruchomienia aplikacji zgodnie z dobrymi praktykami.
3.  **Pełen cykl życia projektu:** Przejście przez wszystkie etapy – od pomysłu, przez development, testowanie, aż po stabilne, działające wdrożenie – było niezwykle rozwijające.

Projekt zakończył się sukcesem, a stara drukarka zyskała nowe, sieciowe życie.