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
  const run=async (file,args,options)=>{if(file==='curl'){assert.match(args.at(-1),/^https:\/\/codeload.github.com\/deepseek-ai\/deepseek-harness\//);await writeFile(args[args.indexOf('--output')+1],bytes);return ''}return command(file,args,options)}
  const good=join(root,'good');await mkdir(good);await downloadSource({tag:'dsh-v0.3.0',version:'0.3.0'},good,new AbortController().signal,run)
  assert.equal(await command('git',['describe','--tags','--exact-match'],{cwd:join(good,'source')}),'dsh-v0.3.0')
  const bad=join(root,'bad');await mkdir(bad);await assert.rejects(downloadSource({tag:'dsh-v0.3.1',version:'0.3.1'},bad,new AbortController().signal,run),/version does not match/)
})
