import { createServerFn } from "@tanstack/react-start";

export interface BuyerCompany {
  domain: string;
  organization: string | null;
  emailsTotal: number;
}

export interface BuyerContact {
  email: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  department: string | null;
  seniority: string | null;
  decisionMaker: boolean;
  confidence: number;
  type: string | null;
  linkedin: string | null;
  verified: boolean;
}

export interface BuyerContactsResult {
  domain: string;
  organization: string | null;
  country: string | null;
  contacts: BuyerContact[];
}

function apiKey(): string {
  const key = process.env["HUNTER_API_KEY"];
  if (!key) throw new Error("Buyer data service is not configured.");
  return key;
}

async function readJson(res: Response): Promise<any> {
  const text = await res.text();
  let body: any = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("The buyer data service returned an unreadable response.");
  }
  const firstError = body?.errors?.[0];
  if (firstError) {
    throw new Error(firstError.details ?? "The buyer search could not be completed.");
  }
  if (!res.ok) throw new Error(`Buyer search failed (${res.status}).`);
  return body;
}

export const discoverBuyers = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string; countries?: string[] }) => {
    const query = (input.query ?? "").trim();
    if (query.length < 3) throw new Error("Please describe the buyers you are looking for.");
    return { query: query.slice(0, 200), countries: (input.countries ?? []).slice(0, 5) };
  })
  .handler(async ({ data }): Promise<BuyerCompany[]> => {
    // Country filters are a paid-plan feature, so the markets are folded into
    // the search phrase itself, which the discovery endpoint honours.
    const phrase = data.countries.length
      ? `${data.query} based in ${data.countries.join(", ")}`
      : data.query;
    const payload: Record<string, unknown> = { query: phrase };

    const res = await fetch(`https://api.hunter.io/v2/discover?api_key=${apiKey()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await readJson(res);
    const rows: any[] = Array.isArray(body?.data) ? body.data : [];
    return rows
      .filter((r) => typeof r?.domain === "string")
      .slice(0, 24)
      .map((r) => ({
        domain: r.domain as string,
        organization: (r.organization as string) ?? null,
        emailsTotal: Number(r?.emails_count?.total ?? 0),
      }));
  });

export const findBuyerContacts = createServerFn({ method: "POST" })
  .inputValidator((input: { domain: string }) => {
    const domain = (input.domain ?? "").trim().toLowerCase();
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) throw new Error("That company address looks wrong.");
    return { domain };
  })
  .handler(async ({ data }): Promise<BuyerContactsResult> => {
    const url = new URL("https://api.hunter.io/v2/domain-search");
    url.searchParams.set("domain", data.domain);
    url.searchParams.set("limit", "10");
    url.searchParams.set("api_key", apiKey());

    const res = await fetch(url.toString());
    const body = await readJson(res);
    const d = body?.data ?? {};
    const emails: any[] = Array.isArray(d.emails) ? d.emails : [];

    const contacts: BuyerContact[] = emails.map((e) => ({
      email: e.value as string,
      firstName: e.first_name ?? null,
      lastName: e.last_name ?? null,
      position: e.position ?? null,
      department: e.department ?? null,
      seniority: e.seniority ?? null,
      decisionMaker: Boolean(e.decision_maker),
      confidence: Number(e.confidence ?? 0),
      type: e.type ?? null,
      linkedin: e.linkedin ?? null,
      verified: e?.verification?.status === "valid",
    }));

    contacts.sort(
      (a, b) => Number(b.decisionMaker) - Number(a.decisionMaker) || b.confidence - a.confidence,
    );

    return {
      domain: data.domain,
      organization: d.organization ?? null,
      country: d.country ?? null,
      contacts,
    };
  });
