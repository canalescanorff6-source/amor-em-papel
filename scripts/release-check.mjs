import { releaseReadiness } from './release-check-lib.mjs';
const preview=process.argv.includes('--preview');
const result=releaseReadiness(process.env);
console.log(result.ready?'✅ Produção pronta.':'⚠️  Ainda não está pronto para publicação definitiva.');
for(const blocker of result.blockers) console.log(`BLOCKER: ${blocker}`);
for(const warning of result.warnings) console.log(`WARNING: ${warning}`);
if(!result.ready&&!preview) process.exitCode=1;
