import { getPartyState, subscribePartyState } from "@/lib/partyStateStore";

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (state: string) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ partyState: state })}\n\n`));
      };

      send(getPartyState()); // initial payload
      const unsubscribe = subscribePartyState((state) => send(state));

      req.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}