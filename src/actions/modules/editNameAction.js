const { body, validationResult } = require('express-validator');

class EditNameAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:editName'
    }
    validationRules(){
        return [
            body('fio').not().isEmpty().withMessage('Не заполнено ФИО!'),
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
        const result = await ctx.services[0][0].setUserName(ctx.req.session.user_id, ctx.req.body.fio);
        if (Number(result.changedRows) != 0)      
            return ctx.res.json({"message": "Вы успешно обновили ФИО!"})
        else
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при обновлении ФИО!"
                }]
            });	
    }
}
module.exports = { EditNameAction }