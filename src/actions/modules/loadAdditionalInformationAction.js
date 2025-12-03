var fs = require('fs');
var multer = require('multer');
const path = require('path');
const roles = require('../../guard/roles');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        cb(null, './src/public/pdf/additional_information/');
    },
  
    filename: function(req, file, cb) {
        cb(null, file.originalname);
        //cb(null, file.fieldname + path.extname(file.originalname));
    }
});

const upload = multer(
    { 
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            //console.log(file.originalname)
            if(ext !== '.pdf') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }
    }
).single('addinfo')

class LoadAdditionalInformationAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:loadAddInfo'
    }
    validationRules(){
        return [];
    }
    async run(ctx){

        /*
        //delete
        const l = ['.png', '.jpg', '.gif', '.jpeg']
        const id = (type == 'Игрок') ? ctx.req.session.player_id : ctx.req.session.representative_id
        const folder = (type == 'Игрок') ? 'players' : 'representatives'
        const path = './src/public/images/uploads/'+ folder +'/passport-' + id
        
        for (let i = 0; i < l.length; i++) {
            if (fs.existsSync(path+l[i])) {
                await fs.unlinkSync(path+l[i])
            }
        }*/
        //

        const result = new Promise((resolve, reject) => {
            upload(ctx.req, ctx.res, (err) => {
                if (err instanceof multer.MulterError) {
                    reject('Произошла ошибка при загрузке файла!')
                }else{
                    resolve('Файл успешно загружен!')
                }
            })
        });

        result.then(async (value) => {
            return ctx.res.json({"message": value})
            
        }).catch(err => {
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: err
                }]
            });	
        });
    }
}
module.exports = { LoadAdditionalInformationAction }