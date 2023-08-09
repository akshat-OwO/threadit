import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    params: {
        slug: string;
    };
}

const Layout: FC<LayoutProps> = async ({ children, params: { slug } }) => {
    const session = await getAuthSession();

    const subthread = await db.subThread.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    vote: true,
                },
            },
        },
    });

    const subscription = !session?.user
        ? undefined
        : await db.subscription.findFirst({
              where: {
                  subThread: {
                      name: slug,
                  },
                  user: {
                      id: session.user.id,
                  },
              },
          });

    const isSubscribed = !!subscription;

    if (!subthread) return notFound();

    const memberCount = await db.subscription.count({
        where: {
            subThread: {
                name: slug,
            },
        },
    });

    return (
        <div className="sm:container max-w-7xl mx-auto h-full pt-12">
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <div className="flex flex-col col-span-2 space-y-6">
                        {children}
                    </div>
                    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
                        <div className="px-6 py-4">
                            <p className="font-semibold py-3">
                                About t/{subthread.name}
                            </p>
                        </div>
                        <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Created</dt>
                                <dd className="text-gray-700">
                                    <time
                                        dateTime={subthread.createdAt.toDateString()}
                                    >
                                        {format(
                                            subthread.createdAt,
                                            'MMMM d, yyyy'
                                        )}
                                    </time>
                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Members</dt>
                                <dd className="text-gray-700">
                                    <div className="text-gray-900">
                                        {memberCount}
                                    </div>
                                </dd>
                            </div>
                            {subthread.creatorId === session?.user.id ? (
                                <div className="flex justify-between gap-x-4 py-3">
                                    <p className="text-gray-500">
                                        You created this community
                                    </p>
                                </div>
                            ) : null}
                            {subthread.creatorId !== session?.user.id ? (
                                <SubscribeLeaveToggle
                                    subthreadName={subthread.name}
                                    subthreaditId={subthread.id}
                                    isSubscribed={isSubscribed}
                                />
                            ) : null}

                            <Link
                                className={cn(
                                    buttonVariants({
                                        variant: 'outline',
                                        className: 'w-full mb-6',
                                    })
                                )}
                                href={`/t/${slug}/submit`}
                            >
                                Create Post
                            </Link>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
