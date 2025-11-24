// Utility functions

export const formatPhoneNumber = (phone) => {
    // Basic cleaning, can be improved
    return phone.replace(/\D/g, '');
};

export const createWhatsAppLink = (phone) => {
    return `https://web.whatsapp.com/send?phone=${formatPhoneNumber(phone)}`;
};
