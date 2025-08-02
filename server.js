// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Ta linia wczytuje dane z pliku .env

const app = express();
const PORT = 3000; // Nasz backend będzie działał na porcie 3000

// Middleware
app.use(cors()); // Zgoda na komunikację z Live Server
app.use(express.json()); // Pozwalamy serwerowi przyjmować dane w formacie JSON

// Endpoint, na który frontend będzie wysyłał dane
app.post('/api/send-message', async (req, res) => {
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const { name, email, subject, message } = req.body;

    // Prosta walidacja
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
    }

    const embed = {
        title: `Nowa wiadomość z portfolio: ${subject}`,
        color: 3447003,
        fields: [
            { name: 'Imię', value: name, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Treść wiadomości', value: message }
        ],
        timestamp: new Date().toISOString()
    };

    try {
        const discordResponse = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });

        if (discordResponse.ok) {
            res.status(200).json({ message: 'Wiadomość wysłana pomyślnie!' });
        } else {
            res.status(500).json({ message: 'Błąd podczas wysyłania na Discorda.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wewnętrzny błąd serwera.' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend nasłuchuje na http://localhost:${PORT}`);
});