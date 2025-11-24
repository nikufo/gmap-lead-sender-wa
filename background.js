// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Lead Gen & WhatsApp Sender Extension Installed');
  // Initialize default settings if needed
  chrome.storage.local.set({
    universalMode: false,
    scrapeDelay: 2000,
    templates: []
  });
});
