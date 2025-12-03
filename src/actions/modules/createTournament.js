const { body, validationResult } = require('express-validator');
const roles = require('../../guard/roles');
const fs = require("fs")

class CreateTournamentAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:createTournament'
    }
    validationRules(){
        return [
            body('name').not().isEmpty().withMessage('Не заполнено наименование турнира!'),
            body('payment').not().isEmpty().withMessage('Не заполнен взнос!'),
            body('type').not().isEmpty().withMessage('Не выбран тип турнира!'),
            body('prize').not().isEmpty().withMessage('Не заполнен приз!'),
            body('format').not().isEmpty().withMessage('Не выбран формат!'),
            body('gender').not().isEmpty().withMessage('Не выбран пол!'),
            body('date_birdth').not().isEmpty().withMessage('Не выбран год рождения участников!'),
            body('date_start').not().isEmpty().withMessage('Не выбрана дата начала турнира!'),
            body('date_end').not().isEmpty().withMessage('Не выбрана дата окончания турнира!'),
            body('place').not().isEmpty().withMessage('Не заполнено место проведения!'),
            //body('count').not().isEmpty().withMessage('Не заполнено число участников!'),
            body('court').not().isEmpty().withMessage('Не заполнен тип корта!'),
            body('count_court').not().isEmpty().withMessage('Не заполнена число кортов!'),
            body('referee').not().isEmpty().withMessage('Не заполнен судья!'),
            body('phone_referee').not().isEmpty().withMessage('Не заполнен телефон!'),
            body('email_referee').not().isEmpty().withMessage('Не заполнена эл. почта!'),

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
        const data = {
            title: ctx.req.body.name, 
            type: ctx.req.body.type, 
            format: ctx.req.body.format, 
            gender: ctx.req.body.gender, 
            year_birth: ctx.req.body.date_birdth, 
            start_date: ctx.req.body.date_start, 
            end_date: ctx.req.body.date_end, 
            place: ctx.req.body.place, 
            court_type: ctx.req.body.court, 
            court_count: ctx.req.body.count_court, 
            head_referee: ctx.req.body.referee, 
            referee_phone: ctx.req.body.phone_referee, 
            referee_mail: ctx.req.body.email_referee,
            prize: ctx.req.body.prize,
            payment: ctx.req.body.payment,
            type_points: ctx.req.body.type_points,
            c_info: ctx.req.body.c_info,
            particions_number: Number(ctx.req.body.particions_number),
            subtournaments: Number(ctx.req.body.subtournaments),
            color: ctx.req.body.color
            
        };
        const result = await ctx.services.tournament.createTournament(data);
        if(result == null)
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при создании турнира!"
                }]
            });
        return ctx.res.json({"message": "Вы успешно создали турнир."});
        //console.log(data)
        //ctx.res.end()
        /*const result = await ctx.services[0][5].createRepresentative(data);
        if (result != null){
            ctx.req.session.representative_id = result;
            return ctx.res.json({"message": "Вы успешно сохранили часть анкеты."});
        }else{
            return ctx.res.status(400).json({ errors: 
                [{
                    msg: "Возникла ошибка при сохранении части анкеты!"
                }]
            });
        }*/
    }
}
module.exports = { CreateTournamentAction }