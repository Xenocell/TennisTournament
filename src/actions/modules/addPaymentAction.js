const { body, validationResult } = require('express-validator');

class AddPaymentAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:addPayment'
    }
    validationRules(){
        return [
            body('player_id').not().isEmpty().withMessage('Не найден ид игрока!'),
            body('year').not().isEmpty().withMessage('Не найден год оплаты!'),

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
        const result_exist = await ctx.services.player.existPlayment(ctx.req.body.player_id, ctx.req.body.year)
        if(result_exist == null)
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка, попробуйте позже!"
                }]
            });
        if(Number(result_exist) == 1){
            const result_exist = await ctx.services.player.deletePayment(ctx.req.body.player_id, ctx.req.body.year)
            if(result_exist == null)
                return ctx.res.status(400).json({ errors: 
                    [{
                        msg: "Возникла ошибка, попробуйте позже!"
                    }]
                });
            return ctx.res.json({"message": "Вы успешно отменили оплату игроку."});

        }
            /*return ctx.res.status(400).json({ errors: 
                [{
                    msg: "У данного игрока уже произведена оплата за этот год!"
                }]
            });*/

        const result_add_payment = await ctx.services.player.addPayment(ctx.req.body.player_id, ctx.req.body.year)
        if(result_add_payment == null)
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка, попробуйте позже!"
                }]
            });
        
        const result_update_status = await ctx.services.player.updateValuePlayer(ctx.req.body.player_id, 'status', 1)
        if(!result_update_status)
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка, попробуйте позже!"
                }]
            });
        return ctx.res.json({"message": "Вы успешно внесли оплату игроку."});
        //console.log(ctx.req.body)
        return ctx.res.end()

    }
}
module.exports = { AddPaymentAction }