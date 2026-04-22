/**
 * Advance Directive Builder — Guide users through creating legally-recognized advance directives.
 * @module directive-builder
 * @license GPL-3.0
 * @author OliWoods Foundation
 */
import { z } from 'zod';

export const AdvanceDirectiveSchema = z.object({
  id: z.string().uuid(), userId: z.string(), state: z.string(), createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
  healthcareProxy: z.object({ name: z.string(), relationship: z.string(), phone: z.string(), alternateAgent: z.object({ name: z.string(), phone: z.string() }).optional() }),
  lifeSustainingTreatment: z.object({
    cpr: z.enum(['yes', 'no', 'try-then-stop', 'undecided']),
    mechanicalVentilation: z.enum(['yes', 'no', 'trial-period', 'undecided']),
    artificialNutrition: z.enum(['yes', 'no', 'short-term-only', 'undecided']),
    dialysis: z.enum(['yes', 'no', 'undecided']),
    antibiotics: z.enum(['yes', 'comfort-only', 'undecided']),
  }),
  comfortPreferences: z.object({
    painManagement: z.enum(['aggressive', 'moderate', 'minimal']), musicOrSpiritual: z.string().optional(), location: z.enum(['home', 'hospice-facility', 'hospital', 'no-preference']),
    visitors: z.enum(['close-family', 'friends-and-family', 'limited', 'none']),
  }),
  organDonation: z.enum(['yes-all', 'yes-specific', 'no', 'undecided']),
  personalStatement: z.string().optional(),
  witnessRequired: z.boolean(), notarized: z.boolean(),
});

export const HospiceEligibilitySchema = z.object({
  patientName: z.string(), diagnosis: z.string(), prognosis: z.enum(['6-months-or-less', 'uncertain', 'more-than-6-months']),
  functionalDecline: z.boolean(), recurringHospitalizations: z.boolean(), weightLoss: z.boolean(),
  eligibilityLikelihood: z.enum(['likely', 'possible', 'unlikely']),
  nextSteps: z.array(z.string()), medicareCovers: z.boolean(),
});

export const GriefResourceSchema = z.object({
  id: z.string(), name: z.string(), type: z.enum(['support-group', 'counseling', 'hotline', 'online-community', 'book', 'app']),
  description: z.string(), url: z.string().url().optional(), phone: z.string().optional(), free: z.boolean(),
  specializations: z.array(z.string()),
});

export type AdvanceDirective = z.infer<typeof AdvanceDirectiveSchema>;
export type HospiceEligibility = z.infer<typeof HospiceEligibilitySchema>;
export type GriefResource = z.infer<typeof GriefResourceSchema>;

export function assessHospiceEligibility(
  diagnosis: string, prognosis: string, functionalDecline: boolean, recurringHospitalizations: boolean, weightLoss: boolean, patientName: string,
): HospiceEligibility {
  const indicators = [prognosis === '6-months-or-less', functionalDecline, recurringHospitalizations, weightLoss].filter(Boolean).length;
  const likelihood: HospiceEligibility['eligibilityLikelihood'] = indicators >= 3 ? 'likely' : indicators >= 2 ? 'possible' : 'unlikely';
  return HospiceEligibilitySchema.parse({
    patientName, diagnosis, prognosis: prognosis as any, functionalDecline, recurringHospitalizations, weightLoss,
    eligibilityLikelihood: likelihood, medicareCovers: true,
    nextSteps: [
      'Ask the primary physician for a hospice referral',
      'Medicare covers 100% of hospice care — no copays for hospice services',
      'You can receive hospice care at home, in a hospice facility, or in a nursing home',
      'Hospice does NOT mean giving up — patients can leave hospice at any time',
      'Contact the Hospice Foundation of America: 1-800-854-3402',
    ],
  });
}

export function generateDirectiveQuestions(state: string): Array<{ section: string; question: string; options: string[]; helpText: string }> {
  return [
    { section: 'Healthcare Proxy', question: 'Who should make medical decisions for you if you cannot speak for yourself?', options: ['Spouse/partner', 'Adult child', 'Sibling', 'Close friend', 'Other'], helpText: 'Choose someone who understands your values and will advocate for your wishes.' },
    { section: 'CPR', question: 'If your heart stops, do you want CPR?', options: ['Yes', 'No', 'Try then stop if not working', 'Undecided'], helpText: 'CPR success rate for terminally ill patients is approximately 2%. For otherwise healthy people, it is 10-15%.' },
    { section: 'Ventilator', question: 'If you cannot breathe on your own, do you want mechanical ventilation?', options: ['Yes', 'No', 'Trial period only', 'Undecided'], helpText: 'A ventilator is a machine that breathes for you. A trial period means trying it for a set time and stopping if there is no improvement.' },
    { section: 'Nutrition', question: 'If you cannot eat or drink, do you want a feeding tube?', options: ['Yes', 'No', 'Short-term only', 'Undecided'], helpText: 'A feeding tube provides nutrition directly to the stomach. Short-term use may help recovery; long-term use is a quality-of-life decision.' },
    { section: 'Pain Management', question: 'How aggressively do you want pain managed?', options: ['Aggressively (even if it shortens life)', 'Moderately (balance comfort and alertness)', 'Minimally (prefer to be as alert as possible)'], helpText: 'Aggressive pain management may cause drowsiness. This is a personal preference with no wrong answer.' },
    { section: 'Location', question: 'Where would you prefer to receive end-of-life care?', options: ['Home', 'Hospice facility', 'Hospital', 'No preference'], helpText: '70% of Americans prefer to die at home. Hospice makes this possible for many patients.' },
  ];
}

export function findGriefResources(needs: string[]): GriefResource[] {
  const RESOURCES: GriefResource[] = [
    { id: '1', name: 'GriefShare', type: 'support-group', description: 'Faith-based grief recovery groups in 15,000+ churches', free: true, specializations: ['general', 'spouse-loss'], url: 'https://www.griefshare.org' },
    { id: '2', name: '988 Suicide & Crisis Lifeline', type: 'hotline', description: '24/7 crisis support', free: true, phone: '988', specializations: ['crisis', 'suicidal-ideation'] },
    { id: '3', name: 'Compassionate Friends', type: 'support-group', description: 'Support for parents after child loss', free: true, specializations: ['child-loss'], url: 'https://www.compassionatefriends.org' },
    { id: '4', name: 'TAPS (Tragedy Assistance)', type: 'support-group', description: 'Support for military families', free: true, specializations: ['military', 'sudden-loss'], url: 'https://www.taps.org' },
    { id: '5', name: 'Modern Loss', type: 'online-community', description: 'Online community for grief', free: true, specializations: ['general', 'young-adults'], url: 'https://modernloss.com' },
  ];
  if (needs.length === 0) return RESOURCES;
  return RESOURCES.filter(r => needs.some(n => r.specializations.some(s => s.includes(n.toLowerCase()) || n.toLowerCase().includes(s))));
}
