const Jimp = require("jimp");
const Path = require('path');

const MAX_IMG_SIZE = 204800; // 200KB
const IPC_CHUNK_SIZE = 16384; // 8KB limit on linux

const compress = async ([file, ix]) => {

    // new
    let fileExtension;
    fileExtension = file.originalFilename.replace(/^.*\./, "");
    fileExtension = fileExtension;

    const imgSize = parseInt(file.size);
    let cr = 100;
    if(imgSize > MAX_IMG_SIZE){
        cr = Math.floor((MAX_IMG_SIZE / imgSize) * 100);
    }else{
        // cr = Math.floor((MAX_IMG_SIZE / imgSize) * 10);
        cr=50;
    }

    // old
    // const filePath = Path.join(__dirname, `img_${new Date().getTime()}.jpg`)
    // new
    const filePath = Path.join(__dirname, `img_${new Date().getTime()+'.'+fileExtension}`)

    try{
         await Jimp.read(file.path)
            .then(data =>
                data.quality(cr)
                    .writeAsync(filePath)
            )
             .catch(err => {
                 return err
             });
    } catch (err) {
        process.send([err, ix]);
        process.exit(0);
    }

    console.log("filePathcompress",filePath,"fileExtension",fileExtension)

    process.send([filePath, ix]);
    // await new Promise((resolve) => setTimeout(resolve, 10));
    process.exit(0);
};

process.on('message', async ([file, ix]) => await compress([file, ix]));
