---
title: "Zdalny dostęp do sieci domowej"
subtitle: "Od WireGuard do Tailscale na Raspberry Pi"
description: "Projekt konfiguracji zdalnego dostępu do sieci domowej, który ewoluował od klasycznego VPN do nowoczesnej sieci mesh z powodu nieoczekiwanych przeszkód."
technologies:
  - Raspberry Pi
  - Linux
  - WireGuard
  - Tailscale
  - Sieci Komputerowe
order: 2
---

Celem projektu było stworzenie bezpiecznego tunelu do mojej sieci domowej, aby mieć zdalny dostęp do lokalnych zasobów, takich jak serwery czy inteligentne urządzenia. Całość została oparta o minikomputer Raspberry Pi.

### Technologia i problem

Początkowy plan zakładał użycie **WireGuard** za pomocą skryptu PiVPN. Wymagało to jednak przekierowania portów na routerze, co okazało się niemożliwe z powodu braku dostępu do jego konfiguracji (zaawansowany router MikroTik zarządzany przez zewnętrzną firmę).

Problem ten zmusił mnie do poszukania alternatywy, która nie wymaga otwierania portów. Rozwiązaniem okazał się **Tailscale** – usługa tworząca sieć nakładkową (overlay network), która połączyła moje urządzenia w bezpieczną sieć prywatną bez konieczności publicznego adresu IP czy DDNS.

### Wyzwania i zdobyta wiedza

Projekt stał się cenną lekcją adaptacji i poszukiwania nowoczesnych rozwiązań:

1.  **Problem z routerem:** Brak możliwości przekierowania portów był kluczową przeszkodą, która uniemożliwiła realizację pierwotnego planu.
2.  **Odkrycie sieci mesh:** Zamiast tradycyjnego modelu klient-serwer, zastosowałem sieć mesh, w której urządzenia łączą się ze sobą bezpośrednio dzięki serwerom koordynacyjnym Tailscale.
3.  **Prostota i bezpieczeństwo:** Konfiguracja Tailscale na Raspberry Pi jako bramy do sieci lokalnej (*subnet router*) okazała się znacznie prostsza i potencjalnie bezpieczniejsza niż wystawianie usług na publicznym adresie IP.

Ten projekt pokazał, że napotkane ograniczenia mogą prowadzić do odkrycia lepszych, bardziej elastycznych technologii. Cel został osiągnięty, a zdobyta wiedza na temat nowoczesnych rozwiązań sieciowych jest bezcenna.