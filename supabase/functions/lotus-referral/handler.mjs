// Bundle with scripts/build-referral-edge.mjs before deploying.
import { submissionSchema } from '../../../lib/validation.ts';
import { summarize, searchable } from '../../../lib/form.ts';
const allowed = new Set(['https://lotusfoundation.info','https://www.lotusfoundation.info']);
Deno.serve(async req => {
  const origin = req.headers.get('origin');
  const headers = {'Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
  if (allowed.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  const reply = (data,status=200) => Response.json(data,{status,headers});
  if (!allowed.has(origin)) return reply({error:'Please use the Foundation referral form.'},403);
  if(req.method==='OPTIONS') return new Response(null,{status:204,headers});
  if(req.method!=='POST') return reply({error:'Method not allowed'},405);
  const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  async function rpc(name, body) {
    const r=await fetch(Deno.env.get('SUPABASE_URL')+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(!r.ok) throw Error('Database operation failed');
    return r.json();
  }
  try {
    const ip=req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() || 'unknown';
    const enc=new TextEncoder();
    const hmac=await crypto.subtle.importKey('raw',enc.encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);
    const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',hmac,enc.encode('lotus-submit:'+ip)));
    const bucket=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
    if(!await rpc('lf_allow_request',{p_key:bucket,p_max:15,p_seconds:3600})) return reply({error:'Too many attempts. Please try again later.'},429);
    const reader=req.body?.getReader(); if(!reader) return reply({error:'Missing answers.'},400);
    const decoder=new TextDecoder(); let size=0,raw='';
    for(;;) { const {done,value}=await reader.read(); if(done) break; size+=value.length; if(size>250000) {await reader.cancel();return reply({error:'Submission too large.'},413);} raw+=decoder.decode(value,{stream:true}); }
    let body; try {body=JSON.parse(raw+decoder.decode());} catch {return reply({error:'Invalid submission.'},400);}
    const parsed=submissionSchema.safeParse(body);
    if(!parsed.success) return reply({error:parsed.error.issues[0]?.message || 'Please review your answers.'},400);
    const {requestId,answers}=parsed.data, summary=summarize(answers);
    const rows=await rpc('lf_submit',{p_request:requestId,p_name:summary.name,p_location:summary.location,p_needs:summary.needs,p_answers:answers,p_search:searchable(answers)});
    if(!rows?.[0]?.case_number) throw Error('No receipt');
    return reply({caseNumber:rows[0].case_number});
  } catch { return reply({error:'We could not confirm your referral. Keep this page open and try again.'},503); }
});
