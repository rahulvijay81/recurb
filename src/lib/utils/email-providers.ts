export interface EmailProvider {
  name: string;
  authUrl: string;
  scopes: string[];
}

export const EMAIL_PROVIDERS: Record<string, EmailProvider> = {
  gmail: {
    name: "Gmail",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"]
  },
  outlook: {
    name: "Outlook",
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scopes: ["https://graph.microsoft.com/mail.read"]
  }
};

export interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  body: string;
  date: Date;
}

export async function fetchGmailMessages(accessToken: string): Promise<EmailMessage[]> {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subscription OR billing OR payment OR renewal&maxResults=50`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  
  if (!response.ok) throw new Error("Failed to fetch Gmail messages");
  
  const data = await response.json();
  const messages: EmailMessage[] = [];
  
  for (const msg of data.messages || []) {
    const msgResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    
    if (msgResponse.ok) {
      const msgData = await msgResponse.json();
      const headers = msgData.payload.headers;
      
      messages.push({
        id: msg.id,
        subject: headers.find((h: any) => h.name === "Subject")?.value || "",
        from: headers.find((h: any) => h.name === "From")?.value || "",
        body: extractEmailBody(msgData.payload),
        date: new Date(parseInt(msgData.internalDate))
      });
    }
  }
  
  return messages;
}

export async function fetchOutlookMessages(accessToken: string): Promise<EmailMessage[]> {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages?$filter=contains(subject,'subscription') or contains(subject,'billing') or contains(subject,'payment')&$top=50`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  
  if (!response.ok) throw new Error("Failed to fetch Outlook messages");
  
  const data = await response.json();
  
  return data.value.map((msg: any) => ({
    id: msg.id,
    subject: msg.subject,
    from: msg.from.emailAddress.address,
    body: msg.body.content,
    date: new Date(msg.receivedDateTime)
  }));
}

function extractEmailBody(payload: any): string {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString();
  }
  
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString();
      }
    }
  }
  
  return "";
}