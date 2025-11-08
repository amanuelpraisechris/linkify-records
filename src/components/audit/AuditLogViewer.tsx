/**
 * Audit Log Viewer Component
 * Displays and filters audit trail entries
 */

import { useState, useEffect, useMemo } from 'react';
import {
  AuditLogEntry,
  AuditActionType,
  AuditSeverity,
  AuditQueryFilter,
  AuditStats,
} from '@/types/audit';
import {
  queryAuditLogs,
  getAuditStats,
  exportAuditLogs,
  clearAuditLogs,
} from '@/services/auditService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { saveAs } from 'file-saver';

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [filter, setFilter] = useState<AuditQueryFilter>({
    limit: 100,
    offset: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Load logs and stats
  const loadData = () => {
    setIsLoading(true);
    try {
      const currentFilter: AuditQueryFilter = {
        ...filter,
        searchText: searchText || undefined,
        severity: selectedSeverity !== 'all' ? [selectedSeverity as AuditSeverity] : undefined,
        actionTypes: selectedActionType !== 'all' ? [selectedActionType as AuditActionType] : undefined,
      };

      const fetchedLogs = queryAuditLogs(currentFilter);
      const fetchedStats = getAuditStats();

      setLogs(fetchedLogs);
      setStats(fetchedStats);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter, searchText, selectedSeverity, selectedActionType]);

  // Handle export
  const handleExport = (format: 'json' | 'csv') => {
    const currentFilter: AuditQueryFilter = {
      searchText: searchText || undefined,
      severity: selectedSeverity !== 'all' ? [selectedSeverity as AuditSeverity] : undefined,
      actionTypes: selectedActionType !== 'all' ? [selectedActionType as AuditActionType] : undefined,
    };

    const content = exportAuditLogs(format, currentFilter);
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv',
    });
    const filename = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
    saveAs(blob, filename);
  };

  // Handle clear logs
  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      clearAuditLogs();
      loadData();
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity: AuditSeverity): string => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'info':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.logsBySeverity.error || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.logsBySeverity.warning || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.logsBySeverity.info || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>View and filter system audit trail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedActionType} onValueChange={setSelectedActionType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="USER_LOGIN">User Login</SelectItem>
                <SelectItem value="USER_LOGOUT">User Logout</SelectItem>
                <SelectItem value="MATCH_ACCEPT">Match Accept</SelectItem>
                <SelectItem value="MATCH_REJECT">Match Reject</SelectItem>
                <SelectItem value="BATCH_MATCH_START">Batch Match Start</SelectItem>
                <SelectItem value="BATCH_MATCH_COMPLETE">Batch Match Complete</SelectItem>
                <SelectItem value="DATA_IMPORT">Data Import</SelectItem>
                <SelectItem value="DATA_EXPORT">Data Export</SelectItem>
                <SelectItem value="CONFIG_FIELD_WEIGHTS_UPDATE">Config Update</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-4">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('json')}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="destructive" onClick={handleClearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
          </div>

          {/* Logs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead className="w-[150px]">User</TableHead>
                  <TableHead className="w-[200px]">Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Entity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(log.severity) as any}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.userName || 'System'}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {log.actionType.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.description}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.entityType || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {logs.length} of {stats?.totalLogs || 0} logs
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filter.offset === 0}
                onClick={() => setFilter({ ...filter, offset: Math.max(0, (filter.offset || 0) - (filter.limit || 100)) })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={logs.length < (filter.limit || 100)}
                onClick={() => setFilter({ ...filter, offset: (filter.offset || 0) + (filter.limit || 100) })}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
