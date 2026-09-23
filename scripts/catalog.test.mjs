import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import * as catalogModule from './catalog.mjs';
import {validateRuleId} from '../toolkit/format.js';
import {readFile} from 'node:fs/promises';
import Ajv from 'ajv';

test('community toolkit and published schema reject reserved IDs without rejecting DEMO courses',async()=>{
 const schema=JSON.parse(await readFile(new URL('../schema/source-rule.v1.schema.json',import.meta.url)));
 const check=new Ajv().compile(schema.properties.id);
 for(const [id,code] of [[null,'id-type'],['','id-empty'],['a.'.padEnd(257,'a'),'id-length'],['Alice.Rule','id-format'],['alice..rule','id-format'],['alice-rule-','id-format'],['alice','id-format'],['alice.rule\n','id-format'],['demo.alice','id-reserved'],['alice.mydemo.rule','id-reserved'],['alice.builtin-rule','id-reserved'],['Alice.BUILTIN','id-reserved']]){
  assert.throws(()=>validateRuleId(id),e=>e.code===code&&e.path==='$.id');assert.equal(check(id),false);
 }
 assert.equal(validateRuleId('community.example.gmail-images'),'community.example.gmail-images');assert.equal(check('community.example.gmail-images'),true);
 const {catalog,files}=sample();assert.equal(validate(catalog,files),1);assert.deepEqual(catalog.rules[0].courses,['DEMO1000']);
});

const rule = {
  schemaVersion: 1,
  id: 'community.example.gmail-images',
  version: '1.0.0',
  name: {en: 'Synthetic Gmail example', zh_CN: 'Gmail demo', zh_TW: 'Gmail demo'},
  source: 'gmail',
  courses: ['DEMO1000'],
  images: {selectors: ['.summary img']},
};

function sample() {
  const raw = Buffer.from(JSON.stringify(rule) + '\n', 'utf8');
  const entry = {
    id: rule.id, version: rule.version, name: {...rule.name},
    source: rule.source, courses: [...rule.courses],
    path: 'examples/DEMO1000/demo-gmail.json', demo: true,
    sha256: createHash('sha256').update(raw).digest('hex'),
  };
  return {
    catalog: {schemaVersion: 1, rules: [entry]},
    files: new Map([[entry.path, raw]]),
  };
}

function validate(catalog, files) {
  assert.equal(typeof catalogModule.validateCatalog, 'function', 'catalogue validator is exported');
  return catalogModule.validateCatalog(catalog, files);
}

test('accepts matching metadata and the digest of the raw file', () => {
  const {catalog, files} = sample();
  assert.doesNotThrow(() => validate(catalog, files));
});
test('attribution is optional but must match the downloaded file exactly',()=>{
 const {catalog,files}=sample(),entry=catalog.rules[0];
 entry.author={name:'mxymalay',url:'https://github.com/mxymalay'};entry.sourceUrl='https://github.com/mxymalay/mamo-checkin-rules/blob/main/'+entry.path;
 const raw=Buffer.from(JSON.stringify({...rule,author:entry.author,sourceUrl:entry.sourceUrl})+'\n');
 files.set(entry.path,raw);entry.sha256=createHash('sha256').update(raw).digest('hex');
 assert.equal(validate(catalog,files),1);
 entry.author.name='Wrong author';assert.throws(()=>validate(catalog,files),/author mismatch/);
});
test('accepts course and shared folders but rejects a folder for another course',()=>{
 for(const folder of ['DEMO1000','shared']){
  const {catalog,files}=sample(),entry=catalog.rules[0],raw=files.get(entry.path);files.clear();entry.path=`examples/${folder}/demo-gmail.json`;files.set(entry.path,raw);assert.doesNotThrow(()=>validate(catalog,files));
 }
 const {catalog,files}=sample(),entry=catalog.rules[0],raw=files.get(entry.path);files.clear();entry.path='examples/DEMO2000/demo-gmail.json';files.set(entry.path,raw);assert.throws(()=>validate(catalog,files),/course/);
});

test('rejects whitespace-only file changes even when parsed JSON is identical', () => {
  const {catalog, files} = sample();
  files.set(catalog.rules[0].path, Buffer.from(JSON.stringify(rule)));
  assert.throws(() => validate(catalog, files), /sha256/);
});

for (const [field, value] of Object.entries({
  id: 'community.other.gmail-images', version: '2.0.0', source: 'ed',
  courses: ['DEMO2000'], name: {...rule.name, en: 'Wrong name'},
})) {
  test(`rejects catalogue ${field} drift`, () => {
    const {catalog, files} = sample();
    catalog.rules[0][field] = value;
    assert.throws(() => validate(catalog, files), new RegExp(field));
  });
}

for (const path of ['../demo.json', 'examples/../demo.json', 'https://example.test/demo.json', 'examples/demo.json?raw=1']) {
  test(`rejects unsafe path ${path}`, () => {
    const {catalog, files} = sample();
    catalog.rules[0].path = path;
    assert.throws(() => validate(catalog, files), /path/);
  });
}

test('rejects missing, extra, and repeated entries', () => {
  const {catalog, files} = sample();
  assert.throws(() => validate({...catalog, rules: []}, files), /coverage/);
  assert.throws(() => validate(catalog, new Map()), /file/);
  assert.throws(() => validate({...catalog, rules: [...catalog.rules, ...catalog.rules]}, files), /duplicate/);
  const extra = {...catalog.rules[0], path: 'examples/DEMO1000/another.json'};
  files.set(extra.path, files.get(catalog.rules[0].path));
  assert.throws(() => validate({...catalog, rules: [...catalog.rules, extra]}, files), /duplicate.*id/);
});

test('requires schema version 1, demo labels, localized names and lowercase sha256', () => {
  for (const mutate of [
    c => { c.schemaVersion = 2; },
    c => { c.rules[0].demo = false; },
    c => { delete c.rules[0].name.zh_TW; },
    c => { c.rules[0].sha256 = 'not-a-digest'; },
    c => { delete c.rules[0].sha256; },
    c => { c.rules[0].sha256 = c.rules[0].sha256.toUpperCase(); },
    c => { c.rules[0].url = 'https://example.test/rule.json'; },
    c => { c.updateUrl = 'https://example.test/feed.json'; },
  ]) {
    const {catalog, files} = sample();
    mutate(catalog);
    assert.throws(() => validate(catalog, files), /catalog/i);
  }
});

test('enforces the raw UTF-8 byte limit', () => {
  const {catalog, files} = sample();
  const raw = Buffer.from(JSON.stringify(rule) + ' '.repeat(65536), 'utf8');
  files.set(catalog.rules[0].path, raw);
  catalog.rules[0].sha256 = createHash('sha256').update(raw).digest('hex');
  assert.throws(() => validate(catalog, files), /64 KiB/);
});

test('rejects malformed catalogues', () => {
  const {files} = sample();
  for (const catalog of [null, [], {}, {schemaVersion: 1, rules: null}, {schemaVersion: 1, rules: [null]}]) {
    assert.throws(() => validate(catalog, files), /catalog/i);
  }
});
