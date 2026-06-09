import { NextResponse } from "next/server";
import { PARTY_STATES, getPartyState, setPartyState, type PartyState } from "@/lib/partyStateStore";

const validStates = new Set<string>(Object.values(PARTY_STATES));

export async function GET() {
  return NextResponse.json({ partyState: getPartyState() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const partyStateToSet = body?.partyState;

    if (typeof partyStateToSet !== "string" || !validStates.has(partyStateToSet)) {
      return NextResponse.json({ error: "Invalid partyState value" }, { status: 400 });
    }

    setPartyState(partyStateToSet as PartyState);
    return NextResponse.json({ ok: true, partyState: getPartyState() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}