import nodemailer from 'nodemailer';
import { MatchResult, ProcessResponse } from '@shared/schema';

export async function sendAlertEmail(response: ProcessResponse) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const alertEmail = process.env.ALERT_EMAIL;

  if (!user || !pass || !alertEmail) {
    console.warn("Email secrets not configured. Skipping email alert.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });

  const matches = response.matches.filter(m => m.isMatch);
  if (matches.length === 0) return;

  let htmlContent = `<h2>Inmate Match Alert</h2>
    <p><strong>Document Type:</strong> ${response.documentType} (Confidence: ${(response.typeConfidence * 100).toFixed(1)}%)</p>
    <hr/>
    <h3>Matches:</h3>
    <ul>
  `;

  for (const match of matches) {
    htmlContent += `
      <li>
        <strong>PDF Name:</strong> ${match.pdfName} <br/>
        <strong>Matched Roster Name:</strong> ${match.matchedName} <br/>
        <strong>Confidence:</strong> ${(match.confidence! * 100).toFixed(1)}% <br/>
        ${match.inmateDetails?.photoUrl ? `<img src="${match.inmateDetails.photoUrl}" alt="Photo" width="150" />` : ''}
      </li>
      <br/>
    `;
  }

  htmlContent += `</ul>`;

  const mailOptions = {
    from: user,
    to: alertEmail,
    subject: `Inmate Match Alert - ${matches.length} matches found`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Alert email sent successfully.");
  } catch (error) {
    console.error("Error sending alert email:", error);
  }
}
