# cPanel Backup — afarines (cp106.unitedhost.org)

Backup date: **2026-08-06**

> **Security:** This repository is public and these archives may contain passwords, configs, and private site data. Make the repo **private** immediately, or delete this content after downloading. Rotate all credentials that were on the hosting account.

## Contents

| Folder | Description |
|--------|-------------|
| `parts-account-2026-08-06/` | Full account backup (host scheduled) — **preferred for restore** |
| `parts-account-2026-07-30/` | Older full account backup |
| `parts-homedir-2026-08-06/` | Live Home Directory backup |
| `mysql/` | Live MySQL dumps (`.sql.gz`) |
| `email/` | Email aliases & filters |
| `SHA256SUMS.txt` | Checksums of original `.tar.gz` files |

Files over GitHub’s 100 MB limit are split into 90 MB parts.

## Reassemble on Linux / macOS

```bash
# Full account (2026-08-06)
cat parts-account-2026-08-06/backup-2026.08.06_00-00-00_afarines.tar.gz.part-* \
  > backup-2026.08.06_00-00-00_afarines.tar.gz

# Full account (2026-07-30)
cat parts-account-2026-07-30/backup-2026.07.30_00-00-00_afarines.tar.gz.part-* \
  > backup-2026.07.30_00-00-00_afarines.tar.gz

# Home directory
cat parts-homedir-2026-08-06/backup-afarineshsystem.com-8-6-2026.tar.gz.part-* \
  > backup-afarineshsystem.com-8-6-2026.tar.gz

# Verify
sha256sum -c SHA256SUMS.txt
```

## Reassemble on Windows (PowerShell)

```powershell
Get-Content parts-account-2026-08-06\* -Enc Byte -Read 0 | Set-Content backup-2026.08.06_00-00-00_afarines.tar.gz -Enc Byte
```

Or use `copy /b part-000 + part-001 + ... outfile.tar.gz` in CMD (list parts in order).

## Notes

- In-panel “Full Backup” was disabled because disk quota was ~96% full.
- Prefer restoring from `backup-2026.08.06_00-00-00_afarines.tar.gz` (cpmove-style full account archive).
