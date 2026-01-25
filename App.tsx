
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AIConfigurator from './pages/AIConfigurator';
import AgentConfigurator from './pages/AgentConfigurator';
import Partners from './pages/Partners';
import Cybersecurity from './pages/Cybersecurity';
import Services from './pages/Services';
import About from './pages/About';
import CaseStudies from './pages/CaseStudies';
import Pricing from './pages/Pricing';
import Training from './pages/Training';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/ai-assessment" element={<AIConfigurator />} />
            <Route path="/agent-studio" element={<AgentConfigurator />} />
            <Route path="/managed-it" element={<Partners />} />
            <Route path="/cybersecurity" element={<Cybersecurity />} />
            <Route path="/about" element={<About />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/training" element={<Training />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </AuthProvider>
  );
};

export default App;
