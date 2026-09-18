// AI service module — Google Gemini edition.
//
// Replaces the z-ai-web-dev-sdk with @google/generative-ai so the project
// runs on any machine (not just inside the Z.ai sandbox).
//
// Setup:
//   1. npm install @google/generative-ai
//   2. Get a free API key from https://aistudio.google.com/app/apikey
//   3. Add to backend/.env:  GEMINI_API_KEY=AIzaSy...your-key
//
// The free tier allows 15 requests/minute — plenty for a dev/demo environment.

const { GoogleGenerativeAI } = require('@google/generative-ai');

let _genAI = null;
let _model = null;

function getModel() {
  if (_model) return _model;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in backend/.env. Get a free key from https://aistudio.google.com/app/apikey');
  }
  _genAI = new GoogleGenerativeAI(apiKey);
  // Model is configurable via env var. Defaults to gemini-1.5-flash (free tier).
  // Other options:
  //   gemini-1.5-flash-8b   — even faster, smaller free quota
  //   gemini-1.5-pro         — higher quality, lower free quota (2 req/min)
  //   gemini-2.0-flash-exp  — Gemini 2.0 Flash (experimental, free)
  //   gemini-2.5-flash       — Gemini 2.5 Flash (newest, if available on your key)
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  _model = _genAI.getGenerativeModel({ model: modelName });
  return _model;
}

// Helper: call Gemini and extract the text response.
async function generate(prompt, systemInstruction) {
  const model = getModel();
  const fullPrompt = systemInstruction
    ? `${systemInstruction}\n\n${prompt}`
    : prompt;

  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();
  return text;
}

// Helper: call Gemini and parse the response as JSON.
// Gemini sometimes wraps JSON in ```json fences — we strip those.
async function generateJSON(prompt, systemInstruction) {
  const raw = await generate(prompt, systemInstruction);
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return { _raw: raw, _parseError: 'Could not parse JSON' };
  }
}

// ---------------------------------------------------------------------------
// 1. Training Program Impact Analysis
// ---------------------------------------------------------------------------

async function analyzeTrainingProgram(program, placementCount, companyDemandCount) {
  const systemInstruction = `You are an expert skills economist for the Indian technical education ecosystem.
You analyze training programs and produce a structured impact assessment.

You ALWAYS respond with valid JSON only (no markdown, no prose outside JSON) with this exact shape:
{
  "techAlignmentScore": <number 0-100>,
  "techAlignmentReasoning": "<string>",
  "overallImpact": "<string: HIGH | MODERATE | LOW>",
  "summary": "<2-3 sentence summary>",
  "recommendations": ["<string>", "<string>", ...]
}`;

  const prompt = `Analyze this training program:

Title: ${program.title}
Provider: ${program.provider || 'N/A'}
Description: ${program.description || 'N/A'}
Duration: ${program.durationWeeks || 'N/A'} weeks
Skills taught: ${program.taughtSkills.map((s) => s.name).join(', ')}
Tech focus areas: ${program.techFocusAreas.join(', ') || 'N/A'}

Hard metrics:
- Trainees placed in jobs after this training: ${placementCount}
- Companies currently hiring for these skills (active drives): ${companyDemandCount}

Score the program's alignment with upcoming/emerging technology trends (AI/ML, Cloud Native, Web3, Quantum, Edge Computing, Sustainable Tech, etc.) on a scale of 0-100, where 100 means perfectly aligned with the most in-demand emerging tech and 0 means completely obsolete.

Then provide an overall impact rating, a summary, and 3-5 actionable recommendations for improving the program.

Respond with JSON only.`;

  const result = await generateJSON(prompt, systemInstruction);
  return {
    techAlignmentScore: result.techAlignmentScore ?? 0,
    techAlignmentReasoning: result.techAlignmentReasoning || '',
    overallImpact: result.overallImpact || 'UNKNOWN',
    summary: result.summary || '',
    recommendations: result.recommendations || []
  };
}

// ---------------------------------------------------------------------------
// 2. Job Discovery via a configured provider
// ---------------------------------------------------------------------------

const JOB_CACHE_TTL_MS = 5 * 60 * 1000;
const JOB_RESULT_LIMIT = 20;
const jobCache = new Map();

function cleanText(value, maxLength = 2000) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function validHttpUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function normalizedJobKey(job) {
  const normalize = (value) => cleanText(value, 200).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return job.url || `${normalize(job.title)}|${normalize(job.company)}`;
}

function matchJobToSkills(job, skills) {
  const searchableText = `${job.title} ${job.description}`
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .replace(/[.#]+/g, ' ');
  const matchedSkills = [];
  const missingSkills = [];

  skills.forEach((skill) => {
    const name = cleanText(skill.name, 80);
    if (!name) return;
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').replace(/[.#]+/g, ' ').trim();
    const matched = Boolean(normalizedName) && searchableText.includes(normalizedName);
    (matched ? matchedSkills : missingSkills).push(name);
  });

  const matchPercentage = skills.length
    ? Math.round((matchedSkills.length / skills.length) * 100)
    : 0;
  return { matchPercentage, matchedSkills, missingSkills };
}

function normalizeJob(raw, skills, source) {
  const job = {
    title: cleanText(raw?.title || raw?.name || 'Untitled job', 180),
    company: cleanText(raw?.company?.display_name || raw?.company?.name || raw?.company || 'Company not listed', 160),
    location: cleanText(raw?.location?.display_name || raw?.location?.name || raw?.location || 'Location not listed', 160),
    description: cleanText(raw?.description || raw?.snippet || raw?.summary || '', 2400),
    url: validHttpUrl(raw?.redirect_url || raw?.url || raw?.link),
    source: cleanText(raw?.source || source || 'Job provider', 80),
    postedDate: cleanText(raw?.created || raw?.postedDate || raw?.date || '', 80),
    employmentType: cleanText(raw?.contract_type || raw?.employmentType || raw?.job_type || 'Not specified', 80),
    salary: cleanText(raw?.salary || (raw?.salary_min || raw?.salary_max
      ? `${raw.salary_min || ''}${raw.salary_min && raw.salary_max ? ' - ' : ''}${raw.salary_max || ''} ${raw.salary_currency || ''}`
      : ''), 120)
  };

  if (!job.url || !job.title) return null;
  return { id: cleanText(raw?.id || job.url, 200), ...job, ...matchJobToSkills(job, skills) };
}

function fallbackJobs(skills, location) {
  const skillNames = skills.map((skill) => cleanText(skill.name, 80)).filter(Boolean);
  const query = skillNames.slice(0, 3).join(' ') || 'technology';
  const encodedQuery = encodeURIComponent(query);
  const encodedLocation = encodeURIComponent(cleanText(location, 100) || 'India');
  const boards = [
    ['LinkedIn', `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=${encodedLocation}`],
    ['Naukri', `https://www.naukri.com/${encodedQuery}-jobs-in-${encodedLocation}`],
    ['Indeed', `https://www.indeed.co.in/jobs?q=${encodedQuery}&l=${encodedLocation}`],
    ['Foundit', `https://www.foundit.in/srp/results?query=${encodedQuery}&location=${encodedLocation}`]
  ];

  return boards.map(([source, url]) => {
    const job = normalizeJob({
      id: `fallback-${source.toLowerCase()}`,
      title: `${skillNames.slice(0, 2).join(' / ') || 'Technology'} jobs on ${source}`,
      company: source,
      location,
      description: `Search current ${query} openings in ${location} on ${source}.`,
      url,
      source,
      postedDate: new Date().toISOString(),
      employmentType: 'Search results'
    }, skills, source);
    return { ...job, isFallback: true };
  });
}

function providerConfig() {
  const provider = (process.env.JOB_SEARCH_PROVIDER || '').trim().toLowerCase();
  const apiKey = (process.env.JOB_SEARCH_API_KEY || '').trim();
  const apiUrl = (process.env.JOB_SEARCH_API_URL || '').trim();
  if (!provider || !apiKey || !apiUrl) return null;
  return { provider, apiKey, apiUrl };
}

async function fetchProviderJobs(skills, location, config) {
  const query = skills.map((skill) => cleanText(skill.name, 80)).filter(Boolean).slice(0, 8).join(' ');
  const url = new URL(config.apiUrl);
  let headers = { Accept: 'application/json' };

  if (config.provider === 'adzuna') {
    // Adzuna accepts app_id and app_key. JOB_SEARCH_API_KEY may be "id:key".
    const [appId, appKey] = config.apiKey.includes(':') ? config.apiKey.split(':', 2) : ['', config.apiKey];
    if (process.env.JOB_SEARCH_API_ID || appId) url.searchParams.set('app_id', process.env.JOB_SEARCH_API_ID || appId);
    url.searchParams.set('app_key', appKey);
    url.searchParams.set('what', query);
    url.searchParams.set('where', cleanText(location, 100));
    url.searchParams.set('results_per_page', String(JOB_RESULT_LIMIT));
  } else {
    url.searchParams.set('q', query);
    url.searchParams.set('location', cleanText(location, 100));
    headers = { ...headers, Authorization: `Bearer ${config.apiKey}` };
  }

  const response = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Job provider returned ${response.status}`);
  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : (payload.results || payload.jobs || payload.data || []);
  if (!Array.isArray(rows)) throw new Error('Job provider returned an invalid result list');
  return rows.map((row) => normalizeJob(row, skills, config.provider)).filter(Boolean);
}

async function discoverJobsForSkills(skills, location = 'India') {
  const safeSkills = (Array.isArray(skills) ? skills : [])
    .map((skill) => ({ name: cleanText(skill?.name, 80), score: Number(skill?.score) || 0 }))
    .filter((skill) => skill.name);
  const safeLocation = cleanText(location, 100) || 'India';
  if (safeSkills.length === 0) return { jobs: [], insight: '', providerError: '' };

  const cacheKey = JSON.stringify({ skills: safeSkills.map((skill) => skill.name.toLowerCase()).sort(), location: safeLocation.toLowerCase() });
  const cached = jobCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const config = providerConfig();
  let jobs;
  let providerError = '';
  if (config) {
    try {
      jobs = await fetchProviderJobs(safeSkills, safeLocation, config);
    } catch (error) {
      providerError = 'The configured job provider is temporarily unavailable. Showing search links instead.';
      jobs = [];
    }
  } else {
    providerError = 'No job provider is configured. Showing search links instead.';
    jobs = [];
  }

  if (jobs.length === 0) jobs = fallbackJobs(safeSkills, safeLocation);
  const uniqueJobsByKey = new Map();
  jobs.forEach((job) => {
    const key = normalizedJobKey(job);
    const existing = uniqueJobsByKey.get(key);
    if (!existing || (job.description.length + job.company.length) > (existing.description.length + existing.company.length)) {
      uniqueJobsByKey.set(key, job);
    }
  });
  const uniqueJobs = [...uniqueJobsByKey.values()].slice(0, JOB_RESULT_LIMIT);
  let insight = '';
  try {
    insight = await generate(`A candidate has these verified skills: ${safeSkills.map((skill) => skill.name).join(', ')}.\nThey are looking for jobs in ${safeLocation}. In 2-3 sentences, give a brief market insight about likely roles and demand outlook. Respond with plain prose, no JSON.`);
  } catch {
    // Job results remain useful when Gemini is unavailable or rate-limited.
  }

  const value = { jobs: uniqueJobs, insight, providerError };
  jobCache.set(cacheKey, { value, expiresAt: Date.now() + JOB_CACHE_TTL_MS });
  return value;
}

// ---------------------------------------------------------------------------
// 3. Course Discovery
// ---------------------------------------------------------------------------
// Same approach — build curated search URLs for SWAYAM / NPTEL / Coursera.

async function discoverCoursesForGaps(gapSkills) {
  const boards = [
    {
      source: 'SWAYAM',
      buildUrl: (q) => `https://swayam.gov.in/explorer?action=Explore&keyword=${encodeURIComponent(q)}`
    },
    {
      source: 'NPTEL',
      buildUrl: (q) => `https://nptel.ac.in/course.html?topic=${encodeURIComponent(q)}`
    },
    {
      source: 'Coursera',
      buildUrl: (q) => `https://www.coursera.org/search?query=${encodeURIComponent(q)}`
    },
    {
      source: 'edX',
      buildUrl: (q) => `https://www.edx.org/search?q=${encodeURIComponent(q)}`
    },
    {
      source: 'Udemy',
      buildUrl: (q) => `https://www.udemy.com/courses/search/?q=${encodeURIComponent(q)}`
    }
  ];

  // Generate one set of results per gap skill so the student can drill in.
  const courses = [];
  for (const skill of gapSkills.slice(0, 5)) {
    for (const b of boards) {
      courses.push({
        title: `${skill} courses on ${b.source}`,
        url: b.buildUrl(skill),
        snippet: `Browse ${b.source} courses covering ${skill}. Filter by free/certified/NSQF-aligned as needed.`,
        source: b.source,
        date: new Date().toISOString()
      });
    }
  }

  // Ask Gemini for a brief learning-path recommendation
  let recommendation = '';
  try {
    const recPrompt = `A student has these skill gaps to bridge: ${gapSkills.join(', ')}.
In 2-3 sentences, recommend a logical learning order (which skill to learn first, second, etc.)
and mention any prerequisites. Respond with plain prose.`;
    recommendation = await generate(recPrompt);
  } catch {
    recommendation = '';
  }

  return { courses, recommendation };
}

// ---------------------------------------------------------------------------
// 4. Tech Trend Analysis
// ---------------------------------------------------------------------------

async function analyzeTechTrends(skillNames) {
  const systemInstruction = `You are a technology trend analyst with deep knowledge of the Indian IT job market.
Respond ONLY with valid JSON (no markdown fences, no prose outside JSON) in this exact shape:
{
  "overallRelevanceScore": <number 0-100>,
  "skillScores": [{ "skill": "<string>", "score": <number>, "reasoning": "<string>" }],
  "emergingSkillsToLearn": ["<string>", ...],
  "summary": "<string>"
}`;

  const prompt = `Score these skills against current and emerging technology trends for 2025-2026:
${skillNames.join(', ')}

For each skill, give:
- A score from 0-100 reflecting its current market demand + future growth trajectory
- A 1-sentence reasoning

Also provide:
- An overall relevance score (0-100) for the candidate's combined skill set
- 3-5 emerging skills they should consider learning next
- A 2-sentence summary

Respond with JSON only. Use your training knowledge — you do not need to search the web.`;

  const result = await generateJSON(prompt, systemInstruction);
  return {
    overallRelevanceScore: result.overallRelevanceScore ?? 0,
    skillScores: result.skillScores || [],
    emergingSkillsToLearn: result.emergingSkillsToLearn || [],
    summary: result.summary || ''
  };
}

module.exports = {
  analyzeTrainingProgram,
  discoverJobsForSkills,
  matchJobToSkills,
  normalizeJob,
  discoverCoursesForGaps,
  analyzeTechTrends
};
