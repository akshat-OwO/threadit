import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubthreadSubscriptionValidator } from '@/lib/validators/subthread';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response('Unauthorised', { status: 401 });
        }

        const body = await req.json();

        const { subthreaditId } = SubthreadSubscriptionValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subThreadId: subthreaditId,
                userId: session.user.id,
            },
        });

        if (subscriptionExists) {
            return new Response(
                'You are already subscribed to this subthread',
                { status: 400 }
            );
        }

        await db.subscription.create({
            data: {
                subThreadId: subthreaditId,
                userId: session.user.id,
            },
        });

        return new Response(subthreaditId);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request data passed', { status: 422 });
        }

        return new Response('Could not subscribe, please try again later', { status: 500 });
    }
}
