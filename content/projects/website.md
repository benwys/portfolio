---
title: "Portfolio na własnym serwerze"
subtitle: "Strona-wizytówka hostowana na Raspberry Pi"
description: "Projekt mojej strony-portfolio, która jest hostowana na lokalnym serwerze Raspberry Pi i udostępniana dzięki Cloudflare Tunnel. Całość powstała przy wsparciu narzędzi AI."
technologies:
  - JavaScript
  - Node.js
  - Raspberry Pi
  - Linux
order: 1
---

To portfolio jest projektem samym w sobie. Zamiast korzystać z gotowych platform hostingowych, postanowiłem zbudować wszystko od podstaw na własnym, domowym serwerze. Celem było nie tylko stworzenie wizytówki, ale przede wszystkim pogłębienie wiedzy z zakresu administracji systemami, konfiguracji sieci i samodzielnego wdrażania aplikacji webowych.

### Technologia

Aplikacja została zbudowana z wykorzystaniem następujących technologii:

- Backend: Lekki serwer oparty na Node.js z frameworkiem Express.js, odpowiedzialny za serwowanie plików statycznych oraz obsługę API (np. formularza kontaktowego).
- Frontend: Czysty JavaScript, HTML i CSS.
- Serwer: Sercem całego systemu jest minikomputer Raspberry Pi. To na nim fizycznie znajduje się i działa ta strona.
- Konfiguracja: Za bezpieczne udostępnienie strony w internecie odpowiada Cloudflare Tunnel. Tworzy on szyfrowany tunel między moim Raspberry Pi a siecią Cloudflare, dzięki czemu nie musiałem wystawiać publicznego adresu IP ani konfigurować reguł na routerze.

### Wyzwania i zdobyta wiedza

Projekt był świetną okazją do nauki. Najciekawsze wyzwania obejmowały:

1. Konfigurację serwera od zera: Instalacja systemu, konfiguracja użytkowników, hardening zabezpieczeń i instalacja niezbędnego oprogramowania (Node.js, Nginx jako reverse proxy).
2. Automatyzację wdrożenia: Ustawienie procesów, które ułatwiają aktualizację strony po wprowadzeniu zmian w kodzie.
3. Zabezpieczenie sieci: Zrozumienie i wdrożenie Cloudflare Tunnel, co pozwoliło na bezpieczne udostępnienie serwisu bez narażania mojej sieci domowej.

Cały proces, od napisania kodu, przez konfigurację serwera, aż po wdrożenie, został zrealizowany przy aktywnym wsparciu narzędzi AI, które pomagały w generowaniu kodu, debugowaniu i tworzeniu treści.

---

Zapraszam do przejrzenia kodu źródłowego projektu na moim GitHubie:
[**Zobacz kod na GitHubie**](https://github.com/benwys/portfolio)
