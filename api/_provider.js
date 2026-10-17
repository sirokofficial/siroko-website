// Pass provider: WalletWallet (https://www.walletwallet.dev), which signs the Apple Wallet pass
// and returns a hosted install page. Member store: Upstash Redis (Vercel KV) over REST.
// Required env vars: WALLETWALLET_API_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.
// Optional (WalletWallet Pro plan): PASS_LOGO_URL, PASS_COLOR (hex).
const notConfigured = () => Object.assign(new Error('Pass provider not configured'), { code: 'NOT_CONFIGURED' });

const redis = async (...command) => {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
  if (!url || !token) throw notConfigured();
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command)
  });
  if (!response.ok) throw new Error(`Redis error ${response.status}`);
  return (await response.json()).result;
};

// Return an existing member (same email) or null.
async function findMember(email) {
  const saved = await redis('GET', `member:${email.toLowerCase()}`);
  return saved ? JSON.parse(saved) : null;
}

// Next unique member number, e.g. "BCN 00029".
async function nextMemberNumber() {
  const count = await redis('INCR', 'member_counter');
  return `BCN ${String(count).padStart(5, '0')}`;
}

// Create the pass and return its hosted "Add to Apple Wallet" page URL.
async function createWalletPass({ name, email, memberNumber }) {
  const key = process.env.WALLETWALLET_API_KEY;
  if (!key) throw notConfigured();

  const body = {
    organizationName: 'Meet. Connect. Belong.',
    description: 'Siroko Card',
    logoText: 'SIROKO COMMUNITY',
    barcodeFormat: 'QR',
    barcodeValue: memberNumber,
    barcodeAltText: memberNumber,
    colorPreset: 'dark',
    expirationDays: 365,
    logoURL: process.env.PASS_LOGO_URL || 'https://sirokofficial.com/assets/siroko-icon-silver-crop.png',
    headerFields: [{ label: 'CARD', value: 'SRK' }],
    primaryFields: [{ label: 'SIROKO', value: 'STUDENT Card' }],
    secondaryFields: [
      { label: 'MEMBER', value: name },
      { label: 'NUMBER', value: memberNumber }
    ],
    backFields: [{ label: 'Perks', value: 'Show this card at partner restaurants and cafés for your discount. See sirokofficial.com/membership.html for the list.' }]
  };
  if (process.env.PASS_COLOR) body.color = process.env.PASS_COLOR;

  const response = await fetch('https://api.walletwallet.dev/api/passes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`WalletWallet error ${response.status}: ${await response.text()}`);
  const { shareUrl } = await response.json();

  await redis('SET', `member:${email.toLowerCase()}`, JSON.stringify({ name, email, memberNumber, walletUrl: shareUrl }));
  return shareUrl;
}

module.exports = { findMember, nextMemberNumber, createWalletPass };
