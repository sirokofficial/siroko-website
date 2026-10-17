// Serverless function (Vercel): POST { name, email } -> { memberNumber, walletUrl }.
// Provider and member store live in api/_provider.js. A repeat email gets its existing card back.
const { findMember, nextMemberNumber, createWalletPass } = require('./_provider');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email } = req.body || {};
  if (!name || !/^\S+@\S+\.\S+$/.test(email || '')) {
    return res.status(400).json({ message: 'Add your name and a valid email.' });
  }

  try {
    const existing = await findMember(email);
    if (existing) return res.status(200).json({ memberNumber: existing.memberNumber, walletUrl: existing.walletUrl });

    const memberNumber = await nextMemberNumber();
    const walletUrl = await createWalletPass({ name: name.trim().slice(0, 60), email, memberNumber });
    return res.status(200).json({ memberNumber, walletUrl });
  } catch (error) {
    if (error.code === 'NOT_CONFIGURED') {
      return res.status(501).json({ message: 'Siroko Card is launching soon. Check back shortly.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong. Try again in a moment.' });
  }
};
