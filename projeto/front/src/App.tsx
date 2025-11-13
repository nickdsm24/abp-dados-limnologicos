// App.js (Refatorado)

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
import {SimaInfo} from "./pages/sima/SimaInfo";
import BalcarMenu from "./pages/balcar/BalcarMenu";
import BalcarTable from "./pages/balcar/PageBalcarTable";
import BalcarGraph from "./pages/balcar/BalcarGraph";
import BalcarMap from "./pages/balcar/BalcarMap";
import FurnasMenu from "./pages/furnas/FurnasMenu";
import FurnasTable from "./pages/furnas/PageFurnasTable";
import FurnasGraph from "./pages/furnas/FurnasGraph";
import FurnasMap from "./pages/furnas/FurnasMap";
import FurnasInfo from "./pages/furnas/FurnasInfo.tsx";
import FurnasMetodologia from "./pages/furnas/InfoFurnas/FurnasMetodologia";
import FurnasResultados from "./pages/furnas/InfoFurnas/FurnasResultados";
import FurnasParticipantes from "./pages/furnas/InfoFurnas/FurnasParticipantes";
import FurnasUsinas from "./pages/furnas/InfoFurnas/FurnasUsinas";
import FurnasPesquisas from "./pages/furnas/InfoFurnas/FurnasPesquisas";
import FurnasLink from "./pages/furnas/InfoFurnas/FurnasLink";
import FurnasPublicacoes from "./pages/furnas/InfoFurnas/FurnasPublicacoes.tsx";


function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
  const location = useLocation();

  // 1. Criamos um array com TODAS as rotas onde o MenuBar deve ser ocultado
  const pathsToHideMenuBar = [
    "/",        // PresentationPage
    "/sima",    // SimaMenu
    "/balcar",  // BalcarMenu
    "/furnas"   // FurnasMenu
  ];

  // 2. Verificamos se o pathname atual ESTÁ INCLUÍDO nesse array
  const hideMenuBar = pathsToHideMenuBar.includes(location.pathname);

  return (
    <div>
      <BarraBrasil />
      
      {/* 3. Usamos a nova variável 'hideMenuBar' para a renderização condicional */}
      {!hideMenuBar && <MenuBar />}
      
      <div>
        <Routes>
          <Route path="/" element={<Presentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/sima" element={<SimaMenu />} />
          <Route path="/sima-table" element={<SimaTable />} />
          <Route path="/sima-graph" element={<SimaGraph />} />
          <Route path="/sima-map" element={<SimaMap />} />
          <Route path="/sima-info" element={<SimaInfo />} />
          <Route path="/balcar" element={<BalcarMenu />} />
          <Route path="/balcar-table" element={<BalcarTable />} />
          <Route path="/balcar-graph" element={<BalcarGraph />} />
          <Route path="/balcar-map" element={<BalcarMap />} />
          <Route path="/furnas" element={<FurnasMenu />} />
          <Route path="/furnas-table" element={<FurnasTable />} />
          <Route path="/furnas-graph" element={<FurnasGraph />} />
          <Route path="/furnas-map" element={<FurnasMap />} />
          <Route path="/furnas-info" element={<FurnasInfo />} />
          <Route path="/furnas-metodologia" element={<FurnasMetodologia />} />
          <Route path="/furnas-resultados" element={<FurnasResultados />} />
          <Route path="/furnas-participantes" element={<FurnasParticipantes />} />
          <Route path="/furnas-usinas" element={<FurnasUsinas />} />
          <Route path="/furnas-pesquisas" element={<FurnasPesquisas />} />
          <Route path="/furnas-publicacoes" element={<FurnasPublicacoes />} />
          <Route path="/furnas-link" element={<FurnasLink />} />
        </Routes>
      </div>
    </div>
  );
}

// 4. Você não precisa mais exportar AppWithRouter se ele só é usado aqui
export default App;

