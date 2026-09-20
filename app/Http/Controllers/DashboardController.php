<?php

namespace App\Http\Controllers;

use App\Models\CsvConversion;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'conversionsToday' => CsvConversion::whereDate('created_at', now()->toDateString())->count(),
                'conversionsThisMonth' => CsvConversion::whereBetween('created_at', [
                    now()->startOfMonth(),
                    now()->endOfMonth(),
                ])->count(),
            ],
        ]);
    }
}
