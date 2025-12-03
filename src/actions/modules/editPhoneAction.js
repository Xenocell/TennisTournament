const { body, validationResult } = require('express-validator');

class EditPhoneAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:editPhone'
    }
    validationRules(){
        return [
            body('phone').matches('[+][7] [0-9]{3} [0-9]{3}-[0-9]{2}-[0-9]{2}').withMessage('Контактный телефон некорректен!'),
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

        const result = await ctx.services[0][0].setUserPhone(ctx.req.session.user_id, ctx.req.body.phone);
        if (Number(result.changedRows) != 0)      
            return ctx.res.json({"message": "Вы успешно обновили контактный телефон!"})
        else
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при обновлении контактного телефона!"
                }]
        });	
    }
}
module.exports = { EditPhoneAction }