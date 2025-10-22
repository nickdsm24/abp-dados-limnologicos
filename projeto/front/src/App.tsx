import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './index.css';
import BarraBrasil from "./components/commons/BarraBrasil";
import MenuBar from "./components/commons/MenuBar";
import Presentation from './pages/PresentationPage';
import About from "./pages/About";
import SimaMenu from "./pages/sima/SimaMenu";
import SimaTable from "./pages/sima/PageSimaTable";
import SimaGraph from "./pages/sima/SimaGraph";
import SimaMap from "./pages/sima/SimaMap";
import BalcarMenu from "./pages/balcar/BalcarMenu";
import BalcarTable from "./pages/balcar/BalcarTable";
import BalcarGraph from "./pages/balcar/BalcarGraph";
import BalcarMap from "./pages/balcar/BalcarMap";
import FurnasMenu from "./pages/furnas/FurnasMenu";
import FurnasTable from "./pages/furnas/PageFurnasTable";
import FurnasGraph from "./pages/furnas/FurnasGraph";
import FurnasMap from "./pages/furnas/FurnasMap";

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
          <Route path="/about" element={<About />} />
          <Route path="/sima" element={<SimaMenu />} />
          <Route path="/sima-table" element={<SimaTable />} />
          <Route path="/sima-graph" element={<SimaGraph />} />
          <Route path="/sima-map" element={<SimaMap />} />
          <Route path="/balcar" element={<BalcarMenu />} />
          <Route path="/balcar-table" element={<BalcarTable />} />
          <Route path="/balcar-graph" element={<BalcarGraph />} />
          <Route path="/balcar-map" element={<BalcarMap />} />
          <Route path="/furnas" element={<FurnasMenu />} />
          <Route path="/furnas-table" element={<FurnasTable />} />
          <Route path="/furnas-graph" element={<FurnasGraph />} />
          <Route path="/furnas-map" element={<FurnasMap />} />
        </Routes>
      </div>
    </div>
  );
}



export default App;

