/**
 * Side-by-Side Comparison Component
 * PIRL-inspired interface for comparing patient record with matched candidate
 */

import { Record } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface SideBySideComparisonProps {
  sourceRecord: Record;
  matchedRecord: Record;
  matchScore: number;
  matchedFields: string[];
  onConfirm?: () => void;
  onReject?: () => void;
}

const SideBySideComparison = ({
  sourceRecord,
  matchedRecord,
  matchScore,
  matchedFields
}: SideBySideComparisonProps) => {
  // Field comparison helper
  const getFieldValue = (record: Record, field: string): string => {
    const value = record[field as keyof Record];
    return value ? String(value) : '-';
  };

  const isFieldMatched = (field: string): boolean => {
    return matchedFields.includes(field);
  };

  const getMatchColor = (field: string): string => {
    if (!isFieldMatched(field)) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
    const sourceVal = getFieldValue(sourceRecord, field);
    const matchVal = getFieldValue(matchedRecord, field);
    if (sourceVal === matchVal && sourceVal !== '-') {
      return 'text-green-600 bg-green-50 dark:bg-green-950';
    }
    return 'text-muted-foreground bg-muted/30';
  };

  const getMatchIcon = (field: string): JSX.Element => {
    if (!isFieldMatched(field)) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    const sourceVal = getFieldValue(sourceRecord, field);
    const matchVal = getFieldValue(matchedRecord, field);
    if (sourceVal === matchVal && sourceVal !== '-') {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  // Core fields for comparison
  const comparisonFields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'sex', label: 'Sex' },
    { key: 'birthDate', label: 'Birth Date' },
    { key: 'village', label: 'Village' },
    { key: 'fatherName', label: 'Father Name' },
    { key: 'motherName', label: 'Mother Name' },
    { key: 'phoneNumber', label: 'Phone Number' },
  ];

  // Determine overall match status
  const getMatchStatus = (): { label: string; color: string; icon: JSX.Element } => {
    if (matchScore >= 80) {
      return {
        label: 'MATCHED',
        color: 'bg-green-600 text-white',
        icon: <CheckCircle2 className="w-5 h-5" />
      };
    } else if (matchScore >= 60) {
      return {
        label: 'REVIEW REQUIRED',
        color: 'bg-yellow-600 text-white',
        icon: <AlertCircle className="w-5 h-5" />
      };
    } else {
      return {
        label: 'NOT MATCHED',
        color: 'bg-red-600 text-white',
        icon: <XCircle className="w-5 h-5" />
      };
    }
  };

  const matchStatus = getMatchStatus();

  return (
    <div className="space-y-4">
      {/* Match Status Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full ${matchStatus.color} flex items-center gap-2 shadow-lg font-bold text-sm`}>
            {matchStatus.icon}
            {matchStatus.label}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Confidence Score:</span>
            <Badge variant={matchScore >= 80 ? "default" : matchScore >= 60 ? "secondary" : "destructive"} className="text-base font-bold">
              {matchScore}%
            </Badge>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[200px_1fr_auto_1fr] gap-0 text-sm">
          {/* Header Row */}
          <div className="bg-primary/10 p-3 font-semibold border-b border-r">Field</div>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 font-semibold border-b border-r text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Patient Record (Source)
            </div>
          </div>
          <div className="bg-muted/30 p-3 border-b border-r flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 p-3 font-semibold border-b text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              HDSS Database Match
            </div>
          </div>

          {/* Data Rows */}
          {comparisonFields.map((field, idx) => {
            const sourceValue = getFieldValue(sourceRecord, field.key);
            const matchValue = getFieldValue(matchedRecord, field.key);
            const matchColor = getMatchColor(field.key);
            const matchIcon = getMatchIcon(field.key);
            const isMatched = sourceValue === matchValue && sourceValue !== '-';

            return (
              <>
                {/* Field Name */}
                <div
                  key={`label-${field.key}`}
                  className={`p-3 border-b border-r font-medium ${idx % 2 === 0 ? 'bg-muted/10' : ''}`}
                >
                  {field.label}
                </div>

                {/* Source Value */}
                <div
                  key={`source-${field.key}`}
                  className={`p-3 border-b border-r ${idx % 2 === 0 ? 'bg-blue-50/30 dark:bg-blue-950/10' : 'bg-blue-50/50 dark:bg-blue-950/20'} ${isMatched ? 'font-semibold text-green-700 dark:text-green-400' : ''}`}
                >
                  {sourceValue}
                </div>

                {/* Match Icon */}
                <div
                  key={`icon-${field.key}`}
                  className={`p-3 border-b border-r flex items-center justify-center ${idx % 2 === 0 ? 'bg-muted/10' : ''}`}
                >
                  {matchIcon}
                </div>

                {/* Matched Value */}
                <div
                  key={`match-${field.key}`}
                  className={`p-3 border-b ${idx % 2 === 0 ? 'bg-green-50/30 dark:bg-green-950/10' : 'bg-green-50/50 dark:bg-green-950/20'} ${isMatched ? 'font-semibold text-green-700 dark:text-green-400' : ''}`}
                >
                  {matchValue}
                </div>
              </>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Exact Match</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600" />
          <span>Different Value</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <span>Not Used for Matching</span>
        </div>
      </div>
    </div>
  );
};

export default SideBySideComparison;
