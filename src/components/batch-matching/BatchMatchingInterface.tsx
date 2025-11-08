/**
 * Batch Matching Interface Component
 * Automated matching for large datasets
 */

import { useState, useEffect } from 'react';
import {
  BatchMatchConfig,
  BatchMatchJob,
  BatchMatchSummary,
  AutoMatchStrategy,
} from '@/types/batchMatching';
import { Record } from '@/types';
import { MatchingConfig } from '@/types/matchingConfig';
import {
  createBatchMatchJob,
  runBatchMatchJob,
  cancelBatchJob,
  getAllBatchJobs,
  getBatchJob,
  generateBatchSummary,
} from '@/services/batchMatchingService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, Square, FileText, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface BatchMatchingInterfaceProps {
  sourceRecords: Record[];
  targetRecords: Record[];
  matchingConfig: MatchingConfig;
  algorithmType: 'deterministic' | 'probabilistic';
  onComplete?: (summary: BatchMatchSummary) => void;
}

export function BatchMatchingInterface({
  sourceRecords,
  targetRecords,
  matchingConfig,
  algorithmType,
  onComplete,
}: BatchMatchingInterfaceProps) {
  // Config state
  const [config, setConfig] = useState<BatchMatchConfig>({
    autoMatchStrategy: 'high-confidence-only',
    autoMatchThreshold: 85,
    maxMatchesPerRecord: 5,
    manualReviewThreshold: 60,
    skipNoMatches: true,
    batchSize: 10,
    pauseBetweenBatches: 100,
    handleDuplicates: 'skip',
    allowMultipleMatches: false,
  });

  // Job state
  const [currentJob, setCurrentJob] = useState<BatchMatchJob | null>(null);
  const [jobHistory, setJobHistory] = useState<BatchMatchJob[]>([]);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<BatchMatchSummary | null>(null);

  // Load job history
  useEffect(() => {
    const jobs = getAllBatchJobs();
    setJobHistory(jobs.slice(-5)); // Show last 5 jobs
  }, [currentJob]);

  // Start batch matching
  const handleStart = async () => {
    if (sourceRecords.length === 0) {
      alert('No source records to match');
      return;
    }

    if (targetRecords.length === 0) {
      alert('No target records to match against');
      return;
    }

    // Create job
    const job = createBatchMatchJob(sourceRecords, targetRecords, config);
    setCurrentJob(job);
    setIsRunning(true);
    setProgress(0);
    setSummary(null);

    try {
      // Run job
      await runBatchMatchJob(
        job.id,
        matchingConfig,
        algorithmType,
        (progressPercent, currentRecord) => {
          setProgress(progressPercent);
          // Refresh job data
          const updatedJob = getBatchJob(job.id);
          if (updatedJob) {
            setCurrentJob(updatedJob);
          }
        },
        (jobSummary) => {
          setSummary(jobSummary);
          setIsRunning(false);
          if (onComplete) {
            onComplete(jobSummary);
          }
        }
      );
    } catch (error) {
      console.error('Error running batch job:', error);
      setIsRunning(false);
      alert('Error running batch matching job');
    }
  };

  // Cancel job
  const handleCancel = () => {
    if (currentJob) {
      cancelBatchJob(currentJob.id);
      setIsRunning(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'running':
        return 'default';
      case 'cancelled':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Matching Configuration</CardTitle>
          <CardDescription>
            Configure automated matching rules for {sourceRecords.length} source records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strategy Selection */}
          <div className="space-y-2">
            <Label htmlFor="strategy">Auto-Match Strategy</Label>
            <Select
              value={config.autoMatchStrategy}
              onValueChange={(value) =>
                setConfig({ ...config, autoMatchStrategy: value as AutoMatchStrategy })
              }
              disabled={isRunning}
            >
              <SelectTrigger id="strategy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-confidence-only">
                  High Confidence Only (Recommended)
                </SelectItem>
                <SelectItem value="threshold-based">Threshold Based</SelectItem>
                <SelectItem value="manual-review-all">Manual Review All</SelectItem>
                <SelectItem value="best-match-only">Best Match Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {config.autoMatchStrategy === 'high-confidence-only' &&
                'Auto-match only records with confidence above threshold'}
              {config.autoMatchStrategy === 'threshold-based' &&
                'Auto-match all records above custom threshold'}
              {config.autoMatchStrategy === 'manual-review-all' &&
                'Queue all matches for manual review'}
              {config.autoMatchStrategy === 'best-match-only' &&
                'Auto-match only if there is a clear best match'}
            </p>
          </div>

          {/* Thresholds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Auto-Match Threshold: {config.autoMatchThreshold}%</Label>
              <Slider
                value={[config.autoMatchThreshold]}
                onValueChange={(value) =>
                  setConfig({ ...config, autoMatchThreshold: value[0] })
                }
                min={50}
                max={100}
                step={5}
                disabled={isRunning}
              />
              <p className="text-xs text-muted-foreground">
                Minimum confidence to automatically accept a match
              </p>
            </div>

            <div className="space-y-2">
              <Label>Manual Review Threshold: {config.manualReviewThreshold}%</Label>
              <Slider
                value={[config.manualReviewThreshold]}
                onValueChange={(value) =>
                  setConfig({ ...config, manualReviewThreshold: value[0] })
                }
                min={30}
                max={80}
                step={5}
                disabled={isRunning}
              />
              <p className="text-xs text-muted-foreground">
                Minimum confidence to queue for manual review
              </p>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxMatches">Max Matches Per Record</Label>
              <Input
                id="maxMatches"
                type="number"
                value={config.maxMatchesPerRecord}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    maxMatchesPerRecord: parseInt(e.target.value) || 5,
                  })
                }
                min={1}
                max={20}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchSize">Batch Size</Label>
              <Input
                id="batchSize"
                type="number"
                value={config.batchSize}
                onChange={(e) =>
                  setConfig({ ...config, batchSize: parseInt(e.target.value) || 10 })
                }
                min={1}
                max={100}
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="skipNoMatches">Skip No Matches</Label>
                <p className="text-xs text-muted-foreground">
                  Don't show records with no matches above threshold
                </p>
              </div>
              <Switch
                id="skipNoMatches"
                checked={config.skipNoMatches}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, skipNoMatches: checked })
                }
                disabled={isRunning}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowMultiple">Allow Multiple Matches</Label>
                <p className="text-xs text-muted-foreground">
                  Allow one source record to match multiple targets
                </p>
              </div>
              <Switch
                id="allowMultiple"
                checked={config.allowMultipleMatches}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, allowMultipleMatches: checked })
                }
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleStart} disabled={isRunning} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Batch Matching
            </Button>
            {isRunning && (
              <Button onClick={handleCancel} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      {currentJob && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Job Progress</span>
              <Badge variant={getStatusColor(currentJob.status) as any}>
                {currentJob.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="w-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold">
                  {currentJob.progress.processedRecords} / {currentJob.progress.totalRecords}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Auto-Matched
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {currentJob.progress.autoMatched}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Manual Review
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {currentJob.progress.manualReviewQueue}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-gray-600" />
                  No Match
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {currentJob.progress.noMatchFound}
                </p>
              </div>
            </div>

            {currentJob.progress.errors > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  {currentJob.progress.errors} error(s) occurred during processing
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Matching Summary</CardTitle>
            <CardDescription>Results from completed batch job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{summary.stats.totalRecords}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Auto-Matched</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.stats.autoMatched}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Manual Review Needed</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {summary.stats.manualReviewNeeded}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">No Match Found</p>
                <p className="text-2xl font-bold text-gray-600">
                  {summary.stats.noMatchFound}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg. Confidence</p>
                <p className="text-2xl font-bold">
                  {summary.quality.averageConfidence.toFixed(1)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Processing Speed</p>
                <p className="text-2xl font-bold">
                  {summary.stats.recordsPerSecond.toFixed(1)}/s
                </p>
              </div>
            </div>

            {/* Confidence Distribution */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Confidence Distribution</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800">High (≥80%)</p>
                  <p className="text-xl font-bold text-green-600">
                    {summary.quality.confidenceDistribution.high}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">Medium (60-79%)</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {summary.quality.confidenceDistribution.medium}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-800">Low (&lt;60%)</p>
                  <p className="text-xl font-bold text-gray-600">
                    {summary.quality.confidenceDistribution.low}
                  </p>
                </div>
              </div>
            </div>

            {summary.actions.recordsNeedingReview.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  Action Required
                </p>
                <p className="text-sm text-yellow-700">
                  {summary.actions.recordsNeedingReview.length} record(s) require manual review
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Job History */}
      {jobHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Batch Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {jobHistory.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {new Date(job.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {job.progress.processedRecords} / {job.progress.totalRecords} records
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(job.status) as any}>
                      {job.status}
                    </Badge>
                    {job.status === 'completed' && (
                      <div className="text-sm text-green-600">
                        {job.progress.autoMatched} matched
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
