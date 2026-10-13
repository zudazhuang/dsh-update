import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { command, migrateLocalChanges } from '../engine.js'
test('committed custom files migrate and conflicting edits stop without changing the original', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-migration-')); t.after(() => rm(root, { recursive: true, force: true }))
  const source = join(root, 'source'); await mkdir(source)
  const git = (args, cwd = source) => command('git', ['-c', 'user.name=Test', '-c', 'user.email=test@localhost', ...args], { cwd })
  await git(['init']); await writeFile(join(source, 'value'), 'base\n'); await git(['add', '.']); await git(['commit', '-m', 'base']); await git(['tag', 'dsh-v0.1.0'])
  await writeFile(join(source, 'value'), 'official\n'); await git(['commit', '-am', 'official']); await git(['tag', 'new'])
  await git(['checkout', 'dsh-v0.1.0']); await writeFile(join(source, 'skill'), 'custom\n'); await writeFile(join(source, 'pnpm-workspace.yaml'), 'overrides: {}\n'); await writeFile(join(source, 'pnpm-lock.yaml'), 'obsolete lockfile\n'); await git(['add', '.']); await git(['commit', '-m', 'local'])
  const staged = join(root, 'stage'); await git(['clone', '--branch', 'new', source, staged])
  assert.equal(await migrateLocalChanges(source, staged, '0.1.0', join(root, 'patch')), true)
  await assert.rejects(readFile(join(staged, 'pnpm-lock.yaml')), { code: 'ENOENT' })
  assert.equal(await readFile(join(staged, 'skill'), 'utf8'), 'custom\n'); assert.equal(await git(['status', '--porcelain'], staged), '')
  await writeFile(join(source, 'value'), 'local\n'); await git(['commit', '-am', 'conflict'])
  const conflict = join(root, 'conflict'); await git(['clone', '--branch', 'new', source, conflict])
  await assert.rejects(migrateLocalChanges(source, conflict, '0.1.0', join(root, 'conflict.patch')))
  assert.equal(await readFile(join(source, 'value'), 'utf8'), 'local\n')
})
