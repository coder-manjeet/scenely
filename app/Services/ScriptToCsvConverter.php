<?php

namespace App\Services;

use League\Csv\Writer;
use PhpOffice\PhpWord\IOFactory;
use RuntimeException;

class ScriptToCsvConverter
{
    public function convert(
        string $filePath,
        string $dialogueKey = 'Dialogue',
        string $imagePromptKey = 'Image Prompt',
        string $durationKey = 'Scene Duration'
    ): array {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        $text = match ($extension) {
            'md', 'txt' => file_get_contents($filePath),
            'docx' => $this->extractTextFromDocx($filePath),
            default => throw new RuntimeException("Unsupported file type: {$extension}"),
        };

        if ($text === false || trim($text) === '') {
            throw new RuntimeException('Could not read file content.');
        }

        $scenes = $this->parseScenes($text, $dialogueKey, $imagePromptKey, $durationKey);

        if (empty($scenes)) {
            throw new RuntimeException('No scenes found. Check your keys and file format.');
        }

        $csvContent = $this->buildCsv($scenes);

        return [
            'scenes' => $scenes,
            'csv' => $csvContent,
            'count' => count($scenes),
        ];
    }

    protected function extractTextFromDocx(string $path): string
    {
        $phpWord = IOFactory::load($path);
        $text = '';

        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $element) {
                if (method_exists($element, 'getText')) {
                    $text .= $element->getText() . "\n";
                } elseif (method_exists($element, 'getElements')) {
                    foreach ($element->getElements() as $child) {
                        if (method_exists($child, 'getText')) {
                            $text .= $child->getText() . "\n";
                        }
                    }
                }
            }
        }

        return $text;
    }

    protected function parseScenes(
        string $text,
        string $dialogueKey,
        string $imagePromptKey,
        string $durationKey
    ): array {
        // Normalize line endings
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        // Split by "Scene X:" pattern (case-insensitive)
        $parts = preg_split('/(?=Scene\s+\d+\s*:)/i', $text, -1, PREG_SPLIT_NO_EMPTY);

        $scenes = [];

        foreach ($parts as $part) {
            $part = trim($part);
            if ($part === '') {
                continue;
            }

            // Extract scene number
            if (! preg_match('/Scene\s+(\d+)\s*:/i', $part, $m)) {
                continue;
            }

            $sceneNumber = (int) $m[1];

            $dialogue = $this->extractValue($part, $dialogueKey);
            $imagePrompt = $this->extractValue($part, $imagePromptKey);
            $duration = $this->extractValue($part, $durationKey);

            // Skip completely empty scenes
            if ($dialogue === '' && $imagePrompt === '' && $duration === '') {
                continue;
            }

            $scenes[] = [
                'Scene' => $sceneNumber,
                'Dialogue' => $dialogue,
                'Image Prompt' => $imagePrompt,
                'Scene Duration' => $duration,
            ];
        }

        // Sort by scene number just in case
        usort($scenes, fn ($a, $b) => $a['Scene'] <=> $b['Scene']);

        return $scenes;
    }

    protected function extractValue(string $block, string $key): string
    {
        // Match "Key: value" until next known key or end of block
        $pattern = '/' . preg_quote($key, '/') . '\s*:\s*(.*?)(?=\n(?:Dialogue|Image Prompt|Scene Duration|Scene\s+\d+)\s*:|$)/is';

        if (preg_match($pattern, $block, $matches)) {
            return trim($matches[1]);
        }

        return '';
    }

    protected function buildCsv(array $scenes): string
    {
        $csv = Writer::createFromString();
        $csv->insertOne(['Scene', 'Dialogue', 'Image Prompt', 'Scene Duration']);

        foreach ($scenes as $scene) {
            $csv->insertOne([
                $scene['Scene'],
                $scene['Dialogue'],
                $scene['Image Prompt'],
                $scene['Scene Duration'],
            ]);
        }

        return $csv->toString();
    }
}