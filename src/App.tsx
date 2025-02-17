import AgentView from "@/pages/AgentView";
import HomePage from "@/pages/HomePage";
import LaunchPage from "@/pages/launch/LaunchPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { CubieWalletProvider } from "./contexts/wallet";

function App() {
  return (
    <CubieWalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/launch" element={<LaunchPage />} />
          <Route path="/agent/:id" element={<AgentView />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </CubieWalletProvider>
  );
}

export default App;
