const { Console } = require('console');
const { body, validationResult } = require('express-validator');

class UpdatePlayerAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:updatePlayer'
    }
    validationRules(){
        return [
            body('id').not().isEmpty().withMessage('empty id!'),
            body('action').not().isEmpty().withMessage('empty action!'),
            body('value').not().isEmpty().withMessage('empty value!'),
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
        const player_id = (ctx.req.body.id == -1) ? ctx.req.session.player_id : ctx.req.body.id
        const representative_id = (ctx.req.body.r_id == -1) ? ctx.req.session.representative_id : ctx.req.body.r_id
        const value = ctx.req.body.value

        switch (ctx.req.body.action) {
            case 'update_player':{
                const data_player = {
                    passport: {
                        series: value.serial_pass,
                        number: value.number_pass,
                        date_issue: value.date_give_pass,
                        organization: value.name_org_give_pass
                    },
                    player: {
                        first_name: value.fio.split(' ')[1],
                        last_name: value.fio.split(' ')[0],
                        patronymic:value.fio.split(' ')[2],
                        gender: value.gender,
                        date_birth: value.date_birth,
                        citizenship: value.citizenship,
                        city: value.city,
                        phone_number: value.phone,
                        email: value.email
                        //status: value.status
                    },
                };
                
                let result = await ctx.services.player.updatePlayer(player_id, data_player);
                if(!result)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Произошла ошибка, попробуйте еще раз!"
                        }]
                    });
                
                return ctx.res.json({"message": "Вы успешно обновили анкету."})
                break;
            }

            case 'update_player_and_representative':{
                const data_player = {
                    passport: {
                        series: value.serial_pass,
                        number: value.number_pass,
                        date_issue: value.date_give_pass,
                        organization: value.name_org_give_pass
                    },
                    player: {
                        first_name: value.fio.split(' ')[1],
                        last_name: value.fio.split(' ')[0],
                        patronymic:value.fio.split(' ')[2],
                        gender: value.gender,
                        date_birth: value.date_birth,
                        citizenship: value.citizenship,
                        city: value.city,
                        phone_number: value.phone,
                        email: value.email
                        //status: value.status
                    },
                };
                const data_representative = {
                    representative: {
                        first_name: value.r_fio.split(' ')[1],
                        last_name: value.r_fio.split(' ')[0],
                        patronymic: value.r_fio.split(' ')[2],
                        gender: value.r_gender,
                        date_birth: value.r_date_birth,
                        phone_number: value.r_phone,
                        email: value.r_email,
                        type: value.r_type,
                    },
                    passport: {
                        series: value.r_serial_pass,
                        number: value.r_number_pass,
                        date_issue: value.r_date_give_pass,
                        organization: value.r_name_org_give_pass
                    },
                };
                
                let result = await ctx.services.representative.updateRepresentative(representative_id, data_representative);
                if(!result)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Произошла ошибка, попробуйте еще раз!"
                        }]
                    });
                console.log(data_player)
                console.log(player_id)
                result = await ctx.services.player.updatePlayer(player_id, data_player);
                if(!result)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Произошла ошибка, попробуйте еще раз!"
                        }]
                    });
                
                return ctx.res.json({"message": "Вы успешно обновили анкету."})
                break;
            }
        

            case 'update_status':{
                if(Number(value) == 2){
                    if(ctx.req.body.message.length == 0)
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Нету причины отказа!"
                            }]
                        });
                    const res = await ctx.services.player.rejectionPlayer(player_id, ctx.req.body.message);
                    if(res.length == 0)
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Произошла ошибка, попробуйте еще раз!"
                            }]
                        });
                }

                const res = await ctx.services.player.updateValuePlayer(player_id, 'status', value);
                if (!res){
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Произошла ошибка, попробуйте еще раз!"
                        }]
                    });
                }else{
                    return ctx.res.json({"message": "Вы успешно подтвердили/отказали анкету."})
                }
                break;
            }
            default:
              break;
          }
    }
}
module.exports = { UpdatePlayerAction }