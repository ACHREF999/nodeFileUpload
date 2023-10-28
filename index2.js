const http = require("http")
const fs = require('fs')


const getFileName = (data)=>{
    let stringData = data.toString()
    const lines = stringData.split("\n")
    // console.log(lines)
    let jingo = ""
    // for (line in lines) 
    lines.forEach(line =>{
        
        if (line.startsWith('Content-Disposition')){
            // console.log("I AM IN")
            let key_value_pairs = line.split(":")[1].split(";")
            // console.log(key_value_pairs)
            key_value_pairs.forEach(kv_pair =>{
                // console.log(String(kv_pair))
                let temp = String(kv_pair)
                // console.log(temp)
                if (temp.trim().startsWith("filename")){
                let fname = temp.split("=")[1]?.replace(/"/g,"")
                // console.log("i got the : ",fname)
                jingo = fname
            }
                
            })

        }
    })

    return jingo

}


const cleanData =(data)=>{

}

const server = http.createServer(function(req,res){

    let done = false
    let fileName= ""
    const url = req.url

    if (url ==="/"){
        
        
        if (req.method==="GET"){
                console.log("hello from GET")
                res.write(fs.readFileSync('./formFile.html'))
                res.end()
                
        }

        else if(req.method==="POST"){
            console.log("hello from POST")
            const fileChunks = []
            let file;

            req.on('data',(data)=>{
                if (!done){
                    done = true
                    fileName = getFileName(data).trim()
                    console.log("GOT IT !!",fileName)
                }
                fileChunks.push(data)
            })

            req.on('end',()=>{
                file = Buffer.concat(fileChunks)
                // console.log(file)
                // console.log("FileName:",fileName)
                res.write("Saving File...\n\r")

                fs.writeFile('./uploads/'+fileName,file,(err)=>{
                if(!err){
                    res.write("Saved File Successfully")
                    res.end()
                }
                else{
                    res.write(`error occured : \n${err}`)
                    res.end()
                }

            
            
                })
            })
        }

    else {
        res.write("Inavalid Endpoint")
    }
    }
})

server.listen(5001,  ()=>{
    console.log(`Server started listening on PORT ${5001}`)
})
