import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/posts';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response('Unauthorised', { status: 401 });
        }

        const body = await req.json();

        const { subthreadId, title, content } = PostValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subThreadId: subthreadId,
                userId: session.user.id,
            },
        });

        if (!subscriptionExists) {
            return new Response('Subscribe to post', { status: 400 });
        }

        await db.post.create({
            data: {
                title,
                content,
                authorId: session.user.id,
                subThreadId: subthreadId
            },
        });

        return new Response('OK');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request data passed', { status: 422 });
        }

        return new Response(
            'Could not post to subthread at this time, please try again later',
            { status: 500 }
        );
    }
}
