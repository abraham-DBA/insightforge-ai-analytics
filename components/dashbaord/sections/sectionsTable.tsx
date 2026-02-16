import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton';
import { getStatusBadge, getToneBadge } from './sectionBadges';

interface SectionTableProps {
    sections: Section[];
    isLoading: boolean;
    onPreview: (section: Section) => void;
    onCreateSection: () => void;
}

const SectionsTable = ({sections, isLoading, onPreview, onCreateSection}:SectionTableProps) => {
  return (
    <Table>
        <TableHeader>
            <TableRow className='border-white/5 hover:bg-transparent'>
                <TableHead className='text-xs uppercase font-medium text-zinc-500'>Name</TableHead>
                <TableHead className='text-xs uppercase font-medium text-zinc-500'>Sources</TableHead>
                <TableHead className='text-xs uppercase font-medium text-zinc-500'>Tone</TableHead>
                <TableHead className='text-xs uppercase font-medium text-zinc-500'>Scope</TableHead>
                <TableHead className='text-xs uppercase font-medium text-zinc-500'>Status</TableHead>
                <TableHead className='text-xs uppercase font-medium text-zinc-500 text-right'>Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
                <TableRow className="hover:bg-transparent">
                    <TableCell className='h-48 text-center'>
                        <Skeleton className="h-5 w-32 bg-white/5" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32 bg-white/5" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32 bg-white/5" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32 bg-white/5" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32 bg-white/5" />
                    </TableCell>
                    <TableCell className='text-right'>
                        <Skeleton className="h-5 w-32 bg-white/5 ml-auto" />
                    </TableCell>
                </TableRow>
          ) : (
            sections.length > 0 ? sections.map((section) => (
                <TableRow 
                key={section.id}
                className='border-white/5 hover:bg-white/5 cursor-pointer group transition-colors focus-visible:bg-white/5 focus-visible:outline-none focus:outline-none'
                onClick={() => onPreview(section)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onPreview(section);
                    }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Preview section ${section.name}`}
                >
                    <TableCell className='font-medium text-zinc-200 py-3 group-hover:text-white transition-colors'>{section.name}</TableCell>
                    <TableCell className='text-zinc-400 text-sm py-3'>
                      {section.sourceCount}
                      <span className='text-zinc-600'> sources</span>
                    </TableCell>
                    <TableCell className='py-3'>{getToneBadge(section.tone)}</TableCell>
                    <TableCell className='text-zinc-400 text-sm py-3'>{section.scopeLabel}</TableCell>
                    <TableCell className='py-3'>{getStatusBadge(section.status)}</TableCell>
                    <TableCell className='text-right'>
                        <Button 
                        variant="ghost"
                        size="sm"
                        className='h-8 text-zinc-400 hover:text-white hover:bg-white/5'
                        onClick={() => onPreview(section)}>Preview</Button>
                    </TableCell>
                </TableRow>
            )) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className='h-48 text-center text-zinc-500'>
                  No sections found. Create one to get started.
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
    </Table>
  )
}

export default SectionsTable