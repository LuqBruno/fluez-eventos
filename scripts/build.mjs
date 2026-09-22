import { mkdir, cp, rm, readFile, writeFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url),dest=new URL('../dist/',import.meta.url);
await rm(dest,{recursive:true,force:true}); await mkdir(dest,{recursive:true});
for(const item of ['index.html','robots.txt','sitemap.xml','src','public']) await cp(new URL(item,root),new URL(item,dest),{recursive:true});
const index=new URL('../dist/index.html',import.meta.url); const html=await readFile(index,'utf8');
await writeFile(index,html.replaceAll('"/public/','"public/').replaceAll('"/src/','"src/'));
console.log('Build estático criado em dist.');
