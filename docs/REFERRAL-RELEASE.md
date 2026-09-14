# The Lotus Foundation referral release

Status: implemented and locally tested; production database, approved accounts, and hosting configuration are pending. Do not merge until the hosted checks below pass.

## Included

- `/referral`: 42 participant topics from the complete 53-section record, including medicine name, dose, frequency, purpose, provider, access, allergies, mental health/recovery medicines, and daily-living support. Questions are skippable; partial referrals are accepted after a sharing acknowledgment. Unsent answers remain in page memory only.
- `/staff`: approved-member search by case prefix or words in submitted answers, status and need filters, pagination, original responses, source-based overview, assignments, follow-up dates and progress entries. Sections 43–51 are linked staff records; 52–53 are owner-only program records.
- Parser: exact unique `Question label: answer` matching with unmatched/ambiguous text retained for human review. It is not a general document/OCR/AI importer and does not send information to an AI service.
- `/contact`, home calls to action and navigation direct participants to the referral.
- The complete approved source is retained at `/forms/complete-referral-form.txt`. This release creates no PDF.

## Connect production

1. Confirm the organization that should own the new Supabase project and any cost before provisioning. Use a dedicated Foundation project; do not use an unrelated app's database.
2. Apply `supabase/migrations/20260914225049_referral_system.sql` to that project using Supabase migrations. Disable public signup. Create only accounts explicitly approved by the Foundation; do not send invitations without approval.
3. Bootstrap the first approved owner in `public.lf_staff` using the owner's actual Supabase Auth UUID, role `owner`, active true, and display name. No membership is inferred from email domain or editable user metadata. Owners can authorize existing Auth accounts through the members endpoint; subsequent access is checked against active membership on every request. There is no self-service membership editor or password-reset screen in this release.
4. In Ashley's Vercel project for lotusfoundation.info, set the variables in `.env.example` for the deployment environment. Keep `SUPABASE_SECRET_KEY` and a randomly generated `RATE_LIMIT_SECRET` server-only. Set `APP_ORIGIN` to the exact HTTPS origin. Each preview needs its own exact origin; use a separate test database and synthetic information for previews.
5. Validate the deployed preview with a synthetic referral: partial answers, medicines, consent, receipt, retry returning the same receipt, member sign-in, case/name/need search, original answers, assignment, follow-up, progress entry, owner program entry, and sign-out. Verify outsiders and disabled members cannot read records. Test two simultaneous updates for conflict handling.
6. Confirm expected database region, backup/restore and retention arrangements with the Foundation before collecting real sensitive information. Set a real process for reviewing referrals; this interface is not an emergency monitoring service. Then merge and deploy the tested revision and repeat a synthetic production smoke check.

Case numbers use `LF-0001-09-13-2026`: an increasing database sequence (minimum four digits, no reset/truncation) and receipt date in America/New_York. The identifier is not an access credential. Gaps in the sequence are possible. Retried identical requests return the existing receipt.

## Access and operational limits

All exposed tables use row-level security. Anonymous users cannot read records or write directly to the database. The server validates submissions, rate-limits requests, and uses membership-checked endpoints for staff operations. Reads/searches and workflow actions through the app create audit events; authorized direct database reads are not comprehensively audited by the application. Active staff currently have organization-wide record access. Health answers are self-reported and summaries do not infer diagnoses. Staff notes are retrievable within each case but are not part of the global submission-text search. No automated external sharing, grant reporting, research export, or clinical risk scoring is included.

## Verification completed locally

`npm test`, `npm run lint`, and `npm run build` pass. Tests execute the real migration in an embedded PostgreSQL engine and cover anonymous/outsider/staff/revoked access, idempotency, sequence growth, optimistic updates and rate limits. Browser checks cover desktop/mobile form display, medicine entries, multiple support selections, and disabled sending while configuration is absent. Mobile viewport 390×844 has no horizontal overflow. Hosted Auth, deployment and actual Supabase integration remain to be verified after credentials and membership are configured.
