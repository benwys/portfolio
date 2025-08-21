---
title: "Inteligentny System Nawadniania Roślin"
subtitle: "Autonomiczne urządzenie IoT z własnym panelem webowym na ESP8266"
description: "Projekt DIY inteligentnej doniczki opartej na mikrokontrolerze ESP8266, która monitoruje wilgotność gleby i udostępnia panel sterowania przez własną sieć Wi-Fi."
technologies:
  - ESP8266
  - Arduino (C++)
  - Elektronika
  - Serwer Web
order: 99
---

Projekt inteligentnej doniczki, która automatycznie dba o nawodnienie rośliny. Urządzenie, oparte na mikrokontrolerze ESP8266, monitoruje wilgotność gleby i w razie potrzeby uruchamia pompkę. System łączy się z domową siecią Wi-Fi, a do jego obsługi służy prosty interfejs webowy, który pozwala na ręczne sterowanie i podgląd stanu urządzenia z dowolnego komputera lub telefonu w tej samej sieci.


### Kluczowe komponenty

Poniższa tabela podsumowuje najważniejsze elementy użyte w projekcie.

| Komponent | Rola w projekcie | Opis |
|---|---|---|
| **NodeMCU (ESP8266)** | Mózg operacji | Mikrokontroler z Wi-Fi, na którym działa cały program. |
| **Czujnik wilgotności**| Zmysły | Mierzy poziom wilgoci w glebie i przekazuje dane do ESP. |
| **Moduł przekaźnika** | Bezpieczny przełącznik | Izoluje i pozwala sterować urządzeniem o większej mocy (pompką). |
| **Pompka wody** | Mięśnie | Element wykonawczy, który fizycznie dostarcza wodę do rośliny.|
| **Kod (Arduino C++)** | Dusza projektu | Logika sterująca, serwer webowy i interfejs użytkownika. |

Ten projekt to doskonały przykład, jak za pomocą kilku tanich komponentów i odrobiny kodu można stworzyć użyteczne i "inteligentne" urządzenie. Zdobyta wiedza stanowi świetną bazę do dalszej rozbudowy, np. o integrację z Raspberry Pi i serwerem MQTT, aby zbierać dane z wielu doniczek jednocześnie.

[Zobacz przykładowy kod na GitHub Gist](https://gist.github.com/google-gemini-builder/8c1482f349c2d186c321683921b7904b)