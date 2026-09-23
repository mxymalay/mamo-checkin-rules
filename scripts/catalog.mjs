import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';

function requireKeys(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      !isDeepStrictEqual(Object.keys(value).sort(), [...keys].sort())) {
    throw new Error(`Catalog ${label}: unexpected or missing fields`);
  }
}

// files contains the exact bytes of examples already checked by the rule harness.
export function validateCatalog(catalog, files) {
  requireKeys(catalog, ['schemaVersion', 'rules'], 'root');
  if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.rules)) {
    throw new Error('Catalog requires schemaVersion 1 and a rules array');
  }
  const paths = new Set(), ids = new Set();
  for (const entry of catalog.rules) {
    requireKeys(entry, ['id', 'version', 'name', 'source', 'courses', 'path', 'demo', 'sha256'], 'entry');
    if (typeof entry.path !== 'string' || !/^examples\/[a-z0-9-]+\.json$/.test(entry.path)) {
      throw new Error('Catalog path must be an examples/<name>.json file');
    }
    if (paths.has(entry.path)) throw new Error(`Catalog duplicate path: ${entry.path}`);
    if (ids.has(entry.id)) throw new Error(`Catalog duplicate id: ${entry.id}`);
    paths.add(entry.path);
    ids.add(entry.id);
    if (entry.demo !== true) throw new Error(`Catalog example must have demo:true: ${entry.path}`);
    requireKeys(entry.name, ['en', 'zh_CN', 'zh_TW'], 'name');
    if (Object.values(entry.name).some(name => typeof name !== 'string' || !name.trim())) {
      throw new Error(`Catalog name must contain all three translations: ${entry.path}`);
    }
    if (typeof entry.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(entry.sha256)) {
      throw new Error(`Catalog sha256 must be 64 lowercase hex characters: ${entry.path}`);
    }
    const raw = files.get(entry.path);
    if (!raw) throw new Error(`Catalog file is not a validated example: ${entry.path}`);
    if (Buffer.byteLength(raw) > 65536) throw new Error(`Catalog file exceeds 64 KiB: ${entry.path}`);
    if (createHash('sha256').update(raw).digest('hex') !== entry.sha256) {
      throw new Error(`Catalog sha256 mismatch: ${entry.path}`);
    }
    const rule = JSON.parse(raw.toString('utf8'));
    for (const key of ['id', 'version', 'name', 'source', 'courses']) {
      if (!isDeepStrictEqual(entry[key], rule[key])) {
        throw new Error(`Catalog ${key} mismatch: ${entry.path}`);
      }
    }
  }
  if (paths.size !== files.size) throw new Error('Catalog coverage: list every validated example exactly once');
  return paths.size;
}
