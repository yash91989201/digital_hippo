export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[80vh]  w-full items-center justify-center">
      {children}
    </div>
  );
}
