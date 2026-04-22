/**
 * Comfort Planner — Personalized end-of-life comfort and legacy planning.
 * @module comfort-planner
 * @license GPL-3.0
 * @author OliWoods Foundation
 */
import { z } from 'zod';

export const ComfortPlanSchema = z.object({
  id: z.string().uuid(), patientName: z.string(),
  painProtocol: z.object({ currentLevel: z.number().int().min(0).max(10), targetLevel: z.number().int().min(0).max(10), medications: z.array(z.string()), nonPharmacological: z.array(z.string()) }),
  environmentPreferences: z.object({ music: z.array(z.string()), lighting: z.enum(['natural', 'dim', 'dark']), temperature: z.enum(['cool', 'warm', 'normal']), scents: z.array(z.string()), quietHours: z.string().optional() }),
  spiritualSupport: z.object({ tradition: z.string().optional(), chaplainRequested: z.boolean(), rituals: z.array(z.string()), readings: z.array(z.string()) }),
  legacyProjects: z.array(z.object({ type: z.string(), description: z.string(), status: z.enum(['not-started', 'in-progress', 'completed']) })),
});

export const SymptomTrackSchema = z.object({
  timestamp: z.string().datetime(), patientId: z.string(),
  pain: z.number().int().min(0).max(10), nausea: z.number().int().min(0).max(10),
  anxiety: z.number().int().min(0).max(10), dyspnea: z.number().int().min(0).max(10),
  fatigue: z.number().int().min(0).max(10), appetite: z.enum(['none', 'poor', 'fair', 'good']),
  notes: z.string().optional(),
});

export const FamilyGuidanceSchema = z.object({
  stage: z.enum(['weeks-before', 'days-before', 'hours-before', 'active-dying', 'after-death']),
  whatToExpect: z.array(z.string()), whatYouCanDo: z.array(z.string()), normalSigns: z.array(z.string()), whenToCallHospice: z.array(z.string()),
});

export type ComfortPlan = z.infer<typeof ComfortPlanSchema>;
export type SymptomTrack = z.infer<typeof SymptomTrackSchema>;
export type FamilyGuidance = z.infer<typeof FamilyGuidanceSchema>;

export function generateFamilyGuidance(stage: FamilyGuidance['stage']): FamilyGuidance {
  const guidance: Record<string, FamilyGuidance> = {
    'weeks-before': {
      stage: 'weeks-before',
      whatToExpect: ['Increased sleeping', 'Decreased appetite and thirst', 'Withdrawal from activities', 'Desire to resolve unfinished business'],
      whatYouCanDo: ['Follow their lead on eating — do not force food', 'Share memories and express love', 'Help with legacy projects if desired', 'Accept help from hospice team and friends'],
      normalSigns: ['Sleeping 16+ hours per day', 'Eating very little', 'Talking about seeing deceased loved ones'],
      whenToCallHospice: ['Uncontrolled pain', 'Severe anxiety or agitation', 'Falls or sudden changes', 'Questions about medications'],
    },
    'days-before': {
      stage: 'days-before',
      whatToExpect: ['Minimal eating or drinking', 'Confusion or restlessness', 'Changes in breathing patterns', 'Cooling of extremities', 'Picking at blankets'],
      whatYouCanDo: ['Speak softly — hearing is the last sense to go', 'Keep lips moist with swabs', 'Play favorite music softly', 'Hold their hand', 'Give permission to let go'],
      normalSigns: ['Mottled skin on knees and feet', 'Irregular breathing', 'Periods of no breathing (Cheyne-Stokes)', 'Decreased urine output'],
      whenToCallHospice: ['Uncontrolled symptoms', 'Caregiver feels overwhelmed', 'Any questions at all — that is what hospice is for'],
    },
    'active-dying': {
      stage: 'active-dying',
      whatToExpect: ['Unconsciousness', 'Rattling breath sounds (normal)', 'Very irregular breathing', 'Fixed gaze'],
      whatYouCanDo: ['Be present', 'Speak to them — assume they can hear', 'Touch gently', 'It is okay to step out of the room — many people die in a brief moment alone'],
      normalSigns: ['Gurgling sounds are not choking — it is fluid the body can no longer clear', 'Jaw may relax', 'Long pauses between breaths are normal'],
      whenToCallHospice: ['When death occurs — there is no rush', 'If you need emotional support'],
    },
    'after-death': {
      stage: 'after-death',
      whatToExpect: ['You may feel relief, grief, numbness, or all at once — all are normal', 'The hospice nurse will come to pronounce death', 'Take as much time as you need before calling the funeral home'],
      whatYouCanDo: ['Sit with your loved one as long as you wish', 'Bathe or dress them if culturally appropriate', 'Call family members when you are ready', 'The hospice nurse handles medication disposal and death certificate'],
      normalSigns: ['Grief comes in waves — there is no right way to grieve', 'Numbness is a normal protective response'],
      whenToCallHospice: ['Call the hospice 24/7 number when ready — they will guide you through next steps'],
    },
  };
  return FamilyGuidanceSchema.parse(guidance[stage] || guidance['weeks-before']);
}

export function trackSymptomTrend(entries: SymptomTrack[]): {
  averages: Record<string, number>; trend: string; alerts: string[];
} {
  if (entries.length === 0) return { averages: {}, trend: 'insufficient data', alerts: [] };
  const fields = ['pain', 'nausea', 'anxiety', 'dyspnea', 'fatigue'] as const;
  const averages: Record<string, number> = {};
  for (const f of fields) averages[f] = Math.round(entries.reduce((s, e) => s + e[f], 0) / entries.length * 10) / 10;
  const alerts: string[] = [];
  if (averages.pain > 6) alerts.push('Pain above 6/10 average — notify hospice nurse for medication adjustment');
  if (averages.dyspnea > 5) alerts.push('Significant shortness of breath — may need oxygen or positioning changes');
  if (averages.anxiety > 6) alerts.push('Elevated anxiety — consider PRN anxiolytic or music therapy');
  const recent = entries.slice(-3);
  const older = entries.slice(0, 3);
  const recentAvg = recent.reduce((s, e) => s + e.pain, 0) / recent.length;
  const olderAvg = older.reduce((s, e) => s + e.pain, 0) / older.length;
  const trend = recentAvg > olderAvg + 1 ? 'worsening' : recentAvg < olderAvg - 1 ? 'improving' : 'stable';
  return { averages, trend, alerts };
}

export function suggestLegacyProjects(): Array<{ type: string; description: string }> {
  return [
    { type: 'letters', description: 'Write letters to loved ones to be opened at future milestones' },
    { type: 'memory-book', description: 'Create a photo and story book of favorite memories' },
    { type: 'video-messages', description: 'Record video messages for birthdays, graduations, or just to say I love you' },
    { type: 'recipe-collection', description: 'Document family recipes with stories behind each dish' },
    { type: 'ethical-will', description: 'Write an ethical will sharing your values, life lessons, and hopes for the future' },
    { type: 'playlist', description: 'Create playlists of songs that tell your life story' },
    { type: 'family-tree', description: 'Document family history and stories for future generations' },
  ];
}
