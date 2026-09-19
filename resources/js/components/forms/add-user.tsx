import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Form } from '@inertiajs/react';
import { toast } from 'sonner';

interface AddUserFormProps {
    onSuccess: () => void;
}

export function AddUserForm({ onSuccess }: AddUserFormProps) {
    return (
        <Form
            action="/users"
            method="post"
            resetOnSuccess
            onSuccess={() => {
                onSuccess();
                toast.success('User created successfully');
            }}
            onError={() => {
                toast.error('Please check the form for errors.');
            }}
            className="space-y-8"
        >
            {({
                processing,
                errors,
            }) => (
                <>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                name="name"
                                type="text"
                                autoFocus
                                autoComplete="name"
                                placeholder="Enter your name"
                                disabled={processing}
                            />

                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                disabled={processing}
                            />

                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Enter your password"
                                disabled={processing}
                            />

                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="password_confirmation">
                                Password Confirmation
                            </Label>

                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                disabled={processing}
                            />

                            {errors.password_confirmation && (
                                <p className="text-sm text-red-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="is_active">Status</Label>

                            <div className="flex items-center gap-3">
                                <Switch
                                    id="is_active"
                                    name="is_active"
                                    value="1"
                                    defaultChecked
                                    disabled={processing}
                                />

                                <span className="text-sm text-muted-foreground">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing
                                ? 'Creating...'
                                : 'Create User'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}