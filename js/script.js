// js/script.js - Główna logika aplikacji

// Zmienne globalne
let currentTheme = 'dark';
/*
// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeTypeWriter();
    initializeForm();
    initializeScrollEffects();
});
*/
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

function showSection(sectionName) {
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
        button.classList.remove('active');
    });
    
    // Znajdź kliknięty przycisk i oznacz jako aktywny
    const clickedButton = event.target;
    clickedButton.classList.add('active');
    
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

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Pobierz dane z formularza
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Walidacja
    if (!name || !email || !subject || !message) {
        showNotification('Proszę wypełnić wszystkie pola!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Proszę podać prawidłowy adres email!', 'error');
        return;
    }
    
    // Symulacja wysyłania
    showNotification('Wysyłanie wiadomości...', 'info');
    
    setTimeout(() => {
        showNotification('Dziękuję za wiadomość! Odpowiem tak szybko jak to możliwe.', 'success');
        e.target.reset();
    }, 1500);
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

// === OBSŁUGA KLIKNIĘCIA NA PROJEKT ===
document.addEventListener('DOMContentLoaded', function() {
    // Obsługa kliknięcia na kartę projektu
    const projectCards = document.querySelectorAll('#projects .card[data-project]');
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const projectId = card.getAttribute('data-project');
            if (projectId) {
                window.location.href = `project-${projectId}.html`;
            }
        });
    });
});

// === KEYBOARD NAVIGATION ===

// Nawigacja klawiaturą
document.addEventListener('keydown', function(e) {
    // ESC - powrót do strony głównej
    if (e.key === 'Escape') {
        showSection('home');
        document.querySelector('.nav-btn').click();
    }
    
    // Cyfry 1-5 - nawigacja do sekcji
    const sectionMap = {
        '1': 'home',
        '2': 'projects', 
        '3': 'about',
        '4': 'skills',
        '5': 'contact'
    };
    
    if (sectionMap[e.key]) {
        showSection(sectionMap[e.key]);
        // Znajdź odpowiedni przycisk i oznacz jako aktywny
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach((btn, index) => {
            btn.classList.remove('active');
            if (index === parseInt(e.key) - 1) {
                btn.classList.add('active');
            }
        });
    }
    
    // T - toggle theme
    if (e.key.toLowerCase() === 't' && e.ctrlKey) {
        e.preventDefault();
        toggleTheme();
    }
});

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
document.addEventListener('DOMContentLoaded', initializeA11y);

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