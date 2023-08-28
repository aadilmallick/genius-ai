export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid place-items-center h-full bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
      {children}
    </section>
  );
}
