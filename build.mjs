import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const dir of ['frontend','printing','vendor'])await cp(dir,`dist/${dir}`,{recursive:true});
await copyFile('garment_billing_demo.html','dist/index.html');
await copyFile('garment_billing_demo.html','dist/garment_billing_demo.html');
console.log('Static demo prepared in dist/. No dependency installation required.');
