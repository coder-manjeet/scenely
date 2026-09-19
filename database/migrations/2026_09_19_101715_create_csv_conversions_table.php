<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('csv_conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('original_filename');
            $table->string('original_path');          // storage path of uploaded .md / .docx
            $table->string('csv_path')->nullable();    // storage path of generated CSV
            $table->string('dialogue_key')->default('Dialogue');
            $table->string('image_prompt_key')->default('Image Prompt');
            $table->string('duration_key')->default('Scene Duration');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->unsignedInteger('scene_count')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('csv_conversions');
    }
};