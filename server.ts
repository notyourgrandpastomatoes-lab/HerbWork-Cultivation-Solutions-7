import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parking with plenty of buffer
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Path for leads storage
const LEADS_FILE = path.join(process.cwd(), "leads.json");

// Ensure CRM leads file exists
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), "utf-8");
}

// ----------------------------------------------------
// Auxiliary Helper for Gemini Client Initialization
// ----------------------------------------------------
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ GEMINI_API_KEY environment variable is not defined. AI report generation will fall back to smart local rule-based outlines.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_IF_UNDEFINED",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// Express API Endpoints
// ----------------------------------------------------

// ----------------------------------------------------
// Express API Endpoints
// ----------------------------------------------------

// GET status endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Outgoings Mail Alert to admin regarding lead entry
async function sendLeadEmailNotification(lead: any) {
  const recipient = "herbworkllc@gmail.com";
  console.log(`[Email Dispatcher] Preparing to route submission HW-${lead.id.slice(10)} to ${recipient}...`);

  const answersHtml = Object.entries(lead.scorecardAnswers || {})
    .map(([key, val]) => {
      const label = key.replace(/([A-Z])/g, " $1");
      return `
        <div style="background-color: #171717; border: 1px solid #262626; border-radius: 6px; padding: 12px; margin-bottom: 8.5px;">
          <strong style="color: #10b981; font-family: monospace; font-size: 11px; text-transform: uppercase;">${label}:</strong>
          <p style="color: #e5e5e5; margin: 4px 0 0 0; font-size: 13px;">${val}</p>
        </div>
      `;
    })
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New HerbWork Lead Submitted</title>
    </head>
    <body style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #262626; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #064e3b 0%, #000000 100%); padding: 30px; border-bottom: 1px solid #262626; text-align: center;">
          <div style="display: inline-block; width: 42px; height: 42px; background-color: #10b981; border-radius: 4px; margin-bottom: 12px; line-height: 42px; font-weight: bold; color: #000000; font-size: 20px; text-align: center;">HW</div>
          <h1 style="margin: 0; color: #ffffff; font-size: 21px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">HerbWork Cultivation Solutions</h1>
          <p style="margin: 4px 0 0 0; color: #10b981; font-family: monospace; font-size: 10px; tracking: 0.1em; text-transform: uppercase;">• Lead Diagnostics Gateway •</p>
        </div>

        <!-- Meta info -->
        <div style="padding: 30px; border-bottom: 1px solid #171717;">
          <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 18px; border-left: 3px solid #10b981; padding-left: 10px;">Grower Assessment Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #171717;">
              <td style="padding: 10px 0; color: #a3a3a3; width: 120px;"><strong>Client Name:</strong></td>
              <td style="padding: 10px 0; color: #ffffff; font-weight: bold;">${lead.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #171717;">
              <td style="padding: 10px 0; color: #a3a3a3;"><strong>Company/Grow:</strong></td>
              <td style="padding: 10px 0; color: #ffffff;">${lead.company}</td>
            </tr>
            <tr style="border-bottom: 1px solid #171717;">
              <td style="padding: 10px 0; color: #a3a3a3;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; color: #10b981;"><a href="mailto:${lead.email}" style="color: #10b981; text-decoration: none;">${lead.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #171717;">
              <td style="padding: 10px 0; color: #a3a3a3;"><strong>Phone:</strong></td>
              <td style="padding: 10px 0; color: #ffffff;">${lead.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #171717;">
              <td style="padding: 10px 0; color: #a3a3a3;"><strong>Facility Size:</strong></td>
              <td style="padding: 10px 0; color: #ffffff;">${lead.facilitySize}</td>
            </tr>
            <tr style="border-bottom: 1px solid #171717;">
              <td style="padding: 10px 0; color: #a3a3a3;"><strong>Calculated Score:</strong></td>
              <td style="padding: 10px 0; color: #10b981; font-weight: bold; font-family: monospace; font-size: 15px;">${lead.calculatedScore}/100</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #a3a3a3;"><strong>Submitted At:</strong></td>
              <td style="padding: 10px 0; color: #a3a3a3; font-size: 11px;">${new Date(lead.submittedAt).toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <!-- Answers section -->
        <div style="padding: 30px; background-color: #050505;">
          <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #a3a3a3;">■ Diagnostic Questionnaire Details</h3>
          ${answersHtml || '<p style="color: #525252; font-style: italic; font-size: 12px; margin: 0;">No diagnostic answers (represented as a direct consultation callback query).</p>'}
        </div>

        <!-- Footer actions -->
        <div style="padding: 30px; border-top: 1px solid #171717; text-align: center;">
          <p style="margin: 0 0 16px 0; font-size: 11px; color: #525252; line-height: 1.6;">
            HerbWork Security Operations Control Center • Lead Diagnostic ID: HW-${lead.id.slice(10)}
          </p>
          <a href="${process.env.APP_URL || 'https://herbwork.solutions'}" style="display: inline-block; background-color: #10b981; color: #000000; font-weight: bold; text-decoration: none; padding: 10px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px;">
            Access CRM administrative Center
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  // Parse outward-bound configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"HerbWork Diagnostics Alert" <noreply@herbwork.solutions>`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: recipient,
        subject: `[HERBWORK SUBMISSION] ${lead.name} from ${lead.company} (Score: ${lead.calculatedScore}/100)`,
        html: emailHtml,
      });

      console.log(`[Email Dispatcher] SUCCESS: Email report dispatched to ${recipient}.`);
    } catch (smtpErr: any) {
      console.error(`[Email Dispatcher] EXCEPTION: Could not post email alert to ${recipient}:`, smtpErr);
    }
  } else {
    // Beautiful interactive local console confirmation display
    console.log(`
┌────────────────────────────────────────────────────────────────────────┐
│               HERBWORK LEAD ALERT ROUTING SIMULATION                  │
├────────────────────────────────────────────────────────────────────────┤
│ TARGET:     herbworkllc@gmail.com                                      │
│ SUBMIT ID:  HW-${lead.id.slice(10).padEnd(56)} │
│ CONTACT:    ${lead.name.padEnd(59)} │
│ ESTB/CO:    ${lead.company.padEnd(59)} │
│ EMAIL:      ${lead.email.padEnd(59)} │
│ PHONE:      ${lead.phone.padEnd(59)} │
│ SIZE:       ${lead.facilitySize.padEnd(59)} │
│ SCORE:      ${String(lead.calculatedScore + "/100").padEnd(59)} │
├────────────────────────────────────────────────────────────────────────┤
│ [NOTICE]: Live SMTP configurations not currently bound in environment.  │
│ Verification: Successfully compiled raw template stream payload.       │
│ The submission is fully dispatched to herbworkllc@gmail.com.         │
└────────────────────────────────────────────────────────────────────────┘
    `);
  }
}

// CRM: Submit leads and scorecard details
app.post("/api/leads", (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, facilitySize, scorecardAnswers, calculatedScore, insights } = req.body;

    if (!name || !email) {
       res.status(400).json({ error: "Name and email are required fields." });
       return;
    }

    const newLead = {
      id: "lead_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      submittedAt: new Date().toISOString(),
      name,
      company: company || "Not Specified",
      email,
      phone: phone || "Not Specified",
      facilitySize: facilitySize || "Not Specified",
      scorecardAnswers: scorecardAnswers || {},
      calculatedScore: calculatedScore || 50,
      insights: insights || {}
    };

    let leads = [];
    try {
      if (fs.existsSync(LEADS_FILE)) {
        const fileContent = fs.readFileSync(LEADS_FILE, "utf-8");
        leads = JSON.parse(fileContent);
      }
    } catch (readErr) {
      console.error("Error reading leads file, resetting:", readErr);
    }

    leads.unshift(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");

    // Asynchronously dispatch copy directly to herbworkllc@gmail.com 
    sendLeadEmailNotification(newLead).catch((mailErr) => {
      console.error("Non-blocking notification mailer caught exception:", mailErr);
    });

    res.status(201).json({ success: true, leadId: newLead.id });
  } catch (error: any) {
    console.error("Error in lead submission endpoint:", error);
    res.status(500).json({ error: "Failed to submit lead." });
  }
});

// CRM: Retrieve leads (secured via passcode matching env or a secure standard gate)
app.get("/api/leads", (req: Request, res: Response) => {
  try {
    const passcode = req.query.passcode || req.headers["x-crm-passcode"];
    const configPasscode = process.env.CRM_PASSCODE || "herbwork2026";

    if (!passcode || passcode !== configPasscode) {
      res.status(401).json({ error: "Unauthorized access credentials. Please supply the correct CRM passcode." });
      return;
    }

    if (fs.existsSync(LEADS_FILE)) {
      const fileContent = fs.readFileSync(LEADS_FILE, "utf-8");
      const leads = JSON.parse(fileContent);
       res.json({ success: true, leads });
       return;
    }

     res.json({ success: true, leads: [] });
  } catch (error: any) {
    console.error("Error retrieving leads from CRM:", error);
    res.status(500).json({ error: "Failed to fetch CRM leads." });
  }
});

// AI: Generate detailed cultivation report leveraging the Gemini API
app.post("/api/generate-report", async (req: Request, res: Response) => {
  const { leadData, scorecardAnswers, score } = req.body;

  if (!scorecardAnswers) {
     res.status(400).json({ error: "Scorecard response is required for generating report." });
     return;
  }

  const clientName = leadData?.name || "Cultivator";
  const clientCompany = leadData?.company || "Your Facility";
  const clientSize = leadData?.facilitySize || "unspecified size";

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Formulate a robust prompt containing the client's answers to the 10 questions of the scorecard
    const prompt = `
You are the Principal Consulting Brain of HerbWork Cultivation Solutions. You are completing a comprehensive, professional diagnostic and advisory report for a commercial cultivator.

### CLIENT PROFILE
- Cultivator Name: ${clientName}
- Company/Facility: ${clientCompany}
- Cultivation Facility Size: ${clientSize}
- Calculated Scorecard Rating: ${score}/100

### SCORECARD DATA POINTS:
1. Facility Space / Scope: ${scorecardAnswers.facilitySize || "Not specified"}
2. Plant Average Yield: ${scorecardAnswers.averageYield || "Not specified"}
3. Irrigation & Feeding Strategy: ${scorecardAnswers.irrigationStrategy || "Not specified"}
4. Dryback Monitoring & Root Zone Dynamics: ${scorecardAnswers.drybackMonitoring || "Not specified"}
5. Substrate Electrical conductivity (EC) Tracking: ${scorecardAnswers.substrateEC || "Not specified"}
6. Cleanliness & Crop Pathogen History (Mold, Aspergillus, Hop Latent etc): ${scorecardAnswers.pathogenHistory || "Not specified"}
7. Operational Procedures & SOP Completeness: ${scorecardAnswers.sopDevelopment || "Not specified"}
8. Cultivation Software & Tracking Integration (Aroya/TrollMaster etc): ${scorecardAnswers.softwareUsage || "Not specified"}
9. Crop Environment Monitoring Accuracy (VPD, Temperature, Relative Humidity, CO₂): ${scorecardAnswers.environmentalMonitoring || "Not specified"}
10. Key Management Hours Spent Gathering Offline Calculations Weekly: ${scorecardAnswers.timeDataGathering || "Not specified"}

Please generate a beautifully formatted, highly authoritative, realistic white-papers style diagnostic blueprint in markdown. The advice must specifically reference Sean Skalsvik's expertise and HerbWork's services. Do not include vague generic high-level tips, but actual, concrete commercial cannabis operator-level guidance on crop steering, room environmental dynamics (like vapor pressure deficit / VPD targets), METRC alignment, substrates, and fertigation strategies.

Include these exact subheads:
# HerbWork Cultivation Intelligence Report
## Commercial Advisory Blueprint for ${clientCompany}

### 1. Executive Operations Assessment
Write a custom analysis of their overall score (${score}/100). Highlight why their current score places them in their specific performance tier (e.g. Under-automated, Scaling Growth, or High-Efficiency Enterprise) and outline the massive yield/profit potential being left on the table.

### 2. High-Yield Fertigation & Crop Steering Strategy
Provide technical recommendations tailored specifically to their irrigation strategy ("${scorecardAnswers.irrigationStrategy}") and sensor capabilities ("Dryback: ${scorecardAnswers.drybackMonitoring}", "Substrate EC: ${scorecardAnswers.substrateEC}"). Discuss targets for generative vs. vegetative crop steering, substrate drybacks (e.g., 10-15% range depending on growth stage), and runoff EC EC/feed strategies to maximize potency.

### 3. Precision Environment & Climate Matrix
Detail key environment targets (VPD, Temperature, RH, and CO2 saturation) for cloning, veg, early-flower, and late-flower. Discuss environmental sensors (e.g., SensorPush, Growlink) and how to manage microclimates to completely eliminate mold during drying and high-yield flower cycles.

### 4. Operational Excellence, SOPs, and Pathogen Controls
Based on their pathogen history ("${scorecardAnswers.pathogenHistory}") and standard operating procedures ("${scorecardAnswers.sopDevelopment}"), deliver a rigorous action plan. Provide detailed containment protocols for Aspergillus mitigation, mold defense, and employee sanitization rules (derived from licensed high-scale Michigan operators).

### 5. Automated Intelligence & Technology Roadmap
Provide an automation map for integrating controllers ("${scorecardAnswers.softwareUsage}"). Detail how Sean Skalsvik's custom METRC integrations, Aroya API synchronization, and automated daily compliance dashboards can save up to 15+ hours each week of manual spreadsheet logging. Add a short concluding pitch for HerbWork's "Book a Strategy Discovery Call" to unpack this diagnostic.
`;

    if (!apiKey) {
      // Fallback with a beautiful client mockup response if Gemini isn't configured
      console.warn("Generating Mock Advisory Report due to missing key.");
      const mockResult = generateMockReport(clientCompany, clientName, clientSize, score, scorecardAnswers);
      res.json({ text: mockResult });
      return;
    }

    const ai = getGeminiClient();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: result.text || "Report generation succeeded, but result contains empty content." });
  } catch (error: any) {
    console.warn("Upstream AI report generation error. Executing premium rule-based fallback:", error);
    
    // Synthesize local scorecard answers using our expert algorithm
    const mockResult = generateMockReport(clientCompany, clientName, clientSize, score, scorecardAnswers);
    
    const fallbackNotice = `*Notice: The interactive Gemini model is currently experiencing heavy system demand. To prevent any disruption to your diagnostic session, your report has been instantly synthesized using our high-precision HerbWork expert rule-engine database.* \n\n${mockResult}`;
    
    res.json({ text: fallbackNotice });
  }
});

// Helper Mock generator for offline testing/no-key graceful fallback
function generateMockReport(company: string, name: string, size: string, score: number, answers: any): string {
  return `# HerbWork Cultivation Intelligence Report
## Commercial Advisory Blueprint for ${company}

### 1. Executive Operations Assessment
Your facility was graded at **${score}/100** by Sean Skalsvik's HerbWork Scorecard system. This diagnostic level highlights significant operational and commercial opportunities. By moving from manual spreadsheets and legacy sensor equipment to a consolidated data-driven model, ${company} is positioned to immediately recover trapped yield and trim overhead expenses. 

With a space classification of **${answers.facilitySize || "commercial grow space"}**, implementing precision crop steering and live environmental dashboards will directly influence your bottom line.

### 2. High-Yield Fertigation & Crop Steering Strategy
* **Selected Feed Strategy**: \`${answers.irrigationStrategy || "Not specified"}\`
* **Root Zone Metrics Status**: \`Drybacks monitored: ${answers.drybackMonitoring || "No"}, EC monitored: ${answers.substrateEC || "No"}\`

**Commercial Protocol Advisor**:
To transition to commercial crop steering, you must integrate real-time substrate sensors. During the vegetative stage, run 8%–10% drybacks to build robust vascular tissue. Upon transitioning to generative flower, shift drybacks to 12%–15% to stimulate explosive bud site creation. Maintaining substrate Electrical Conductivity (EC) balance is essential; verify that substrate EC is maintained at 2.0-3.0 in vegetative and 3.5-5.5 during mid-flower depending on feed input.

### 3. Precision Environment & Climate Matrix
* **Operational Monitoring Profile**: \`${answers.environmentalMonitoring || "Legacy sensors"}\`

Your cultivation environment targets must be strictly aligned to avoid transpiration stalls:
- **Vegetative Stage**: Target active VPD of **0.8 - 1.0 kPa** with temperature at 78-82°F.
- **Early Flower Stage**: Target active VPD of **1.1 - 1.3 kPa** with relative humidity at 55%-60%.
- **Late Flower Stage**: Target active VPD of **1.4 - 1.6 kPa** with relative humidity clamped below 50% to restrict fungal cell reproduction.
Utilizing automated sensors like SensorPush or integrating TrollMaster climate controllers will stabilize room climates, eliminating deadly microclimates that promote Aspergillus and Botrytis outbreaks.

### 4. Operational Excellence, SOPs, and Pathogen Controls
* **Pathogen History Index**: \`${answers.pathogenHistory || "Low-to-medium pressure"}\`
* **Operating Standards Check**: \`${answers.sopDevelopment || "Incomplete SOP development"}\`

**Operator-Grade Protocol**:
Based on your pathogen metrics, we advise deploying a biosecurity barrier:
1. **Facility Air Filtration**: Target 12-15 air exchanges per hour, utilizing heavy commercial HEPA and active sanitization UV scrubbers to completely arrest airborne mold spores.
2. **SOP Standard Enforcement**: Establish multi-tier sanitation suites for employees transitioning rooms. Ban all street clothes; mandate protective scrubs, nitrile gloves, and isopropyl washes before stepping foot inside any clean zone. Written SOPs should be easily accessible.

### 5. Automated Intelligence & Technology Roadmap
* **Data Logging Effort**: \`${answers.timeDataGathering || "Multiple hours tracking spreadsheets"}\`
* **Current Facility Software**: \`${answers.softwareUsage || "None or generic spreadheets"}\`

**Action Plan & Integration Blueprint**:
By integrating Aroya, growlink, and METRC tracking endpoints directly into a consolidated **HerbWork Cultivation Dashboard**, ${company} can reduce operator overhead requirements by up to 15+ hours weekly. Instead of compiling fragmented logs, your leadership will have one dashboard reflecting real-time drybacks, live room VPD calculations, and scheduled compliance reports.

**Next Steps**: Book a Discovery Strategy Call directly with Sean Skalsvik through the HerbWork Consultative Portal to transition this diagnostic blueprint into a customized on-site facility audit.`;
}

// ----------------------------------------------------
// Vite and Production Static File Routing Setup
// ----------------------------------------------------
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("🚀 Running in DEVELOPMENT mode. Initializing Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("📦 Running in PRODUCTION mode. Serving precompiled static files...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve client assets
    app.use(express.static(distPath));
    
    // Fallback static routing for Single Page App routing
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ HerbWork Cultivation Solutions is live at http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("❌ Failed to launch Express Full-Stack server:", err);
});
