// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { SeoHead } from "./seo/SeoHead";
import SiteLayout from "./layouts/SiteLayout";
import Vaatwassers from "./pages/Vaatwassers";
import NotFound from "./pages/NotFound";

function RedirectHome() {
  return (
    <>
      <SeoHead
        title="HelpKiezen – start"
        description="HelpKiezen helpt je kiezen. Momenteel focussen we op vaatwassers."
        canonical="https://helpkiezen.nl/vaatwassers"
      />
      <Navigate to="/vaatwassers" replace />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<RedirectHome />} />
              <Route path="vaatwassers" element={<Vaatwassers />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </HelmetProvider>
  );
}
