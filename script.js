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
 * Uloženie údajov formuláru
 * @param {Object} formData - Zbierané údaje
 */
function saveFormData(formData) {
    // Uloženie do localStorage
    const responses = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]');
    const timestamp = new Date().toLocaleString('sk-SK');
    
    const response = {
        timestamp,
        ...formData
    };
    
    responses.push(response);
    localStorage.setItem('questionnaire_responses', JSON.stringify(responses));
    
    console.log('Dotazník uložený:', response);
}

/**
 * Zobrazenie správy o úspechu
 */
function displaySuccessMessage() {
    const container = document.querySelector('.questionnaire-section');
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <p>✓ Ďakujeme za vyplnenie dotazníka!</p>
        <p>Veľmi sa tešíme na vašu účasť.</p>
    `;
    
    // Vloženie správy za formulár
    const form = document.getElementById('rsvpForm');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Automatické skrytie
    setTimeout(function() {
        successDiv.style.opacity = '0';
        successDiv.style.transition = 'opacity 0.5s ease';
    }, 2000);
}

/**
 * Zobrazenie chybovej správy
 * @param {string} message - Chybová správa
 */
function showErrorMessage(message) {
    alert(message);
}