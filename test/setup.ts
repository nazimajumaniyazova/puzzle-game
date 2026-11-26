import { fc } from '@fast-check/vitest';

// PRs run 200 cases per property with a random seed; the nightly build raises it
// to 10 000. On failure fast-check prints the seed and path to reproduce.
fc.configureGlobal({ numRuns: Number(process.env['FC_NUM_RUNS'] ?? 200) });
