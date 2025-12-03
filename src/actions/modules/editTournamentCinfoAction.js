const { body, validationResult } = require('express-validator');

class EditTournamentCinfoAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:editTournamentCinfo'
    }
    validationRules(){
        return [
            body('id').not().isEmpty().withMessage('Не заполнен ид!'),
            body('text').not().isEmpty().withMessage('Не заполнен текст!'),
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
        const result = await ctx.services.tournament.updateTournamentCinfo(ctx.req.body.id, ctx.req.body.text)
        if(!result)
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Произошла ошибка, попробуйте еще раз!"
                }]
            });
        
        return ctx.res.json({"message": "Вы успешно обновили текст."})    
    }
}
module.exports = { EditTournamentCinfoAction }