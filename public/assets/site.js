// Enhanced focus management

// Focus trap for modal dialogs
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('a, area, button, iframe, object, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable]');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    function handleKeyDown(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) { // shift + tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { // tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
}

// Focus restoration when drawer closes
function restoreFocus(previousFocus) {
    if (previousFocus) {
        previousFocus.focus();
    }
}

// Aria-live feedback for language changes
function updateLanguageFeedback() {
    const status = document.getElementById('language-status');
    status.textContent = 'Language changed!';
    status.setAttribute('aria-live', 'polite');
}

// Dynamic range input aria attributes
function setupRangeInput(element) {
    const min = element.getAttribute('min');
    const max = element.getAttribute('max');
    element.setAttribute('aria-valuemin', min);
    element.setAttribute('aria-valuemax', max);
    element.addEventListener('input', function() {
        const value = this.value;
        this.setAttribute('aria-valuenow', value);
    });
}

// Example usage
const drawer = document.getElementById('drawer');
const previousFocus = document.activeElement;
const focusTrapCleanup = trapFocus(drawer);

drawer.addEventListener('close', () => {
    focusTrapCleanup();
    restoreFocus(previousFocus);
});

const rangeInput = document.getElementById('range-input');
setupRangeInput(rangeInput);
