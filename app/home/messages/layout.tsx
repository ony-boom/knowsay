import { ReactNode } from 'react';

interface MessagesLayoutProps {
    content: ReactNode;
    list: ReactNode;
    children: ReactNode;
}

export default function MessagesLayout({ children, content, list }: Readonly<MessagesLayoutProps>) {
    return (
        <>
            <div>
               {children}
            </div>
            <div className="flex flex-row-reverse h-full">
                <div className="flex-2/3 overflow-y-auto min-w-[250px] border-l border-gray-200 p-4">
                    {content}
                </div>
                <div className=" flex-1/3 w-1/4 min-w-[250px] border-l border-gray-200 p-4 overflow-y-auto">
                    {list}
                </div>
            </div>
        </>
    );
}