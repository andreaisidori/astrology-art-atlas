import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS and Cache-Control headers to completely prevent caching
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repoOwner = process.env.GITHUB_REPO_OWNER || 'andreaisidori';
  const repoName = process.env.GITHUB_REPO_NAME || 'astrology-art-atlas';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'public/data/atlas.json';

  // 1. Try to fetch the live, latest data from GitHub API
  if (token) {
    try {
      const getFileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`;
      const getFileRes = await fetch(getFileUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'AAA-Curator-Studio',
        },
        cache: 'no-store',
      });

      if (getFileRes.ok) {
        const fileInfo = await getFileRes.json();
        const contentStr = Buffer.from(fileInfo.content, 'base64').toString('utf-8');
        const json = JSON.parse(contentStr);
        return res.status(200).json(json);
      }
    } catch (ghErr) {
      console.warn('GitHub live fetch fallback:', ghErr);
    }
  }

  // 2. Fallback to local static file if GitHub API is unreachable
  try {
    const localFilePath = path.join(process.cwd(), 'public', 'data', 'atlas.json');
    if (fs.existsSync(localFilePath)) {
      const fileData = fs.readFileSync(localFilePath, 'utf-8');
      return res.status(200).json(JSON.parse(fileData));
    }
  } catch (fsErr) {
    console.error('File fallback error:', fsErr);
  }

  return res.status(500).json({ error: 'Impossibile caricare i dati dell’atlante.' });
}
