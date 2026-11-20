
import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ProfileProvider } from "./context/ProfileContext";

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <ProfileProvider>
      {!isAdminRoute && <Navbar />}

      <main className="app-main">
        <AppRoutes />
      </main>

      {!isAdminRoute && <Footer />}
    </ProfileProvider>
  );
}

export default App;
