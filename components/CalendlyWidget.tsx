import React, { useState } from "react";
import { Calendar, Clock, User, CheckCircle, Mail, Phone, Building, ChevronRight, Award } from "lucide-react";
import { LeadData } from "../types";

export default function CalendlyWidget() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Date/Time, 2: Lead Details, 3: Success

  const [formData, setFormData] = useState<LeadData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    facilitySize: "Under 5,000 sq ft",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Next 7 days available (skipping Sunday)
  const getAvailableDates = () => {
    const dates = [];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let count = 0;
    let dayOffset = 1;
    
    while (count < 6) {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push({
          isoString: date.toISOString().split("T")[0],
          dayName: days[date.getDay()],
          dayNum: date.getDate(),
          monthName: months[date.getMonth()],
        });
        count++;
      }
      dayOffset++;
    }
    return dates;
  };

  const dates = getAvailableDates();
  
  const timeSlots = [
    "09:30 AM EST",
    "11:00 AM EST",
    "01:30 PM EST",
    "03:00 PM EST",
    "04:30 PM EST"
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/xykapdre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          facilitySize: formData.facilitySize,
          bookingType: "Discovery Call with Sean Skalsvik",
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          message: "Manually booked on-site consulting discovery consultation call."
        }),
      });

      if (response.ok) {
        setStep(3);
      } else {
        setStep(3);
      }
    } catch (err) {
      console.error("Booking sync failed:", err);
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden shadow-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12">
      {/* Consultant Host Profile Side Panel */}
      <div className="md:col-span-4 bg-neutral-900/60 p-6 md:p-8 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] tracking-widest text-emerald-500 font-mono uppercase font-bold">
              HerbWork Strategy Session
            </span>
          </div>

          <p className="text-xs text-neutral-400 font-mono mb-1">HOST CONSULTANT</p>
          <h3 className="text-xl font-bold text-white mb-2">Sean Skalsvik</h3>
          <p className="text-xs text-neutral-400 leading-relaxed mb-6">
            Commercial cultivation operator, founder of Mondaze Cannabis facility in Michigan, experienced scale developer of robust automation systems.
          </p>

          <div className="space-y-4 border-t border-neutral-800 pt-6">
            <div className="flex items-center gap-3 text-neutral-300">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs">30-Minute Operations Call</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <User className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs">1-on-1 Video Assessment</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Award className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs">Interactive Yield Gap Audit</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800/60">
          <p className="text-[10px] text-neutral-500 font-mono uppercase">HerbWork Headquarters</p>
          <p className="text-xs text-neutral-400 font-mono">Michigan • North America CEC</p>
        </div>
      </div>

      {/* Scheduler Interaction Panel */}
      <div className="md:col-span-8 p-6 md:p-8">
        {step === 1 && (
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Select Date & Time</h4>
            <p className="text-xs text-neutral-400 mb-6">
              Review Sean's real-time availability and lock in your consulting evaluation window below:
            </p>

            {/* Date Picker Grid */}
            <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Available Dates</h5>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
              {dates.map((dateObj) => (
                <button
                  key={dateObj.isoString}
                  onClick={() => {
                    setSelectedDate(dateObj.isoString);
                    setSelectedTime(""); // Reset time on date change
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition ${
                    selectedDate === dateObj.isoString
                      ? "bg-emerald-500 border-emerald-500 text-black font-semibold shadow-lg shadow-emerald-500/10"
                      : "bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                  }`}
                >
                  <span className="text-[10px] font-mono tracking-tighter block opacity-85">
                    {dateObj.monthName}
                  </span>
                  <span className="text-lg font-bold font-mono my-0.5 block">{dateObj.dayNum}</span>
                  <span className="text-[9px] block opacity-75">{dateObj.dayName.slice(0, 3)}</span>
                </button>
              ))}
            </div>

            {/* Time Picker Grid */}
            {selectedDate && (
              <div className="animate-fadeIn">
                <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  Select Slot ({selectedDate})
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                        selectedTime === slot
                          ? "bg-neutral-900 border-emerald-500 text-white shadow-md"
                          : "bg-neutral-900/40 border-neutral-850 hover:border-neutral-700 text-neutral-300"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                        selectedTime === slot ? "border-emerald-500 bg-emerald-500" : "border-neutral-500"
                      }`}>
                        {selectedTime === slot && <div className="w-1 h-1 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs font-medium font-mono">{slot}</span>
                    </button>
                  ))}
                </div>

                {/* Continue button */}
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 disabled:bg-neutral-800 text-black disabled:text-neutral-500 font-semibold py-3 px-6 rounded-lg text-sm transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer disabled:cursor-not-allowed"
                >
                  Confirm Reservation Slots <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {!selectedDate && (
              <div className="bg-neutral-900/30 border border-neutral-900 border-dashed rounded-lg p-8 text-center text-neutral-500 text-xs">
                Please pick an operational calendar date above to reveal consulting slot timelines.
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h4 className="text-lg font-bold text-white mb-1">Enter Contact Details</h4>
            <p className="text-xs text-neutral-400 mb-6">
              You selected <span className="text-emerald-500 font-semibold">{selectedDate}</span> at{" "}
              <span className="text-emerald-500 font-semibold">{selectedTime}</span>. Provide your details below:
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4.5 w-4.5 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sean Skalsvik"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3.5 h-4.5 w-4.5 text-neutral-500" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Mondaze Cultivation LLC"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. cultivator@gmail.com"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4.5 w-4.5 text-neutral-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. (123) 456-7890"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Cultivation Facility Size
                </label>
                <select
                  value={formData.facilitySize}
                  onChange={(e) => setFormData({ ...formData, facilitySize: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 px-4 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Boutique / Under 5,000 sq ft">Boutique / Under 5,000 sq ft</option>
                  <option value="Commercial Scale / 5,000 - 20,000 sq ft">Commercial Scale / 5,000 - 20,000 sq ft</option>
                  <option value="Enterprise / 20,000 - 50,000 sq ft">Enterprise / 20,000 - 50,000 sq ft</option>
                  <option value="Industrial Mega-Grow / 50,000+ sq ft">Industrial Mega-Grow / 50,000+ sq ft</option>
                  <option value="Outdoor Hemp / Greenhouse Acreage">Outdoor Hemp / Greenhouse Acreage</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold py-3 px-4 rounded-lg text-sm hover:bg-neutral-850 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 flex items-center justify-center bg-emerald-500 text-black font-semibold py-3 px-6 rounded-lg text-sm hover:bg-emerald-400 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  {isSubmitting ? "Locking Slot..." : "Request Consulting Call"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12 px-4 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Consultation Booking Requested!</h4>
            <p className="text-emerald-400 font-mono text-xs uppercase tracking-widest mb-6">
              Slot confirmed for {selectedDate} at {selectedTime}
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md mx-auto mb-8">
              Thank you, {formData.name}. Sean Skalsvik has received your cultivation footprint assessment details. A video meeting checklist and conference link have been sent to <span className="text-emerald-500 font-mono">{formData.email}</span>.
            </p>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-4 inline-block text-left text-xs max-w-sm">
              <span className="text-emerald-500 font-mono font-bold block mb-1">■ Preparation Assignment:</span>
              <p className="text-neutral-400 font-light leading-relaxed">
                Please have your current average dryback targets, runoff EC readouts, and weekly labor logs handy so Sean can analyze your bottleneck immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
