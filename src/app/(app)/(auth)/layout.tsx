export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-5">
      <div className="h-screen w-full overflow-y-auto bg-[#f4f4f0] lg:col-span-3">
        {children}
      </div>
      <div
        className="hidden w-full h-screen lg:col-span-2 lg:block bg-cover bg-center"
        style={{ backgroundImage: "url('/auth-bg.png')" }}
      />
    </section>
  );
}
