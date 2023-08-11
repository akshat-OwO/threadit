import { Comment, Post, SubThread, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
    subThread: SubThread,
    vote: Vote[],
    author: User,
    comments: Comment[]
}