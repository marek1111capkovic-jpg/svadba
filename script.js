/* ============================================
   SVADOBNÁ STRÁNKA - JAVASCRIPT
   Logika formuláru a interakcie
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

/**
 * Inicializácia formuláru
 */
function initializeForm() {
    const form = document.getElementById('rsvpForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * Spracovanie odoslania formuláru
 * @param {Event} event - Submit event formuláru
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Zbieranie údajov z formuláru
    const formData = collectFormData();
    
    // Validácia údajov
    if (!validateFormData(formData)) {
        showErrorMessage('Prosím, vyplňte všetky povinné polia správne.');
        return;
    }
    
    // Uloženie údajov (v reálnej aplikácii by sa tu poslali na server)
    saveFormData(formData);
    
    // Zobrazenie správy o úspechu
    displaySuccessMessage();
    
    // Resetovanie formuláru
    event.target.reset();
    
    // Skrytie formuláru po chvíli
    setTimeout(function() {
        document.getElementById('rsvpForm').style.display = 'none';
    }, 2000);
}

/**
 * Zbieranie údajov z formuláru
 * @returns {Object} Objekt s údajmi z formuláru
 */
function collectFormData() {
    const form = document.getElementById('rsvpForm');
    
    const name = document.getElementById('name').value.trim();
    const transport = document.querySelector('input[name="transport"]:checked')?.value || '';
    const allergies = document.getElementById('allergies').value.trim();
    
    // Zbieranie vybraných alkoholických nápojov
    const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]:checked');
    const alcohol = Array.from(alcoholCheckboxes).map(cb => cb.value);
    
    const message = document.getElementById('message').value.trim();
    
    return {
        name: name,
        transport: transport,
        allergies: allergies,
        alcohol: alcohol,
        message: message,
        timestamp: new Date().toLocaleString('sk-SK')
    };
}

/**
 * Validácia údajov formuláru
 * @param {Object} data - Údaje na validáciu
 * @returns {boolean} True ak sú údaje platné
 */
function validateFormData(data) {
    // Kontrola povinného mena
    if (!data.name || data.name.length < 3) {
        return false;
    }
    
    // Kontrola povinnej dopravy
    if (!data.transport) {
        return false;
    }
    
    return true;
}

/**
 * Uloženie údajov do Google Apps Script a Google Sheets
 * @param {Object} data - Údaje na uloženie
 */
function saveFormData(data) {
    // ⚠️ ZMEŇ TÚTO URL NA SVOJU Z GOOGLE APPS SCRIPT DEPLOYMENT
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlEKpeOf_0uk2IgtL9S-YKWK85yJi6tFJUWJTOaF2lBRAUCg2Y6IZNCtLfEKTinq8/exec";
    
    // Odoslanie údajov
    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log('✓ Údaje boli odoslané a uložené!', result);
    })
    .catch(error => {
        console.error('✗ Chyba pri odosielaní:', error);
        showErrorMessage('Chyba pri odosielaní. Prosím, skúste neskôr.');
    });
}

/**
 * Zobrazenie správy o úspechu
 */
function displaySuccessMessage() {
    const form = document.getElementById('rsvpForm');
    const successMsg = document.getElementById('successMessage');
    
    // Skrytie formuláru
    form.style.display = 'none';
    
    // Zobrazenie správy
    successMsg.style.display = 'block';
    
    // Animácia появления
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Zobrazenie chybovej správy
 * @param {string} message - Text chybovej správy
 */
function showErrorMessage(message) {
    // Získanie formuláru a vytvorenie chybovej správy
    const form = document.getElementById('rsvpForm');
    
    // Odstránenie starej chybovej správy ak existuje
    const oldError = form.querySelector('.error-message');
    if (oldError) {
        oldError.remove();
    }
    
    // Vytvorenie novej chybovej správy
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = '✗ ' + message;
    errorDiv.style.cssText = `
        background-color: #ffebee;
        border: 1px solid #ef5350;
        border-radius: 5px;
        padding: 15px;
        color: #c62828;
        margin-bottom: 20px;
        font-weight: 500;
    `;
    
    // Vloženie chybovej správy na začiatok formuláru
    form.insertBefore(errorDiv, form.firstChild);
    
    // Automatické skrytie po 4 sekundách
    setTimeout(function() {
        errorDiv.remove();
    }, 4000);
}

/**
 * Funkcia na zobrazenie všetkých uložených údajov (len pre debug)
 * Spustiť v konzole: showAllSubmissions()
 */
function showAllSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('weddingRSVP')) || [];
    console.log('📋 Všetky podania:', submissions);
    return submissions;
}