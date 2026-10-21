# Stage 10 — Oracle Content-Richness: decision memo

Paired dose experiment on Cypress RWA. N=1 runs/dose · slice=24 requirements.
FP and grounding-rejection reported PRE-adjudication; true-FP awaits the blind worksheet.

## Verdict: **NEGATIVE**

| metric | sparse (control) | rich (treatment) | call |
|--------|------------------|------------------|------|
| FP rate (raw) | 12.1% | 15.1% | WORSE (Δ=3.0pt, band=±0.0pt) |
| grounding-rejection | 0.0% | 0.0% | NULL (Δ=0.0pt, band=±0.0pt) |
| catch rate | 40.0% | 50.0% | BETTER (Δ=10.0pt, band=±0.0pt) |

### Catch decomposition (auth-gate freebies vs value/shape)
| defect type | sparse | rich |
|-------------|--------|------|
| auth-gate (structural) | 100.0% | 100.0% |
| value/shape (the interesting ones) | 0.0% | 16.7% |

### Paired per-requirement FP (Wilcoxon signed-rank)
W=0, z=-2.61, p=0.009, non-zero pairs=9

_Noise band = control (sparse) run-to-run range; deltas inside the band are null. Powered for moderate-to-large effects only (slice=24) — a null means no effect of at least that size._