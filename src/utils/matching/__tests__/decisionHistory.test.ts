import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MatchResult } from '@/types';

const mocks = vi.hoisted(() => ({
  insert: vi.fn(),
  single: vi.fn(),
  getUser: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getUser: mocks.getUser },
  from: () => ({ insert: mocks.insert }),
} }));

import { databaseService } from '@/services/database';
import { decisionForStatus } from '@/services/matchDecisionHistory';

describe('match decision audit rules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'collector-123' } } });
    mocks.single.mockResolvedValue({ data: { id: 'saved-decision-123' }, error: null });
    mocks.insert.mockReturnValue({ select: () => ({ single: mocks.single }) });
  });
  it('records confirmed matches as confirmed', () => {
    expect(decisionForStatus('matched')).toBe('confirmed');
  });
  it('records no-match decisions as no-match', () => {
    expect(decisionForStatus('rejected')).toBe('no-match');
  });
  it('records candidates sent for review as review', () => {
    expect(decisionForStatus('manual-review')).toBe('review');
  });
  const makeResult = (): MatchResult => ({ sourceId: 'clinic-1', matchId: 'community-2', status: 'matched', confidence: 0.9, matchedBy: 'user', matchedAt: '2026-10-21T00:00:00Z' });
  it('uses authenticated collector identity instead of a supplied actor', async () => {
    await databaseService.saveMatchResult(makeResult());
    expect(mocks.insert.mock.calls[0][0][0]).toMatchObject({ matched_by: 'collector-123', user_id: 'collector-123' });
  });
  it('retains an optional reason with the saved decision', async () => {
    await databaseService.saveMatchResult({ ...makeResult(), notes: 'Patient verified household details' });
    expect(mocks.insert.mock.calls[0][0][0].notes).toBe('Patient verified household details');
  });
  it('allows a decision without a reason', async () => {
    await databaseService.saveMatchResult(makeResult());
    expect(mocks.insert.mock.calls[0][0][0].notes).toBeUndefined();
  });
  it('does not insert twice when a saved result reaches the completion callback', async () => {
    const result = makeResult();
    await databaseService.saveMatchResult(result);
    await databaseService.saveMatchResult({ ...result });
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(result.persistenceId).toBe('saved-decision-123');
  });
  it('does not mark a failed decision as saved', async () => {
    mocks.single.mockResolvedValue({ data: null, error: new Error('Save failed') });
    const result = makeResult();
    await expect(databaseService.saveMatchResult(result)).rejects.toThrow('Save failed');
    expect(result.persistenceId).toBeUndefined();
  });
});