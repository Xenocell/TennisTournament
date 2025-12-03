const { body, validationResult } = require('express-validator');

class EditCityAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:editCity'
    }
    validationRules(){
        return [
            body('city').not().isEmpty().withMessage('Не выбран город!'),
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

        const result = await ctx.services[0][0].setUserCity(ctx.req.session.user_id, ctx.req.body.city);
        if (Number(result.changedRows) != 0)      
            return ctx.res.json({"message": "Вы успешно обновили город!"})
        else
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при обновлении города!"
                }]
        });
    }
}
module.exports = { EditCityAction }