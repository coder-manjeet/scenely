<?php

namespace App\Http\Controllers;

use App\Models\CsvConversion;
use App\Services\ScriptToCsvConverter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CsvConversionController extends Controller
{
    public function index(Request $request)
    {
        $conversions = CsvConversion::query()
            ->where('user_id', $request->user()->id)
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
                $query->where(function ($q) use ($search) {
                    $q->where('original_filename', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->string('status'));
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('csv-conversions/index', [
            'conversions' => $conversions,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    public function store(Request $request, ScriptToCsvConverter $converter)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:md,txt,docx', 'max:10240'], // 10 MB
            'dialogue_key' => ['required', 'string', 'max:100'],
            'image_prompt_key' => ['required', 'string', 'max:100'],
            'duration_key' => ['required', 'string', 'max:100'],
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $storedPath = $file->store('csv-conversions/originals', 'local');

        $conversion = CsvConversion::create([
            'user_id' => $request->user()->id,
            'original_filename' => $originalName,
            'original_path' => $storedPath,
            'dialogue_key' => $validated['dialogue_key'],
            'image_prompt_key' => $validated['image_prompt_key'],
            'duration_key' => $validated['duration_key'],
            'status' => 'processing',
        ]);

        try {
            $absolutePath = Storage::disk('local')->path($storedPath);

            $result = $converter->convert(
                $absolutePath,
                $validated['dialogue_key'],
                $validated['image_prompt_key'],
                $validated['duration_key']
            );

            $csvFilename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '-' . now()->format('YmdHis') . '.csv';
            $csvPath = 'csv-conversions/generated/' . $csvFilename;

            Storage::disk('local')->put($csvPath, $result['csv']);

            $conversion->update([
                'csv_path' => $csvPath,
                'status' => 'completed',
                'scene_count' => $result['count'],
            ]);
        } catch (\Throwable $e) {
            $conversion->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return back()->withErrors([
                'file' => 'Conversion failed: ' . $e->getMessage(),
            ]);
        }

        return to_route('csv-conversions')
            ->with('success', "Successfully converted {$result['count']} scenes.");
    }

    public function download(CsvConversion $csvConversion)
    {
        abort_unless($csvConversion->user_id === auth()->id(), 403);
        abort_unless($csvConversion->status === 'completed' && $csvConversion->csv_path, 404);

        return Storage::disk('local')->download(
            $csvConversion->csv_path,
            pathinfo($csvConversion->original_filename, PATHINFO_FILENAME) . '.csv'
        );
    }

    public function destroy(CsvConversion $csvConversion)
    {
        abort_unless($csvConversion->user_id === auth()->id(), 403);

        $csvConversion->deleteFiles();
        $csvConversion->delete();

        return to_route('csv-conversions')
            ->with('success', 'Conversion deleted.');
    }
}