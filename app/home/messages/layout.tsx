export default function MessagesLayout({
    list,
    content,
}: Readonly<{
    list: React.ReactNode;
    content: React.ReactNode;
}>) {
    return (
        <div className="flex h-full gap-8 flex-col md:flex-row">
            <div className="w-full md:border-r md:w-80">{list}</div>
            <div className="flex-1 px-2">
                {content}
            </div>
        </div>
    );
}
