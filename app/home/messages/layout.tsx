export default function MessagesLayout({
    list,
    content,
}: Readonly<{
    list: React.ReactNode;
    content: React.ReactNode;
}>) {
    return (
        <div className="flex h-full flex-col md:flex-row">
            <div className="w-full border-r md:w-80">{list}</div>
            <div className="flex-1">
                {content}
            </div>
        </div>
    );
}
