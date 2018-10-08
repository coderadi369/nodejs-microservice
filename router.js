const router = module.exports = require('express').Router()
const {
    IsAuthenticated,
    JWT
} = require(`${__base}/utils/user`)
const cors = require('cors')
const jsonpatch = require('json-patch')
const validUrl = require('valid-url');
const http = require('https')
const Filetype = require('file-type')
const uuidv1 = require('uuid/v1');
const im = require('imagemagick');
const fs=require('fs');

var corsOptions = {
    credentials: true
}
router.use((req, res, next) => {
    corsOptions['origin'] = req.get('origin')
    next()
}, cors(corsOptions))
router.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body
    if (!(username) || !(password)) {
        res.status(403).json({
            'message': 'Please Kindly enter correct password and username'
        })
    }
    const token = JWT(username)
    res.status(200).json({
        'message': 'User login successful',
        'token': token
    })
})
router.post('/patch', IsAuthenticated, (req, res) => {
    const {
        body,
        patch
    } = req.body
    if (!(body) || !(patch)) {
        res.status(403).json({
            'message': 'Both body and patch are required fields'
        })
    }
    const result = jsonpatch.apply(body, patch)
    res.status(200).json(result)
})
router.post('/thumbnail', IsAuthenticated, (req, res) => {
    const {
        url
    } = req.body
    if ((!url) || !(validUrl.isUri)) {
        return res.status(403).json({
            'message': 'url in request body is required'
        })
    }
    const mimeType = {
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml'
    };
    http.get(url, (Response) => {
        let imageData = [],
            ImgType = null

        Response.once('data', (chunk) => {
            const imageFileType = Filetype(chunk)
            if (!(imageFileType)) {
                return res.status(400).json({
                    'message': 'Not a valid file'
                })
            }
            ImgType = imageFileType.ext
            if (Object.keys(mimeType).indexOf(ImgType) == -1) {
                return res.status(400).json({
                    'message': 'Not a valid image'
                })
            }
        })
        Response.on('data', (chunk) => {
            imageData = [...imageData, chunk]
            console.log("reached")
        })
        Response.on('end', () => {
            console.log("reached here")
            const imgName = __dirname+`/${uuidv1()}.${ImgType}`;
            console.log("imgName",imgName)
            const buffer = Buffer.concat(imageData);
            console.log("buffer",buffer)
            fs.writeFile(imgName, buffer, {
                flag: "w"
            },err => {
                if (err) {
                  console.log("error",err)
                  return ;
                }

                im.resize({
                    srcPath: imgName,
                    dstPath: imgName,
                    width: 50,
                    height: 50
                }, (err, stdout, stderr) => {
                    if (err) {
                        console.log("error",err)
                    };
                    var output = fs.createReadStream(imgName);
                    output.on('open', () => {
                        res.set('Content-Type', mimeType[ImgType]);
                        output.pipe(res);
                    });
                    output.on('error', () => {
                        return res.status(500).json({
                            error: {
                                message: "Error occured!",
                                name: "UNKOWN_ERROR"
                            }
                        })
                    })
                })
            })
        })
    })
})