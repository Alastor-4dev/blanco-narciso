'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const multer=require('multer');
const sharp=require('sharp');
const MAX_BYTES=8*1024*1024;
const MAX_PIXELS=40_000_000;
const formats=new Set(['jpeg','png','webp']);
const localImage=/^[\w. -]+\.(?:jpe?g|png|webp|gif)$/i;

module.exports=function mountProductImages(app,{requireAuth,imageDirectory}) {
  const parser=multer({
    storage:multer.memoryStorage(),
    limits:{fileSize:MAX_BYTES,files:1,fields:0,parts:1},
    fileFilter(req,file,done){
      if(!/\.(?:jpe?g|png|webp)$/i.test(file.originalname))return done(Object.assign(new Error('Elige una foto JPG, PNG o WebP.'),{status:415}));
      done(null,true);
    }
  }).single('image');
  const sameOrigin=(req,res,next)=>{
    res.setHeader('Cache-Control','no-store');
    if(req.headers.origin && req.headers.origin!==`${req.protocol}://${req.get('host')}`)return res.status(403).json({error:'Origen no permitido.'});
    next();
  };
  app.get('/api/admin/images',requireAuth,sameOrigin,async(req,res)=>{
    try{
      const entries=await fs.readdir(imageDirectory,{withFileTypes:true});
      const images=await Promise.all(entries.filter(entry=>entry.isFile() && localImage.test(entry.name) && !/^(?:wallet-|logo(?:-|\.))/i.test(entry.name)).map(async entry=>{
        const stat=await fs.stat(path.join(imageDirectory,entry.name));
        return {name:entry.name,path:'img/'+entry.name,modifiedAt:stat.mtimeMs};
      }));
      images.sort((a,b)=>b.modifiedAt-a.modifiedAt || a.name.localeCompare(b.name));
      res.json({images:images.map(({name,path})=>({name,path}))});
    }catch{res.status(500).json({error:'No se pudieron cargar las fotos guardadas.'});}
  });
  // Authentication runs before multipart parsing. Only decoded, re-encoded pixels reach img/.
  app.post('/api/admin/images',requireAuth,sameOrigin,(req,res)=>{
    parser(req,res,async error=>{
      if(error){
        const tooLarge=error.code==='LIMIT_FILE_SIZE';
        return res.status(tooLarge?413:error.status || 400).json({error:tooLarge?'La foto supera el máximo de 8 MB.':error.status?error.message:'Selecciona una sola foto JPG, PNG o WebP.'});
      }
      if(!req.file)return res.status(400).json({error:'Selecciona una foto para subir.'});
      let output,info;
      try{
        const image=sharp(req.file.buffer,{limitInputPixels:MAX_PIXELS,failOn:'warning',animated:false});
        const metadata=await image.metadata();
        if(!formats.has(metadata.format) || !metadata.width || !metadata.height)return res.status(415).json({error:'El archivo debe ser una foto JPG, PNG o WebP válida.'});
        // Auto-orient phone photos, bound their resolution and omit EXIF/GPS metadata.
        ({data:output,info}=await image.autoOrient().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toBuffer({resolveWithObject:true}));
      }catch{return res.status(422).json({error:'No se pudo leer la foto. Usa una imagen válida de hasta 40 megapíxeles.'});}
      try{
        await fs.mkdir(imageDirectory,{recursive:true});
        const filename='producto-'+crypto.randomUUID()+'.webp';
        await fs.writeFile(path.join(imageDirectory,filename),output,{flag:'wx',mode:0o644});
        res.status(201).json({path:'img/'+filename,width:info.width,height:info.height});
      }catch{res.status(500).json({error:'No se pudo guardar la foto. Inténtalo de nuevo.'});}
    });
  });
};
module.exports.MAX_BYTES=MAX_BYTES;
