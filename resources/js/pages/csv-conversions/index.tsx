import DataTable from './data-table';
import { CsvConversion } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConvertScriptForm } from '@/components/forms/convert-script';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

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

interface PageProps {
    conversions: PaginatedConversions;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ conversions, filters }: PageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Head title="CSV Conversions" />

            <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>CSV Conversions</CardTitle>
                        <CardDescription>
                            Convert scene scripts (.md / .docx) into clean CSV files
                        </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" /> Convert New
                    </Button>
                </CardHeader>

                <CardContent>
                    <DataTable
                        data={conversions}
                        search={filters.search ?? ''}
                        status={filters.status}
                    />

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>Convert Script to CSV</DialogTitle>
                                <DialogDescription>
                                    Upload a .md or .docx file and map the keys used in your script.
                                </DialogDescription>
                            </DialogHeader>
                            <ConvertScriptForm onSuccess={() => setIsModalOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'CSV Conversions', href: '/csv-conversions' },
    ],
};