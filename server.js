const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const marked = require('marked');
const fm = require('front-matter');
require('dotenv').config();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint do wysyłania wiadomości (bez zmian)
app.post('/api/send-message', async (req, res) => {
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const { name, email, subject, message } = req.body;
    if (!discordWebhookUrl) return res.status(500).json({ message: 'Brak DISCORD_WEBHOOK_URL.' });
    if (!name || !email || !subject || !message) return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });

    const embed = {
        title: `Nowa wiadomość: ${subject}`,
        color: 3447003,
        fields: [
            { name: 'Imię', value: name, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Treść', value: message }
        ],
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });
        if (response.ok) res.status(200).json({ message: 'Wiadomość wysłana!' });
        else res.status(500).json({ message: 'Błąd wysyłania na Discorda.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera.' });
    }
});

// --- NOWA LOGIKA DLA PROJEKTÓW ---

// Endpoint zwracający listę projektów
app.get('/api/projects', (req, res) => {
    const projectsDir = path.join(__dirname, 'content', 'projects');
    fs.readdir(projectsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Nie można odczytać folderu z projektami.');
        }
        const projects = files
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(projectsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const { attributes } = fm(content);
                return {
                    slug: file.replace('.md', ''),
                    ...attributes,
                };
            })
            .sort((a, b) => (a.order || 99) - (b.order || 99)); // Sortowanie po polu 'order'
        res.json(projects);
    });
});


// Dynamiczne generowanie strony projektu
app.get('/projects/:slug', (req, res) => {
    const slug = req.params.slug;
    const filePath = path.join(__dirname, 'content', 'projects', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Projekt nie został znaleziony.');
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { attributes, body } = fm(fileContent);
    const contentHtml = marked.parse(body);

    const techTags = attributes.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');

    // Dynamiczne dodawanie obrazka, jeśli jest zdefiniowany w atrybutach
    let imageHtml = '';
    if (attributes.image) {
        imageHtml = `<img src="${attributes.image}" alt="${attributes.title}" class="project-image">`;
    }

    // Użyj obrazka projektu dla tagów Open Graph, jeśli istnieje
    const ogImage = attributes.image ? `https://benedyktwysocki.me${attributes.image}` : 'https://benedyktwysocki.me/assets/images/LogoBW.png';

    const projectHtml = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <title>${attributes.title} | Portfolio Benedykta Wysockiego</title>
            <meta name="description" content="${attributes.description}">
            <meta property="og:title" content="${attributes.title}">
            <meta property="og:description" content="${attributes.description}">
            <meta property="og:type" content="article">
            <meta property="og:url" content="https://benedyktwysocki.me/projects/${slug}">
            <meta property="og:image" content="${ogImage}">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/css/styles.css">
            <link rel="stylesheet" href="/css/themes.css">
        </head>
        <body>
            <canvas id="matrix-canvas"></canvas>
            <div class="container">
                <header>
                    <h1>${attributes.title}</h1>
                    <p class="subtitle">${attributes.subtitle}</p>
                    <a href="/#projects" class="nav-btn" style="margin-top:20px;display:inline-block;">← Powrót</a>
                </header>
                <section class="section active" id="project-details">
                    <div class="card">
                        ${imageHtml}
                        <h3>Opis projektu</h3>
                        ${contentHtml}
                        <h3>Technologie</h3>
                        <div class="tech-stack">${techTags}</div>
                    </div>
                </section>
            </div>
            <footer>
                <p>Stworzone z pasją i retro vibem.</p>
                <p class="easter-egg-hint">↑ ↑ ↓ ↓ ← → ← → B A</p>
            </footer>
            <script src="/js/script.js"></script>
        </body>
        </html>
    `;

    res.send(projectHtml);
});

app.listen(PORT, HOST, () => {
    console.log(`✅ Backend nasłuchuje na http://${HOST}:${PORT}`);
});