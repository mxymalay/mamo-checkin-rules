import {readFile,readdir} from 'node:fs/promises';
import {createPublicKey,verify} from 'node:crypto';
import assert from 'node:assert/strict';
import {validateRule} from '../toolkit/format.js';

const root=new URL('../',import.meta.url),raw=await readFile(new URL('official/latest.json',root));
assert.ok(raw.length<=512*1024,'Official release exceeds byte budget');
const envelope=JSON.parse(raw),key=JSON.parse(await readFile(new URL('official/public-key.json',root),'utf8'));
assert.deepEqual(Object.keys(envelope).sort(),['keyId','payload','signature']);assert.equal(envelope.keyId,key.keyId);
assert.ok(verify('sha256',Buffer.from(envelope.payload),{key:createPublicKey({key:key.jwk,format:'jwk'}),dsaEncoding:'ieee-p1363'},Buffer.from(envelope.signature,'base64')),'Invalid official signature');
const release=JSON.parse(envelope.payload);assert.equal(release.schemaVersion,1);assert.equal(release.engineVersion,1);assert.ok(Number.isSafeInteger(release.sequence)&&release.sequence>0);
assert.deepEqual(Object.keys(release).sort(),['engineVersion','publishedAt','rules','schemaVersion','sequence','version']);
assert.ok(release.rules.length>=3&&release.rules.length<=100);assert.match(release.version,/^\d+\.\d+\.\d+$/);assert.ok(Number.isFinite(Date.parse(release.publishedAt)));
const assignments=new Set(),ids=new Set();
for(const rule of release.rules){validateRule(rule,{builtin:true});assert.match(rule.id,/^builtin\./);assert.ok(!ids.has(rule.id));ids.add(rule.id);for(const course of rule.courses){const key=rule.source+':'+course;assert.ok(!assignments.has(key));assignments.add(key);}}
for(const source of ['gmail','moodle','ed'])assert.equal(release.rules.find(rule=>rule.id==='builtin.'+source&&rule.source===source)?.courses.length,0);
const files=[];async function collect(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const url=new URL(entry.name+(entry.isDirectory()?'/':''),dir);if(entry.isDirectory())await collect(url);else if(entry.name.endsWith('.json'))files.push(JSON.parse(await readFile(url,'utf8')));}}
await collect(new URL('builtin/',root));const ordered=list=>[...list].sort((a,b)=>a.id.localeCompare(b.id));assert.deepEqual(ordered(release.rules),ordered(files),'Sign a new release after changing official rule files');
assert.deepEqual(await readFile(new URL(`official/releases/${release.sequence}.json`,root)),raw,'Archive and latest release differ');
console.log(`Verified official release ${release.version} (sequence ${release.sequence}), ${release.rules.length} rules.`);
