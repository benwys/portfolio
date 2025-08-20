// js/script.js - Główna logika aplikacji

// Zmienne globalne
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cache selektorów DOM dla lepszej wydajności
const DOMCache = {
    sections: null,
    navButtons: null,
    projectsGrid: null,
    
    initialize() {
        this.sections = document.querySelectorAll('.section');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.projectsGrid = document.getElementById('projects-grid');
    }
};

// Mapowanie sekcji dla eliminacji duplikacji
const SECTION_MAPPING = {
    'start': 'start',
    'o mnie': 'about',
    'projekty': 'projects',
    'umiejętności': 'skills',
    'kontakt': 'contact'
};

function getSectionFromButtonText(buttonText) {
    return SECTION_MAPPING[buttonText.trim().toLowerCase()];
}

// --- NATYCHMIASTOWE ZASTOSOWANIE MOTYWU --- 
// Musi być na samej górze, aby uniknąć migotania.
(function() {
    let theme = 'dark';
    
    try {
        const navigationEntries = performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
            sessionStorage.removeItem('portfolio-theme');
        } else {
            theme = sessionStorage.getItem('portfolio-theme') || 'dark';
        }
    } catch (e) {
        // Fallback dla starszych przeglądarek
        try {
            theme = sessionStorage.getItem('portfolio-theme') || 'dark';
        } catch (storageError) {
            theme = 'dark';
        }
    }

    document.documentElement.className = `${theme}-theme`;
    if (theme === 'matrix') {
        document.body.classList.add('matrix-theme');
    }
})();

// --- NATYCHMIASTOWE POKAZANIE WŁAŚCIWEJ SEKCJI PRZED DOMContentLoaded ---
// Ten blok musi być na samym początku pliku!
(function() {
    // Obsługa hash w URL przy starcie (przed DOMContentLoaded)
    let sectionFromHash = window.location.hash ? window.location.hash.substring(1) : 'start';
    const validSections = ['start', 'about', 'projects', 'skills', 'contact'];
    if (!validSections.includes(sectionFromHash)) {
        sectionFromHash = 'start';
    }
    // Działaj tylko, jeśli docelowa sekcja istnieje (na stronie głównej).
    const targetSection = document.getElementById(sectionFromHash);
    if (targetSection) {
        // Ukryj wszystkie sekcje
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        // Pokaż wybraną sekcję
        targetSection.classList.add('active');
        // Zaktualizuj aktywny przycisk nawigacji
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(button => {
            const btnSection = button.textContent.trim().toLowerCase();
            if (
                (btnSection === 'start' && sectionFromHash === 'start') ||
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
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    DOMCache.initialize(); // Inicjalizuj cache selektorów DOM
    initializeTheme();
    initializeTypeWriter();
    initializeForm();
    initializeScrollEffects();
    initializeA11y();
    initializeProjects(); // Dodano ładowanie projektów
    // Nie wywołuj showSection na starcie, bo już to zrobiliśmy powyżej

    // Auto-aktywacja trybu Matrix po północy
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 3) { // Od północy do 3:00
        setTimeout(activateMatrixMode, 500);
    }
});

// Obsługa zmiany hash (np. cofanie/ponawianie w przeglądarce)
window.addEventListener('hashchange', function() {
    let sectionFromHash = window.location.hash ? window.location.hash.substring(1) : 'start';
    const validSections = ['start', 'about', 'projects', 'skills', 'contact'];
    if (!validSections.includes(sectionFromHash)) {
        sectionFromHash = 'start';
    }
    showSection(sectionFromHash, false);
});

// === ZARZĄDZANIE MOTYWAMI ===

function initializeTheme() {
    const savedTheme = sessionStorage.getItem('portfolio-theme') || 'dark';

    // Jeśli motyw to matrix, upewnij się, że animacja jest aktywna.
    if (savedTheme === 'matrix') {
        startMatrixRain();
    }

    // Logika dla przycisku zmiany motywu (jeśli zostanie w przyszłości odkomentowany)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function applyTheme(theme) {
    document.documentElement.className = `${theme}-theme`;
    sessionStorage.setItem('portfolio-theme', theme);

    if (theme === 'matrix') {
        document.body.classList.add('matrix-theme');
        startMatrixRain();
    } else {
        document.body.classList.remove('matrix-theme');
        stopMatrixRain();
    }
}

function toggleTheme() {
    let currentTheme = sessionStorage.getItem('portfolio-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}
// === NAWIGACJA ===

function showSection(sectionName, updateHash = true) {
    // Pokaż wybraną sekcję (tylko jeśli istnieje na tej stronie)
    const targetSection = document.getElementById(sectionName);
    if (!targetSection) {
        // Jeśli jesteśmy na podstronie projektu, przenieś do strony głównej z odpowiednim hashem
        if (window.location.pathname.includes('/projects/')) {
            window.location.href = `../index.html#${sectionName}`;
        }
        return;
    }

    // Ukryj wszystkie sekcje i aktywuj docelową
    if (DOMCache.sections) {
        DOMCache.sections.forEach(section => {
            section.classList.remove('active');
        });
    }
    targetSection.classList.add('active');

    // Zaktualizuj aktywny przycisk nawigacji
    const buttons = DOMCache.navButtons || document.querySelectorAll('.nav-btn');
    buttons.forEach(button => {
        const mappedSection = getSectionFromButtonText(button.textContent);
        if (mappedSection === sectionName) {
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
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
}

// === EFEKT PISANIA ===

function initializeTypeWriter() {
    if (prefersReducedMotion) return;
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
    if (prefersReducedMotion) {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    } else {
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
    }

    // Automatyczne usunięcie po 4 sekundach
    setTimeout(() => {
        if (prefersReducedMotion) {
            if (notification.parentNode) {
                notification.remove();
            }
        } else {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);

}

// === EFEKTY SCROLL ===

function initializeScrollEffects() {
    if (prefersReducedMotion) return;
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
    // Używamy sluga do nawigacji, a nie ID
    card.setAttribute('data-slug', project.slug);
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        window.location.href = `/projects/${project.slug}`;
    });

    // Generowanie wewnętrznego HTML karty
    const innerHTML = `
        <h3>${project.title || 'Brak tytułu'}</h3>
        <p>${project.description || 'Brak opisu.'}</p>
        <div class="tech-stack">
            ${(project.technologies || []).map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('')}
        </div>
        ${project.link ? `<a href="${project.link}" class="project-link" target="_blank" onclick="event.stopPropagation()">Zobacz na zewnątrz</a>` : ''}
    `;

    card.innerHTML = innerHTML;
    return card;
}

// --- NOWA FUNKCJA DO ŁADOWANIA PROJEKTÓW ---
async function initializeProjects() {
    if (DOMCache.projectsGrid) {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) {
                throw new Error(`Błąd HTTP: ${response.status}`);
            }
            const projects = await response.json();
            renderProjects(projects);
        } catch (error) {
            console.error('Błąd podczas ładowania projektów:', error);
            DOMCache.projectsGrid.innerHTML = '<p class="error-message">Nie udało się załadować projektów. Spróbuj odświeżyć stronę.</p>';
        }
    }
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

function activateMatrixMode(showNotif = true) {
    if (document.documentElement.className.includes('matrix-theme') || prefersReducedMotion) return;
    
    applyTheme('matrix');

    if (showNotif) {
        showNotification('Matrix mode activated!', 'info');
    }

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
        showSection('start');
    }

    // Cyfry 1-5 - nawigacja do sekcji
    // const sectionMap = {
    //     '1': 'start',
    //     '2': 'projects',
    //     '3': 'skills',
    //     '4': 'about',
    //     '5': 'contact'
    // };

    // if (sectionMap[e.key]) {
    //     showSection(sectionMap[e.key]);
    // }

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

    canvas.style.display = 'block';
    setupMatrixCanvas();
    // Zwiększono interval z 33ms do 50ms dla lepszej wydajności
    matrixRainInterval = setInterval(drawMatrix, 50);
}

function stopMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        canvas.style.display = 'none';
    }
    if (matrixRainInterval) {
        clearInterval(matrixRainInterval);
        matrixRainInterval = null;
    }
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