# Scenely

A modern dashboard for converting structured scene scripts into clean CSV files.

Built with the official **Laravel 13 React Starter Kit** (Inertia + React 19 + TypeScript + Tailwind + shadcn/ui).

---

## What it does

Upload a scene script (`.md` or `.docx`) that looks like this:

Scene 1:
Dialogue: There comes a quiet moment when you feel the edges of yourself growing thin.
Image Prompt: Whimsical rich watercolor painting style, soft paper texture...
Scene Duration: 5
Scene 2:
Dialogue: You have given so much of your time, your energy, your silence.
Image Prompt: Whimsical rich watercolor painting style...
Scene Duration: 3

The app extracts **Dialogue**, **Image Prompt**, and **Scene Duration** using the keys you provide and generates a downloadable CSV.

---

## Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Backend        | Laravel 13                          |
| Frontend       | React 19 + TypeScript + Inertia     |
| UI             | shadcn/ui + Tailwind CSS            |
| Auth           | Built-in Laravel authentication     |
| File handling  | Native + PhpWord for `.docx`        |

---

## Features

- Login / Logout
- **CSV Conversions** page
  - Backend pagination
  - Search
  - Column filters
- “Convert New” modal
  - Upload `.md` or `.docx`
  - Custom keys for:
    - Dialogue
    - Image Prompt
    - Scene Duration
- Automatic parsing → CSV generation
- Download generated CSV
- Clean status tracking (pending / processing / completed / failed)

---

## Requirements

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL / PostgreSQL / SQLite

---

## Installation

```bash
# Create the project using the official React starter kit
laravel new scriptcsv --react

cd scriptcsv

# Install PHP dependencies (if needed)
composer install

# Install frontend dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env, then run migrations
php artisan migrate

# Start the development servers
composer run dev
```

The app will be available at http://localhost:8000.
```bash
Project Structure (Key Parts)

textapp/
├── Http/Controllers/CsvConversionController.php
├── Models/CsvConversion.php
├── Services/ScriptToCsvConverter.php
└── Jobs/ProcessScriptConversion.php   (optional queue)

resources/js/
├── Pages/CsvConversions/
│   └── Index.tsx
├── components/
│   ├── ui/                  # shadcn components
│   └── csv-conversions/     # table, modal, filters
```

## Usage

- Log in.
- Go to CSV Conversions.
- Click Convert New.
- Upload your script (.md / .docx).
- Confirm or change the three keys:
- Dialogue
- Image Prompt
- Scene Duration

- Submit → the system parses the file and generates a CSV.
- Download the CSV from the table.


## License
MIT