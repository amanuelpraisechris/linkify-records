
import { ColumnDef } from "@tanstack/react-table"
import { MatchResult } from "@/types"

export const columns: ColumnDef<MatchResult>[] = [
  {
    accessorKey: "clinicFirstName",
    header: "Clinic First Name"
  },
  {
    accessorKey: "clinicLastName",
    header: "Clinic Last Name"
  },
  {
    accessorKey: "communityFirstName",
    header: "Community First Name"
  },
  {
    accessorKey: "communityLastName",
    header: "Community Last Name"
  },
  {
    accessorKey: "matchScore",
    header: "Match Score",
    cell: ({ row }) => {
      const score = row.getValue("matchScore") as number
      return `${(score * 100).toFixed(1)}%`
    }
  }
]
