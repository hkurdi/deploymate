import { useEffect } from "react";

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";

function App() {
   
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
