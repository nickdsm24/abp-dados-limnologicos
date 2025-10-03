import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import { ThemeProvider } from "styled-components";
import theme from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";
import SimaMenu from "./pages/sima/SimaMenu";
import BarraBrasil from "./components/commons/BarraBrasil";
import MenuBar from "./components/commons/MenuBar";
import About from "./pages/About"


function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className="w-full min-h-screen flex flex-col">
        <Router>
          <BarraBrasil />
          <MenuBar />
          <div className="flex-1 w-full">
            <Routes>
              <Route path="/sima" element={<SimaMenu />} />
              <Route path="/about" element={<About />} />
              {/*<Route path="/" element={<InitialPage/>} />
               <Route path="/balcar" element= />
              <Route path="/furnas" element= /> */}
            </Routes>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
