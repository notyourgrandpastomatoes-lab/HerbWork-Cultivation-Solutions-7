import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { leads } from "../../db/schema.js";

const jsonHeaders = {
  "Content-Type": "application/json",
};

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...init?.headers,
    },
  });
}

function isAuthorized(req: Request) {
  const url = new URL(req.url);
  const passcode = url.searchParams.get("passcode") || req.headers.get("x-crm-passcode");
  const configuredPasscode = process.env.CRM_PASSCODE || "herbwork2026";

  return Boolean(passcode && passcode === configuredPasscode);
}

export default async (req: Request) => {
  if (req.method === "GET") {
    if (!isAuthorized(req)) {
      return json({ error: "Unauthorized access credentials. Please supply the correct CRM passcode." }, { status: 401 });
    }

    const rows = await db.select().from(leads).orderBy(desc(leads.submittedAt));
    return json({ success: true, leads: rows });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null);

    if (!body?.name || !body?.email) {
      return json({ error: "Name and email are required fields." }, { status: 400 });
    }

    const id = `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const [lead] = await db
      .insert(leads)
      .values({
        id,
        name: body.name,
        company: body.company || "Not Specified",
        email: body.email,
        phone: body.phone || "Not Specified",
        facilitySize: body.facilitySize || "Not Specified",
        scorecardAnswers: body.scorecardAnswers || {},
        calculatedScore: body.calculatedScore || 50,
        insights: body.insights || {},
      })
      .returning();

    return json({ success: true, leadId: lead.id }, { status: 201 });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = {
  path: "/api/leads",
};
