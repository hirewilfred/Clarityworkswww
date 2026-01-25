
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const AgentConfigurator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    role: '',
    capabilities: [] as string[],
    integrations: [] as string[],
    customObjective: ''
  });
  const [result, setResult] = useState<any>(null);

  const roles = [
    { id: 'orchestrator', title: 'Executive Orchestrator', icon: 'fa-chess-king', desc: 'Reasoning and long-term planning.' },
    { id: 'sentinel', title: 'Data Sentinel', icon: 'fa-shield-halved', desc: 'Governance, privacy, and compliance.' },
    { id: 'specialist', title: 'Task Specialist', icon: 'fa-bolt', desc: 'Fast, focused execution of specific tools.' },
    { id: 'concierge', title: 'Client Concierge', icon: 'fa-comments', desc: 'High-EQ communication and support.' }
  ];

  const capabilityOptions = [
    'Web Research', 'Document Analysis', 'Code Execution', 'Image Generation', 'Database Querying', 'API Orchestration', 'Multi-Step Reasoning'
  ];

  const integrationOptions = [
    'Slack', 'Microsoft Teams', 'Salesforce', 'Zendesk', 'Email (SMTP)', 'Custom Webhooks', 'SQL/NoSQL DB'
  ];

  const handleToggleCapability = (cap: string) => {
    setAgentConfig(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(cap) 
        ? prev.capabilities.filter(c => c !== cap) 
        : [...prev.capabilities, cap]
    }));
  };

  const handleToggleIntegration = (int: string) => {
    setAgentConfig(prev => ({
      ...prev,
      integrations: prev.integrations.includes(int) 
        ? prev.integrations.filter(i => i !== int) 
        : [...prev.integrations, int]
    }));
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Synthesize a professional Agentic AI specification for an agent named "${agentConfig.name}" with the role of "${agentConfig.role}". 
      Capabilities: ${agentConfig.capabilities.join(', ')}. 
      Integrations: ${agentConfig.integrations.join(', ')}. 
      Primary Objective: ${agentConfig.customObjective}.
      Provide a system prompt, a logic flow description, and security considerations.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              systemPrompt: { type: Type.STRING },
              logicFlow: { type: Type.ARRAY, items: { type: Type.STRING } },
              securityGuardrails: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimatedROI: { type: Type.STRING }
            },
            required: ["systemPrompt", "logicFlow", "securityGuardrails", "estimatedROI"]
          }
        }
      });

      setResult(JSON.parse(response.text));
      setStep(5);
    } catch (error) {
      console.error(error);
      alert("Deployment synthesis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden pt-32 pb-24">
      <SEO 
        title="Agent Studio | Architect Custom AI" 
        description="Design and deploy professional Agentic AI systems with custom roles, tools, and integrations."
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-clarity-blue text-white uppercase tracking-widest">Studio Workspace</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight uppercase tracking-widest">Architecture Suite</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-gradient mb-6">Agent <span className="italic">Studio.</span></h1>
          <p className="text-slate-400 text-lg font-medium">Step {step} of 4 • Technical Configuration</p>
        </div>

        <div className="glass-panel rounded-[3.5rem] border-white/10 overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="p-10 lg:p-16">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h3 className="text-3xl font-black mb-10 text-white tracking-tight leading-tight">Define the Agent's <span className="text-clarity-blue italic">Identity.</span></h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Agent Identifier</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Nexus Sentinel" 
                      className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-xl font-bold text-white outline-none focus:border-clarity-blue transition-all"
                      value={agentConfig.name}
                      onChange={(e) => setAgentConfig({...agentConfig, name: e.target.value})}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {roles.map(r => (
                      <button 
                        key={r.id}
                        onClick={() => { setAgentConfig({...agentConfig, role: r.title}); setStep(2); }}
                        className={`p-8 rounded-[2.5rem] border transition-all text-left flex flex-col h-full group ${agentConfig.role === r.title ? 'bg-clarity-blue border-clarity-blue' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                      >
                        <i className={`fas ${r.icon} text-2xl mb-6 ${agentConfig.role === r.title ? 'text-white' : 'text-clarity-blue'}`}></i>
                        <h4 className="text-xl font-black text-white mb-2">{r.title}</h4>
                        <p className={`text-sm font-medium ${agentConfig.role === r.title ? 'text-white/70' : 'text-slate-400'}`}>{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-white mb-10 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-arrow-left"></i> Identity
                </button>
                <h3 className="text-3xl font-black mb-10 text-white tracking-tight leading-tight">Assign <span className="text-clarity-blue italic">Capabilities.</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  {capabilityOptions.map(cap => (
                    <button 
                      key={cap}
                      onClick={() => handleToggleCapability(cap)}
                      className={`p-6 rounded-2xl border text-left font-black uppercase tracking-widest text-xs transition-all flex items-center justify-between ${agentConfig.capabilities.includes(cap) ? 'bg-clarity-blue border-clarity-blue text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}
                    >
                      {cap}
                      {agentConfig.capabilities.includes(cap) && <i className="fas fa-check"></i>}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={agentConfig.capabilities.length === 0}
                  onClick={() => setStep(3)}
                  className="w-full bg-white text-[#050614] py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-clarity-blue hover:text-white transition-all disabled:opacity-30 uppercase tracking-[0.2em]"
                >
                  Configure Ecosystem
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <button onClick={() => setStep(2)} className="text-slate-500 hover:text-white mb-10 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-arrow-left"></i> Capabilities
                </button>
                <h3 className="text-3xl font-black mb-10 text-white tracking-tight leading-tight">Establish <span className="text-clarity-blue italic">Integrations.</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  {integrationOptions.map(int => (
                    <button 
                      key={int}
                      onClick={() => handleToggleIntegration(int)}
                      className={`p-6 rounded-2xl border text-left font-black uppercase tracking-widest text-xs transition-all flex items-center justify-between ${agentConfig.integrations.includes(int) ? 'bg-clarity-blue border-clarity-blue text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}
                    >
                      {int}
                      {agentConfig.integrations.includes(int) && <i className="fas fa-link"></i>}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={agentConfig.integrations.length === 0}
                  onClick={() => setStep(4)}
                  className="w-full bg-white text-[#050614] py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-clarity-blue hover:text-white transition-all disabled:opacity-30 uppercase tracking-[0.2em]"
                >
                  Finalize Objectives
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <button onClick={() => setStep(3)} className="text-slate-500 hover:text-white mb-10 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-arrow-left"></i> Integrations
                </button>
                <h3 className="text-3xl font-black mb-10 text-white tracking-tight leading-tight">Synthesis & <span className="text-clarity-blue italic">Deployment.</span></h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Primary Objective / Logic Flow</label>
                    <textarea 
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-lg font-medium text-white outline-none focus:border-clarity-blue transition-all"
                      placeholder="e.g., Monitor Slack for sales queries, research competitors using web search, and draft a response in our CRM."
                      value={agentConfig.customObjective}
                      onChange={(e) => setAgentConfig({...agentConfig, customObjective: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    disabled={!agentConfig.customObjective || loading}
                    onClick={handleFinalize}
                    className="w-full bg-clarity-blue text-white py-6 rounded-2xl font-black text-lg shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                  >
                    {loading ? <i className="fas fa-cog animate-spin"></i> : <i className="fas fa-rocket"></i>}
                    {loading ? 'Synthesizing Architecture...' : 'Architect Agent Brain'}
                  </button>
                </div>
              </div>
            )}

            {step === 5 && result && (
              <div className="animate-in fade-in zoom-in-95 duration-1000">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-grow">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Logic Synthesized Successfully</span>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-8 tracking-tighter">{agentConfig.name} <span className="text-clarity-blue text-2xl font-medium block mt-2 opacity-60">{agentConfig.role}</span></h2>
                    
                    <div className="space-y-12">
                      <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-clarity-blue mb-6">Generated System Prompt</h4>
                        <p className="text-slate-300 text-sm leading-relaxed font-mono whitespace-pre-wrap">{result.systemPrompt}</p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Logic Flow Graph</h4>
                        <div className="space-y-4">
                          {result.logicFlow.map((step: string, i: number) => (
                            <div key={i} className="flex gap-6 items-center">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-clarity-blue border border-white/5">0{i+1}</div>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-80 space-y-6">
                    <div className="p-8 bg-slate-900/50 rounded-3xl border border-white/5">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-clarity-orange mb-6">Security Guardrails</h4>
                      <ul className="space-y-3">
                        {result.securityGuardrails.map((g: string, i: number) => (
                          <li key={i} className="flex gap-3 text-[10px] font-bold text-slate-500 leading-tight">
                            <i className="fas fa-lock text-clarity-orange/40 mt-0.5"></i>
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-8 bg-clarity-blue rounded-3xl text-white shadow-2xl">
                       <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Impact Assessment</p>
                       <p className="text-2xl font-black tracking-tight leading-tight">{result.estimatedROI}</p>
                    </div>

                    <button 
                      onClick={() => setStep(1)}
                      className="w-full py-5 rounded-2xl bg-white text-[#050614] font-black uppercase tracking-widest text-xs hover:bg-clarity-blue hover:text-white transition-all shadow-xl"
                    >
                      New Architecture
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConfigurator;
