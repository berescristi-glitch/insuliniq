# Quiz v2 Privacy & Legal Review — InsulinIQ

> Date: 2026-07-01  
> Jurisdiction: UK (UK-GDPR + PECR), Australia (Privacy Act 1988 + Australian Privacy Principles), United States (FTC, COPPA, state health privacy laws)  
> NOT legal advice — this is an internal compliance review for pre-launch preparation. Formal legal review required before public launch.

---

## Summary Classification

| Data category | Legal classification (UK-GDPR) | Basis for collection |
|--------------|-------------------------------|---------------------|
| Email address | Personal data (Art. 4) | Contract performance (for educational service delivery) |
| Country/region | Personal data | Legitimate interests (localisation) |
| Goal (general) | Personal data | Contract performance |
| Biological sex | Special category (Art. 9) | Explicit consent (A01 + health data consent) |
| Symptoms | Special category (Art. 9) — health data | Explicit consent (A01) |
| Safety flags | Special category (Art. 9) — health data | Explicit consent (A01) |
| Known conditions | Special category (Art. 9) — health data | Explicit consent (A01) |
| Lab values | Special category (Art. 9) — health data | Explicit consent (A01) |
| Anthropometrics | Special category (Art. 9) — health data | Explicit consent (A01) |
| Diet pattern | Low sensitivity — not Art. 9 | Legitimate interests |
| Allergens | Medium — potentially health-related | Explicit consent (A01) |
| Cooking time/skill | Not health-related | Legitimate interests |
| Budget | Financial sensitivity | Legitimate interests |
| Eating behavior | Health-adjacent (Art. 9 borderline) | Explicit consent (A01) |
| Marketing consent | Processing legal basis | Consent (L01, separate from A01) |

---

## GDPR / UK-GDPR Requirements for Quiz v2

### Article 9 — Special Category Data
The following quiz fields constitute **special category data** and require **explicit consent** before collection:
- Sex/gender
- Symptoms (all)
- Safety flags (all)  
- Known conditions/diagnoses
- Lab values
- Anthropometrics
- Eating disorder history
- Pregnancy/breastfeeding status
- Medication information

**Requirement:** Section A01 (health data consent) must be the first screen, before ANY health-related question. "I understand — start the quiz" constitutes the explicit consent record.

**Record of consent:** The timestamp of A01 confirmation must be stored (or implied by quiz_results created_at). In v2, store explicitly as `health_data_consent_at TIMESTAMPTZ` in quiz_results.

### Article 13 — Information at time of collection
Users must be told at quiz start:
- What data is collected
- Why it's collected
- Who it's shared with (Supabase EU hosting, Resend for email, Vercel for infrastructure)
- How long it's retained
- Their right to access, rectify, erase
- Their right to withdraw consent

**Implementation:** A01 consent screen + link to Privacy Policy. Privacy Policy must be current and accurate.

### Article 17 — Right to Erasure
Health data (special category) must be erasable immediately on request. See data schema deletion flow.

---

## Australian Privacy Act 1988 — Quiz v2

### Sensitive Information (APP 3.3)
Health information is "sensitive information" under the Australian Privacy Act. Collection requires:
- Consent (express or implied)
- Or collection required by law
- Or necessary to prevent serious threat to health/safety

**For InsulinIQ:** Explicit consent (A01) is the correct basis.

### APP 7 — Direct Marketing
Marketing emails require consent. The Australian Spam Act 2003 requires:
- Express or inferred consent
- Clear identification of sender
- Functional unsubscribe mechanism

Quiz v2 maintains the Sprint 3 consent checkbox (L01) — compliant.

### APP 11 — Security of Personal Information
Health data stored in Supabase EU region. Supabase provides encryption at rest and in transit. Acceptable for Australian Privacy Act purposes.

---

## US Privacy Considerations

### No federal health privacy law applies
HIPAA applies only to covered entities (healthcare providers, insurers, clearinghouses). InsulinIQ is an educational platform, not a healthcare provider. HIPAA does not apply.

### FTC Act — Unfair or Deceptive Acts or Practices
The FTC has broad jurisdiction over data practices. Key requirements:
- Honour stated privacy policy
- Don't collect more data than disclosed
- Protect data from security breaches
- Don't sell health data without disclosure

### State Laws
- California CMIA (Confidentiality of Medical Information Act) — may apply to health data for CA residents
- Various state health data privacy laws emerging (e.g. Washington My Health MY Data Act)
- **Manual action before launch:** Legal review of state-by-state applicability for US market

### COPPA (Children's Online Privacy Protection Act)
Must not collect personal data from users under 13.  
Quiz v2 safety flag `under_18` triggers SafetyNotice and content modification.  
**Strong recommendation:** Add age gate at A01: "By proceeding, you confirm you are 18 or older (or have parental consent if under 18)."

---

## What Must Be Optional

Every question except these four must have "prefer not to say" or "I don't know":
- **Required:** A01 consent (can't proceed without)
- **Required:** B01 goal (minimum for profile)
- **Required:** C01 country (minimum for content delivery)
- **Required:** Safety screening (can answer "none of the above")

All health data fields (sex, symptoms, known conditions, safety flags, lab values, anthropometrics) must be explicitly optional with "prefer not to say" always available.

**Design rule:** Never make it feel like omitting health data will give a worse result. Copy should say: "These are all optional — your results will be personalised based on what you choose to share."

---

## What Must Have "I Don't Know" Available

Lab values (Section O): All 8 questions — most users won't have these values.  
Known conditions (F01): "I haven't been tested / I don't know" must be an option.  
PCOS hormone markers (M03): "I haven't had these tested" must be an option.

---

## What Must NOT Be Collected

| Field | Why not |
|-------|---------|
| Sexual orientation | Not relevant; would be Art. 9 special category with no clear purpose |
| Specific medication names | Too clinical; we're not a healthcare provider; creates liability |
| HIV/AIDS status | Special category; not relevant to metabolic health education |
| Mental health diagnosis | Beyond scope; creates significant legal complexity |
| Genetic data | Special category; not relevant; significant legal complexity |
| Biometric data | Not collected by quiz |
| Precise location | Region-level sufficient; precise GPS not needed |
| Income (specific number) | Budget tier (rough range) is sufficient; specific income creates unnecessary sensitivity |
| Bank/payment data | Handled by Lemon Squeezy as Merchant of Record |

---

## What Must NOT Appear in Results Display

| Item | Reason |
|------|--------|
| BMI calculated from height/weight | BMI is a poor metabolic health proxy; displaying it creates weight stigma and may trigger eating disorder responses |
| "You are at high risk of X" | Diagnostic framing; outside educational scope |
| Specific lab value interpretations ("Your HbA1c of X means...") | Clinical assessment; requires licensed practitioner |
| "You should take medication X" | Prescribing; illegal without medical license |
| Any reference to user's specific symptoms back to them as a "diagnosis" | Cannot pattern-match to diagnosis |

---

## What Must NOT Be Used for Marketing

| Data | Marketing use allowed? |
|------|----------------------|
| Safety flags (type1_diabetes, eating_disorder etc.) | NO — never use these for targeted advertising or email segment targeting beyond safety-notice emails |
| Lab values | NO — never target marketing based on specific health metrics |
| Specific known conditions | NO — never use confirmed diagnoses for advertising targeting |
| Anthropometrics | NO — never use weight/waist data for marketing |
| General metabolic profile | YES — can use profile key for educational content targeting (with marketing consent, L01) |
| Region/country | YES — for content localisation only, not demographic targeting |
| Goal | YES — with marketing consent |
| Diet pattern | YES — with marketing consent |

---

## Health Data Consent Screen — Required Copy (A01)

The A01 screen must clearly state:

```
"InsulinIQ will ask you some health-related questions — including about symptoms, 
any conditions you've been told you have, and optional questions about lab values 
or measurements. 

This information is used only to personalise your educational metabolic profile. 
It is not used for advertising and is never sold.

You can choose not to answer any question by selecting 'prefer not to say'.

[Read our Privacy Policy →]

[I understand — start the quiz]"
```

---

## Pre-Launch Compliance Checklist

- [ ] Privacy Policy updated to reflect quiz v2 data collection
- [ ] Health data consent (A01) implemented before any health question
- [ ] "Prefer not to say" available on all health-related questions
- [ ] "I don't know" available on all lab/diagnosis questions
- [ ] Age confirmation added to A01 or as separate gate
- [ ] Data deletion flow implemented (`DELETE /api/user/delete-data`)
- [ ] Supabase data export implemented for Subject Access Requests
- [ ] Security review: RLS on quiz_results_advanced table
- [ ] Legal review: state-by-state US health privacy law applicability
- [ ] Legal review: Australian Notifiable Data Breaches scheme registration
- [ ] Data Retention Policy documented and enforced
- [ ] Cookie consent banner in place (if using analytics cookies)
- [ ] DPA (Data Processing Agreement) with Supabase in place
- [ ] DPA with Resend in place
- [ ] DPA with Vercel in place
- [ ] Vercel deployment region confirmed (must be EU for UK-GDPR compliance or SCCs in place)
