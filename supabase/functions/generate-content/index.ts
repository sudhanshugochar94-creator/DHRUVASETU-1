// ====================================================================
// SIH26063: Supabase Edge Function - AI Science Outreach Generator
// Powered by xAI / Grok API
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface GenerateContentPayload {
  sourceTitle?: string;
  sourceDescription?: string;
  sourceType?: string;
  region?: string;
  contentType?: string;
  targetAudience?: string;
  tone?: string;
  platform?: string;
  additionalContext?: string;
}

interface AIResponseSchema {
  title: string;
  short_summary: string;
  main_content: string;
  social_caption: string;
  hashtags: string[];
  source_notes: string[];
}

const XAI_API_ENDPOINT = 'https://api.x.ai/v1/chat/completions';
const PRIMARY_MODEL = 'grok-2-latest';
const FALLBACK_MODEL = 'grok-beta';

Deno.serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Only POST is supported.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 1. Check for xAI API Key in Edge Function Secrets
    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    if (!xaiApiKey) {
      console.warn('[AI Edge Function] XAI_API_KEY secret is not set in Supabase environment.');
      return new Response(
        JSON.stringify({
          error: 'XAI_API_KEY is not configured in Supabase Edge Function environment secrets. Please configure the XAI_API_KEY secret in the Supabase Dashboard or CLI before invoking live generation.',
          code: 'MISSING_XAI_API_KEY'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Parse & Validate Payload
    let payload: GenerateContentPayload;
    try {
      payload = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body in request.', code: 'INVALID_JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      sourceTitle,
      sourceDescription = '',
      sourceType = 'Scientific Resource',
      region = 'Antarctica',
      contentType = 'Website article',
      targetAudience = 'General Public',
      tone = 'Public Friendly',
      platform = 'Portal Website',
      additionalContext = ''
    } = payload;

    if (!sourceTitle || sourceTitle.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: sourceTitle', code: 'MISSING_REQUIRED_FIELD' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Construct System Prompt & Instructions
    const systemPrompt = `You are the Lead Science Communications Officer for the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences (MoES), Government of India.
Your mission is to transform verified polar scientific documentation—expedition field reports, in-situ datasets, glaciological cores, oceanographic CTD transects, and peer-reviewed publications—into engaging, factually grounded outreach copy.

RULES:
1. Ground every statement strictly in real polar science and Indian polar initiatives (e.g. Maitri, Bharati stations in Antarctica; Himadri station in Ny-Ålesund, Svalbard, Arctic; Himansh station in Western Himalaya; and Southern Ocean cruises).
2. Adhere rigorously to the requested Content Type, Target Audience, and Tone.
3. Output MUST BE strictly valid JSON conforming exactly to the specified schema, with no surrounding markdown or explanation outside the JSON object.

JSON SCHEMA:
{
  "title": "Engaging and scientifically accurate headline",
  "short_summary": "1-2 sentence executive summary / outreach hook",
  "main_content": "Comprehensive and well-structured body text (with subsections, bullet points, or paragraphs appropriate to format)",
  "social_caption": "Punchy caption formatted for social dissemination with emojis and call to action",
  "hashtags": ["#PolarScience", "#NCPOR", "#MoES", "#IndiaAtPoles"],
  "source_notes": ["Official citation and attribution referencing the primary material"]
}`;

    const userPrompt = `Generate a scientifically grounded polar outreach piece with the following parameters:

- Source Title: "${sourceTitle}"
- Source Type: "${sourceType}"
- Polar Region: "${region}"
- Source Details / Excerpt: "${sourceDescription || 'Archived scientific record from NCPOR Polar Data Repository.'}"
- Requested Content Type: "${contentType}"
- Target Audience: "${targetAudience}"
- Tone of Voice: "${tone}"
- Target Platform: "${platform}"
${additionalContext ? `- Additional Context / Directives: "${additionalContext}"` : ''}

Synthesize the content now and return ONLY the structured JSON response conforming to the schema.`;

    // 4. Request xAI / Grok API with Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

    let xaiResponse: Response;
    try {
      xaiResponse = await fetch(XAI_API_ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${xaiApiKey.trim()}`
        },
        body: JSON.stringify({
          model: PRIMARY_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      const isAbort = fetchErr instanceof DOMException && fetchErr.name === 'AbortError';
      const errMsg = isAbort ? 'Request to xAI Grok API timed out after 45 seconds.' : String(fetchErr);
      return new Response(
        JSON.stringify({ error: errMsg, code: isAbort ? 'GATEWAY_TIMEOUT' : 'NETWORK_ERROR' }),
        { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    // Fallback model trial if primary model is unavailable
    if (xaiResponse.status === 404 || xaiResponse.status === 400) {
      const errText = await xaiResponse.text();
      console.warn(`[AI Edge Function] Primary model ${PRIMARY_MODEL} returned ${xaiResponse.status}, retrying with ${FALLBACK_MODEL}:`, errText);
      
      const retryController = new AbortController();
      const retryTimeout = setTimeout(() => retryController.abort(), 45000);
      try {
        xaiResponse = await fetch(XAI_API_ENDPOINT, {
          method: 'POST',
          signal: retryController.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${xaiApiKey.trim()}`
          },
          body: JSON.stringify({
            model: FALLBACK_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.3
          })
        });
      } catch (retryErr) {
        clearTimeout(retryTimeout);
        return new Response(
          JSON.stringify({ error: `xAI fallback call failed: ${String(retryErr)}`, code: 'AI_FALLBACK_FAILED' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } finally {
        clearTimeout(retryTimeout);
      }
    }

    if (!xaiResponse.ok) {
      const errBody = await xaiResponse.text();
      console.error(`[AI Edge Function] xAI API responded with HTTP ${xaiResponse.status}:`, errBody);
      return new Response(
        JSON.stringify({
          error: `xAI API returned error (HTTP ${xaiResponse.status}): ${errBody}`,
          code: 'XAI_API_ERROR',
          status: xaiResponse.status
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Parse and Validate AI Completion
    const completion = await xaiResponse.json();
    const rawContent = completion.choices?.[0]?.message?.content;

    if (!rawContent) {
      return new Response(
        JSON.stringify({ error: 'xAI returned an empty completion content.', code: 'EMPTY_AI_RESPONSE' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract JSON (stripping optional markdown ```json ... ``` wrapper if present)
    let parsed: AIResponseSchema;
    try {
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const cleanJson = jsonMatch ? jsonMatch[1] : rawContent.trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error('[AI Edge Function] Failed to parse JSON from AI response:', rawContent);
      return new Response(
        JSON.stringify({
          error: `Failed to parse structured JSON from xAI response: ${String(parseErr)}`,
          raw_output: rawContent,
          code: 'MALFORMED_AI_JSON'
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure all required fields are present with fallbacks
    const structuredResult: AIResponseSchema = {
      title: parsed.title || sourceTitle,
      short_summary: parsed.short_summary || '',
      main_content: parsed.main_content || '',
      social_caption: parsed.social_caption || parsed.short_summary || '',
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['#PolarScience', '#NCPOR', '#MoES'],
      source_notes: Array.isArray(parsed.source_notes) && parsed.source_notes.length > 0 
        ? parsed.source_notes 
        : [`Primary Source: ${sourceTitle} (${region})`, 'Archived at NCPOR Polar Knowledge Gateway']
    };

    return new Response(
      JSON.stringify({
        data: structuredResult,
        model: completion.model || PRIMARY_MODEL,
        usage: completion.usage || null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    console.error('[AI Edge Function] Unhandled error:', err);
    return new Response(
      JSON.stringify({ error: `Internal edge function error: ${String(err)}`, code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
