import { checkAdminPassword } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const auth = checkAdminPassword(req.body?.password);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }
  return res.status(200).json({ success: true });
}
