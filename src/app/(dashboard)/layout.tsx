import Navbar from "@/components/myComponents/Navbar";
import Sidebar from "@/components/myComponents/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="hidden md:block fixed top-0 left-0 w-64 h-full">
        <Sidebar />
      </div>
      <main className="md:pl-64">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
