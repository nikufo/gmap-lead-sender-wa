// Regex for international phone numbers (simplified)
// Matches: +1234567890, (123) 456-7890, 123-456-7890
const PHONE_REGEX = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

const injectUniversalButtons = () => {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    const nodesToReplace = [];

    while (node = walker.nextNode()) {
        // Skip if already inside a link or script/style
        if (node.parentElement.tagName === 'A' ||
            node.parentElement.tagName === 'SCRIPT' ||
            node.parentElement.tagName === 'STYLE' ||
            node.parentElement.tagName === 'TEXTAREA' ||
            node.parentElement.isContentEditable) {
            continue;
        }

        if (node.nodeValue.match(PHONE_REGEX)) {
            // Check if it's a reasonable length for a phone number (e.g. > 6 digits)
            const digits = node.nodeValue.replace(/\D/g, '');
            if (digits.length > 6 && digits.length < 16) {
                nodesToReplace.push(node);
            }
        }
    }

    nodesToReplace.forEach(node => {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        // Reset regex
        PHONE_REGEX.lastIndex = 0;

        const text = node.nodeValue;
        let match;

        // We only replace the first match to avoid messing up the DOM too much in one go
        // or we can replace all. Let's try to be safe and just append an icon.

        // Actually, replacing text node with HTML is tricky. 
        // Easier strategy: Wrap the phone number in a span and append the icon.

        const span = document.createElement('span');
        span.innerHTML = text.replace(PHONE_REGEX, (match) => {
            const cleanPhone = match.replace(/\D/g, '');
            if (cleanPhone.length < 7) return match; // Too short

            return `${match} <a href="https://web.whatsapp.com/send?phone=${cleanPhone}" target="_blank" style="text-decoration:none; margin-left:4px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style="width:16px; height:16px; vertical-align:middle;" alt="WA">
        </a>`;
        });

        if (span.innerHTML !== text) {
            node.parentNode.replaceChild(span, node);
        }
    });
};

// Check settings before running
chrome.storage.local.get(['universalMode'], (result) => {
    if (result.universalMode) {
        console.log('Universal Mode Enabled: Scanning for phone numbers...');
        // Run after a slight delay to let page load
        setTimeout(injectUniversalButtons, 2000);
    }
});
