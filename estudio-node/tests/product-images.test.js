'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const express=require('express'),sharp=require('sharp');
const mountImages=require('../lib/product-images');
async function fixture(t){
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'bn-images-'));
 const app=express();
 mountImages(app,{imageDirectory:directory,requireAuth:(req,res,next)=>req.headers.authorization==='Bearer test-session'?next():res.status(401).json({error:'No autorizado'})});
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
 t.after(async()=>{await new Promise(resolve=>server.close(resolve));await fs.rm(directory,{recursive:true,force:true});});
 return {directory,url:'http://127.0.0.1:'+server.address().port};
}
function form(buffer,name){const data=new FormData();data.append('image',new Blob([buffer]),name);return data;}
const auth={Authorization:'Bearer test-session'};
test('Photo browsing and upload require authentication before a file can be written',async t=>{
 const {url,directory}=await fixture(t);
 assert.equal((await fetch(url+'/api/admin/images')).status,401);
 assert.equal((await fetch(url+'/api/admin/images',{method:'POST',body:form(Buffer.from('data'),'photo.jpg')})).status,401);
 assert.deepEqual(await fs.readdir(directory),[]);
});
test('An uploaded photo gets a unique safe path, is re-encoded, and loses embedded metadata',async t=>{
 const {url,directory}=await fixture(t);
 const original=await sharp({create:{width:40,height:30,channels:3,background:'#6f917e'}}).withExif({IFD0:{Artist:'Test photographer'}}).jpeg().toBuffer();
 assert((await sharp(original).metadata()).exif);
 const response=await fetch(url+'/api/admin/images',{method:'POST',headers:auth,body:form(original,'../../../ramo.jpg')});
 const data=await response.json();assert.equal(response.status,201,JSON.stringify(data));
 assert.match(data.path,/^img\/producto-[a-f0-9-]+\.webp$/);
 const saved=await fs.readFile(path.join(directory,path.basename(data.path)));
 const metadata=await sharp(saved).metadata();assert.equal(metadata.format,'webp');assert.equal(metadata.width,40);assert.equal(metadata.height,30);assert.equal(metadata.exif,undefined);
 const again=await fetch(url+'/api/admin/images',{method:'POST',headers:auth,body:form(original,'ramo.jpg')}).then(r=>r.json());
 assert.notEqual(again.path,data.path);assert.equal((await fs.readdir(directory)).length,2);
});
test('Spoofed images, scripts, excessive size and cross-origin submissions are rejected without files',async t=>{
 const {url,directory}=await fixture(t);
 const send=async(buffer,name,headers=auth)=>fetch(url+'/api/admin/images',{method:'POST',headers,body:form(buffer,name)});
 assert.equal((await send(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'),'fake.jpg')).status,415);
 assert.equal((await send(Buffer.from('<script>alert(1)</script>'),'fake.jpg')).status,422);
 assert.equal((await send(Buffer.from('<script/>'),'file.html')).status,415);
 assert.equal((await send(Buffer.alloc(mountImages.MAX_BYTES+1),'oversize.png')).status,413);
 assert.equal((await send(Buffer.from('x'),'photo.jpg',{...auth,Origin:'https://unrelated.invalid'})).status,403);
 assert.deepEqual(await fs.readdir(directory),[]);
});
test('The media library lists only usable local images and ignores symlinks and private files',async t=>{
 const {url,directory}=await fixture(t);
 await fs.writeFile(path.join(directory,'ramo01.png'),'fixture');await fs.writeFile(path.join(directory,'logo-navy.png'),'fixture');await fs.writeFile(path.join(directory,'wallet-logo-v2.png'),'fixture');await fs.writeFile(path.join(directory,'config.json'),'private');await fs.symlink('/etc/hosts',path.join(directory,'outside.png'));
 const response=await fetch(url+'/api/admin/images',{headers:auth});assert.equal(response.status,200);
 const data=await response.json();assert.deepEqual(data.images,[{name:'ramo01.png',path:'img/ramo01.png'}]);assert.equal(response.headers.get('cache-control'),'no-store');
});
