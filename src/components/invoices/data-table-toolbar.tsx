"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, PlusCircle } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const statuses = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Overdue', label: 'Overdue' },
  ]

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by customer..."
          value={(table.getColumn("customerId")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            // This is a simple text filter on customer name which is rendered in the cell
            // A more robust solution would use the customer ID and a select dropdown
            table.getColumn("customerId")?.setFilterValue(event.target.value)
          }}
          className="h-10 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <PlusCircle className="mr-2 h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statuses.map((status) => (
                    <DropdownMenuCheckboxItem
                        key={status.value}
                        checked={(table.getColumn("status")?.getFilterValue() as string[] ?? []).includes(status.value)}
                        onCheckedChange={(checked) => {
                            const currentFilter = (table.getColumn("status")?.getFilterValue() as string[] ?? []);
                            if (checked) {
                                table.getColumn("status")?.setFilterValue([...currentFilter, status.value]);
                            } else {
                                table.getColumn("status")?.setFilterValue(currentFilter.filter(v => v !== status.value));
                            }
                        }}
                    >
                        {status.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
