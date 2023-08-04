'use client';

import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { SubscribeToSubthreadPayload } from '@/lib/validators/subthread';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, startTransition } from 'react';
import { Button } from './ui/button';

interface SubscribeLeaveToggleProps {
    subthreaditId: string;
    subthreadName: string;
    isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
    subthreaditId,
    subthreadName,
    isSubscribed,
}) => {
    const { loginToast } = useCustomToast();
    const router = useRouter();

    const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubthreadPayload = {
                subthreaditId,
            };

            const { data } = await axios.post(
                '/api/subthread/subscribe',
                payload
            );
            return data as string;
        },
        onError: async (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast({
                title: 'There was a problem',
                description: 'Something went wrong, please try again.',
                variant: 'destructive',
            });
        },
        onSuccess: async () => {
            startTransition(() => {
                router.refresh();
            });
            return toast({
                title: 'Subscribed',
                description: `You are now subscribed to t/${subthreadName}`,
            });
        },
    });

    const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubthreadPayload = {
                subthreaditId,
            };

            const { data } = await axios.post(
                '/api/subthread/unsubscribe',
                payload
            );
            return data as string;
        },
        onError: async (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast({
                title: 'There was a problem',
                description: 'Something went wrong, please try again.',
                variant: 'destructive',
            });
        },
        onSuccess: async () => {
            startTransition(() => {
                router.refresh();
            });
            return toast({
                title: 'Unsubscribed',
                description: `You are now unsubscribed from t/${subthreadName}`,
            });
        },
    });

    return isSubscribed ? (
        <Button
            isLoading={isUnsubLoading}
            onClick={() => unsubscribe()}
            className="w-full mt-1 mb-4"
        >
            {isUnsubLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Leave Community
        </Button>
    ) : (
        <Button
            isLoading={isSubLoading}
            onClick={() => subscribe()}
            className="w-full mt-1 mb-4"
        >
            {isSubLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Join to Post
        </Button>
    );
};

export default SubscribeLeaveToggle;
