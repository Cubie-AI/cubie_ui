import AgentView from "@/pages/AgentView";
import BlogPage from "@/pages/BlogPage";
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
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </CubieWalletProvider>
  );
}

export default App;
