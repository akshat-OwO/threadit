'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { CreateSubthreadPayload } from '@/lib/validators/subthread';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    const [input, setInput] = useState<string>('');
    const router = useRouter();
    const { loginToast } = useCustomToast();

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: CreateSubthreadPayload = {
                name: input,
            };
            const { data } = await axios.post('/api/subthread', payload);
            return data as string;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'Subreddit already exists.',
                        description:
                            'Please choose a different Subthread name.',
                        variant: 'destructive',
                    });
                }

                if (err.response?.status === 422) {
                    return toast({
                        title: 'Invalid subthread name.',
                        description:
                            'Please choose a name between 3 and 21 characters.',
                        variant: 'destructive',
                    });
                }

                if (err.response?.status === 401) {
                    return loginToast();
                }

                toast({
                    title: 'There was an error.',
                    description: 'Could not create subthread.',
                    variant: 'destructive',
                });
            }
        },
        onSuccess: (data) => {
            router.push(`/t/${data}`);
        },
    });

    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative bg-white h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">
                        Create a community
                    </h1>
                </div>
                <hr className="bg-zinc-500 h-px" />
                <div>
                    <p className="text-lg font-medium">Name</p>
                    <p className="tex-xs pb-2">
                        Community name including capitalization cannot be
                        changed
                    </p>

                    <div className="relative">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                            t/
                        </p>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="pl-6"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        isLoading={isLoading}
                        disabled={input.length === 0}
                        onClick={() => createCommunity()}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Page;
