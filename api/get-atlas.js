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

  const token = req.headers.authorization?.replace('Bearer ', '') || req.query?.token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repoOwner = process.env.GITHUB_REPO_OWNER || 'andreaisidori';
  const repoName = process.env.GITHUB_REPO_NAME || 'astrology-art-atlas';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'public/data/atlas.json';

  // 1. Get the exact latest commit SHA on GitHub to bypass CDN caching
  let latestSha = branch;
  try {
    const commitUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${branch}`;
    const commitRes = await fetch(commitUrl, {
      headers: {
        'User-Agent': 'AAA-Curator-Studio',
        'Accept': 'application/vnd.github.v3+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    if (commitRes.ok) {
      const commitData = await commitRes.json();
      if (commitData?.sha) {
        latestSha = commitData.sha;
      }
    }
  } catch (cErr) {
    console.warn('Commit SHA fetch fallback:', cErr);
  }

  // 2. Fetch immutable raw file at exact commit SHA (0-second CDN cache delay)
  try {
    const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${latestSha}/${filePath}`;
    const rawRes = await fetch(rawUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'User-Agent': 'AAA-Curator-Studio',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    if (rawRes.ok) {
      const json = await rawRes.json();
      if (json && json.progetto && Array.isArray(json.opere) && json.opere.length > 0) {
        return res.status(200).json(json);
      }
    }
  } catch (ghErr) {
    console.warn('GitHub raw live fetch fallback:', ghErr);
  }

  // 3. Fallback to local static file if GitHub API is unreachable
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

