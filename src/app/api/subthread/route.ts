import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubthreadValidator } from '@/lib/validators/subthread';
import kebabCase from 'lodash.kebabcase';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response('Unauthorised', { status: 401 });
        }

        const body = await req.json();
        const { name } = SubthreadValidator.parse(body);
        const kebabName = kebabCase(name);

        const subthreadExists = await db.subThread.findFirst({
            where: {
                name: kebabName,
            },
        });

        if (subthreadExists) {
            return new Response('Subthread already exists', { status: 409 });
        }

        const subthread = await db.subThread.create({
            data: {
                name: kebabName,
                creatorId: session.user.id,
            },
        });

        await db.subscription.create({
            data: {
                userId: session.user.id,
                subThreadId: subthread.id,
            },
        });

        return new Response(subthread.name);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 });
        }

        return new Response('Could not create Subthread', { status: 500 });
    }
}
