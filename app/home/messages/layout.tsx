export default function Layout(props: Readonly<{
    content: React.ReactNode;
    list: React.ReactNode;
}>) {
    return (
        <div className="md:grid md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] flex flex-col">
            <aside className="md:border-r md:h-[calc(100vh-4rem)] md:w-full w-full border-b">
            {props.list}
            </aside>
            <main className="md:h-[calc(100vh-4rem)] h-[calc(100vh-4rem-var(--aside-height,auto))]">
                {props.content}
            </main>
        </div>
    );
}
