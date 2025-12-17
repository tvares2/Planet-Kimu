'use server';

import { generateReasonForLove } from '@/ai/flows/generate-reasons-for-love';

export async function generateReason(): Promise<{ reason: string | null }> {
  try {
    const reason = await generateReasonForLove();
    return { reason };
  } catch (error) {
    console.error('Error generating reason:', error);
    return { reason: 'My love for you is beyond words right now.' };
  }
}
