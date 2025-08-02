// api/send-message.js

export default async function handler(req, res) {
    // 1. Akceptuj tylko zapytania POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 2. Pobierz URL webhooka ze zmiennej środowiskowej (dla bezpieczeństwa)
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!discordWebhookUrl) {
        console.error('Brak zdefiniowanego DISCORD_WEBHOOK_URL');
        return res.status(500).json({ message: 'Błąd serwera: brak konfiguracji webhooka.' });
    }

    try {
        // 3. Pobierz dane z formularza wysłane przez frontend
        const { name, email, subject, message } = req.body;
        
        // Prosta walidacja na serwerze
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
        }

        // 4. Stwórz ładną, osadzoną wiadomość dla Discorda (embed)
        const embed = {
            title: `Nowa wiadomość z portfolio: ${subject}`,
            color: 3447003, // Niebieski kolor
            fields: [
                { name: 'Imię', value: name, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Treść wiadomości', value: message }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Wiadomość z formularza kontaktowego'
            }
        };

        // 5. Wyślij dane do webhooka Discorda
        const discordResponse = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ embeds: [embed] }),
        });

        // 6. Sprawdź, czy Discord przyjął wiadomość
        if (!discordResponse.ok) {
            console.error(`Błąd Discord API: ${discordResponse.statusText}`);
            return res.status(500).json({ message: 'Nie udało się wysłać wiadomości na Discorda.' });
        }

        // 7. Wyślij odpowiedź o sukcesie do frontendu
        res.status(200).json({ message: 'Wiadomość została wysłana pomyślnie!' });

    } catch (error) {
        console.error('Wystąpił błąd:', error);
        res.status(500).json({ message: 'Wystąpił wewnętrzny błąd serwera.' });
    }
}