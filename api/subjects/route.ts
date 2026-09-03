import type { IncomingMessage, ServerResponse } from "http";

// In-memory array of subjects
const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Computer Science"];

// Helper function to read the incoming JSON data stream safely
async function getRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Set JSON content response headers natively
  res.setHeader("Content-Type", "application/json");

  // 1. Handle GET Request (Fetch all subjects)
  if (req.method === "GET") {
    res.statusCode = 200;
    return res.end(JSON.stringify(subjects));
  }

  // 2. Handle POST Request (Add a new subject)
  if (req.method === "POST") {
    const newSubject = await getRequestBody(req);
    if (newSubject && typeof newSubject === "string") {
      subjects.push(newSubject);
      res.statusCode = 201;
      return res.end(JSON.stringify(subjects));
    }
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Invalid subject data" }));
  }

  // 3. Handle PUT Request (Edit an existing subject)
  if (req.method === "PUT") {
    const { index, subject } = await getRequestBody(req);
    if (typeof index === "number" && index >= 0 && index < subjects.length) {
      subjects[index] = subject;
      res.statusCode = 200;
      return res.end(JSON.stringify(subjects));
    }
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Invalid index or subject data" }));
  }

  // 4. Handle DELETE Request (Remove a subject)
  if (req.method === "DELETE") {
    const { index } = await getRequestBody(req);
    if (typeof index === "number" && index >= 0 && index < subjects.length) {
      subjects.splice(index, 1);
      res.statusCode = 200;
      return res.end(JSON.stringify(subjects));
    }
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Invalid index" }));
  }

  // Fallback for unhandled HTTP methods
  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  res.statusCode = 405;
  return res.end(JSON.stringify({ error: `Method ${req.method} Not Allowed` }));
}
