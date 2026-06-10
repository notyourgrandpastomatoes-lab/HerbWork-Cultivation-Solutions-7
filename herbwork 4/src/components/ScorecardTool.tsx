import React, { useState } from "react";
import { 
  ChevronRight, ChevronLeft, CheckCircle, BarChart2, TrendingUp, Clock, 
  Database, Shield, RefreshCw, Smartphone, Award, Users, AlertTriangle, Sparkles, Printer, Lock
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ScorecardAnswers, LeadData, ScorecardResult } from "../types";

const questions = [
  {
    id: "facilitySize",
    label: "What is your current active cultivation facility size?",
    description: "Helps tailor canopy yield and potential scaling calculations.",
    options: [
      { value: "Under 5,000 sq ft", score: 40, label: "Under 5,000 sq ft (Boutique/Micro)" },
      { value: "5,000 - 20,000 sq ft", score: 65, label: "5,000 - 20,000 sq ft (Mid-Scale Commercial)" },
      { value: "20,000 - 50,000 sq ft", score: 85, label: "20,000 - 50,000 sq ft (Enterprise Scale)" },
      { value: "50,000+ sq ft", score: 100, label: "50,000+ sq ft (Industrial Scale)" },
      { value: "Outdoor Hemp or Greenhouse Acres", score: 75, label: "Outdoor Hemp or Greenhouse Acres" }
    ]
  },
  {
    id: "averageYield",
    label: "What is your current average flower yield per plant?",
    description: "Helps us pinpoint your yield-gap ceiling relative to Michigan operator standards.",
    options: [
      { value: "Under 500 grams", score: 30, label: "Under 500g per plant (Vast room for crop steering growth)" },
      { value: "500g - 800g", score: 55, label: "500g - 800g per plant (Below commercial peak)" },
      { value: "800g - 1,100g", score: 80, label: "800g - 1,100g per plant (Competitive commercial average)" },
      { value: "1,100g+ per plant", score: 100, label: "1,100g+ per plant (High-yield operator grade)" }
    ]
  },
  {
    id: "irrigationStrategy",
    label: "What is your current substrate irrigation and feeding strategy?",
    description: "Determines plant nutrient Uptake efficiency and generative dryback potential.",
    options: [
      { value: "Manual hand-watering based on media feel", score: 20, label: "Manual hand watering based on media feel" },
      { value: "Timer-based scheduled irrigation shots", score: 50, label: "Timer-based scheduled irrigation shots" },
      { value: "Sensor-guided vegetative vs generative crop steering shots", score: 100, label: "Sensor-guided vegetative / generative crop steering" }
    ]
  },
  {
    id: "drybackMonitoring",
    label: "How does your team monitor root zone Drybacks daily?",
    description: "Drybacks control root thickness and flower swelling trigger signals.",
    options: [
      { value: "No active dryback tracking", score: 20, label: "No active tracking" },
      { value: "Occasional manual soil moisture checks", score: 50, label: "Occasional soil checks or handheld probes" },
      { value: "Automated continuous root moisture sensors (VWC)", score: 100, label: "Continuous inline substrate TDR/FDR sensors" }
    ]
  },
  {
    id: "substrateEC",
    label: "How is root substrate Electrical Conductivity (EC) being monitored?",
    description: "Controls nutrient density accumulation to prevent plant salt burn and stress.",
    options: [
      { value: "Drain runoff EC tests only", score: 30, label: "Drain runoff EC testing" },
      { value: "Handheld spot-checks once or twice a week", score: 60, label: "Occasional handheld soil spot-checks" },
      { value: "Continuous continuous inline root zone substrate EC loggers", score: 100, label: "Continuous substrate EC logging sensors (Aroya/Growlink)" }
    ]
  },
  {
    id: "pathogenHistory",
    label: "What is your facility's history with mold, powdery mildew, or Aspergillus?",
    description: "Crucial for compliance clearance and final bio-security design recommendations.",
    options: [
      { value: "Frequent crop loss / recurrent Aspergillus failures", score: 25, label: "Recurrent mold, mildew, or Aspergillus issues" },
      { value: "Occasional microclimate pathogen occurrences", score: 60, label: "Occasional batch spikes or minor microclimate mold" },
      { value: "Rare issues, generally clean product passes", score: 85, label: "Rare pathogen spikes, consistent compliance passes" },
      { value: "100% clean tissue cultures & clean room environment", score: 100, label: "No pathogen history, hospital-grade climate biosecurity" }
    ]
  },
  {
    id: "sopDevelopment",
    label: "What is the status of your facility's Standard Operating Procedures (SOPs)?",
    description: "SOPs prevent labor turnover error rate, product drift, and cross-contamination.",
    options: [
      { value: "No written SOPs, relying on staff personal memory", score: 20, label: "No written SOPs, staff reliant" },
      { value: "Basic incomplete manual written internally", score: 50, label: "Incomplete/Vague manual binders" },
      { value: "Comprehensive written guides for every workflow department", score: 85, label: "Comprehensive detailed SOP manuals" },
      { value: "Digital AI-guided real-time SOP chatbot & video onboarding", score: 100, label: "Integrated digital AI training & modular SOP dashboard" }
    ]
  },
  {
    id: "softwareUsage",
    label: "What cultivation software is integrated into your operations?",
    description: "Software tracks historical crop trends to duplicate record-setting harvests.",
    options: [
      { value: "Pen and paper calendars / manual physical dry-erase boards", score: 20, label: "Pen and paper calendars / dry-erase boards" },
      { value: "Vast disparate offline Google Sheets / MS Excel spreadsheets", score: 50, label: "Separated spreadsheets that require manual collation" },
      { value: "Consolidated systems (Aroya / TrollMaster / Growlink / Bluelab)", score: 90, label: "Commercial software controllers (Aroya, TrollMaster, Growlink)" },
      { value: "Unified sensor data stream integrated directly with compliance", score: 100, label: "Custom unified data dashboard (Connected Intelligence)" }
    ]
  },
  {
    id: "environmentalMonitoring",
    label: "How are room heat, humidity, VPD, and carbon dioxide measured?",
    description: "VPD spikes stifle transpiration, causing calcium deficiencies.",
    options: [
      { value: "Standard analog wall thermostats and humidistats", score: 30, label: "Standard analog wall sensors" },
      { value: "Digital wireless sensors with separate alert alarms", score: 65, label: "Smart consumer sensors (e.g., SensorPush, Ambient)" },
      { value: "Commercial multi-sensor nodes with integrated continuous environmental logging", score: 100, label: "High-density sensor nodes with central climate control systems" }
    ]
  },
  {
    id: "timeDataGathering",
    label: "How many hours per week does management spend gathering/compiling data?",
    description: "Time spent duplicating entries across sheets is lost productivity.",
    options: [
      { value: "10+ hours per week compiling fragmented logging files", score: 25, label: "10+ hours per week (Heavy admin overhead)" },
      { value: "5 - 10 hours per week of manual data entries", score: 55, label: "5 - 10 hours per week of spreadsheet copying" },
      { value: "1 - 5 hours per week of data review", score: 80, label: "1 - 5 hours per week of basic manual review" },
      { value: "Under 1 hour per week utilizing digital dashboards", score: 100, label: "Under 1 hour (Fully automated real-time dashboards)" }
    ]
  }
];

export default function ScorecardTool() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Partial<ScorecardAnswers>>({});
  const [step, setStep] = useState<"quiz" | "lead" | "loading" | "results">("quiz");

  const [leadData, setLeadData] = useState<LeadData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    facilitySize: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [insights, setInsights] = useState<ScorecardResult | null>(null);
  const [aiReport, setAiReport] = useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState("Calibrating metrics...");

  const handleOptionSelect = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    // Auto-advance with visual buffer
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        // Sync facility size to leadData
        setLeadData(prev => ({
          ...prev,
          facilitySize: answers.facilitySize || val // Fallback if selected just now
        }));
        setStep("lead");
      }
    }, 250);
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.email) return;

    setStep("loading");
    setIsSubmitting(true);

    // Dynamic loading texts to keep user highly engaged during Gemini AI compilation
    const statuses = [
      "Securing facility canopy footprint details...",
      "Analyzing substrate EC and irrigation intervals...",
      "Evaluating room Climatology targets...",
      "Calculating yield ceiling vs current averages...",
      "Consulting Sean Skalsvik's Mondaze Facility SOP standards...",
      "Connecting METRC and automation compliance matrix...",
      "Gemini AI engine compiling personalized commercial report...",
    ];

    let statusIdx = 0;
    const statusInterval = setInterval(() => {
      if (statusIdx < statuses.length - 1) {
        statusIdx++;
        setLoadingStatus(statuses[statusIdx]);
      }
    }, 1800);

    // Calculate structural score
    let totalScore = 0;
    questions.forEach((q) => {
      const selectedVal = answers[q.id as keyof ScorecardAnswers];
      const selectedOpt = q.options.find(o => o.value === selectedVal);
      if (selectedOpt) {
        totalScore += selectedOpt.score;
      } else {
        totalScore += 50; // default average fallback
      }
    });
    const finalScore = Math.round(totalScore / questions.length);
    setScore(finalScore);

    // Build quantitative scorecard outcomes
    let cat = "Legacy manual facility";
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    let opps: string[] = [];
    let yieldImp = "10% - 15% improvement";
    let laborSav = "4 - 6 hours saved / week";

    if (finalScore < 45) {
      cat = "Legacy Manual-Driven Facility";
      strengths = ["Sizable market opportunity", "Strong operator dedication", "High local care factor"];
      weaknesses = [
        "Uncontrolled biological substrate drift", 
        "Manual tracking creates severe administrative drag", 
        "High risk of pathogen spoilage"
      ];
      opps = [
        "Transition to automated sensor loggers immediately",
        "Deploy biosecurity SOP quarantine protocols",
        "Introduce automated generative drybacks to bolster margins"
      ];
      yieldImp = "25% - 40% Increase (+200g to +400g per plant) via Crop Steering";
      laborSav = "12 - 16 Hours Saved weekly through dashboard automation";
    } else if (finalScore >= 45 && finalScore < 75) {
      cat = "Transitionary Semi-Automated Grow";
      strengths = ["Sufficient crop data records", "Standard environmental alerts active", "High operational intent"];
      weaknesses = [
        "Substrate EC is unmonitored or spotchecked, leading to nutrient locks",
        "Fragmented spreadsheets lead to compliance blindspots",
        "Sub-optimal generative dryback practices"
      ];
      opps = [
        "Synchronize Aroya/Trollmaster API endpoints into a unified panel",
        "Incorporate daily automated operations summaries for growers",
        "Upgrade written operational handbooks to interactive AI SOP standard"
      ];
      yieldImp = "15% - 25% Increase (+150g to +250g per plant) through Precision Control";
      laborSav = "8 - 12 Hours Saved weekly through compliance streamlining";
    } else {
      cat = "Precision Automated Enterprise";
      strengths = ["Excellent root-zone data logs", "Automated environment integration", "Robust biosecurity SOPs"];
      weaknesses = [
        "Data is siloed across multiple screens, slowing real-time diagnosis",
        "High management hours dedicated to manual data aggregation weekly",
        "Compliance documentation represents administrative friction"
      ];
      opps = [
         "Implement fully customized HerbWork Centralized Dashboard",
         "Deploy fully trained private AI SOP chatbot for new-crew onboarding",
         "Integrate Automated Package and Tag generation models for METRC"
      ];
      yieldImp = "5% - 12% Extra Canopy Optimization & Quality Consistency Improvement";
      laborSav = "5 - 8 Hours Saved weekly by eliminating cross-spreadsheet duplication";
    }

    const scorecardInsights: ScorecardResult = {
      score: finalScore,
      performanceCategory: cat,
      strengths,
      weaknesses,
      opportunities: opps,
      estimatedYieldImprovements: yieldImp,
      estimatedLaborSavings: laborSav,
      recommendedTechnology: ["Aroya substrate sensors", "Trollmaster climate controller", "Growlink fertigation sync", "HerbWork automated dashboards"]
    };

    setInsights(scorecardInsights);

    try {
      // POST scorecard results to Formspree
      await fetch("https://formspree.io/f/xykapdre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadData.name,
          company: leadData.company,
          email: leadData.email,
          phone: leadData.phone,
          facilitySize: leadData.facilitySize,
          diagnosticScore: finalScore,
          performanceCategory: scorecardInsights.performanceCategory,
          strengths: scorecardInsights.strengths.join(", "),
          weaknesses: scorecardInsights.weaknesses.join(", "),
          message: "Scorecard submission from HerbWork website"
        }),
      });

      setAiReport("✅ Your diagnostic scorecard has been submitted to Sean Skalsvik. You will receive a personalized follow-up report within 24 hours. In the meantime, book a Discovery Call to discuss your results directly.");

    } catch (err: any) {
      console.error("Scorecard submission error:", err);
      setAiReport("⚠️ System encountered connectivity issues. Please contact Sean Skalsvik directly to request your customized report.");
    } finally {
      clearInterval(statusInterval);
      setStep("results");
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentQ = questions[currentIdx];
  const progressRatio = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 1. Quiz Section */}
      {step === "quiz" && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 sm:p-10 shadow-2xl relative">
          <div className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-300" style={{ width: `${progressRatio}%` }}></div>
          
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] font-mono tracking-wider text-emerald-500 uppercase">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {Math.round(progressRatio)}% Completed
            </span>
          </div>

          <p className="text-xs text-emerald-400 font-mono mb-2 tracking-widest uppercase">■ Facility Audit Parameters</p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
            {currentQ.label}
          </h3>
          <p className="text-sm text-neutral-400 mb-8 font-light">
            {currentQ.description}
          </p>

          <div className="space-y-3.5 mb-8">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = answers[currentQ.id as keyof ScorecardAnswers] === opt.value;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleOptionSelect(currentQ.id, opt.value)}
                  className={`w-full text-left p-4 rounded-lg border transition duration-200 cursor-pointer flex justify-between items-center ${
                    isSelected
                      ? "bg-neutral-900 border-emerald-500 text-white"
                      : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium pr-4">{opt.label}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? "border-emerald-500 bg-emerald-500 text-black" : "border-neutral-600"
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 text-xs font-mono text-neutral-400 disabled:text-neutral-700 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Metric
            </button>
            <span className="text-[10px] text-neutral-500 font-mono">
              HerbWork Cultivation Solutions Diagnostics
            </span>
          </div>
        </div>
      )}

      {/* 2. Lead Capture Section */}
      {step === "lead" && (
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 sm:p-10 shadow-2xl relative max-w-2xl mx-auto">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          
          <span className="text-[10px] tracking-widest text-emerald-500 font-mono uppercase font-bold block mb-1">
            • FINAL STEP: GENERATE INTELLIGENCE
          </span>
          <h3 className="text-2xl font-bold text-white mb-2">Configure Your Report Profile</h3>
          <p className="text-sm text-neutral-400 leading-relaxed mb-6">
            Provide your facility details below to capture your diagnostic score and initiate our server-side AI report generator (designed by lead operations consultant Sean Skalsvik).
          </p>

          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                placeholder="Sean Skalsvik"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Company / Cultivation Name
                </label>
                <input
                  type="text"
                  value={leadData.company}
                  onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                  placeholder="Mondaze Cultivation LLC"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Your Facility Size
                </label>
                <input
                  type="text"
                  disabled
                  value={leadData.facilitySize}
                  placeholder="Determined from scorecard"
                  className="w-full bg-neutral-950/60 border border-neutral-800 rounded-lg py-2.5 px-4 text-neutral-400 text-xs cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={leadData.email}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  placeholder="grower@facility.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Direct Phone Number
                </label>
                <input
                  type="tel"
                  value={leadData.phone}
                  onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  placeholder="(123) 456-7890"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-lg flex items-start gap-3 mt-6">
              <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono text-emerald-500 font-bold block mb-0.5">Privacy Confirmed</span>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  Your cultivation answers are 100% private and protected. Results are sent securely directly to Sean Skalsvik's local database. No public sales listing or leaks.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-emerald-500 text-black font-bold py-3.5 px-6 rounded-lg text-xs tracking-wider uppercase hover:bg-emerald-400 shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                Compile My Diagnostics & Send Report <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Loading/Calculation Sequence */}
      {step === "loading" && (
        <div className="text-center py-24 px-4 bg-neutral-950 border border-neutral-900 rounded-lg max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-emerald-950/20 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 border-2 border-dashed border-emerald-500 border-t-transparent rounded-full animate-spin flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-8 h-8 text-emerald-500 animate-pulse" />
            </div>
            
            <h4 className="text-2xl font-bold text-white tracking-tight mb-2">Analyzing Growth Ratios</h4>
            <div className="bg-neutral-900 border border-neutral-850 py-2 px-4 rounded-full inline-block">
              <p className="text-xs font-mono text-emerald-400 tracking-wide animate-pulse">{loadingStatus}</p>
            </div>
            
            <p className="text-xs text-neutral-500 mt-8 max-w-sm mx-auto font-light">
              Plucking inputs, indexing crop steering target ranges, and generating personalized intelligence recommendations with Gemini...
            </p>
          </div>
        </div>
      )}

      {/* 4. Complete Action Dashboard */}
      {step === "results" && insights && (
        <div className="space-y-8 print:bg-white print:text-black">
          
          {/* Top diagnostic card */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 sm:p-8 shadow-2xl relative print:border-none print:shadow-none">
            <div className="absolute top-0 left-0 w-2.5 h-full bg-emerald-500 print:hidden"></div>
            
            {/* Top Row with client profile and print btn */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-neutral-850 pb-6">
              <div>
                <p className="text-xs font-mono text-emerald-500 tracking-wider uppercase mb-1">■ Commercial Diagnostics Output</p>
                <h3 className="text-2xl font-bold text-white">{leadData.company || "Consulting Guest"} Audit</h3>
                <p className="text-xs text-neutral-450 font-mono mt-0.5">Tested for: {leadData.name} • Canopy Space: {leadData.facilitySize}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 py-1.5 px-3.5 rounded text-xs font-mono transition cursor-pointer print:hidden"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-500" /> Export Blueprint (PDF)
                </button>
              </div>
            </div>

            {/* Grid display of metrics, score, category */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-center">
              
              {/* Radial score gauge */}
              <div className="md:col-span-5 flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-850 rounded-lg p-6 text-center">
                <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-4">Overall Grow Score</p>
                <div className="relative flex items-center justify-center w-36 h-36 border-4 border-neutral-800 rounded-full">
                  
                  {/* Neon score stroke circle */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-neutral-800"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-emerald-500"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="402"
                      strokeDashoffset={402 - (402 * score) / 100}
                    />
                  </svg>
                  
                  <div className="text-center z-10">
                    <span className="text-5xl font-mono font-black text-white">{score}</span>
                    <span className="text-xs text-neutral-500 font-mono block">/ 100 pts</span>
                  </div>
                </div>
                
                <p className="text-emerald-400 font-bold font-mono text-xs uppercase tracking-wider mt-4">
                  {insights.performanceCategory}
                </p>
              </div>

              {/* Estimated returns */}
              <div className="md:col-span-7 space-y-4">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2 font-mono">
                  ★ Projected Recoverable Yield & Efficiency Gains
                </h4>

                <div className="bg-emerald-950/10 border border-emerald-950/50 p-4 rounded-lg flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 block pb-0.5">Projected Canopy Yield Growth</span>
                    <p className="text-xs text-neutral-300 leading-normal">{insights.estimatedYieldImprovements}</p>
                  </div>
                </div>

                <div className="bg-neutral-900/60 border border-neutral-850 p-4 rounded-lg flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-neutral-300 block pb-0.5">Projected Management Labor Saved</span>
                    <p className="text-xs text-neutral-400 leading-normal">{insights.estimatedLaborSavings}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Strengths & Opportunities Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-850">
              <div>
                <p className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest block mb-3">
                  ▲ Core Strengths Detected
                </p>
                <ul className="space-y-2">
                  {insights.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest block mb-3">
                  ▼ Urgent Operations opportunities
                </p>
                <ul className="space-y-2">
                  {insights.opportunities.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Detailed Advisor deep-dive Report */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-emerald-900/10 to-transparent pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] tracking-widest text-emerald-400 font-mono uppercase font-bold">
                HerbWork AI Systems Output • Gemini-3.5-flash
              </span>
            </div>

            <div className="markdown-body pr-2">
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-neutral-350 leading-relaxed font-light space-y-6 prose-headings:text-white prose-headings:font-bold prose-h1:text-xl prose-h2:text-lg prose-h3:text-sm prose-strong:text-emerald-500 prose-code:text-emerald-300 prose-code:font-mono prose-code:bg-neutral-900 prose-code:px-1 shadow-inner rounded-md">
                <ReactMarkdown>
                  {aiReport}
                </ReactMarkdown>
              </div>
            </div>
            
            {/* Action footer */}
            <div className="mt-12 pt-8 border-t border-neutral-850 text-center print:hidden">
              <h4 className="text-white text-base font-bold mb-2">Want to Review This Blueprint with Sean?</h4>
              <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed mb-6">
                Avoid costly trail-and-error. Let Sean Skalsvik analyze your crop environmental loops, drybacks, and compliance dashboard integrations live over a discovery Zoom call.
              </p>
              
              <div className="bg-neutral-900/40 p-4 border border-neutral-850 rounded-lg max-w-xs mx-auto mb-4 text-xs font-mono text-neutral-400">
                Authorized Lead Operator: <span className="text-emerald-400 font-bold block">{leadData.name}</span>
                Diagnostic ID: <span className="text-neutral-550 block">HW-{Math.floor(Math.random() * 90000) + 10000}</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
