import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export interface Column<T> {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
    className?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    pageSize?: number
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    pageSize = 10,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = React.useState(1)
    const totalPages = Math.ceil(data.length / pageSize) || 1

    const paginatedData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="rounded-xl border bg-card shadow-sm flex-1 overflow-hidden relative flex flex-col">
                <ScrollArea className="flex-1 w-full">
                    <Table>
                        <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                            <TableRow className="hover:bg-transparent border-b border-border/60">
                                {columns.map((col, index) => (
                                    <TableHead key={index} className={`h-11 font-semibold text-foreground/70 ${col.className || ""}`}>
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0">
                                        {columns.map((col, index) => (
                                            <TableCell key={index} className={`py-3 ${col.className || ""}`}>
                                                {col.cell
                                                    ? col.cell(item)
                                                    : col.accessorKey
                                                        ? (item[col.accessorKey] as React.ReactNode)
                                                        : null}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        Không có dữ liệu.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 pt-2">
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
    )
}
