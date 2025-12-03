const { body, validationResult } = require('express-validator');

class DestroySessionAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:destroySession'
    }
    validationRules(){
        return [
            body('s_id').not().isEmpty().withMessage('Не заполнена сессия!'),
        
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                else next();
            }
        ];
    }
    async run(ctx){
        
        const result = await ctx.services[0][3].destroySesion(ctx.req.body.s_id);
        if(result.length != 0){
            return ctx.res.json({"message": 'Вы успешно завершили выбранную сессию.'});
        }else{
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при завершении выбранной сессии!"
                }]
            });
        }
    }
}
module.exports = { DestroySessionAction }