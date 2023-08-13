'use client';

import { Image, Link2 } from 'lucide-react';
import { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import UserAvatar from './UserAvatar';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface MiniCreatePostProps {
    session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="overflow-hidden rounded-md bg-white shadow">
            <div className="h-full px-6 py-4 flex justify-between gap-6">
                <div className="relative">
                    <UserAvatar
                        user={{
                            name: session?.user.name || null,
                            image: session?.user.image || null,
                        }}
                    />
                </div>
                <Input
                    readOnly
                    onClick={() => router.push(pathname + '/submit')}
                    placeholder="Create post"
                />

                <Button
                    onClick={() => router.push(pathname + '/submit')}
                    variant="ghost"
                    className='hidden sm:block'
                >
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="text-zinc-600" />
                </Button>

                <Button
                    variant="ghost"
                    className='hidden sm:block'
                    onClick={() => router.push(pathname + '/submit')}
                >
                    <Link2 className="text-zinc-600" />
                </Button>
            </div>
        </div>
    );
};

export default MiniCreatePost;
