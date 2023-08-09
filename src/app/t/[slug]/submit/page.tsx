import Editor from '@/components/Editor';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { FC } from 'react';

interface pageProps {
    params: {
        slug: string;
    };
}

const page: FC<pageProps> = async ({ params }) => {
    const subthread = await db.subThread.findFirst({
        where: {
            name: params.slug,
        },
    });

    if (!subthread) notFound();

    return (
        <div className="flex flex-col items-start gap-6">
            <div className="border-b border-gray-200 pb-5">
                <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                    <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
                        Create post
                    </h3>
                    <p className="ml-2 mt-1 truncate text-sm text-gray-500">
                        in t/{params.slug}
                    </p>
                </div>
            </div>

            <Editor subthreadId={subthread.id} />
            <div className="w-full flex justify-end">
                <Button
                    type="submit"
                    className="w-full"
                    form="subthread-post-form"
                >
                    Post
                </Button>
            E</div>
        </div>
    );
};

export default page;
