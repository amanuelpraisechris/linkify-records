/**
 * Data Quality Dashboard
 * Pre-match validation and quality checks
 */

import { useState, useEffect } from 'react';
import { Record } from '@/types';
import { DataQualityReport, FieldCompletenessMetric, DuplicateGroup } from '@/types/dataQuality';
import {
  generateDataQualityReport,
  calculateFieldCompleteness,
  findDuplicates,
  autoFixIssues
} from '@/services/dataQualityService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Wrench,
  Download
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface DataQualityDashboardProps {
  records: Record[];
  useCase?: 'healthcare' | 'census' | 'research' | 'custom';
  onRecordsUpdated?: (records: Record[]) => void;
}

export function DataQualityDashboard({
  records,
  useCase = 'custom',
  onRecordsUpdated
}: DataQualityDashboardProps) {
  const [report, setReport] = useState<DataQualityReport | null>(null);
  const [completeness, setCompleteness] = useState<FieldCompletenessMetric[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (records.length > 0) {
      runQualityCheck();
    }
  }, [records]);

  const runQualityCheck = () => {
    setIsLoading(true);
    try {
      const newReport = generateDataQualityReport(records, useCase);
      setReport(newReport);

      const requiredFields = ['firstName', 'lastName', 'birthDate', 'sex'];
      const completenessMetrics = calculateFieldCompleteness(records, requiredFields);
      setCompleteness(completenessMetrics);

      const duplicateGroups = findDuplicates(records, 85);
      setDuplicates(duplicateGroups);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFix = () => {
    if (!report) return;

    setIsLoading(true);
    try {
      const result = autoFixIssues(records, report.issues);

      if (onRecordsUpdated) {
        onRecordsUpdated([...records]);
      }

      // Re-run quality check
      runQualityCheck();

      alert(`Fixed ${result.fixed} issues. ${result.failed} issues could not be fixed automatically.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'outline';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (records.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No records available. Please load data to run quality checks.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreColor(report.overallQualityScore)}`}>
                {report.overallQualityScore.toFixed(1)}%
              </div>
              <Progress value={report.overallQualityScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Records with Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{report.recordsWithIssues}</div>
              <p className="text-xs text-muted-foreground mt-1">
                out of {report.totalRecords} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{report.issueCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {report.issues.filter(i => i.autoFixable).length} auto-fixable
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Duplicates Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{duplicates.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                groups of similar records
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Actions</CardTitle>
          <CardDescription>Run checks and fix issues</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={runQualityCheck} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Run Quality Check
          </Button>
          {report && report.issues.filter(i => i.autoFixable).length > 0 && (
            <Button onClick={handleAutoFix} disabled={isLoading} variant="outline">
              <Wrench className="h-4 w-4 mr-2" />
              Auto-Fix Issues ({report.issues.filter(i => i.autoFixable).length})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Completeness</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`text-2xl font-bold ${getScoreColor(report.completenessScore)}`}>
                    {report.completenessScore.toFixed(1)}%
                  </div>
                  <Progress value={report.completenessScore} className="flex-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consistency</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`text-2xl font-bold ${getScoreColor(report.consistencyScore)}`}>
                    {report.consistencyScore.toFixed(1)}%
                  </div>
                  <Progress value={report.consistencyScore} className="flex-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Validity</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`text-2xl font-bold ${getScoreColor(report.validityScore)}`}>
                    {report.validityScore.toFixed(1)}%
                  </div>
                  <Progress value={report.validityScore} className="flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field Completeness */}
      {completeness.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Field Completeness</CardTitle>
            <CardDescription>How complete is each field across all records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completeness</TableHead>
                  <TableHead>Populated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completeness.slice(0, 10).map(metric => (
                  <TableRow key={metric.fieldName}>
                    <TableCell className="font-medium">
                      {metric.fieldName}
                      {metric.isRequired && (
                        <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {metric.status === 'good' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      {metric.status === 'acceptable' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {metric.status === 'poor' && <XCircle className="h-4 w-4 text-red-600" />}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{metric.completenessRate.toFixed(1)}%</div>
                        <Progress value={metric.completenessRate} className="w-20" />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {metric.populatedRecords} / {metric.totalRecords}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Issues Summary */}
      {report && report.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Issues by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Critical</Badge>
                <span className="text-lg font-bold">{report.issuesBySeverity.critical || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">High</Badge>
                <span className="text-lg font-bold">{report.issuesBySeverity.high || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Medium</Badge>
                <span className="text-lg font-bold">{report.issuesBySeverity.medium || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Low</Badge>
                <span className="text-lg font-bold">{report.issuesBySeverity.low || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {report && report.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
