<p align="center">
  <h1 align="center">foundation-gentle-passage</h1>
  <h3 align="center"><em>Hospice & end-of-life navigation. Advance directives. 50% miss hospice care.</em></h3>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL-3.0-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/cost-Free_Forever-green" alt="Free">
  <img src="https://img.shields.io/badge/status-Prototype-yellow" alt="Prototype">
  <a href="https://mama.oliwoods.ai"><img src="https://img.shields.io/badge/Built_with-MAMA-8b5cf6" alt="Built with MAMA"></a>
  <a href="https://mama.oliwoods.ai/foundation"><img src="https://img.shields.io/badge/OliWoods-Foundation-10b981" alt="OliWoods Foundation"></a>
</p>

---

---

## Status / Honesty

This repository is a **prototype library** under the Mama Foundation (Scheme C). It is **not** production clinical software, **not** HIPAA certified, and **not** cleared for care delivery.

- Maturity: **Prototype**
- Portal path: [https://mama.oliwoods.ai/foundation/gentle-passage](https://mama.oliwoods.ai/foundation/gentle-passage)
- See [MAMA-MSTR#959](https://github.com/OliWoods-Org/MAMA-MSTR/issues/959)


> *"More than 50% of Americans who qualify for hospice never receive it. Most die in hospitals — surrounded by machines — when they wanted to be at home. The paperwork was never filed. No one explained the options. The system failed them in their final hours."*
> — NHPCO Facts and Figures, 2023

## Why This Exists

End-of-life care is catastrophically under-navigated. Not because people don't care, but because the system is incomprehensible. Advance directives, hospice eligibility, POLST forms, DNR/DNI decisions, and palliative referrals require navigating a maze of medical, legal, and insurance bureaucracy — at the worst possible time.

- **50%+ of eligible patients** never access hospice care — largely due to awareness gaps, not medical reasons (NHPCO, 2023)
- **Only 1 in 3 Americans** has a completed advance directive (AHA, 2022) — leaving critical decisions to strangers in emergency rooms
- **$12,000 average cost** for the final month of life in the ICU vs. $2,500 for equivalent hospice care (JAMA, 2021)
- **Hispanic, Black, and lower-income families** are 2-3x less likely to access palliative services due to systemic navigation barriers (NHPCO Equity Report, 2022)

Gentle Passage does not make end-of-life easy. It makes it navigable.

## System Architecture

```mermaid
flowchart TD
    A[Patient / Family Member] --> B[MAMA Conversation Interface\nCompassionate, plain-language AI]
    B --> C{Situation Assessment\nTerminal diagnosis?\nEmergency planning?\nAdvance care planning?}
    C -->|Advance Directive| D[Document Wizard\nState-specific POLST / AHCD\nNotarization guidance]
    C -->|Hospice Eligibility| E[Eligibility Checker\nMedicare / Medicaid / private\nDiagnosis-based criteria]
    C -->|Palliative Navigation| F[Provider Finder\nGeo-located hospice + palliative\nteams with availability]
    C -->|Family Support| G[Caregiver Guide\nPractical tasks, emotional\npreparation, grief resources]
    D --> H[Document Vault\nEncrypted storage +\nsharing with medical team]
    E --> I[Insurance Navigator\nBenefit explanation +\nreferral letter generation]
    F --> J[Appointment Assist\nBooking + reminders +\nquestion prep for doctor]
    G --> K[Grief Resources\nPost-loss support network\ncommunity + counseling]
    H & I & J & K --> L[(Supabase\nencrypted store (prototype; not HIPAA certified))]
```

## Features

| Feature | Description | Standard |
|---------|-------------|----------|
| **Advance Directive Wizard** | State-specific AHCD, POLST, living will generation with plain-language explanations | All 50 states + DC |
| **Hospice Eligibility Check** | Diagnosis-based assessment against Medicare / Medicaid hospice benefit criteria | CMS guidelines |
| **Provider Finder** | Geo-located hospice + palliative care teams with ratings, specialties, and availability | NHPCO registry |
| **DNR / DNI Guidance** | Plain-language explanation of resuscitation decisions with family discussion frameworks | AHA protocols |
| **Caregiver Prep Guide** | Practical and emotional preparation checklist for family caregivers in final weeks | Hospice Foundation curriculum |
| **Document Vault** | Encrypted, shareable storage of completed directives for medical teams and family | privacy-oriented (not HIPAA certified; prototype) |
| **Insurance Navigator** | Medicare Part A hospice benefit decoder + private insurance benefit summary | CMS 2024 |
| **Grief Resource Bridge** | Immediate post-loss support network connections, counseling finder, peer groups | APA grief frameworks |

## Research Foundation

| Citation | Finding | Relevance |
|----------|---------|-----------|
| NHPCO (2023) | 50%+ of hospice-eligible patients never enroll; navigation gap is primary barrier | Core mission |
| JAMA (2021) | ICU end-of-life costs 5x hospice; outcomes rated worse by families | Economic + quality case |
| Bernacki & Block (2014) | Structured conversations about end-of-life preferences reduce ICU days by 30% | Conversation design |
| Elk & Landrum (2021) | Racial equity in palliative care requires culturally tailored navigation, not just access | Equity module design |

## Quick Start

```bash
git clone https://github.com/OliWoods-Org/foundation-gentle-passage.git
cd foundation-gentle-passage
npm install
npm run dev
```

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Validation:** Zod schemas
- **Database:** Supabase (PostgreSQL, privacy-oriented (not HIPAA certified; prototype) configuration)
- **AI:** Claude API (compassionate conversation design, plain-language generation)
- **Documents:** PDF generation (state-specific advance directives)
- **Alerts:** Twilio (SMS/WhatsApp), Resend (email)

## A Note on Tone

Every interaction in this system was designed with palliative care social workers and hospice chaplains in mind. The AI never uses euphemisms that obscure meaning, never rushes, and always offers to connect the user to a human if needed.

## Contributing

We welcome contributions from palliative care nurses, social workers, hospice volunteers, elder law attorneys, and anyone who has navigated end-of-life for a loved one. Your lived experience is expertise.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes
4. Push and open a PR

## License

AGPL-3.0 — Free to use, modify, and distribute.

---

<p align="center">
  <strong>Built by the <a href="https://oliwoods.ai">OliWoods Foundation</a></strong><br>
  <em>Free forever. Open source. Because everyone deserves a gentle passage.</em>
</p>
