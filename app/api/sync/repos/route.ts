import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Cron Secret' }, { status: 401 });
    }

    const repos = await prisma.repo.findMany({
      select: { id: true, githubOrg: true, githubRepo: true }
    });

    if (!repos.length) {
      return NextResponse.json({ message: 'No repositories found to sync.' }, { status: 200 });
    }

    // Note: GitHub requires a Personal Access Token (PAT) for API access now.
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      throw new Error("Missing GITHUB_TOKEN in env variables.");
    }

    const CHUNK_SIZE = 10; 
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < repos.length; i += CHUNK_SIZE) {
      const chunk = repos.slice(i, i + CHUNK_SIZE);

      const fetchPromises = chunk.map(async (repo) => {
        const url = `https://api.github.com/repos/${repo.githubOrg}/${repo.githubRepo}`;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'AIAtlas-Sync-Engine'
          }
        });

        if (!res.ok) {
          throw new Error(`GitHub API Error for ${repo.githubOrg}/${repo.githubRepo}: ${res.statusText}`);
        }
        
        const data = await res.json();
        return { repo, data };
      });

      const settled = await Promise.allSettled(fetchPromises);
      const transactions = [];

      for (const outcome of settled) {
        if (outcome.status === 'fulfilled') {
          const { repo, data } = outcome.value;
          const stars = data.stargazers_count;
          const forks = data.forks_count;
          const openIssues = data.open_issues_count;

          transactions.push(
            prisma.repo.update({
              where: { id: repo.id },
              data: {
                stars,
                forks,
                lastSyncedAt: new Date(),
              }
            })
          );

          transactions.push(
            prisma.repoSnapshot.create({
              data: {
                repoId: repo.id,
                stars,
                forks,
                openIssues,
              }
            })
          );
          successCount++;
        } else {
          console.error('Failed to sync repo:', outcome.reason);
          failCount++;
        }
      }

      if (transactions.length > 0) {
        await prisma.$transaction(transactions);
      }

      if (i + CHUNK_SIZE < repos.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sync complete. Success: ${successCount}, Failed: ${failCount}` 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Sync Engine Critical Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}