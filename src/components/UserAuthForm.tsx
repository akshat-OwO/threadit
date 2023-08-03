'use client';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { FC, useState } from 'react';
import { Icons } from './Icons';
import { Button } from './ui/button';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await signIn('google');
        } catch (error) {
            toast({
                title: 'There was a problem.',
                description: 'There was an error logging in with Google',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('flex justify-center', className)} {...props}>
            <Button
                onClick={loginWithGoogle}
                isLoading={isLoading}
                size="sm"
                className="w-full"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="h-4 w-4 mr-2" />
                )}
                Google
            </Button>
        </div>
    );
};

export default UserAuthForm;
