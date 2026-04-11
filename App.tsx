
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
import AIAudit from './pages/AIAudit';
import AIAuditSurvey from './pages/AIAuditSurvey';
import MarketingAssessment from './pages/marketing-assessment/index';
import AdminPortal from './pages/AdminPortal';
import AdminRoute from './components/AdminRoute';
import ChatWidget from './components/ChatWidget';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import LandingWebsites from './pages/landing/Websites';
import LandingAIAssessment from './pages/landing/AIAssessment';
import LandingROICalculator from './pages/landing/ROICalculator';

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
            <Route path="/ai-audit" element={<AIAudit />} />
            <Route path="/ai-audit/survey" element={<AIAuditSurvey />} />
            <Route path="/marketing-assessment" element={<MarketingAssessment />} />
            <Route path="/landing/websites" element={<LandingWebsites />} />
            <Route path="/landing/ai-assessment" element={<LandingAIAssessment />} />
            <Route path="/landing/roi-calculator" element={<LandingROICalculator />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<AdminRoute><AdminPortal /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
        <ChatWidget />
      </div>
    </AuthProvider>
  );
};

export default App;
