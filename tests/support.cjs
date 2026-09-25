const path=require('node:path'),fs=require('node:fs');
const playwright=require(process.env.PMD_PLAYWRIGHT||'playwright');
const root=path.resolve(__dirname,'..'),output=path.join(root,'test-results');fs.mkdirSync(output,{recursive:true});
const executablePath=process.env.PMD_BROWSER||undefined;
module.exports={...playwright,root,output,executablePath};
