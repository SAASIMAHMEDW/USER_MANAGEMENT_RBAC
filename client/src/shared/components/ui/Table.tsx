import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">{children}</table>
    </div>
  );
};

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead>
    <tr className="bg-slate-50">{children}</tr>
  </thead>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <th
    className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-slate-100">{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <tr className={`hover:bg-slate-50 transition-colors ${className}`}>{children}</tr>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <td className={`px-4 py-3 text-sm text-slate-900 ${className}`}>{children}</td>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
