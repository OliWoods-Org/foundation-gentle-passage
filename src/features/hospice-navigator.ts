/**
 * Hospice Navigator — Compare hospice providers, understand coverage, plan transitions.
 * @module hospice-navigator
 * @license GPL-3.0
 * @author OliWoods Foundation
 */
import { z } from 'zod';

export const HospiceProviderSchema = z.object({
  id: z.string(), name: z.string(), type: z.enum(['home-based', 'inpatient', 'residential', 'hospital-based']),
  address: z.object({ city: z.string(), state: z.string(), zip: z.string() }),
  phone: z.string(), medicareRating: z.number().min(1).max(5).optional(),
  services: z.array(z.string()), specializations: z.array(z.string()),
  acceptsMedicare: z.boolean(), acceptsMedicaid: z.boolean(), acceptsPrivate: z.boolean(),
  averageLOS: z.number().optional(), // average length of stay in days
  familySatisfactionScore: z.number().min(0).max(100).optional(),
});

export const CoverageExplanationSchema = z.object({
  insuranceType: z.enum(['medicare', 'medicaid', 'private', 'va', 'uninsured']),
  coveredServices: z.array(z.string()), notCovered: z.array(z.string()),
  estimatedOutOfPocket: z.string(), importantNotes: z.array(z.string()),
});

export const CareTransitionPlanSchema = z.object({
  patientName: z.string(), transitionType: z.enum(['curative-to-hospice', 'hospital-to-home-hospice', 'home-to-inpatient-hospice']),
  checklist: z.array(z.object({ task: z.string(), category: z.string(), critical: z.boolean(), completed: z.boolean() })),
  medicationChanges: z.array(z.object({ medication: z.string(), action: z.enum(['continue', 'discontinue', 'adjust', 'add']), reason: z.string() })),
  equipmentNeeded: z.array(z.string()), emergencyPlan: z.string(),
});

export type HospiceProvider = z.infer<typeof HospiceProviderSchema>;
export type CoverageExplanation = z.infer<typeof CoverageExplanationSchema>;
export type CareTransitionPlan = z.infer<typeof CareTransitionPlanSchema>;

export function compareProviders(providers: HospiceProvider[]): Array<HospiceProvider & { overallScore: number }> {
  return providers.map(p => {
    let score = 50;
    if (p.medicareRating) score += (p.medicareRating - 3) * 10;
    if (p.familySatisfactionScore) score += (p.familySatisfactionScore - 50) * 0.3;
    if (p.services.length > 5) score += 5;
    if (p.specializations.length > 2) score += 5;
    return { ...p, overallScore: Math.min(100, Math.max(0, Math.round(score))) };
  }).sort((a, b) => b.overallScore - a.overallScore);
}

export function explainCoverage(insuranceType: CoverageExplanation['insuranceType']): CoverageExplanation {
  const coverageMap: Record<string, CoverageExplanation> = {
    medicare: {
      insuranceType: 'medicare', estimatedOutOfPocket: '$0 for most hospice services',
      coveredServices: ['Physician services', 'Nursing care', 'Medical equipment', 'Medications for pain/symptom management', 'Home health aide', 'Social work', 'Grief counseling for family (up to 13 months)', 'Short-term inpatient care', 'Respite care (up to 5 days)'],
      notCovered: ['Curative treatments for the terminal illness', 'Care from a provider not in the hospice team', 'Room and board in a nursing home (unless for respite)'],
      importantNotes: ['Medicare covers 100% of hospice — zero copays', 'You can leave hospice and return to curative care at any time', 'Hospice benefit has no maximum duration', 'You keep your regular Medicare for non-hospice conditions'],
    },
    medicaid: {
      insuranceType: 'medicaid', estimatedOutOfPocket: '$0',
      coveredServices: ['All Medicare-covered services', 'Additional state-specific benefits may apply'],
      notCovered: ['Curative treatments for the terminal illness'], importantNotes: ['Medicaid hospice coverage mirrors Medicare in most states'],
    },
    va: {
      insuranceType: 'va', estimatedOutOfPocket: '$0',
      coveredServices: ['Full hospice care through VA or community providers', 'We Honor Veterans program participation', 'Combat-related PTSD counseling', 'Special bereavement support for military families'],
      notCovered: ['Non-VA providers without prior authorization'], importantNotes: ['VA hospice includes special recognition of military service', 'Contact VA Palliative Care: 1-877-222-VETS'],
    },
    private: {
      insuranceType: 'private', estimatedOutOfPocket: 'Varies — check your plan',
      coveredServices: ['Most plans cover hospice similarly to Medicare'], notCovered: ['Check specific plan details'],
      importantNotes: ['Most private insurance covers hospice with minimal out-of-pocket', 'Call the number on your insurance card for specifics'],
    },
    uninsured: {
      insuranceType: 'uninsured', estimatedOutOfPocket: 'May be $0 through charity care',
      coveredServices: ['Many hospices provide charity care', 'Medicaid application may be possible'],
      notCovered: [], importantNotes: ['Apply for Medicaid — hospice eligibility may help qualify', 'Most nonprofit hospices have financial assistance programs', 'No one should be denied hospice care due to inability to pay'],
    },
  };
  return CoverageExplanationSchema.parse(coverageMap[insuranceType] || coverageMap.uninsured);
}

export function createTransitionPlan(patientName: string, transitionType: CareTransitionPlan['transitionType']): CareTransitionPlan {
  return CareTransitionPlanSchema.parse({
    patientName, transitionType,
    checklist: [
      { task: 'Obtain hospice physician certification', category: 'medical', critical: true, completed: false },
      { task: 'Complete advance directive if not already done', category: 'legal', critical: true, completed: false },
      { task: 'Review and reconcile all medications', category: 'medication', critical: true, completed: false },
      { task: 'Order comfort-focused medications (pain, anxiety, secretions)', category: 'medication', critical: true, completed: false },
      { task: 'Arrange medical equipment delivery (hospital bed, oxygen, etc.)', category: 'equipment', critical: true, completed: false },
      { task: 'Identify primary family caregiver and backup', category: 'family', critical: true, completed: false },
      { task: 'Schedule initial hospice nurse visit within 48 hours', category: 'scheduling', critical: true, completed: false },
      { task: 'Discuss funeral/memorial preferences', category: 'planning', critical: false, completed: false },
      { task: 'Notify pharmacy of hospice enrollment', category: 'coordination', critical: false, completed: false },
    ],
    medicationChanges: [],
    equipmentNeeded: transitionType.includes('home') ? ['Hospital bed', 'Bedside commode', 'Oxygen concentrator', 'Suction machine', 'Comfort kit medications'] : [],
    emergencyPlan: 'Call the hospice 24/7 number for any symptoms or concerns. Do NOT call 911 unless previously discussed — paramedics are required to attempt resuscitation.',
  });
}
