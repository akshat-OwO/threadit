import MiniCreatePost from '@/components/MiniCreatePost';
import PostFeed from '@/components/PostFeed';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { FC } from 'react';

interface pageProps {
    params: {
        slug: string;
    };
}

const page: FC<pageProps> = async ({ params }) => {
    const { slug } = params;

    const session = await getAuthSession();

    const subthread = await db.subThread.findFirst({
        where: {
            name: slug,
        },
        include: {
            posts: {
                include: {
                    author: true,
                    vote: true,
                    comments: true,
                    subThread: true,
                },
                take: INFINITE_SCROLLING_PAGINATION_RESULTS,
            },
        },
    });

    if (!subthread) return notFound();

    return (
        <>
            <h1 className="font-bold text-3xl md:text-4xl h-14">
                t/{subthread.name}
            </h1>
            <MiniCreatePost session={session} />
            <PostFeed initialPosts={subthread.posts} subThreadName={subthread.name} />
        </>
    );
};

export default page;
