import { ReactNode, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  render?: (value: any, row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  className?: string;
  pageSize?: number;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick,
  className,
  pageSize = 10
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize) || 1;

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className={cn("rounded-xl border border-border bg-card overflow-hidden shadow-sm flex-1", className)}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border bg-muted/50">
              <TableHead className="font-semibold text-foreground/70 w-16">STT</TableHead>
              {columns.map((column, index) => (
                <TableHead 
                  key={index} 
                  className={cn("font-semibold text-foreground/70", column.className)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-border transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50"
                  )}
                >
                  <TableCell className="py-3 text-muted-foreground">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </TableCell>
                  {columns.map((column, index) => {
                    const value = typeof column.accessor === "function"
                      ? column.accessor(row)
                      : row[column.accessor as keyof T];
                    return (
                      <TableCell key={index} className={cn("py-3", column.className)}>
                        {column.render ? column.render(value, row) : (value as ReactNode)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Hiển thị {paginatedData.length} trên tổng số {data.length} kết quả
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
