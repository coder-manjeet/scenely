import DataTable from './data-table';
import { User } from '@/types';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddUserForm } from '@/components/forms/add-user';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


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

interface UsersPageProps {
    users: PaginatedUsers;
    filters: {
        search?: string;
    };
}

export default function Index({
    users,
    filters,
}: UsersPageProps) {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const AddUserDialog = () => {
        return (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Fill in the information below to create a new user account.
                        </DialogDescription>
                    </DialogHeader>
                    <AddUserForm onSuccess={() => setIsAddModalOpen(false)} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
            <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage your users</CardDescription>
                    </div>
                    <Button className='w-auto ml-auto mr-0' size="sm" onClick={() => setIsAddModalOpen(true)} >
                        <Plus className="h-4 w-4" /> Add New
                    </Button>
                </CardHeader>
                <CardContent>

                    <DataTable
                        data={users}
                        search={filters.search ?? ''}
                    />

                    <AddUserDialog />
                </CardContent>
            </Card>
        </>
    );
}