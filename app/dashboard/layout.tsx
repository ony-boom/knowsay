export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-white p-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">KNOWSAY</h1>
        </div>
        <nav></nav>
      </header>
      {children}
    </div>
  );
}
