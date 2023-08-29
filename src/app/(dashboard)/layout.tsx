import Navbar from "@/components/myComponents/Navbar";
import Sidebar from "@/components/myComponents/Sidebar";
import Script from "next/script";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-full relative">
        <div className="hidden md:block fixed top-0 left-0 w-64 h-full">
          <Sidebar />
        </div>
        <main className="md:pl-64">
          <Navbar />
          {children}
        </main>
      </div>
      <Script id="crisp" strategy="lazyOnload">
        {`window.$crisp=[];window.CRISP_WEBSITE_ID="481a1188-3878-4e2f-9acd-ce08f4019029";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
      </Script>
    </>
  );
}
