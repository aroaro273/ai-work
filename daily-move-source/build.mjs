import {build} from 'esbuild';await build({entryPoints:['entry.tsx'],bundle:true,outdir:'dist',format:'esm',platform:'browser',minify:true,jsx:'automatic'});
