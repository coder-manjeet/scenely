import { router } from '@inertiajs/react';
import { Download, MoreVertical, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CsvConversion } from '@/types';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedConversions {
    data: CsvConversion[];
    current_page: number;
    from: number | null;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    per_page: number;
    to: number | null;
    total: number;
    links: PaginationLink[];
}

interface DataTableProps {
    data: PaginatedConversions;
    search: string;
    status?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    return (
        <Badge variant="outline" className={`px-1.5 capitalize ${map[status] ?? ''}`}>
            {status}
        </Badge>
    );
};

export default function DataTable({ data, search: initialSearch, status: initialStatus }: DataTableProps) {
    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState(initialStatus ?? '');

    useEffect(() => {
        setSearch(initialSearch);
        setStatus(initialStatus ?? '');
    }, [initialSearch, initialStatus]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search === initialSearch && status === (initialStatus ?? '')) {
                return;
            }

            router.get(
                '/csv-conversions',
                {
                    search: search || undefined,
                    status: status || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, status]);

    const handleDelete = (item: CsvConversion) => {
        if (!confirm(`Delete conversion of "${item.original_filename}"?`)) {
            return;
        }

        router.delete(`/csv-conversions/${item.id}`, {
            preserveScroll: true,
        });
    };

    const handleDownload = (item: CsvConversion) => {
        window.location.href = `/csv-conversions/${item.id}/download`;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by filename..."
                        className="pl-9"
                    />
                </div>

                <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            <TableHead>Filename</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Scenes</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[70px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.data.length > 0 ? (
                            data.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        {item.original_filename}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                    <TableCell>{item.scene_count || '—'}</TableCell>
                                    <TableCell>
                                        {new Date(item.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button variant="ghost" size="icon" className="size-8" />
                                                }
                                            >
                                                <MoreVertical className="size-4" />
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                {item.status === 'completed' && (
                                                    <DropdownMenuItem onClick={() => handleDownload(item)}>
                                                        <Download className="mr-2 size-4" />
                                                        Download CSV
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <Trash2 className="mr-2 size-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No conversions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination – same as users */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {data.from ?? 0} to {data.to ?? 0} of {data.total}
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!data.prev_page_url}
                        onClick={() =>
                            data.prev_page_url &&
                            router.get(data.prev_page_url, {}, { preserveState: true, preserveScroll: true })
                        }
                    >
                        Previous
                    </Button>

                    {data.links.slice(1, -1).map((link, index) => {
                        if (link.label === '...') {
                            return (
                                <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <Button
                                key={link.label}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(link.url, {}, { preserveState: true, preserveScroll: true })
                                }
                            >
                                {link.label}
                            </Button>
                        );
                    })}

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!data.next_page_url}
                        onClick={() =>
                            data.next_page_url &&
                            router.get(data.next_page_url, {}, { preserveState: true, preserveScroll: true })
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}