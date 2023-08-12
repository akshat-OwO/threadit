import { getAuthSession } from '@/lib/auth';
import { Post, Vote, VoteType } from '@prisma/client';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import PostVoteClient from './PostVoteClient';

interface PostVoteServerProps {
    postId: string;
    initialVotesAmount?: number;
    initialVote?: VoteType | null;
    getData?: () => Promise<(Post & { vote: Vote[] }) | null>;
}

const PostVoteServer: FC<PostVoteServerProps> = async ({
    postId,
    initialVotesAmount,
    initialVote,
    getData,
}) => {
    const session = await getAuthSession();

    let _votesAmount: number = 0;
    let _currentVote: VoteType | null | undefined = undefined;

    if (getData) {
        const post = await getData();
        if (!post) notFound();

        _votesAmount = post.vote.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1;
            if (vote.type === 'DOWN') return acc - 1;
            return acc;
        }, 0);

        _currentVote = post.vote.find(
            (vote) => vote.userId === session?.user.id
        )?.type;
    } else {
        _votesAmount = initialVotesAmount!;
        _currentVote = initialVote;
    }

    return (
        <PostVoteClient
            initialVotesAmount={_votesAmount}
            postId={postId}
            initialVote={_currentVote}
        />
    );
};

export default PostVoteServer;
