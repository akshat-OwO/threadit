import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET(req: Request) {
    const url = new URL(req.url);

    const session = await getAuthSession();

    let followedCommunitiesIds: string[] = [];

    if (session) {
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                subThread: true,
            },
        });

        followedCommunitiesIds = followedCommunities.map(
            ({ subThread }) => subThread.id
        );
    }

    try {
        const { limit, subthreadname, page } = z
            .object({
                limit: z.string(),
                page: z.string(),
                subthreadname: z.string().nullish().optional(),
            })
            .parse({
                subthreadname: url.searchParams.get('subthreadname'),
                limit: url.searchParams.get('limit'),
                page: url.searchParams.get('page'),
            });

        let whereClause = {};

        if (subthreadname) {
            whereClause = {
                subThread: {
                    name: subthreadname,
                },
            };
        } else if (session) {
            whereClause = {
                subThread: {
                    id: {
                        in: followedCommunitiesIds,
                    },
                },
            };
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                subThread: true,
                vote: true,
                author: true,
                comments: true,
            },
            where: whereClause,
        });

        return new Response(JSON.stringify(posts))
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request data passed', { status: 422 });
        }

        return new Response('Could not fetch more posts, please try again later', { status: 500 });
    }
}
