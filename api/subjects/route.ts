import { VercelRequest, VercelResponse } from "@vercel/node";

// In-memory array of subjects
const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Computer Science"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Handle GET Request (Fetch all subjects)
  if (req.method === 'GET') {
    return res.status(200).json(subjects);
  }

  // 2. Handle POST Request (Add a new subject)
  if (req.method === 'POST') {
    const newSubject = req.body;
    if (newSubject && typeof newSubject === 'string') {
      subjects.push(newSubject);
      return res.status(201).json(subjects);
    }
    return res.status(400).json({ error: "Invalid subject data" });
  }

  // 3. Handle PUT Request (Edit an existing subject)
  if (req.method === 'PUT') {
    const { index, subject } = req.body || {};
    if (typeof index === 'number' && index >= 0 && index < subjects.length) {
      subjects[index] = subject;
      return res.status(200).json(subjects);
    }
    return res.status(400).json({ error: "Invalid index or subject data" });
  }

  // 4. Handle DELETE Request (Remove a subject)
  if (req.method === 'DELETE') {
    const { index } = req.body || {};
    if (typeof index === 'number' && index >= 0 && index < subjects.length) {
      subjects.splice(index, 1);
      return res.status(200).json(subjects);
    }
    return res.status(400).json({ error: "Invalid index" });
  }

  // Fallback for unhandled HTTP methods
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
