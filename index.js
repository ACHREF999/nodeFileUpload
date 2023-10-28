const http = require("http")
const fs = require('fs')
const formidable = require('formidable')
const path = require("path")


const validate=(file)=>{
    const lll = file.originalFilename.split(".")
    const type  = lll[lll.length-1]
    const invalidTypes = ["c","py","asm","exe","docx","bat","bash"]

    if(invalidTypes.indexOf(type)===-1) {
        return true;
    }
    return false;
}
const server = http.createServer(function(req,res){
    if(req.url==="/"){
    if (req.method==="GET"){
            console.log("hello from GET")
            res.write(fs.readFileSync('./formFile.html'))
            res.end()
            
    }
    else if(req.method==="POST"){
    const form = new formidable.IncomingForm()
    const uploadDir = path.join(__dirname,'uploadDir')
    form.multiples = false
    form.maxFilesize = 3*1024*1024;
    form.uploadDir = uploadDir

    form.parse(req,async(err,fields,files)=>{
        if(err){
            res.statusCode = 500
            res.write("There was an error parsing the files")
            res.end()
        }
        // console.log(files)
        const file = files.myFile[0]
        // console.log(file)
        // res.end()
        const fileName= encodeURIComponent(file.originalFilename.replace(/\s/g,'-'))

        if (!validate(file)){
            res.statusCode = 500
            
            res.write("The file type is NOT valid")
            res.end()
        }
        try{
            fs.renameSync(file.filepath,path.join(uploadDir,file.originalFilename))
        }
        catch(err){
            console.log(err);
        }
        res.statusCode = 200
        res.write("file saved successfully")
        res.end()

    })
    }}
})


server.listen(5001,  ()=>{
    console.log(`Server started listening on PORT ${5001}`)
})
