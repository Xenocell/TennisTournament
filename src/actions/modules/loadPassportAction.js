var fs = require('fs');
var multer = require('multer');
const path = require('path');
const roles = require('../../guard/roles');


const get_type = (req) =>{
    if (Object.keys(req.query).length != 0)
    {
        if ((req.query.type != 'Игрок') && (req.query.type != 'Представитель'))
            return null
        return req.query.type
    }
    return null
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        const folder = (req) =>{
            return (get_type(req) == 'Игрок') ? 'players' : 'representatives'
        }
        cb(null, './src/public/images/uploads/' + folder(req));
    },
  
    filename: function(req, file, cb) {
        const id = (req) =>{
            return (get_type(req) == 'Игрок') ? req.session.player_id : req.session.representative_id
        }    
        cb(null, file.fieldname + '-' + id(req) + path.extname(file.originalname));
    }
});
const upload = multer(
    { 
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }
    }).single('passport')

class LoadPassportAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:loadPassport'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        const type = get_type(ctx.req)
        if (type == null)
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: 'Произошла ошибка при загрузке файла.'
                }]
            });
        
        //delete
        const l = ['.png', '.jpg', '.gif', '.jpeg']
        const id = (type == 'Игрок') ? ctx.req.session.player_id : ctx.req.session.representative_id
        const folder = (type == 'Игрок') ? 'players' : 'representatives'
        const path = './src/public/images/uploads/'+ folder +'/passport-' + id
        
        for (let i = 0; i < l.length; i++) {
            if (fs.existsSync(path+l[i])) {
                await fs.unlinkSync(path+l[i])
            }
        }
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
            if(type == 'Представитель'){
                return ctx.res.json({"message": value})
            }
            else if(type == 'Игрок'){
                const res = await ctx.services.player.updateValuePlayer( ctx.req.session.player_id, 'status', 0);
                if (!res){
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: 'Произошла ошибка при загрузке файла.'
                        }]
                    });	 
                }else{
                    return ctx.res.json({"message": value})
                }
            }
        }).catch(err => {
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: err
                }]
            });	
        });
    }
}
module.exports = { LoadPassportAction }