import React, { useState, useEffect } from "react";
import { CRMLead } from "../types";
import { Lock, Eye, CheckCircle, Search, RefreshCw, AlertTriangle, Calendar, Building, Phone, Mail, User, ShieldAlert } from "lucide-react";

export default function CRMAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<CRMLead[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/leads?passcode=${encodeURIComponent(passcode)}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setFilteredLeads(data.leads || []);
        setIsAuthenticated(true);
        // Persist passcode locally for session
        sessionStorage.setItem("crm_passcode", passcode);
      } else {
        setErrorStatus("Invalid CRM authorization passcode. Access denied.");
      }
    } catch (err) {
      console.error(err);
      setErrorStatus("Connection fail. Verify server status.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setErrorStatus("");
    const savedPass = sessionStorage.getItem("crm_passcode") || passcode;
    try {
      const response = await fetch(`/api/leads?passcode=${encodeURIComponent(savedPass)}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setFilteredLeads(data.leads || []);
      } else {
        setErrorStatus("Session expired. Please relog.");
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err);
      setErrorStatus("Could not renew lead listings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedPass = sessionStorage.getItem("crm_passcode");
    if (savedPass) {
      setPasscode(savedPass);
      // Autoauthenticate with saved passcode
      setIsLoading(true);
      fetch(`/api/leads?passcode=${encodeURIComponent(savedPass)}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error();
        })
        .then(data => {
          setLeads(data.leads || []);
          setFilteredLeads(data.leads || []);
          setIsAuthenticated(true);
        })
        .catch(() => {
          sessionStorage.removeItem("crm_passcode");
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (!val.trim()) {
      setFilteredLeads(leads);
      return;
    }
    const query = val.toLowerCase();
    const updated = leads.filter(l => 
      l.name.toLowerCase().includes(query) || 
      l.company.toLowerCase().includes(query) ||
      l.email.toLowerCase().includes(query)
    );
    setFilteredLeads(updated);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("crm_passcode");
    setPasscode("");
    setIsAuthenticated(false);
    setSelectedLead(null);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-850 rounded-lg overflow-hidden shadow-2xl p-6 sm:p-10 max-w-6xl mx-auto">
      
      {/* 1. Auth gate */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/40 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">HerbWork CRM Administrative Portal</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed mb-6">
            Input the administrative passcode configured in your environment to view, search, and download lead diagnostics submissions and scorecard assessments.
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter CRM Admin Passcode (e.g., herbwork2026)"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 px-4 text-center text-white text-xs tracking-widest focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            {errorStatus && (
              <p className="text-xs text-red-500 font-mono">{errorStatus}</p>
            )}

            <button
               type="submit"
               disabled={isLoading}
               className="w-full bg-emerald-500 text-black font-semibold py-2.5 rounded-lg text-xs tracking-wider uppercase hover:bg-emerald-400 transition cursor-pointer"
            >
              {isLoading ? "Authenticating Gateway..." : "Unlock Leads Database"}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-neutral-900 text-left">
            <span className="text-[10px] text-neutral-500 font-mono block text-center">
              Administrative credentials required • HerbWork Operations CEC
            </span>
          </div>
        </div>
      ) : (
        /* 2. Logged In Panel layout */
        <div className="space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] tracking-widest text-emerald-500 font-mono font-bold uppercase">
                  CRM DATA PLATFORM SECURE
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Lead & Scorecard Repository</h3>
              <p className="text-xs text-neutral-400">Manage incoming commercial consultation pipelines of growers.</p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={fetchLeads}
                disabled={isLoading}
                className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 py-1.5 px-3 rounded text-xs font-mono transition"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} /> Refresh
              </button>
              <button
                onClick={handleLogout}
                className="bg-neutral-900 border border-neutral-800 hover:border-red-950/50 hover:text-red-400 text-neutral-450 py-1.5 px-3 rounded text-xs font-mono transition"
              >
                Exit Portal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left list group */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by name, company, or email..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-9 pr-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="border border-neutral-850 rounded-lg overflow-hidden divide-y divide-neutral-900 max-h-[500px] overflow-y-auto">
                {filteredLeads.length === 0 ? (
                  <div className="p-8 text-center text-neutral-600 text-xs">
                    No matching consulting submissions logged yet.
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`w-full text-left p-4 transition text-xs block ${
                        selectedLead?.id === lead.id 
                          ? "bg-neutral-900 border-l-2 border-emerald-500" 
                          : "bg-neutral-950/40 hover:bg-neutral-900/10"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="font-bold text-white text-sm">{lead.name}</span>
                        <div className="flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                          Score: {lead.calculatedScore}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-neutral-400">
                        <p className="flex items-center gap-1.5 font-light">
                          <Building className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>{lead.company}</span>
                        </p>
                        <p className="flex items-center gap-1.5 font-light">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>{new Date(lead.submittedAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right details group */}
            <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-850 rounded-lg p-6 min-h-[400px]">
              {selectedLead ? (
                <div className="space-y-6">
                  
                  {/* Lead metadata card */}
                  <div className="border-b border-neutral-900 pb-5">
                    <span className="text-[10px] tracking-widest text-emerald-500 font-mono font-bold block mb-1">
                      LEAD PROFILE ID: HW-{selectedLead.id.slice(5, 11)}
                    </span>
                    <h4 className="text-xl font-bold text-white mb-4">{selectedLead.name}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-light text-neutral-300">
                      <p className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span><strong>Company:</strong> {selectedLead.company}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span><strong>Email:</strong> {selectedLead.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span><strong>Phone:</strong> {selectedLead.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span><strong>Canopy:</strong> {selectedLead.facilitySize}</span>
                      </p>
                    </div>
                  </div>

                  {/* Answers review */}
                  <div>
                    <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                      ■ Scorecard diagnostic answers
                    </h5>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {selectedLead.scorecardAnswers && Object.keys(selectedLead.scorecardAnswers).map((key) => {
                        const val = (selectedLead.scorecardAnswers as any)[key];
                        return (
                          <div key={key} className="bg-neutral-950 p-2.5 rounded border border-neutral-900 text-[11px]">
                            <p className="font-mono text-emerald-500 text-[10px] capitalize mb-1">
                              {key.replace(/([A-Z])/g, " $1")}
                            </p>
                            <p className="text-neutral-300 font-medium">{val}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-12">
                  <ShieldAlert className="w-12 h-12 text-neutral-600 mb-3" />
                  <p className="text-xs">No lead profile selected.</p>
                  <p className="text-[11px] text-neutral-600 max-w-xs mt-1">Select a candidate from the column list to inspect their custom crop steering parameters and direct contacts.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
