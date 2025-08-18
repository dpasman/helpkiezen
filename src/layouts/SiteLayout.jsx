import React from "react";
import { Outlet } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* evt. sitewide header/nav hier */}
      <div className="flex-1">
        <Outlet /> {/* hier rendert je pagina-inhoud */}
      </div>
      <SiteFooter /> {/* footer altijd als laatst */}
    </div>
  );
}
