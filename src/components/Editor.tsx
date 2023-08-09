'use client';

import { toast } from '@/hooks/use-toast';
import { uploadFiles } from '@/lib/uploadthing';
import { PostCreationRequest, PostValidator } from '@/lib/validators/posts';
import EditorJS from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutoSize from 'react-textarea-autosize';

interface EditorProps {
    subthreadId: string;
}

const Editor: FC<EditorProps> = ({ subthreadId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subthreadId,
            title: '',
            content: null,
        },
    });

    const ref = useRef<EditorJS>();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const _titleRef = useRef<HTMLTextAreaElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    const { mutate: createPost } = useMutation({
        mutationFn: async ({
            title,
            content,
            subthreadId,
        }: PostCreationRequest) => {
            const payload: PostCreationRequest = {
                title,
                content,
                subthreadId,
            };
            const { data } = await axios.post(
                '/api/subthread/post/create',
                payload
            );
            return data;
        },
        onError: () => {
            return toast({
                title: 'Something went wrong',
                description:
                    'Your post was not published, please try again later',
                variant: 'destructive',
            });
        },
        onSuccess: () => {
            const newPathName = pathname.split('/').slice(0, -1).join('/');
            router.push(newPathName);
            router.refresh();
            return toast({
                description: 'Your post has been published',
            });
        },
    });

    const initializedEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default;
        const Header = (await import('@editorjs/header')).default;
        const Embed = (await import('@editorjs/embed')).default;
        const Table = (await import('@editorjs/table')).default;
        const List = (await import('@editorjs/list')).default;
        const Code = (await import('@editorjs/code')).default;
        const LinkTool = (await import('@editorjs/link')).default;
        const InlineCode = (await import('@editorjs/inline-code')).default;
        const ImageTool = (await import('@editorjs/image')).default;

        if (!ref.current) {
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    ref.current = editor;
                },
                placeholder: 'Type here to write your post...',
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link',
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const [res] = await uploadFiles({
                                        endpoint: 'imageUploader',
                                        files: [file],
                                    });

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        },
                                    };
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            });
        }
    }, []);

    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                toast({
                    title: 'Something went wrong',
                    description: (value as { message: string }).message,
                    variant: 'destructive',
                });
            }
        }
    }, [errors]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await initializedEditor();

            setTimeout(() => {
                _titleRef.current?.focus();
            }, 0);
        };

        if (isMounted) {
            init();
            return () => {
                ref.current?.destroy();
                ref.current = undefined;
            };
        }
    }, [isMounted, initializedEditor]);

    async function onSubmit(data: PostCreationRequest) {
        const blocks = await ref.current?.save();

        const payload: PostCreationRequest = {
            title: data.title,
            content: blocks,
            subthreadId,
        };
        createPost(payload);
    }

    const { ref: titleRef, ...rest } = register('title');

    return (
        <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <form
                id="subthread-post-form"
                className="w-fit"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="prose prose-stone dark:prose-invert">
                    <TextareaAutoSize
                        ref={(e) => {
                            titleRef(e);
                            // @ts-ignore
                            _titleRef.current = e;
                        }}
                        {...rest}
                        placeholder="Title"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                    />
                    <div id="editor" className="min-h-[500px]" />
                </div>
            </form>
        </div>
    );
};

export default Editor;
