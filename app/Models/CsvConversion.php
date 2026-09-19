<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class CsvConversion extends Model
{
    protected $fillable = [
        'user_id',
        'original_filename',
        'original_path',
        'csv_path',
        'dialogue_key',
        'image_prompt_key',
        'duration_key',
        'status',
        'scene_count',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'scene_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getCsvDownloadUrlAttribute(): ?string
    {
        if (! $this->csv_path || ! Storage::disk('local')->exists($this->csv_path)) {
            return null;
        }

        return route('csv-conversions.download', $this);
    }

    public function deleteFiles(): void
    {
        if ($this->original_path) {
            Storage::disk('local')->delete($this->original_path);
        }
        if ($this->csv_path) {
            Storage::disk('local')->delete($this->csv_path);
        }
    }
}