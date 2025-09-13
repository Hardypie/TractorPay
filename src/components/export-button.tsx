'use client';

import * as XLSX from 'xlsx';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import type { Customer } from '@/lib/types';

interface ExportButtonProps {
  data: Customer[];
  fileName?: string;
}

export function ExportButton({ data, fileName = 'customer_data.xlsx' }: ExportButtonProps) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Button variant="outline" onClick={exportToExcel}>
      <Download className="mr-2 h-4 w-4" />
      Export to Excel
    </Button>
  );
}
