export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {children}
    </section>
  );
}
