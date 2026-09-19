import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form } from '@inertiajs/react';
import { toast } from 'sonner';
import { useRef } from 'react';

interface ConvertScriptFormProps {
    onSuccess: () => void;
}

export function ConvertScriptForm({ onSuccess }: ConvertScriptFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Form
            action="/csv-conversions"
            method="post"
            encType="multipart/form-data"
            resetOnSuccess
            onSuccess={() => {
                onSuccess();
                toast.success('Script converted successfully');
            }}
            onError={() => {
                toast.error('Please check the form for errors.');
            }}
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="file">Script File (.md or .docx)</Label>
                            <Input
                                id="file"
                                name="file"
                                type="file"
                                accept=".md,.txt,.docx"
                                ref={fileInputRef}
                                disabled={processing}
                                required
                            />
                            {errors.file && (
                                <p className="text-sm text-red-500">{errors.file}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dialogue_key">Dialogue Key</Label>
                            <Input
                                id="dialogue_key"
                                name="dialogue_key"
                                type="text"
                                defaultValue="Dialogue"
                                disabled={processing}
                                required
                            />
                            {errors.dialogue_key && (
                                <p className="text-sm text-red-500">{errors.dialogue_key}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image_prompt_key">Image Prompt Key</Label>
                            <Input
                                id="image_prompt_key"
                                name="image_prompt_key"
                                type="text"
                                defaultValue="Image Prompt"
                                disabled={processing}
                                required
                            />
                            {errors.image_prompt_key && (
                                <p className="text-sm text-red-500">{errors.image_prompt_key}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="duration_key">Scene Duration Key</Label>
                            <Input
                                id="duration_key"
                                name="duration_key"
                                type="text"
                                defaultValue="Scene Duration"
                                disabled={processing}
                                required
                            />
                            {errors.duration_key && (
                                <p className="text-sm text-red-500">{errors.duration_key}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Converting...' : 'Convert to CSV'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}