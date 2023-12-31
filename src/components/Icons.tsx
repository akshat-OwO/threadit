import { LucideProps, User } from 'lucide-react';

export const Icons = {
    logo: (props: LucideProps) => (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_1_2)">
                <path
                    d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 8V13C16 13.7957 16.3161 14.5587 16.8787 15.1213C17.4413 15.6839 18.2043 16 19 16C19.7956 16 20.5587 15.6839 21.1213 15.1213C21.6839 14.5587 22 13.7957 22 13V12C22 9.74731 21.2394 7.5606 19.8414 5.79417C18.4434 4.02774 16.49 2.78507 14.2975 2.26751C12.1051 1.74995 9.80213 1.98781 7.76176 2.94255C5.7214 3.8973 4.06316 5.51299 3.05572 7.52786C2.04829 9.54274 1.75067 11.8387 2.2111 14.0439C2.67152 16.249 3.86301 18.2341 5.59252 19.6775C7.32203 21.1209 9.48824 21.9381 11.7402 21.9966C13.9921 22.0552 16.1978 21.3516 18 20"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect
                    x="23.6621"
                    y="-1"
                    width="2"
                    height="34.8775"
                    transform="rotate(45 23.6621 -1)"
                    fill="black"
                />
            </g>
            <defs>
                <clipPath id="clip0_1_2">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    ),
    google: (props: LucideProps) => (
        <svg {...props} viewBox="0 0 24 24">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
        </svg>
    ),
    user: User
};
