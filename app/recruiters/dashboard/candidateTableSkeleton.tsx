import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function CandidateTableSkeleton() {
  // Create 5 skeleton rows
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {/* Name and Email Cell */}
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </TableCell>

          {/* Skills Cell */}
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 3 }).map((_, skillIndex) => (
                <Skeleton key={skillIndex} className="h-6 w-16" />
              ))}
            </div>
          </TableCell>

          {/* Relevance Score Cell */}
          <TableCell>
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" /> {/* Star icon */}
              <Skeleton className="h-4 w-12" /> {/* Score */}
            </div>
          </TableCell>

          {/* Actions Cell */}
          <TableCell>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-24" /> {/* View Profile button */}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

