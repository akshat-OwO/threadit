'use client';

import { Prisma, SubThread } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './ui/command';

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
    const [input, setInput] = useState<string>('');

    const router = useRouter();

    const {
        data: queryResults,
        refetch,
        isFetched,
        isFetching,
    } = useQuery({
        queryFn: async () => {
            if (!input) return [];
            const { data } = await axios.get(`/api/search?q=${input}`);
            return data as (SubThread & {
                _count: Prisma.SubThreadCountOutputType;
            })[];
        },
        queryKey: ['search-query'],
        enabled: false,
    });

    const request = debounce(async () => {
        refetch();
    }, 300);

    const debounceRequest = useCallback(() => {
        request();
    }, []);

    return (
        <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
            <CommandInput
                value={input}
                onValueChange={(text) => {
                    setInput(text);
                    debounceRequest();
                }}
                className="outline-none border-none focus:border-none focus:outline-none ring-0"
                placeholder="Search communities..."
            />
            {input.length > 0 ? (
                <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
                    {isFetched && <CommandEmpty>No Results Found</CommandEmpty>}
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading="Communities">
                            {queryResults?.map((subthread) => (
                                <CommandItem
                                    key={subthread.id}
                                    value={subthread.name}
                                    onSelect={(e) => {
                                        router.push(`/t/${e}`);
                                        router.refresh();
                                    }}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    <a href={`/t/${subthread.name}`}>
                                        t/{subthread.name}
                                    </a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            ) : null}
        </Command>
    );
};

export default SearchBar;
