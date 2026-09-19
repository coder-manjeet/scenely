
export type CsvConversion = {
    id: number;
    user_id: number;
    original_filename: string;
    original_path: string;
    csv_path: string | null;
    dialogue_key: string;
    image_prompt_key: string;
    duration_key: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    scene_count: number;
    error_message: string | null;
    created_at: string;
    updated_at: string;
};