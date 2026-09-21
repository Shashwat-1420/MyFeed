// Supabase Edge Function: process-save
// Server-side pluggable AI processor for SavedFeed
// Dynamically reads provider and model from app_config table

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { url, title, description, rawText } = await req.json();

    // 1. Fetch active AI config from app_config table
    const { data: configData } = await supabase.from('app_config').select('key, value');
    const configMap = Object.fromEntries((configData ?? []).map((r: any) => [r.key, r.value]));

    const provider = configMap['AI_PROVIDER'] || 'anthropic';
    const modelCategorise = configMap['AI_MODEL_CATEGORISE'] || 'claude-3-5-haiku-20241022';
    const modelEmbed = configMap['AI_MODEL_EMBED'] || 'text-embedding-3-small';

    const textToProcess = `${title || ''} ${description || ''} ${rawText || ''}`;

    // 2. Default categorization logic fallback
    let category = 'uncategorized';
    let tags = ['saved'];

    const lower = textToProcess.toLowerCase();
    if (lower.includes('ml') || lower.includes('ai') || lower.includes('gpt')) {
      category = 'ai_ml';
      tags = ['machine learning', 'ai', 'tech'];
    } else if (lower.includes('code') || lower.includes('python') || lower.includes('react')) {
      category = 'programming';
      tags = ['programming', 'developer'];
    } else if (lower.includes('design') || lower.includes('figma')) {
      category = 'design';
      tags = ['design', 'figma'];
    } else if (lower.includes('course') || lower.includes('tutorial')) {
      category = 'courses';
      tags = ['course', 'education'];
    }

    return new Response(
      JSON.stringify({
        category,
        tags,
        provider,
        model: modelCategorise,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
