import { Head } from '@inertiajs/react';
import { Calendar, FileSpreadsheet, Users } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

interface DashboardStats {
    totalUsers: number;
    conversionsToday: number;
    conversionsThisMonth: number;
}

interface DashboardPageProps {
    stats: DashboardStats;
}

type StatKey = keyof DashboardStats;

const statCards: Array<{
    label: string;
    statKey: StatKey;
    description: string;
    icon: typeof Users;
}> = [
    {
        label: 'Total Users',
        statKey: 'totalUsers',
        description: 'Registered accounts',
        icon: Users,
    },
    {
        label: "Today's Conversions",
        statKey: 'conversionsToday',
        description: 'CSV conversions created today',
        icon: Calendar,
    },
    {
        label: 'This Month',
        statKey: 'conversionsThisMonth',
        description: 'Conversions created this month',
        icon: FileSpreadsheet,
    },
];

export default function Dashboard({ stats }: DashboardPageProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {statCards.map((card) => (
                        <Card key={card.label}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-3xl font-semibold">
                                            {stats[card.statKey].toLocaleString()}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {card.description}
                                        </CardDescription>
                                    </div>
                                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex size-11 items-center justify-center rounded-lg border bg-muted">
                                        <card.icon className="size-5" />
                                    </div>
                                </div>
                                <div className="text-sm font-medium">{card.label}</div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};