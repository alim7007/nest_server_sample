require('dotenv').config();

export const commonConstants = {
    maxStringInputLength: 255,
    minPasswordLength: 8,
    maxPasswordLength: 255,
    maxNameLength: 255,
    maxEmailLength: 255,
    maxTokenLength: 255,
    maxSearchItemsPerPage: 20,
    defaultUserName: 'Customer',
    defaultAdminUserName: 'Admin',
    defaultExternalLoginDomain: 'external-source',
    defaultUserNameLength: 8,
    supportedContries: ['US'],
    maxInputUrlLength: 512,
    supportPhone: process.env.SUPPORT_PHONE || '',
    supportEmail: process.env.EMAIL_FROM || ''
};