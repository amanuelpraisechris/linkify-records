/**
 * Audit Logs Page
 * View and manage audit trail
 */

import { AuditLogViewer } from '@/components/audit/AuditLogViewer';

export default function AuditLogs() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Audit Trail</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive system activity and security logs
        </p>
      </div>

      <AuditLogViewer />
    </div>
  );
}
