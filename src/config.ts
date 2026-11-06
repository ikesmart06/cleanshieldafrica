/**
 * ============================================================
 *  CLEANSHIELD — SITE SETTINGS (edit this file only)
 * ============================================================
 *  Put your real numbers here. Everything on the site
 *  (call buttons, WhatsApp buttons, order form) uses them.
 */
export const SITE = {
  /** Phone number for the "Call" buttons, with country code. Example: "+225 07 00 00 00 00" */
  phoneDisplay: '+225 07 00 00 00 00',

  /** Same number, digits only with country code, no "+" or spaces. Used for tel: links. */
  phoneDigits: '2250700000000',

  /** WhatsApp number, digits only with country code, no "+". Often the same as the phone. */
  whatsapp: '2250700000000',

  /** Where you deliver (shown on the site). */
  deliveryArea: { fr: "partout en Côte d'Ivoire", en: 'across Côte d’Ivoire' },
  city: "Abidjan, Côte d'Ivoire",

  /** Social links — leave '' to hide an icon. */
  facebook: '',
  instagram: '',
  tiktok: '',
};

export const telLink = `tel:+${SITE.phoneDigits}`;
export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
