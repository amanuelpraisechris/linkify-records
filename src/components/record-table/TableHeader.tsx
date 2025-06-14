
import React from 'react';

interface TableHeaderProps {
  showMatchDetail?: boolean;
  showActions?: boolean;
  showCheckbox?: boolean;
}

const TableHeader = ({ showMatchDetail = false, showActions = false, showCheckbox = false }: TableHeaderProps) => {
  return (
    <thead className="bg-muted/50">
      <tr>
        {showCheckbox && (
          <th className="px-2 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider w-10"></th>
        )}
        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider w-10"></th>
        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Name</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Gender</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Birth Date</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Village</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Sub-Village</th>
        {showMatchDetail && (
          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Match Score</th>
        )}
        {showActions && (
          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Actions</th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
