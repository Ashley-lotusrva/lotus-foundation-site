import {build} from 'esbuild';
await build({entryPoints:['supabase/functions/lotus-referral/handler.mjs'],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,outfile:'supabase/functions/lotus-referral/index.ts'});
