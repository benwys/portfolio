// js/script.js - Główna logika aplikacji

// Zmienne globalne
let currentTheme = 'dark';

// --- NATYCHMIASTOWE POKAZANIE WŁAŚCIWEJ SEKCJI PRZED DOMContentLoaded ---
// Ten blok musi być na samym początku pliku!
(function() {
    // Obsługa hash w URL przy starcie (przed DOMContentLoaded)
    let sectionFromHash = window.location.hash ? window.location.hash.substring(1) : 'about';
    const validSections = ['about', 'projects', 'skills', 'contact'];
    if (!validSections.includes(sectionFromHash)) {
        sectionFromHash = 'about';
    }
    // Ukryj wszystkie sekcje
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    // Pokaż wybraną sekcję
    const targetSection = document.getElementById(sectionFromHash);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    // Zaktualizuj aktywny przycisk nawigacji
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(button => {
        const btnSection = button.textContent.trim().toLowerCase();
        if (
            (btnSection === 'o mnie' && sectionFromHash === 'about') ||
            (btnSection === 'projekty' && sectionFromHash === 'projects') ||
            (btnSection === 'umiejętności' && sectionFromHash === 'skills') ||
            (btnSection === 'kontakt' && sectionFromHash === 'contact')
        ) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    //initializeTheme();
    initializeTypeWriter();
    initializeForm();
    initializeScrollEffects();
    initializeA11y();
    // Nie wywołuj showSection na starcie, bo już to zrobiliśmy powyżej

    // Obsługa kliknięcia na kartę projektu
    const projectCards = document.querySelectorAll('#projects .card[data-project]');
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const projectId = card.getAttribute('data-project');
            if (projectId) {
                window.location.href = `projects/project-${projectId}.html`;
            }
        });
    });

    // Auto-aktywacja trybu Matrix po północy
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 3) { // Od północy do 3:00
        setTimeout(activateMatrixMode, 500);
    }
});

// Obsługa zmiany hash (np. cofanie/ponawianie w przeglądarce)
window.addEventListener('hashchange', function() {
    let sectionFromHash = window.location.hash ? window.location.hash.substring(1) : 'about';
    const validSections = ['about', 'projects', 'skills', 'contact'];
    if (!validSections.includes(sectionFromHash)) {
        sectionFromHash = 'about';
    }
    showSection(sectionFromHash, false);
});

// === ZARZĄDZANIE MOTYWAMI ===
/*
function initializeTheme() {
    // Sprawdź zapisany motyw w localStorage (jeśli używane poza Claude.ai)
    const savedTheme = getSavedTheme();
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.className = `${currentTheme}-theme`;
    }
    
    // Ustaw ikonę przycisku
    updateThemeIcon();
    
    // Dodaj event listener do przycisku
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    // Dodaj klasę przejścia
    document.body.classList.add('theme-transition');
    
    // Zmień motyw
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = `${currentTheme}-theme theme-transition`;
    
    // Zapisz preferencję
    saveTheme(currentTheme);
    
    // Zaktualizuj ikonę
    updateThemeIcon();
    
    // Usuń klasę przejścia po animacji
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 500);
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = currentTheme === 'dark' ? '' : '';
}

function saveTheme(theme) {
    // Zapisz w pamięci sesji (działa w Claude.ai)
    try {
        sessionStorage.setItem('portfolio-theme', theme);
    } catch (e) {
        // Fallback jeśli sessionStorage nie jest dostępny
        console.log('Theme saved in memory only');
    }
}

function getSavedTheme() {
    try {
        return sessionStorage.getItem('portfolio-theme') || 'dark';
    } catch (e) {
        return 'dark';
    }
}
*/
// === NAWIGACJA ===

function showSection(sectionName, updateHash = true) {
    // Ukryj wszystkie sekcje
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Pokaż wybraną sekcję
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Zaktualizuj aktywny przycisk nawigacji
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(button => {
        // Sprawdź czy tekst przycisku odpowiada sekcji
        const btnSection = button.textContent.trim().toLowerCase();
        if (
            (btnSection === 'o mnie' && sectionName === 'about') ||
            (btnSection === 'projekty' && sectionName === 'projects') ||
            (btnSection === 'umiejętności' && sectionName === 'skills') ||
            (btnSection === 'kontakt' && sectionName === 'contact')
        ) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Zmień hash w URL jeśli trzeba
    if (updateHash) {
        window.location.hash = sectionName;
    }

    // Przewiń do góry sekcji
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// === EFEKT PISANIA ===

function initializeTypeWriter() {
    const title = document.querySelector('h1');
    const originalText = title.innerText;
    
    // Opóźnij start efektu
    setTimeout(() => {
        typeWriter(title, originalText, 150);
    }, 500);
}

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// === FORMULARZ KONTAKTOWY ===

function initializeForm() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// w pliku public/js/script.js

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Walidacja po stronie klienta
    if (!data.name || !data.email || !data.subject || !data.message) {
        showNotification('Proszę wypełnić wszystkie pola!', 'error');
        return;
    }
    
    showNotification('Wysyłanie wiadomości...', 'info');

    try {
        // Wysyłamy dane do naszego LOKALNEGO backendu
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Dziękuję za wiadomość! Została wysłana pomyślnie.', 'success');
            form.reset();
        } else {
            showNotification(`Błąd: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Błąd:', error);
        showNotification('Nie można połączyć się z serwerem. Upewnij się, że jest uruchomiony!', 'error');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Usuń poprzednie powiadomienia
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Utwórz nowe powiadomienie
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style powiadomienia
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        fontFamily: 'Courier New, monospace',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Kolory w zależności od typu
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Dodaj do DOM
    document.body.appendChild(notification);
    
    // Animacja pojawienia
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Automatyczne usunięcie po 4 sekundach
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// === EFEKTY SCROLL ===

function initializeScrollEffects() {
    // Obserwator dla animacji przy scrollowaniu
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Obserwuj karty i umiejętności
    const cards = document.querySelectorAll('.card, .skill');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}

// === DODATKOWE FUNKCJE ===

// Smooth scroll dla nawigacji
function smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Funkcja do animacji liczb (przydatna dla statystyk)
function animateNumber(element, targetNumber, duration = 2000) {
    const startNumber = 0;
    const increment = targetNumber / (duration / 16);
    let currentNumber = startNumber;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber);
    }, 16);
}

// Funkcja do ładowania projektów z zewnętrznego źródła (placeholder)
async function loadProjects() {
    // Placeholder dla przyszłego API
    try {
        // const response = await fetch('/api/projects');
        // const projects = await response.json();
        // renderProjects(projects);
        console.log('Funkcja loadProjects gotowa do implementacji API');
    } catch (error) {
        console.error('Błąd ładowania projektów:', error);
    }
}

// Funkcja do renderowania projektów
function renderProjects(projects) {
    const projectsGrid = document.querySelector('#projects .grid');
    if (!projectsGrid || !projects) return;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const card = createProjectCard(project);
        projectsGrid.appendChild(card);
    });
}

// Tworzenie karty projektu
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-project', project.id); // Dodano atrybut data-project
    
    card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-stack">
            ${project.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('')}
        </div>
        ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">Zobacz projekt</a>` : ''}
    `;
    
    return card;
}

// Funkcja do kopiowania kontaktu
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Skopiowano do schowka!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Skopiowano do schowka!', 'success');
    } catch (err) {
        showNotification('Nie udało się skopiować', 'error');
    }
    
    document.body.removeChild(textArea);
}

// === KEYBOARD NAVIGATION & EASTER EGG ===

const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let konamiIndex = 0;

function activateMatrixMode() {
    if (document.body.classList.contains('matrix-theme')) return;
    document.body.className = 'matrix-theme';
    showNotification('Matrix mode activated!', 'info');
    startMatrixRain();
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.style.display = 'none';
    }
}

// Nawigacja klawiaturą
document.addEventListener('keydown', function(e) {
    // Easter Egg check
    const keyPressed = e.key.toLowerCase();
    if (keyPressed === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateMatrixMode();
            konamiIndex = 0; // Zresetuj, aby można było wpisać ponownie
        }
    } else {
        // if the key pressed is the first key of the code, start over
        if (keyPressed === konamiCode[0]) {
            konamiIndex = 1;
        } else {
            konamiIndex = 0;
        }
    }

    // ESC - powrót do strony głównej
    if (e.key === 'Escape') {
        showSection('about');
    }

    // Cyfry 1-4 - nawigacja do sekcji
    const sectionMap = {
        '1': 'about',
        '2': 'projects',
        '3': 'skills',
        '4': 'contact'
    };

    if (sectionMap[e.key]) {
        showSection(sectionMap[e.key]);
    }

    // T - toggle theme
    if (e.key.toLowerCase() === 't' && e.ctrlKey) {
        e.preventDefault();
        // Nie przełączaj motywu, jeśli jesteśmy w trybie Matrix
        if (!document.body.classList.contains('matrix-theme')) {
            // toggleTheme();
        }
    }
});

// === MATRIX RAIN EFFECT ===
let matrixRainInterval = null;
let matrixDrops = [];
let matrixColumns = 0;
const matrixFontSize = 14;
const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';
const matrixCharArray = matrixChars.split('');

function drawMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41'; // Kolor liter
    ctx.font = matrixFontSize + 'px monospace';

    for (let i = 0; i < matrixDrops.length; i++) {
        const text = matrixCharArray[Math.floor(Math.random() * matrixCharArray.length)];
        ctx.fillText(text, i * matrixFontSize, matrixDrops[i] * matrixFontSize);

        if (matrixDrops[i] * matrixFontSize > canvas.height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }
        matrixDrops[i]++;
    }
}

function setupMatrixCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    matrixColumns = canvas.width / matrixFontSize;
    matrixDrops = [];
    for (let x = 0; x < matrixColumns; x++) {
        matrixDrops[x] = 1;
    }
}

function startMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas || matrixRainInterval) return; // Już działa

    setupMatrixCanvas();
    matrixRainInterval = setInterval(drawMatrix, 33);
}


// === PERFORMANCE OPTIMIZATION ===

// Debounce function dla zdarzeń resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Obsługa resize okna
const handleResize = debounce(() => {
    // Dostosuj layout jeśli potrzebne
    console.log('Window resized');
    if (document.body.classList.contains('matrix-theme')) {
        setupMatrixCanvas();
    }
}, 250);

window.addEventListener('resize', handleResize);

// === ACCESSIBILITY ===

// Ulepszenia dostępności
function initializeA11y() {
    // Dodaj focus indicators
    const focusableElements = document.querySelectorAll('button, input, textarea, a[href]');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
        });
        
        element.addEventListener('blur', function() {
        });
    });
}

// Uruchom ulepszenia dostępności
// document.addEventListener('DOMContentLoaded', initializeA11y); // Przeniesione

// === EKSPORT FUNKCJI (jeśli używane jako moduł) ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        toggleTheme,
        typeWriter,
        animateNumber,
        copyToClipboard
    };
}