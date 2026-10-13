import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { command, migrateLocalChanges, deploymentHash } from '../engine.js'
test('working edits and untracked files migrate without changing source state; conflicts stop', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-migration-')); t.after(() => rm(root, { recursive: true, force: true }))
  const source = join(root, 'source'); await mkdir(source)
  const git = (args, cwd = source) => command('git', ['-c', 'user.name=Test', '-c', 'user.email=test@localhost', ...args], { cwd })
  await git(['init']); await writeFile(join(source, 'value'), 'base\n'); await git(['add', '.']); await git(['commit', '-m', 'base']); await git(['tag', 'dsh-v0.1.0'])
  await writeFile(join(source, 'value'), 'official\n'); await git(['commit', '-am', 'official']); await git(['tag', 'new'])
  await git(['checkout', 'dsh-v0.1.0']); await writeFile(join(source, 'skill'), 'custom\n'); await writeFile(join(source, 'pnpm-workspace.yaml'), 'overrides: {}\n'); await writeFile(join(source, 'pnpm-lock.yaml'), 'obsolete lockfile\n'); await git(['add', '.']); await git(['commit', '-m', 'local'])
  await writeFile(join(source, 'untracked-skill'), 'pending\n')
  await writeFile(join(source, 'skill'), 'uncommitted edit\n')
  const before = await deploymentHash(root, source)
  await writeFile(join(source, 'untracked-skill'), 'pending newer\n')
  assert.notEqual(await deploymentHash(root, source), before)
  const originalStatus = await git(['status', '--porcelain'])
  const originalHead = await git(['rev-parse', 'HEAD'])
  const staged = join(root, 'stage'); await git(['clone', '--branch', 'new', source, staged])
  assert.equal(await migrateLocalChanges(source, staged, '0.1.0', join(root, 'patch')), true)
  await assert.rejects(readFile(join(staged, 'pnpm-lock.yaml')), { code: 'ENOENT' })
  assert.equal(await readFile(join(staged, 'skill'), 'utf8'), 'uncommitted edit\n'); assert.equal(await git(['status', '--porcelain'], staged), '')
  assert.equal(await readFile(join(staged, 'untracked-skill'), 'utf8'), 'pending newer\n')
  assert.equal(await git(['status', '--porcelain']), originalStatus)
  assert.equal(await git(['rev-parse', 'HEAD']), originalHead)
  await writeFile(join(source, 'value'), 'local\n'); await git(['commit', '-am', 'conflict'])
  const conflict = join(root, 'conflict'); await git(['clone', '--branch', 'new', source, conflict])
  await assert.rejects(migrateLocalChanges(source, conflict, '0.1.0', join(root, 'conflict.patch')))
  assert.equal(await readFile(join(source, 'value'), 'utf8'), 'local\n')
})
