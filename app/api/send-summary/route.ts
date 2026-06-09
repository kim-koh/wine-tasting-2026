import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type WineRow = {
  wineName: string;
  winery?: string;
  year?: string | number;
  origin?: string;
  varietals?: string;
  pictureUrl?: string;
  rating?: number;
  notes?: string;
};

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stars(n?: number) {
  if (!n || n <= 0) return "Not rated";
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function buildHtml(rows: WineRow[], photosLink?: string) {
  const items = rows
    .map((w, i) => {
      return `
        <div style="margin:0 0 18px 0;padding:12px;border:1px solid #ddd;border-radius:8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td style="vertical-align:top;padding-right:12px;">
                <h3 style="margin:0 0 8px 0;">${i + 1}. ${escapeHtml(w.wineName)}</h3>
                ${w.winery ? `<div><b>Producer:</b> ${escapeHtml(w.winery)}</div>` : ""}
                ${w.varietals ? `<div><b>Varietal:</b> ${escapeHtml(w.varietals)}</div>` : ""}
                ${w.year ? `<div><b>Vintage:</b> ${escapeHtml(String(w.year))}</div>` : ""}
                ${w.origin ? `<div><b>Region:</b> ${escapeHtml(w.origin)}</div>` : ""}
                <div><b>Rating:</b> ${escapeHtml(stars(w.rating))}</div>
                <div><b>Notes:</b> ${escapeHtml(w.notes?.trim() || "No notes added.")}</div>
              </td>
              ${
                w.pictureUrl
                  ? `<td style="vertical-align:top;text-align:right;width:120px;">
                       <img src="${escapeHtml(w.pictureUrl)}" alt="${escapeHtml(w.wineName)}" style="display:block;max-width:100px;max-height:120px;border-radius:6px;margin-left:auto;" />
                     </td>`
                  : ""
              }
            </tr>
          </table>
        </div>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.4;color:#222;">
      <p>Hi there!</p>
      <p>Here's your personal summary from tonight's wine tasting.</p>
      <p>Please view and upload photos from the event here: <a href="${escapeHtml(process.env.GOOGLE_PHOTOS_ALBUM_LINK || "")}">2026 Wine Tasting</a></p>
      ${items}
      <p>Cheers! 🥂</p>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const { recipientEmail, rows, photosLink } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    if (!recipientEmail || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Kim & Calvin Wine Night <onboarding@resend.dev>",
      to: recipientEmail,
      subject: "✨Wine Tasting Night✨ — Your Summary",
      html: buildHtml(rows, photosLink),
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    console.log("Email sent:", result.data?.id);
    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (e) {
    console.error("send-summary route error:", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}