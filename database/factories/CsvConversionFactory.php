<?php

namespace Database\Factories;

use App\Models\CsvConversion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CsvConversion>
 */
class CsvConversionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = fake()->slug().'.md';

        return [
            'user_id' => User::factory(),
            'original_filename' => $filename,
            'original_path' => 'csv-conversions/originals/'.Str::slug($filename),
            'dialogue_key' => 'Dialogue',
            'image_prompt_key' => 'Image Prompt',
            'duration_key' => 'Scene Duration',
            'status' => 'completed',
            'scene_count' => fake()->numberBetween(1, 20),
        ];
    }

    /**
     * Indicate that the conversion is still pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the conversion failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'error_message' => 'Something went wrong.',
        ]);
    }

    public function configure(): static
    {
        return $this->afterMaking(function (CsvConversion $conversion) {
            if ($conversion->status === 'completed') {
                $conversion->csv_path = 'csv-conversions/generated/'.Str::slug(pathinfo($conversion->original_filename, PATHINFO_FILENAME)).'.csv';
            }
        });
    }
}
