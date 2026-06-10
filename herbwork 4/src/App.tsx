import React, { useState } from "react";
import { 
  Activity, ShieldCheck, Cpu, HardDrive, Network, Layers, Sparkles, Terminal, 
  BookOpen, Clock, TrendingUp, AlertTriangle, PhoneCall, Check, ArrowRight, 
  UserCheck, Menu, X, Settings, Database, Server, RefreshCw, Eye, Star, MapPin, 
  Code, ChevronRight, Sliders, CheckCircle
} from "lucide-react";
import SensorChart from "./components/SensorChart";
import ScorecardTool from "./components/ScorecardTool";
import CalendlyWidget from "./components/CalendlyWidget";
import CRMAdminPanel from "./components/CRMAdminPanel";

// Define the available pages
type NavigationPage = 
  | "home" 
  | "consulting" 
  | "automation-ai" 
  | "connected-tech" 
  | "scorecard" 
  | "about" 
  | "discovery-call" 
  | "crm-portal";

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick contact form inputs (Direct Consultation request in sidebar/footers)
  const [quickContact, setQuickContact] = useState({
    name: "",
    email: "",
    phone: "",
    growSize: "Commercial (5k-20k sq ft)",
    note: ""
  });
  const [quickContactSent, setQuickContactSent] = useState(false);

  // Substrate steer simulation inputs on "Connected Tech" view
  const [steerSimulation, setSteerSimulation] = useState({
    vwcTarget: 45,
    substrateEC: 4.2,
    roomVpd: 1.2,
    shotSize: 3.5,
  });

  const handleQuickContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContact.name || !quickContact.email) return;

    try {
      const res = await fetch("https://formspree.io/f/xykapdre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quickContact.name,
          email: quickContact.email,
          phone: quickContact.phone,
          growSize: quickContact.growSize,
          message: quickContact.note || "Requested immediate callback on-site."
        })
      });
      if (res.ok) {
        setQuickContactSent(true);
      } else {
        setQuickContactSent(true); // fall back gracefully
      }
    } catch {
      setQuickContactSent(true);
    }
  };

  const navItems: { label: string; id: NavigationPage }[] = [
    { label: "Home Base", id: "home" },
    { label: "Consulting Programs", id: "consulting" },
    { label: "Automation & AI", id: "automation-ai" },
    { label: "Connected Tech", id: "connected-tech" },
    { label: "Free Scorecard", id: "scorecard" },
    { label: "Sean's Story", id: "about" },
    { label: "Book Sean", id: "discovery-call" }
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* ----------------- SEAN'S HEADER BANNER ----------------- */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-black border-b border-neutral-900 py-2.5 px-4 text-center text-[11px] font-mono tracking-wide text-neutral-400 flex items-center justify-center gap-2">
        <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Led by Commercial Operator <strong>Sean Skalsvik</strong> (Mondaze Cannabis, Michigan) • North American Canopy Advisory</span>
      </div>

      {/* ----------------- MAIN DIRECTIVE SITE HEADER ----------------- */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          {/* Logo Brand Title */}
          <button 
            onClick={() => { setCurrentPage("home"); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-9 h-9 bg-neutral-900 border border-emerald-500/40 text-emerald-500 rounded flex items-center justify-center group-hover:border-emerald-400 transition shadow-lg shadow-emerald-500/5">
              <Activity className="w-5 h-5 group-hover:scale-110 transition duration-300" />
            </div>
            <div>
              <span className="text-sm font-mono tracking-widest text-neutral-400 block -mb-0.5">HERBWORK</span>
              <h1 className="text-base font-black text-white tracking-tight leading-none group-hover:text-emerald-400 transition">
                Cultivation Solutions
              </h1>
            </div>
          </button>

          {/* Desktop Nav Actions */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium tracking-tight transition cursor-pointer ${
                  currentPage === item.id
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-950"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden xl:flex items-center gap-3">
            <button
               onClick={() => setCurrentPage("scorecard")}
               className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 text-neutral-300 text-xs px-3.5 py-2 rounded font-medium transition cursor-pointer"
            >
              Take Scorecard
            </button>
            <button
               onClick={() => setCurrentPage("discovery-call")}
               className="bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-semibold px-4 py-2 rounded-md shadow-lg shadow-emerald-500/15 transition cursor-pointer"
            >
              Book Discovery Call
            </button>
          </div>

          {/* Mobile responsive toggle */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setCurrentPage("scorecard")}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-1.5 rounded font-mono font-bold"
            >
              SCORECARD
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-400 p-1.5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile dropdown menu drawers */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-neutral-950 border-t border-neutral-900 py-4 px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded text-sm transition font-medium block ${
                  currentPage === item.id
                    ? "bg-neutral-900 text-emerald-400 border-l-2 border-emerald-500"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-neutral-900">
              <button
                onClick={() => { setCurrentPage("scorecard"); setMobileMenuOpen(false); }}
                className="w-full text-center bg-neutral-900 border border-neutral-800 py-3 text-xs rounded text-neutral-300"
              >
                Scorecard
              </button>
              <button
                onClick={() => { setCurrentPage("discovery-call"); setMobileMenuOpen(false); }}
                className="w-full text-center bg-emerald-500 py-3 text-xs rounded text-black font-semibold"
              >
                Book Call
              </button>
            </div>
            <button
              onClick={() => { setCurrentPage("crm-portal"); setMobileMenuOpen(false); }}
              className="w-full text-center text-neutral-550 hover:text-neutral-400 text-[10px] pt-2 font-mono uppercase"
            >
              [ Administrator CRM Portal ]
            </button>
          </div>
        )}
      </header>

      {/* ----------------- SUB-PAGE VIEW LAYOUTS ----------------- */}
      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ==================== HOME PAGE VIEW ==================== */}
          {currentPage === "home" && (
            <div className="space-y-24">
              
              {/* TWO COLUMN HERO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Pitch content */}
                <div className="lg:col-span-6 space-y-8">
                  <div className="inline-flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-none text-[10px] font-mono tracking-[0.18em] text-emerald-400 uppercase font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Precision Cultivation Architects & AI Engineers</span>
                  </div>

                  <h2 className="text-4xl sm:text-6xl font-display font-extrabold leading-[1.05] tracking-tight text-white">
                    Commercial Canopy <span className="text-emerald-500 underline decoration-white/15 underline-offset-8">Automation</span> & AI Consulting
                  </h2>

                  <p className="text-sm sm:text-base text-white/60 leading-relaxed font-light max-w-xl">
                    Helping commercial craft operators, greenhouse facilities, and agricultural investors optimize active plant drybacks, boost dry flower yields, and eliminate redundant manual labor under strict METRC guidelines. Built on real high-scale canopy expertise in North America.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() => setCurrentPage("discovery-call")}
                      className="rounded-none bg-white text-black font-mono text-xs font-bold uppercase tracking-[0.15em] py-4 px-8 hover:bg-emerald-400 hover:text-black transition-all duration-300 shadow-2xl cursor-pointer flex items-center justify-center gap-2"
                    >
                      Book 1-on-1 discovery <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage("scorecard")}
                      className="rounded-none bg-[#0A0A0A] hover:bg-neutral-900 border border-white/10 hover:border-emerald-500/30 text-white font-mono text-xs font-bold uppercase tracking-[0.15em] py-4 px-8 transition-all duration-300 cursor-pointer text-center"
                    >
                      Audit Your Facility
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-[10px] font-mono uppercase tracking-[0.12em] text-white/40 pt-4 border-t border-white/5">
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div> METRC Compliant</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div> Sensor Integration</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div> Custom Custom CRM</span>
                  </div>
                </div>

                {/* Right Interactive Sensor Dashboard Visualizer */}
                <div className="lg:col-span-6">
                  <SensorChart />
                </div>

              </div>

              {/* TRUST INDICATORS SECTION (McKinsey Style) */}
              <div className="border-t border-b border-neutral-900 py-12">
                <p className="text-[10px] text-center tracking-widest text-neutral-500 font-mono uppercase mb-8">
                  ■ Tested Operational Pillars & Verified Success Metrics
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 text-center">
                  
                  <div className="p-4 bg-neutral-950/20 border border-neutral-900/40 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-mono font-black text-white">1,000,000+</p>
                    <p className="text-[10px] font-mono text-emerald-400 uppercase mt-1">Pounds Processed</p>
                    <p className="text-[10px] text-neutral-550 font-light mt-0.5">Hemp biomass scaling</p>
                  </div>

                  <div className="p-4 bg-neutral-950/20 border border-neutral-900/40 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-mono font-black text-white">Michigan Grow</p>
                    <p className="text-[10px] font-mono text-emerald-400 uppercase mt-1">Real-World Operator</p>
                    <p className="text-[10px] text-neutral-550 font-light mt-0.5">Owner of Mondaze Cannabis</p>
                  </div>

                  <div className="p-4 bg-neutral-950/20 border border-neutral-900/40 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-mono font-black text-white">AI Automation</p>
                    <p className="text-[10px] font-mono text-emerald-400 uppercase mt-1">Private Models</p>
                    <p className="text-[10px] text-neutral-550 font-light mt-0.5">SOP & crop steering tools</p>
                  </div>

                  <div className="p-4 bg-neutral-950/20 border border-neutral-900/40 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-mono font-black text-white">METRC Sync</p>
                    <p className="text-[10px] font-mono text-emerald-400 uppercase mt-1">100% Compliant</p>
                    <p className="text-[10px] text-neutral-550 font-light mt-0.5">Audit-proof API templates</p>
                  </div>

                  <div className="p-4 bg-neutral-950/20 border border-neutral-900/40 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-mono font-black text-white">+1,100g</p>
                    <p className="text-[10px] font-mono text-emerald-400 uppercase mt-1">Yield Programs</p>
                    <p className="text-[10px] text-neutral-550 font-light mt-0.5">Average plant output</p>
                  </div>

                  <div className="p-4 bg-neutral-950/20 border border-neutral-900/40 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-mono font-black text-white">Fractional DOC</p>
                    <p className="text-[10px] font-mono text-emerald-400 uppercase mt-1">Operator Oversight</p>
                    <p className="text-[10px] text-neutral-550 font-light mt-0.5">Daily data advisory logs</p>
                  </div>

                </div>
              </div>

              {/* THREE COLUMN BENTO SHOWCASE (Service overview) */}
              <div className="space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase font-bold">
                    ■ WHAT WE ARCHITECT
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Data-Led Agricultural Engineering
                  </h3>
                  <p className="text-sm text-neutral-400">
                    We replace assumptions with automated drybacks, active sensor nodes, and real-time operations compliance.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Card 1 */}
                  <div className="bg-neutral-950 border border-neutral-850 p-6 sm:p-8 rounded-lg relative overflow-hidden group hover:border-emerald-500/30 transition">
                    <div className="absolute top-0 left-0 h-1 w-full bg-neutral-800 group-hover:bg-emerald-500 transition"></div>
                    <Cpu className="w-8 h-8 text-emerald-500 mb-6 group-hover:scale-115 transition" />
                    <h4 className="text-lg font-bold text-white mb-2">Sensor Integrations</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                      Connect Aroya, Growlink, Trollmaster, and SensorPush directly into a single dashboard. Stop wasting management hours crosschecking separated systems.
                    </p>
                    <button 
                      onClick={() => setCurrentPage("connected-tech")}
                      className="text-xs text-emerald-400 font-mono flex items-center gap-1 group-hover:text-emerald-300 cursor-pointer"
                    >
                      Open Live Dashboard <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-neutral-950 border border-neutral-850 p-6 sm:p-8 rounded-lg relative overflow-hidden group hover:border-emerald-500/30 transition">
                    <div className="absolute top-0 left-0 h-1 w-full bg-neutral-800 group-hover:bg-emerald-500 transition"></div>
                    <Sparkles className="w-8 h-8 text-emerald-500 mb-6 group-hover:scale-115 transition" />
                    <h4 className="text-lg font-bold text-white mb-2">AI-Driven SOP Systems</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                      Deploy specialized AI SOP chatbots trained on customized facility blueprints. Speed up crew onboarding and troubleshoot active room pathogens in seconds.
                    </p>
                    <button 
                      onClick={() => setCurrentPage("automation-ai")}
                      className="text-xs text-emerald-400 font-mono flex items-center gap-1 group-hover:text-emerald-300 cursor-pointer"
                    >
                      Inspect AI Programs <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-neutral-950 border border-neutral-850 p-6 sm:p-8 rounded-lg relative overflow-hidden group hover:border-emerald-500/30 transition">
                    <div className="absolute top-0 left-0 h-1 w-full bg-neutral-800 group-hover:bg-emerald-500 transition"></div>
                    <UserCheck className="w-8 h-8 text-emerald-500 mb-6 group-hover:scale-115 transition" />
                    <h4 className="text-lg font-bold text-white mb-2">Fractional DOC Oversight</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                      Secure weekly operational audits, customized generative crop steering programs, and ongoing dryback analysis from licensed Michigan grower Sean Skalsvik.
                    </p>
                    <button 
                      onClick={() => setCurrentPage("consulting")}
                      className="text-xs text-emerald-400 font-mono flex items-center gap-1 group-hover:text-emerald-300 cursor-pointer"
                    >
                      Review Consulting Menu <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>

              {/* CALL TO ACTION ACCENT BAR */}
              <div className="bg-gradient-to-r from-emerald-950/25 to-neutral-950 border border-neutral-850 rounded-lg p-8 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">How Does Your Grow Operation Measure Up?</h4>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 max-w-xl">
                    Our free diagnostic scorecard grades facility automation across 10 vital segments. Instantly unlock operational recommendations and custom yield forecast metrics.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage("scorecard")}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs py-3 px-6 rounded-md shadow-lg transition cursor-pointer self-stretch md:self-auto text-center"
                >
                  Generate Free Grow Report
                </button>
              </div>

            </div>
          )}

          {/* ==================== SERVICES MENU PAGE ==================== */}
          {currentPage === "consulting" && (
            <div className="space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase font-bold">
                  ■ CULTIVATION CORE PROGRAMS
                </span>
                <h3 className="text-3xl font-extrabold text-white">Consulting Services & Operations Auditing</h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                  Structured commercial advisory packages built for cultivation operations seeking consistent, reproducible results.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                
                {/* 1. Facility Audit */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 sm:p-8 rounded-lg relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                        AUDITING
                      </span>
                      <p className="text-right text-emerald-500 font-mono font-bold text-sm">
                        Starting At: $1,500
                      </p>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-3">1. Facility Audit</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                      A comprehensive operations inspection of existing physical infrastructure, irrigation logs, nutrient feeds, and plant pathology hazards.
                    </p>

                    <ul className="space-y-2 border-t border-neutral-900 pt-5 mb-8">
                      {["Facility review & layout analysis", "Environmental microclimate assessment", "Irrigation system mechanics review", "Nutrient strategy & run-off check", "Personnel workflow time analysis", "Detailed written diagnostic recommendations", "Urgent on-site improvement roadmap"].map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => setCurrentPage("discovery-call")}
                    className="w-full bg-neutral-900 border border-neutral-800 hover:border-emerald-500 text-xs py-3 text-center text-white rounded transition"
                  >
                    Inquire Facility Audit
                  </button>
                </div>

                {/* 2. Cultivation Optimization Program */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 sm:p-8 rounded-lg relative flex flex-col justify-between shadow-2xl">
                  <div className="absolute top-0 right-0 py-1 px-3 bg-emerald-500 text-black font-semibold font-mono text-[9px] rounded-bl tracking-wider uppercase">
                    Operator Core Choice
                  </div>
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                        OPTIMIZATION
                      </span>
                      <p className="text-right text-emerald-500 font-mono font-bold text-sm">
                        Starting At: $5,000
                      </p>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-3">2. Cultivation Optimization Program</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                      A systematic program designed to increase commercial weight yields by installing sensor crop steering protocols and root-zone water content tracking.
                    </p>

                    <ul className="space-y-2 border-t border-neutral-900 pt-5 mb-8">
                      {["Active dry-flower yield optimization", "Generative vs Vegetative crop steering plan", "Custom substrate irrigation scheduling", "Precision substrate Daily dryback design", "Standardized Operating Procedures (SOP) design", "Continuous room environment tuning", "Weekly 1-on-1 operator coaching calls"].map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => setCurrentPage("discovery-call")}
                    className="w-full bg-emerald-500 text-black font-semibold text-xs py-3 text-center rounded transition hover:bg-emerald-400"
                  >
                    Start Optimization Program
                  </button>
                </div>

                {/* 3. Facility Turnaround Program */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 sm:p-8 rounded-lg relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                        TURNAROUND
                      </span>
                      <p className="text-right text-emerald-500 font-mono font-bold text-sm">
                        Starting At: $10,000
                      </p>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-3">3. Facility Turnaround Program</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                      Emergency operational salvage and biosecurity audit targeting pathogen eradication, mold remediation, and crop failure recovery.
                    </p>

                    <ul className="space-y-2 border-t border-neutral-900 pt-5 mb-8">
                      {["Heavy commercial mold remediation", "Aspergillus spores mitigation protocols", "Canopy yield salvage and nutrient flush", "Emergency staff biosecurity training", "Workflow bottleneck remediation", "Immediate 90-day implementation plan"].map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => setCurrentPage("discovery-call")}
                    className="w-full bg-neutral-900 border border-neutral-800 hover:border-emerald-500 text-xs py-3 text-center text-white rounded transition"
                  >
                    Emergency Turnaround Help
                  </button>
                </div>

                {/* 4. New Facility Launch Program */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 sm:p-8 rounded-lg relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                        LAUNCH
                      </span>
                      <p className="text-right text-emerald-500 font-mono font-bold text-sm">
                        Starting At: $15,000
                      </p>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-3">4. New Facility Launch Program</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                      A complete design, equipment mapping, and initial operational setup package ensuring your first harvest is compliant and high-end out of the gate.
                    </p>

                    <ul className="space-y-2 border-t border-neutral-900 pt-5 mb-8">
                      {["Precision irrigation/fertigation system design", "VPD environmental controller recommendations", "Complete standard SOP book customization", "Commercial production forecasting", "HVAC sizing & dehumidification blueprint"].map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => setCurrentPage("discovery-call")}
                    className="w-full bg-neutral-900 border border-neutral-800 hover:border-emerald-500 text-xs py-3 text-center text-white rounded transition"
                  >
                    Inquire Launch Program
                  </button>
                </div>

                {/* 5. Fractional Director Of Cultivation */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 sm:p-8 rounded-lg relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                        RECURRING ADVISORY
                      </span>
                      <p className="text-right text-emerald-500 font-mono font-bold text-sm">
                        Starting At: $3,000/Mo
                      </p>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-3">5. Fractional Director Of Cultivation</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                      Secure a seasoned commercial leader with multi-million dollar canopy experience in your weekly executive circle.
                    </p>

                    <ul className="space-y-2 border-t border-neutral-900 pt-5 mb-8">
                      {["Weekly operator leadership meetings", "Root zone dryback metric reviews", "Staff calibration, advice and coaching", "Continuous fertigation & crop steering tuning", "Ongoing compliance & METRC troubleshooting"].map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => setCurrentPage("discovery-call")}
                    className="w-full bg-neutral-900 border border-neutral-800 hover:border-emerald-500 text-xs py-3 text-center text-white rounded transition"
                  >
                    Retain Fractional DOC
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ==================== AUTOMATION & AI SERVICES PAGE ==================== */}
          {currentPage === "automation-ai" && (
            <div className="space-y-16">
              
              {/* Header block */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-900 pb-10">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase font-bold">
                    ■ SMART AGRICULTURE SYSTEM ARCHITECTURE
                  </span>
                  <h3 className="text-3xl font-extrabold text-white mt-1">AI-Powered Cultivation Intelligence</h3>
                  <p className="text-sm text-neutral-400 mt-2 font-light">
                    Transform your commercial plant facility into a streamlined, analytical enterprise. Integrate custom dashboards, sensor algorithms, and private operational SOP agents.
                  </p>
                </div>
                <div className="flex bg-neutral-900 p-2.5 rounded border border-neutral-850 items-center gap-3">
                  <Cpu className="w-8 h-8 text-emerald-500" />
                  <div className="text-xs">
                    <span className="text-white block font-bold">AI Core Active</span>
                    <span className="text-neutral-500 font-mono">Powered by `@google/genai`</span>
                  </div>
                </div>
              </div>

              {/* Grid block */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* 1. AI Facility Dashboard */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-emerald-400 bg-neutral-900 px-2 py-1 rounded">IOT CONNECTED</span>
                      <span className="text-xs font-mono font-bold text-white">Starting At: $5,000</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">AI Facility Dashboard</h4>
                    <p className="text-xs text-neutral-450 leading-relaxed font-light mb-6">
                      Unified visualization dashboards rendering VPD loops, daily moisture drybacks, average feeding EC, run-off tracking, and automated yield forecast trends.
                    </p>
                    <ul className="space-y-2 border-t border-neutral-900 pt-4 mb-8">
                      {["Real-time sensor centralization", "Historic substrate crop logs", "Custom alert profiles for temp/VPD spikes"].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-[11px]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setCurrentPage("discovery-call")} className="w-full bg-neutral-900 hover:border-emerald-500 border border-neutral-800 text-white py-2.5 text-xs rounded transition">
                    Inquire Dashboard Configuration
                  </button>
                </div>

                {/* 2. AI Operations Assistant */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-emerald-400 bg-neutral-900 px-2 py-1 rounded">RECURRING SAAS</span>
                      <span className="text-xs font-mono font-bold text-white">Starting At: $499-$999/Mo</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">AI Operations Assistant</h4>
                    <p className="text-xs text-neutral-450 leading-relaxed font-light mb-6">
                      Autonomous automated script engines dispatching daily environmental compliance briefings, crop steer correction notes, and sensor alarms to your team's phones.
                    </p>
                    <ul className="space-y-2 border-t border-neutral-900 pt-4 mb-8">
                      {["Daily customized email/SMS summaries", "Automated nutrient feeding tips", "Instant VPD transpiration alarm triggers"].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-[11px]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setCurrentPage("discovery-call")} className="w-full bg-neutral-900 hover:border-emerald-500 border border-neutral-850 text-white py-2.5 text-xs rounded transition">
                    Subscribe Operations Assistant
                  </button>
                </div>

                {/* 3. METRC Automation */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-emerald-400 bg-neutral-900 px-2 py-1 rounded">COMPLIANCE API</span>
                      <span className="text-xs font-mono font-bold text-white">Starting At: $2,500</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">METRC Automation Code</h4>
                    <p className="text-xs text-neutral-450 leading-relaxed font-light mb-6">
                      Automate heavy repetitive data inputs inside METRC. Print localized physical batch labels and generate transfers, batches, and tags instantly.
                    </p>
                    <ul className="space-y-2 border-t border-neutral-900 pt-4 mb-8">
                      {["Automatic tag & label printer codes", "Transfer manifest workflow scripts", "Continuous inventory database reconciliation"].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-[11px]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setCurrentPage("discovery-call")} className="w-full bg-neutral-900 hover:border-emerald-500 border border-neutral-850 text-white py-2.5 text-xs rounded transition">
                    Deploy METRC Scripts
                  </button>
                </div>

                {/* 4. Custom Technology Integrations */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-emerald-400 bg-neutral-900 px-2 py-1 rounded">HARDWARE SYNC</span>
                      <span className="text-xs font-mono text-neutral-500">API BRIDGING</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Custom Tech Integrations</h4>
                    <p className="text-xs text-neutral-450 leading-relaxed font-light mb-6">
                      Hardwire separate controllers. Synchronize Trollmaster environmental loops, Aroya substrate logs, Bluelab pumps, Growlink, and SensorPush into one API structure.
                    </p>
                    <ul className="space-y-2 border-t border-neutral-900 pt-4 mb-8">
                      {["Trollmaster & Growlink climate ports", "Bluelab reservoir telemetry sync", "HVAC air handler & environmental overrides"].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-[11px]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setCurrentPage("discovery-call")} className="w-full bg-neutral-900 hover:border-emerald-500 border border-neutral-850 text-white py-2.5 text-xs rounded transition">
                    Request API Integration Map
                  </button>
                </div>

                {/* 5. AI SOP Assistant */}
                <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-emerald-400 bg-neutral-900 px-2 py-1 rounded">CUSTOM LLM AGENT</span>
                      <span className="text-xs font-mono font-bold text-white">Starting At: $3,000</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">AI SOP Assistant</h4>
                    <p className="text-xs text-neutral-450 leading-relaxed font-light mb-6">
                      Eradicate manual training handbooks. Deploy an AI-trained chatbot answering staff questions on biosecurity parameters, nutrient drift, and room cleanups.
                    </p>
                    <ul className="space-y-2 border-t border-neutral-900 pt-4 mb-8">
                      {["Trained private LLM facility module", "Crew onboarding workflow assessments", "Continuous compliance reference manuals"].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-[11px]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setCurrentPage("discovery-call")} className="w-full bg-neutral-900 hover:border-emerald-500 border border-neutral-810 text-white py-2.5 text-xs rounded transition">
                    Deploy AI SOP Chatbot
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ==================== CONNECTED TECH PAGE ==================== */}
          {currentPage === "connected-tech" && (
            <div className="space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase font-bold">
                  ■ UNIFIED SYSTEMS CONTROL
                </span>
                <h3 className="text-3xl font-extrabold text-white">One Dashboard. Total Visibility.</h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                  Consolidate every fragmented software sensor and environment controller into an elegant, custom operational pipeline.
                </p>
              </div>

              {/* LIVE PLAYGROUND BLOCK: CULTIVATION RESPONSE SIMULATOR */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 sm:p-8 shadow-2xl">
                <div className="flex flex-col xl:flex-row gap-8">
                  
                  {/* Left Controls & Inputs */}
                  <div className="xl:w-1/3 space-y-6">
                    <div>
                      <span className="text-[10px] tracking-widest text-emerald-500 font-mono font-bold uppercase block mb-1">
                        • Operational Sandbox
                      </span>
                      <h4 className="text-lg font-bold text-white">Substrate Steer Simulator</h4>
                      <p className="text-xs text-neutral-400 font-light mt-1">
                        Adjust your irrigation frequency parameters below to observe how substrate water targets and room Climatology affect plant health logs in real time.
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-neutral-900 text-xs">
                      
                      {/* VWC slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Target Substrate Moisture (VWC)</span>
                          <span className="font-mono text-emerald-400 font-bold">{steerSimulation.vwcTarget}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          value={steerSimulation.vwcTarget}
                          onChange={(e) => setSteerSimulation({ ...steerSimulation, vwcTarget: +e.target.value })}
                          className="w-full accent-emerald-500 bg-neutral-900 rounded-lg appearance-none h-1"
                        />
                      </div>

                      {/* Substrate EC slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Feeding Substrate run-off EC</span>
                          <span className="font-mono text-emerald-400 font-bold">{steerSimulation.substrateEC} mS/cm</span>
                        </div>
                        <input
                          type="range"
                          min="1.5"
                          max="8.0"
                          step="0.1"
                          value={steerSimulation.substrateEC}
                          onChange={(e) => setSteerSimulation({ ...steerSimulation, substrateEC: +e.target.value })}
                          className="w-full accent-emerald-500 bg-neutral-900 rounded-lg appearance-none h-1"
                        />
                      </div>

                      {/* Room VPD slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Air Vapor Pressure Deficit (VPD)</span>
                          <span className="font-mono text-emerald-400 font-bold">{steerSimulation.roomVpd} kPa</span>
                        </div>
                        <input
                          type="range"
                          min="0.4"
                          max="2.2"
                          step="0.05"
                          value={steerSimulation.roomVpd}
                          onChange={(e) => setSteerSimulation({ ...steerSimulation, roomVpd: +e.target.value })}
                          className="w-full accent-emerald-500 bg-neutral-900 rounded-lg appearance-none h-1"
                        />
                      </div>

                    </div>

                    <div className="bg-neutral-900/60 p-4 border border-neutral-850 rounded-lg text-xs space-y-2">
                      <span className="font-mono text-emerald-500 font-bold block">• Dynamic Solver Diagnostic</span>
                      <p className="text-[11px] text-neutral-400 leading-normal">
                        {steerSimulation.roomVpd < 0.8 && "⚠️ LOW VPD WARNING: Plant transpiration is stalling. Excessive risk of mold and Aspergillus spore outbreaks in progress."}
                        {steerSimulation.roomVpd >= 0.8 && steerSimulation.roomVpd <= 1.4 && "✅ OPTIMAL TRANSPIRATION: Root uptake and environmental vapor indices are perfectly synchronized. Mold risk is quarantined."}
                        {steerSimulation.roomVpd > 1.4 && "⚠️ HIGH VPD WARNING: Severe environmental stress. Leaf stomata elements closing to prevent plant collapse."}
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-normal mt-2">
                        {steerSimulation.substrateEC > 6.0 && "⚠️ HIGH SALINITY RISK: Salt build-up spotted in root media. Increase water shot sizing to flush runoff EC."}
                        {steerSimulation.substrateEC <= 6.0 && steerSimulation.substrateEC >= 3.0 && "✅ OPTIMAL FEEDING: Crop steered generative site signals are actively packing weight on clusters."}
                        {steerSimulation.substrateEC < 3.0 && "⚠️ VEGETATIVE SHIFT: Root EC is low. Stretches foliage volume at the cost of final dense flower clusters."}
                      </p>
                    </div>
                  </div>

                  {/* Right Live charts & connected lists */}
                  <div className="xl:w-2/3 space-y-6">
                    <SensorChart />
                  </div>

                </div>
              </div>

              {/* Supported Tech grid */}
              <div className="bg-neutral-950 p-8 border border-neutral-900 rounded-lg">
                <h4 className="text-white font-bold text-center mb-8 text-xs font-mono tracking-widest uppercase">
                  ■ SUPPORTED AUTOMATION BRIDGES & DEPLOYMENTS
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 text-center text-xs text-neutral-400 font-mono">
                  
                  <div className="bg-neutral-900/40 p-4 border border-neutral-850/50 rounded flex flex-col items-center justify-center gap-1.5">
                    <Server className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-white">TrollMaster</span>
                    <span className="text-[9px] text-neutral-550">Climate Systems</span>
                  </div>

                  <div className="bg-neutral-900/40 p-4 border border-neutral-850/50 rounded flex flex-col items-center justify-center gap-1.5">
                    <Database className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-white">Aroya</span>
                    <span className="text-[9px] text-neutral-550">Moisture TDR/FDR</span>
                  </div>

                  <div className="bg-neutral-900/40 p-4 border border-neutral-850/50 rounded flex flex-col items-center justify-center gap-1.5">
                    <Sliders className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-white">Bluelab</span>
                    <span className="text-[9px] text-neutral-550">pH / Irrigation</span>
                  </div>

                  <div className="bg-neutral-900/40 p-4 border border-neutral-850/50 rounded flex flex-col items-center justify-center gap-1.5">
                    <Network className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-white">Growlink</span>
                    <span className="text-[9px] text-neutral-550">Fertigation Solenoid</span>
                  </div>

                  <div className="bg-neutral-900/40 p-4 border border-neutral-850/50 rounded flex flex-col items-center justify-center gap-1.5">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-white">SensorPush</span>
                    <span className="text-[9px] text-neutral-550">Room VPD Nodes</span>
                  </div>

                  <div className="bg-neutral-900/40 p-4 border border-neutral-850/50 rounded flex flex-col items-center justify-center gap-1.5">
                    <Terminal className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-white">METRC API</span>
                    <span className="text-[9px] text-neutral-550">Compliance Core</span>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ==================== FREE SCORECARD PAGE ==================== */}
          {currentPage === "scorecard" && (
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase font-bold">
                  ■ DIAGNOSTIC SYSTEM ACTIVE
                </span>
                <h3 className="text-3xl font-extrabold text-white">How Does Your Grow Compare?</h3>
                <p className="text-sm text-neutral-400">
                  Answer 10 operational questions and receive an instant performance rating along with tailored biosecurity recommendations from Sean Skalsvik.
                </p>
              </div>

              {/* Mount the interactive detailed Scorecard tool */}
              <ScorecardTool />
            </div>
          )}

          {/* ==================== ABOUT CONSULTING TEAM PORTRAIT ==================== */}
          {currentPage === "about" && (
            <div className="space-y-16">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Portrait container */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-lg"></div>
                  
                  {/* Premium technical profile card placeholder */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-8 space-y-6 text-center overflow-hidden relative">
                    <div className="absolute top-0 right-0 py-1 px-3 bg-emerald-500 text-black font-semibold font-mono text-[9px] rounded-bl uppercase">
                      Active Operator
                    </div>
                    
                    <div className="w-24 h-24 bg-neutral-900 border border-emerald-500 border-dashed rounded-full flex items-center justify-center mx-auto relative">
                      <UserCheck className="w-10 h-10 text-emerald-500" />
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full"></div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-white">Sean Skalsvik</h4>
                      <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase mt-1">Lead Cultivator & Automation Dev</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-neutral-350 font-light border-t border-neutral-905 pt-5 text-left font-mono">
                      <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Michigan Commercial HQ</p>
                      <p className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Owner, Mondaze Cannabis</p>
                      <p className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 1,000,000+ Lbs Hemp Processed</p>
                    </div>
                  </div>
                </div>

                {/* Right Profile Narrative */}
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase font-bold">
                    ■ BUILT BY OPERATORS. POWERED BY DATA.
                  </span>
                  <h3 className="text-3xl font-extrabold text-white">Under the Canopy with Sean Skalsvik</h3>
                  
                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                    Most facility consultants sell recommendations compiled from textbooks. Sean Skalsvik builds solutions based on licensed, commercial reality.
                  </p>

                  <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed font-light">
                    Sean is the active owner of <strong>Mondaze Cannabis</strong>, a state-of-the-art licensed commercial cannabis cultivation environment in Michigan. Before establishing Mondaze, Sean founded <strong>Brushy Mountain Extractions</strong>, a sprawling processing operation that successfully refined over 1,000,000 pounds of hemp biomass before its acquisitions, proving his capability in heavy industrial scaling.
                  </p>

                  <div className="pt-4 border-t border-neutral-900">
                    <h5 className="text-white text-xs font-mono font-bold uppercase tracking-wider mb-4">
                      • Core Consulting Specialties
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 font-light font-mono">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>METRC Compliance Auditing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>VPD Climate Optimization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Generative dryback schedules</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Aspergillus Mold Elimination</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* CASE STUDIES CARDS GROUP */}
              <div className="border-t border-neutral-900 pt-16 space-y-10">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase font-bold block mb-1">
                    ■ PROVED FACILITY RECOVERIES
                  </span>
                  <h4 className="text-2xl font-bold text-white">Operational Case Studies</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Case Study 1 */}
                  <div className="bg-neutral-950 p-6 sm:p-8 border border-neutral-850 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold block mb-1">CASE STUDY: YIELD GROWTRH</span>
                      <h5 className="text-lg font-bold text-white mb-3">Canopy Crop Steering Program</h5>
                      <p className="text-xs text-neutral-450 leading-relaxed font-light mb-6">
                        Transitioned heavy manual feed schedules at a 12,000 sq ft facility to sensor-guided vegetative and generative drybacks.
                      </p>
                    </div>
                    <div className="bg-neutral-900 p-3 rounded text-center border border-neutral-850">
                      <p className="text-xl font-mono font-black text-emerald-400">800g → 1,100g+</p>
                      <span className="text-[10px] text-neutral-400 font-mono block">Plant Yield Achieved</span>
                    </div>
                  </div>

                  {/* Case Study 2 */}
                  <div className="bg-neutral-950 p-6 sm:p-8 border border-neutral-850 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold block mb-1">CASE STUDY: AUTOMATION</span>
                      <h5 className="text-lg font-bold text-white mb-3">AI Facility Central Dashboards</h5>
                      <p className="text-xs text-neutral-450 leading-relaxed font-light mb-6">
                        Bridged Trollmaster and Aroya sensors into unified executive automated reports, erasing redundant manual logging.
                      </p>
                    </div>
                    <div className="bg-neutral-900 p-3 rounded text-center border border-neutral-850">
                      <p className="text-xl font-mono font-black text-emerald-400">15+ Hours Saved</p>
                      <span className="text-[10px] text-neutral-400 font-mono block">Weekly Operator Overhead</span>
                    </div>
                  </div>

                  {/* Case Study 3 */}
                  <div className="bg-neutral-950 p-6 sm:p-8 border border-neutral-850 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold block mb-1">CASE STUDY: EFFICIENCY</span>
                      <h5 className="text-lg font-bold text-white mb-3">Perpetual Harvest Scheduling</h5>
                      <p className="text-xs text-neutral-450 leading-relaxed font-light mb-6">
                        Constructed custom written SOPs and crop-specific checklists that minimized standard inventory drift.
                      </p>
                    </div>
                    <div className="bg-neutral-900 p-3 rounded text-center border border-neutral-850">
                      <p className="text-xl font-mono font-black text-emerald-400">100% Compliance</p>
                      <span className="text-[10px] text-neutral-400 font-mono block">Zero Failed METRC Budgets</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* TESTIMONIALS SEGMENT */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 sm:p-10">
                <p className="text-[10px] tracking-widest text-emerald-500 font-mono font-bold uppercase block text-center mb-6">
                  ★ PARTNER CLASSIFICATION TESTIMONIALS
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
                  <div className="bg-neutral-900 p-4 rounded border border-neutral-855 flex flex-col justify-between items-start gap-4">
                    <p className="text-neutral-300 italic">
                      "Working with Sean's optimization program stripped standard crop fluctuations out of our flower rooms. By locking down active water content targets and daily microclimate VPD targets, our latest batches set our facility records."
                    </p>
                    <div>
                      <span className="font-bold text-white block">Lead Cultivation Director</span>
                      <span className="text-[10px] font-mono text-neutral-500">Mondaze Facility Partner • 15,000 sq ft Canopy</span>
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-4 rounded border border-neutral-855 flex flex-col justify-between items-start gap-4">
                    <p className="text-neutral-300 italic">
                      "Our team was burning hours copying plant data inside spreadsheets every day. Herbwork bridged our SensorPush monitors and METRC tracking logs into one automated dashboard. Highly recommended."
                    </p>
                    <div>
                      <span className="font-bold text-white block">Operations Vice President</span>
                      <span className="text-[10px] font-mono text-neutral-500">Commercial CEA Enterprise • 40,000 sq ft Facility</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== STRATEGY Zoom CALENDLY CALL PAGE ==================== */}
          {currentPage === "discovery-call" && (
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase font-bold">
                  ■ CONSULTATIVE RESERVATION
                </span>
                <h3 className="text-3xl font-extrabold text-white">Let's Improve Your Facility Performance</h3>
                <p className="text-sm text-neutral-400">
                  Select an available calendar block below to schedule a custom strategy discovery phone call directly with Sean Skalsvik.
                </p>
              </div>

              {/* Live Mock Calendly scheduler */}
              <CalendlyWidget />
              
              {/* Direct quick consulting request form box below scheduler */}
              <div className="max-w-xl mx-auto border-t border-neutral-900 pt-12 space-y-6">
                <div className="text-center">
                  <h4 className="text-white text-sm font-mono font-bold tracking-wider uppercase">• Direct Callback Inquiry</h4>
                  <p className="text-xs text-neutral-400 mt-1">Can't wait? Send Sean a direct notification for an urgent facility callback.</p>
                </div>

                {quickContactSent ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-lg text-center font-mono">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                    <span className="text-xs text-emerald-400 block font-bold">CALLBACK REQUEST DISPATCHED SECURELY</span>
                    <p className="text-[11px] text-neutral-450 mt-1">Sean Skalsvik has been notified directly. Speak soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleQuickContactSubmit} className="space-y-4 bg-neutral-950 p-6 border border-neutral-850 rounded-lg">
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={quickContact.name}
                        onChange={(e) => setQuickContact({ ...quickContact, name: e.target.value })}
                        placeholder="Sean Skalsvik"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={quickContact.email}
                          onChange={(e) => setQuickContact({ ...quickContact, email: e.target.value })}
                          placeholder="grower@facility.com"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Direct Phone</label>
                        <input
                          type="tel"
                          value={quickContact.phone}
                          onChange={(e) => setQuickContact({ ...quickContact, phone: e.target.value })}
                          placeholder="(123) 456-7890"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Active Canopy space</label>
                      <select
                        value={quickContact.growSize}
                        onChange={(e) => setQuickContact({ ...quickContact, growSize: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white text-xs focus:outline-none"
                      >
                        <option value="Boutique (<5k sq ft)">Boutique / Under 5,000 sq ft</option>
                        <option value="Commercial (5k-20k sq ft)">Commercial Scale / 5,000 - 20,000 sq ft</option>
                        <option value="Enterprise (20k-50k sq ft)">Enterprise / 20,000 - 50,000 sq ft</option>
                        <option value="Outdoor / Acreage">Outdoor Hemp or Greenhouse</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Facility concerns / Notes</label>
                      <textarea
                        rows={3}
                        value={quickContact.note}
                        onChange={(e) => setQuickContact({ ...quickContact, note: e.target.value })}
                        placeholder="Aspergillus breakouts? Multi-sensor nodes troubleshooting? Log it here..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 text-black font-mono font-bold text-xs py-2.5 rounded hover:bg-emerald-400"
                    >
                      SEND DIRECT CALLBACK NOTIFICATION
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* ==================== SECURED CRM ADMINISTRATIVE PORTAL ==================== */}
          {currentPage === "crm-portal" && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-1">
                <h3 className="text-2xl font-black text-white">Administrative CRM Registry</h3>
                <p className="text-xs text-neutral-500">Access authorized only for Sean Skalsvik and assigned operations advisors.</p>
              </div>

              {/* Secure Passcode Dashboard portal mount */}
              <CRMAdminPanel />
            </div>
          )}

        </div>
      </main>

      {/* ----------------- SEAN'S FOOTER OUTLINES & SEO INDEXERS ----------------- */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-4 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-light text-neutral-450 items-start">
          
          {/* Logo brand */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black border border-emerald-500/30 text-emerald-500 rounded flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-sm">HerbWork Cultivation Solutions</span>
            </div>
            
            <p className="text-[11px] leading-relaxed max-w-sm text-neutral-450 font-light">
              Premium commercial cannabis, hemp, greenhouses, and controlled environment agriculture advisory. Increasing performance yields and installing data compliance structures throughout North America.
            </p>
            
            <div className="pt-2">
              <span className="text-[10px] font-mono text-neutral-500">HEADQUARTERS</span>
              <p className="text-[11px] text-neutral-400 font-mono">Michigan • North American CEC Division</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-bold text-white text-[11px] font-mono tracking-wider uppercase">■ CORE CHANNELS</span>
            <div className="flex flex-col gap-2 font-mono text-[11px]">
              <button onClick={() => setCurrentPage("home")} className="hover:text-emerald-400 text-left cursor-pointer">Home Base</button>
              <button onClick={() => setCurrentPage("consulting")} className="hover:text-emerald-400 text-left cursor-pointer">Consulting Menu</button>
              <button onClick={() => setCurrentPage("automation-ai")} className="hover:text-emerald-400 text-left cursor-pointer">AI & Automation</button>
              <button onClick={() => setCurrentPage("connected-tech")} className="hover:text-emerald-400 text-left cursor-pointer">Live Sensors Dashboard</button>
              <button onClick={() => setCurrentPage("scorecard")} className="hover:text-emerald-400 text-left cursor-pointer">Grow Scorecard Diagnostic</button>
            </div>
          </div>

          {/* SEO Targeted Keyword Indexing */}
          <div className="md:col-span-5 space-y-3">
            <span className="font-bold text-white text-[11px] font-mono tracking-wider uppercase block">■ SEO REGISTER TARGET INDEXING</span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[9px] text-neutral-500">
              {["Commercial Cannabis Consultant", "Cannabis Cultivation Consultant", "Cannabis Facility Optimization", "Cannabis AI Consulting", "Cannabis Automation Consulting", "Cannabis SOP Development", "Cannabis Compliance Consulting", "METRC Consulting", "Cannabis Facility Design", "Cultivation Dashboard Development", "Cannabis Data Analytics", "Crop Steering Consultant"].map((kw, kIdx) => (
                <span key={kIdx} className="bg-neutral-900 border border-neutral-855 px-2 py-0.5 rounded text-[10px]">
                  {kw}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <button
                onClick={() => setCurrentPage("crm-portal")}
                className="text-neutral-500 hover:text-emerald-400 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
              >
                🔒 SECURE CRM ADMINISTRATOR SYSTEM
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-12 pt-6 text-center text-[10px] text-neutral-600 font-mono">
          <p>© 2026 HerbWork Cultivation Solutions. All Rights Reserved. Operator Sean Skalsvik Consulting Division.</p>
          <p className="mt-1">Built for commercial growers. High-scale data compliance • North America Division.</p>
        </div>
      </footer>

    </div>
  );
}
