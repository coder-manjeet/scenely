import { router } from '@inertiajs/react';
import { MoreVertical, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

import { User } from '@/types';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: User[];
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
    data: PaginatedUsers;
    search: string;
}

const StatusBadge = ({ status }: { status: string }) => {
    const statusClass =
        status === 'Active'
            ? 'bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-500'
            : 'bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-400';

    return (
        <Badge
            variant="outline"
            className={`text-muted-foreground px-1.5 ${statusClass}`}
        >
            {status}
        </Badge>
    );
};

export default function DataTable({
    data,
    search: initialSearch,
}: DataTableProps) {
    const [search, setSearch] = useState(initialSearch);

    useEffect(() => {
        setSearch(initialSearch);
    }, [initialSearch]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search === initialSearch) {
                return;
            }

            router.get(
                '/users',
                {
                    search: search || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const handleDelete = (user: User) => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
            return;
        }

        router.delete(`/users/${user.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="pl-9"
                />
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[70px] text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.data.length > 0 ? (
                            data.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        {user.name}
                                    </TableCell>

                                    <TableCell>
                                        {user.email}
                                    </TableCell>

                                    <TableCell>
                                        <StatusBadge
                                            status={
                                                user.is_active
                                                    ? 'Active'
                                                    : 'Inactive'
                                            }
                                        />
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    />
                                                }
                                            >
                                                <MoreVertical className="size-4" />
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.get(
                                                            `/users/${user.id}`,
                                                        )
                                                    }
                                                >
                                                    View
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.get(
                                                            `/users/${user.id}/edit`,
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(user)
                                                    }
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {data.from ?? 0} to {data.to ?? 0} of{' '}
                    {data.total}
                </div>

                <div className="flex items-center gap-1">
                    {/* Previous */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!data.prev_page_url}
                        onClick={() =>
                            data.prev_page_url &&
                            router.get(
                                data.prev_page_url,
                                {},
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            )
                        }
                    >
                        Previous
                    </Button>

                    {/* Page Numbers */}
                    {data.links.slice(1, -1).map((link, index) => {
                        if (link.label === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-sm text-muted-foreground"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <Button
                                key={link.label}
                                variant={
                                    link.active
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(
                                        link.url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                            >
                                {link.label}
                            </Button>
                        );
                    })}

                    {/* Next */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!data.next_page_url}
                        onClick={() =>
                            data.next_page_url &&
                            router.get(
                                data.next_page_url,
                                {},
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            )
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}