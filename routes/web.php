<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CsvConversionController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('users', [UserController::class, 'index'])->name('users');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('csv-conversions', [CsvConversionController::class, 'index'])->name('csv-conversions');
    Route::post('csv-conversions', [CsvConversionController::class, 'store'])->name('csv-conversions.store');
    Route::get('csv-conversions/{csvConversion}/download', [CsvConversionController::class, 'download'])->name('csv-conversions.download');
    Route::delete('csv-conversions/{csvConversion}', [CsvConversionController::class, 'destroy'])->name('csv-conversions.destroy');
});

require __DIR__ . '/settings.php';
