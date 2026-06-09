import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type SummaryRow = {
  wineName?: string;
  winery?: string;
  year?: string | number;
  origin?: string;
  varietals?: string;
  pictureUrl?: string;
  rating?: number;
  notes?: string;
};

type SendSummaryBody = {
  recipientEmail?: string;
  photosLink?: string;
  rows?: SummaryRow[];
};

function buildStars(rating?: number) {
  if (!rating || rating < 1) return "Not rated";
  return "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));
}

function cleanVarietals(input?: string) {
  if (!input) return "";
  return input
    .replace(/\\"/g, '"')   // \" -> "
    .replace(/\\'/g, "'")   // \' -> '
    .replace(/\\n/g, ", ")  // \n -> separator
    .replace(/\\r/g, " ")
    .replace(/\\t/g, " ")
    .replace(/\\\\/g, "\\") // \\ -> \
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SendSummaryBody;
    const recipientEmail = body.recipientEmail?.trim();
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const photosLink = body.photosLink?.trim();

    if (!recipientEmail) {
      return NextResponse.json({ error: "recipientEmail is required" }, { status: 400 });
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail);
    if (!isValidEmail) {
      return NextResponse.json({ error: "Invalid recipientEmail" }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;

    if (!host || !user || !pass || !from) {
      return NextResponse.json(
        { error: "Missing SMTP env vars (SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM)" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587
      auth: { user, pass },
    });

    const textLines: string[] = [];
    textLines.push("Hi there!");
    textLines.push("");
    textLines.push("Here's your personal summary from tonight's wine tasting.");
    textLines.push("");

    rows.forEach((row, i) => {
      textLines.push(`${i + 1}. ${row.wineName ?? "Unknown wine"}`);
      if (row.winery) textLines.push(`Producer: ${row.winery}`);
      if (row.varietals) textLines.push(`Varietal: ${cleanVarietals(row.varietals)}`);
      if (row.year) textLines.push(`Vintage: ${row.year}`);
      if (row.origin) textLines.push(`Region: ${row.origin}`);
      textLines.push(`Rating: ${buildStars(row.rating)}`);
      textLines.push(`Notes: ${row.notes?.trim() || "No notes added."}`);
      textLines.push("");
    });

    if (photosLink) {
      textLines.push(`Photos: ${photosLink}`);
      textLines.push("");
    }

    textLines.push("Cheers! 🥂");

    const htmlRows = rows
      .map(
        (row, i) => `
        <div style="margin:0 0 18px 0;padding:12px;border:1px solid #ddd;border-radius:8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td style="vertical-align:top;padding-right:12px;">
                <h3 style="margin:0 0 8px 0;">${i + 1}. ${escapeHtml(row.wineName || '')}</h3>
                ${row.winery ? `<div><b>Producer:</b> ${escapeHtml(row.winery)}</div>` : ""}
                ${row.varietals ? `<div><b>Varietal:</b> ${escapeHtml(row.varietals)}</div>` : ""}
                ${row.year ? `<div><b>Vintage:</b> ${escapeHtml(String(row.year))}</div>` : ""}
                ${row.origin ? `<div><b>Region:</b> ${escapeHtml(row.origin)}</div>` : ""}
                <div><b>Rating:</b> ${escapeHtml(buildStars(row.rating))}</div>
                <div><b>Notes:</b> ${escapeHtml(row.notes?.trim() || "No notes added.")}</div>
              </td>
              ${
                row.pictureUrl
                  ? `<td style="vertical-align:top;text-align:right;width:120px;">
                       <img src="${escapeHtml(row.pictureUrl)}" alt="${escapeHtml(row.wineName || '')}" style="display:block;max-width:100px;max-height:120px;border-radius:6px;margin-left:auto;" />
                     </td>`
                  : ""
              }
            </tr>
          </table>
        </div>
      `)
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.4;color:#222;">
        <p>Hi there!</p>
        <p>Here's your personal summary from tonight's wine tasting.</p>
        <p>Please view and upload photos from the event here: <a href="${escapeHtml(process.env.GOOGLE_PHOTOS_ALBUM_LINK || "")}">2026 Wine Tasting</a></p>
        ${htmlRows}
        <p>Cheers! 🥂</p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: recipientEmail,
      subject: "✨Wine Tasting Night✨ — Your Summary",
      text: textLines.join("\n"),
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send-summary error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}