import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './index.css';
import SimaMenu from "./pages/sima/SimaMenu";
import Presentation from './pages/PresentationPage';
import BarraBrasil from "./components/commons/BarraBrasil";
import MenuBar from "./components/commons/MenuBar";
import BalcarMenu from "./pages/balcar/BalcarMenu";
import FurnasMenu from "./pages/furnas/FurnasMenu";

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
  const location = useLocation();
  const presentationPage = location.pathname === "/"; // Verifica se está na página inicial

  return (
    <div>
      <BarraBrasil />
      
      {/* Renderiza o MenuBar apenas se não estiver na página inicial */}
      {!presentationPage && <MenuBar />}
      
      <div>
        <Routes>
          <Route path="/" element={<Presentation />} />
          <Route path="/sima" element={<SimaMenu />} />
          <Route path="/balcar" element={<BalcarMenu />} />
          <Route path="/furnas" element={<FurnasMenu />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
