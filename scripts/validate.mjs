import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {runValidation} from '../toolkit/validate.mjs';
import {validateCatalog} from './catalog.mjs';
const root=new URL('../',import.meta.url),toolkit=new URL('../toolkit/',import.meta.url);
const tests=spawnSync(process.execPath,['--test','scripts/catalog.test.mjs'],{cwd:root,stdio:'inherit'});
if(tests.error)throw tests.error;
if(tests.status!==0)throw new Error('Catalog regression tests failed');
const manifest=JSON.parse(await readFile(new URL('manifest.json',toolkit),'utf8'));
for(const [path,hash] of Object.entries(manifest.files)){
 if(!/^toolkit\/[a-z.-]+$/.test(path))throw new Error('Invalid manifest path');
 if(createHash('sha256').update(await readFile(new URL(path,root))).digest('hex')!==hash)throw new Error('Toolkit checksum mismatch: '+path);
}
const files=new Map();
for(const name of (await readdir(new URL('examples/',root))).filter(n=>n.endsWith('.json')).sort()){
 if(!/^[a-z0-9-]+\.json$/.test(name))throw new Error('Invalid example filename: '+name);
 const result=await runValidation(new URL('examples/'+name,root),new URL('fixtures/'+name.replace(/\.json$/,'')+'/',root),toolkit);
 files.set('examples/'+name,await readFile(new URL('examples/'+name,root)));
 console.log(`PASS ${result.id}: ${result.fixtures} fixtures`);
}
const count=validateCatalog(JSON.parse(await readFile(new URL('catalog.json',root),'utf8')),files);
console.log(`PASS catalog: ${count} validated examples, raw SHA-256 and metadata verified`);
