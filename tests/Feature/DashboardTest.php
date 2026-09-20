<?php

use App\Models\CsvConversion;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated non-admin users cannot visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertForbidden();
});

test('admins can visit the dashboard', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard exposes user and conversion statistics', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->count(3)->create();

    CsvConversion::factory()->count(2)->for($admin)->create(['created_at' => now()]);
    CsvConversion::factory()->for($admin)->create(['created_at' => now()->startOfMonth()]);
    CsvConversion::factory()->for($admin)->create(['created_at' => now()->subMonth()]);

    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->where('stats.totalUsers', 4)
        ->where('stats.conversionsToday', 2)
        ->where('stats.conversionsThisMonth', 3)
    );
});
