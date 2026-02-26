/* ============================================
   SVADOBNÝ DOTAZNÍK - JAVASCRIPT
   Logika formuláru a interakcie
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupDynamicInputs();
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
 * Nastavenie dynamických vstupov (zobrazenie/skrytie)
 */
function setupDynamicInputs() {
    // Zobrazenie iného inputu pre dietu
    const dietOtherCheckbox = document.querySelector('input[name="diet"][value="other"]');
    const dietOtherInput = document.querySelector('.diet-other');
    
    if (dietOtherCheckbox && dietOtherInput) {
        dietOtherCheckbox.addEventListener('change', function() {
            dietOtherInput.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Zobrazenie iného inputu pre alkohol
    const alcoholOtherCheckbox = document.querySelector('input[name="alcohol"][value="other"]');
    const alcoholOtherInput = document.querySelector('.alcohol-other');
    
    if (alcoholOtherCheckbox && alcoholOtherInput) {
        alcoholOtherCheckbox.addEventListener('change', function() {
            alcoholOtherInput.style.display = this.checked ? 'block' : 'none';
        });
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
    
    // Uloženie údajov
    saveFormData(formData);
    
    // Zobrazenie správy o úspechu
    displaySuccessMessage();
    
    // Resetovanie formuláru
    event.target.reset();
    
    // Skrytie formuláru po chvíli
    setTimeout(function() {
        document.getElementById('rsvpForm').style.display = 'none';
    }, 3000);
}

/**
 * Zbieranie údajov z formuláru
 * @returns {Object} Zbierané údaje formuláru
 */
function collectFormData() {
    const formData = {};
    
    // Zber mien
    const namesInput = document.querySelector('input[placeholder="Napíšte mená..."]');
    formData.names = namesInput ? namesInput.value.trim() : '';
    
    // Zber transportu
    const transportCheckboxes = document.querySelectorAll('input[name="transport"]');
    formData.transport = Array.from(transportCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .join(', ') || 'Neuvedené';
    
    // Zber diety
    const dietCheckboxes = document.querySelectorAll('input[name="diet"]');
    formData.diet = Array.from(dietCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .join(', ') || 'Bez obmedzení';
    
    if (document.querySelector('.diet-other').style.display !== 'none') {
        const dietOtherValue = document.querySelector('.diet-other').value.trim();
        if (dietOtherValue) {
            formData.dietOther = dietOtherValue;
        }
    }
    
    // Zber alkoholu
    const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]');
    formData.alcohol = Array.from(alcoholCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .join(', ') || 'Neuvedené';
    
    if (document.querySelector('.alcohol-other').style.display !== 'none') {
        const alcoholOtherValue = document.querySelector('.alcohol-other').value.trim();
        if (alcoholOtherValue) {
            formData.alcoholOther = alcoholOtherValue;
        }
    }
    
    // Zber bonusu
    const bonusTextarea = document.querySelector('textarea[placeholder="Napíšte vašu správu..."]');
    formData.bonus = bonusTextarea ? bonusTextarea.value.trim() : '';
    
    return formData;
}

/**
 * Validácia údajov formuláru
 * @param {Object} formData - Zbierané údaje
 * @returns {boolean} Platnosť dát
 */
function validateFormData(formData) {
    // Kontrola mien
    if (!formData.names || formData.names.length < 2) {
        return false;
    }
    
    return true;
}

/**
 * Uloženie údajov do Google Apps Script a Google Sheets
 * @param {Object} formData - Zbierané údaje
 */
function saveFormData(formData) {
    // ⚠️ ZMEŇ TÚTO URL NA SVOJU Z GOOGLE APPS SCRIPT DEPLOYMENT
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlEKpeOf_0uk2IgtL9S-YKWK85yJi6tFJUWJTOaF2lBRAUCg2Y6IZNCtLfEKTinq8/exec";
    
    // Vytvorenie FormData (nie JSON!) - toto obchádza CORS!
    const formDataToSend = new FormData();
    formDataToSend.append('names', formData.names);
    formDataToSend.append('transport', formData.transport);
    formDataToSend.append('diet', formData.diet);
    if (formData.dietOther) {
        formDataToSend.append('dietOther', formData.dietOther);
    }
    formDataToSend.append('alcohol', formData.alcohol);
    if (formData.alcoholOther) {
        formDataToSend.append('alcoholOther', formData.alcoholOther);
    }
    formDataToSend.append('bonus', formData.bonus);
    formDataToSend.append('timestamp', new Date().toLocaleString('sk-SK'));
    formDataToSend.append('weddingRSVP', 'true');
    
    // Odoslanie údajov ako FormData (bez CORS problémov!)
    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: formDataToSend
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
    const container = form.parentElement;
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <p>✓ Ďakujeme za vyplnenie dotazníka!</p>
        <p>Veľmi sa tešíme na vašu účasť.</p>
    `;
    
    // Vloženie správy za formulár
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Skrytie formuláru
    form.style.display = 'none';
}

/**
 * Zobrazenie chybovej správy
 * @param {string} message - Chybová správa
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