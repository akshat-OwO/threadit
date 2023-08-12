import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import PostFeed from './PostFeed';

const CustomFeed = async () => {
    const session = await getAuthSession();

    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            subThread: true,
        },
    });

    const posts = await db.post.findMany({
        where: {
            subThread: {
                name: {
                    in: followedCommunities.map(
                        ({ subThread }) => subThread.id
                    ),
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            vote: true,
            author: true,
            comments: true,
            subThread: true,
        },
    });

    return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
