import { getReport } from '../../src/lib/grader/storage.js';

export default async (request: Request) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://sellontube.com',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  const url = new URL(request.url);
  const reportId = url.searchParams.get('id');

  if (!reportId || reportId.length < 3) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid report ID.' }),
      { status: 400, headers }
    );
  }

  const snapshot = await getReport(reportId);

  if (!snapshot) {
    return new Response(
      JSON.stringify({ error: 'Report not found or expired. Reports are available for 30 days after creation.' }),
      { status: 404, headers }
    );
  }

  return new Response(JSON.stringify(snapshot), { status: 200, headers });
};
