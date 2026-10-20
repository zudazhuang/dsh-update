import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { downloadSource, command } from '../engine.js'
test('official archive download initializes a usable tag and rejects mismatched source versions', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-archive-'));t.after(()=>rm(root,{recursive:true,force:true}))
  const input=join(root,'input');await mkdir(join(input,'top/apps/cli'),{recursive:true});await writeFile(join(input,'top/apps/cli/package.json'),JSON.stringify({version:'0.3.0'}))
  const archive=join(root,'fixture.tar.gz');await command('tar',['-czf',archive,'-C',input,'top'])
  const {readFile}=await import('node:fs/promises');const bytes=await readFile(archive)
  const run=async (file,args,options)=>{if(file==='curl'){assert.equal(args[args.indexOf('--max-time')+1],'3600');assert.equal(args[args.indexOf('--connect-timeout')+1],'20');assert.equal(args[args.indexOf('--retry')+1],'2');assert.equal(options.timeoutMs,3610000);assert.match(args.at(-1),/^https:\/\/codeload.github.com\/deepseek-ai\/deepseek-harness\//);await writeFile(args[args.indexOf('--output')+1],bytes);return ''}return command(file,args,options)}
  const cache=join(root,'cache');
  const good=join(root,'good');await mkdir(good);await downloadSource({tag:'dsh-v0.3.0',version:'0.3.0'},good,new AbortController().signal,run,3600,cache)
  assert.equal(await command('git',['describe','--tags','--exact-match'],{cwd:join(good,'source')}),'dsh-v0.3.0')
  const cached=join(root,'cached');await mkdir(cached)
  const cachedRun=async(file,args,options)=>{assert.notEqual(file,'curl');return command(file,args,options)}
  await downloadSource({tag:'dsh-v0.3.0',version:'0.3.0'},cached,undefined,cachedRun,3600,cache)
  await writeFile(join(cache,'dsh-v0.3.0.tar.gz'),'corrupt')
  const repaired=join(root,'repaired');await mkdir(repaired)
  await downloadSource({tag:'dsh-v0.3.0',version:'0.3.0'},repaired,undefined,run,3600,cache)
  const bad=join(root,'bad');await mkdir(bad);await assert.rejects(downloadSource({tag:'dsh-v0.3.1',version:'0.3.1'},bad,new AbortController().signal,run),/version does not match/)
})

test('download budget rejects invalid values before starting a subprocess', async () => {
  for (const timeout of [0, 119, 7201, 120.5, NaN]) await assert.rejects(downloadSource({tag:'dsh-v0.3.0'}, '/unused', undefined, () => {throw Error('must not run')}, timeout), /Invalid download timeout/)
})
