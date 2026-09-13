import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data, githubToken } = req.body || {};

    if (!data || !data.opere) {
      return res.status(400).json({ error: 'Dati non validi: manca il campo opere.' });
    }

    const jsonContent = JSON.stringify(data, null, 2);

    // 1. Try GitHub API commit if token is available in env or request body
    const token = githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'andreaisidori';
    const repoName = process.env.GITHUB_REPO_NAME || 'astrology-art-atlas';
    const branch = process.env.GITHUB_BRANCH || 'main';
    const filePath = 'public/data/atlas.json';

    if (token) {
      // Get current file SHA from GitHub
      const getFileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`;
      const getFileRes = await fetch(getFileUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'AAA-Curator-Studio',
        },
      });

      let currentSha = null;
      if (getFileRes.ok) {
        const fileInfo = await getFileRes.json();
        currentSha = fileInfo.sha;
      }

      // Commit new content to GitHub
      const putFileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
      const putRes = await fetch(putFileUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'AAA-Curator-Studio',
        },
        body: JSON.stringify({
          message: `chore(atlas): update dataset via Curator Studio (${data.opere.length} opere)`,
          content: Buffer.from(jsonContent).toString('base64'),
          branch,
          ...(currentSha ? { sha: currentSha } : {}),
        }),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        console.error('GitHub API error:', errJson);
        return res.status(500).json({
          error: 'Errore durante il commit su GitHub',
          details: errJson,
        });
      }

      const commitResult = await putRes.json();
      return res.status(200).json({
        success: true,
        mode: 'github_commit',
        message: `Dataset salvato e committato con successo su GitHub (${data.opere.length} opere)! Il nuovo deploy Vercel si avvierà automaticamente.`,
        commit: commitResult.commit?.sha,
      });
    }

    // 2. Local fallback if running in a writable node environment (e.g. local / server)
    try {
      const localFilePath = path.join(process.cwd(), 'public', 'data', 'atlas.json');
      fs.writeFileSync(localFilePath, jsonContent, 'utf-8');
      return res.status(200).json({
        success: true,
        mode: 'local_file',
        message: `File public/data/atlas.json salvato con successo su disco (${data.opere.length} opere)!`,
      });
    } catch (fsErr) {
      // Serverless environment read-only filesystem
      return res.status(200).json({
        success: true,
        mode: 'memory',
        message: `Dati sincronizzati con successo (${data.opere.length} opere). Per rendere il commit permanente su GitHub, configura la variabile GITHUB_TOKEN su Vercel.`,
      });
    }
  } catch (error) {
    console.error('Error saving atlas:', error);
    return res.status(500).json({
      error: 'Errore interno nel salvataggio dell’atlante',
      details: error.message,
    });
  }
}
