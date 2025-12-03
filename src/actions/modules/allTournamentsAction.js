
const fs = require("fs")
require('../../utils/string')

class AllTournamentsAction{
    async init(){
        console.log(`${this.constructor.name} initialized...`)
    }
    accessTag() {
        return 'users:allPlayers'
    }
    validationRules(){
        return [];
    }
    async run(ctx){
        if (
            (ctx.req.query.action != '') && Number.isInteger(Number(ctx.req.query.id) )
        ){
            const status_tournament = await ctx.services.tournament.getTournamentStatus(ctx.req.query.id)
            //INDEX PAGE
            if(ctx.req.query.action == 'index'){
              let file_state = false
              if (fs.existsSync('./src/public/pdf/additional_information/addinfo_tour_' + ctx.req.query.id + '.pdf')) {
                file_state = true
              }
              return ctx.res.render('referee_info_tournament', { file_state: file_state })
            }
            //ENTRIEST PAGE
            else if(ctx.req.query.action == 'entries'){
                //POST REQUEST
                if (ctx.req.method == "POST"){
                    if ( (Number.isInteger(Number(lniToId(ctx.req.body.id)))) == false)
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Возникла ошибка, попробуйте позже!"
                            }]
                        });
                    if(ctx.req.body.action == 'add'){
                        const check_exist = await ctx.services.player.checkExist(lniToId(ctx.req.body.id))
                        if(check_exist == null || check_exist == 0)
                            return ctx.res.status(400).json({ errors: 
                                [{
                                    msg: "Такой игрок не найден!"
                                }]
                            });
                        const check_exist_player_in_tournament = await ctx.services.tournament.checkExistPlayerInTournament(ctx.req.query.id, lniToId(ctx.req.body.id))
                        if(check_exist_player_in_tournament == null || check_exist_player_in_tournament == 1)
                            return ctx.res.status(400).json({ errors: 
                                [{
                                    msg: "Возникла ошибка или данный игрок уже заявлен на этот турнир!"
                                }]
                            });
                        const result = await ctx.services.tournament.registerPlayerInTournament(ctx.req.query.id, lniToId(ctx.req.body.id))
                        if(result.length == 0)
                          return ctx.res.status(400).json({ errors: 
                              [{
                                  msg: "Возникла ошибка, попробуйте позже!"
                              }]
                          });
                        return ctx.res.json({"message": "Вы успешно заявили игрока на турнир."});
                    }else if(ctx.req.body.action == 'unreg'){
                        const result = await ctx.services.tournament.unregisterPlayerInTournament(ctx.req.query.id, lniToId(ctx.req.body.id));
                        if(result == null)
                            return ctx.res.status(400).json({ errors: 
                                [{
                                    msg: "Возникла ошибка, попробуйте позже!"
                                }]
                            });
                        return ctx.res.json({ "message": "Вы успешно сняли игрока с турнира."});  
                    }else if(ctx.req.body.action == 'change_status'){
                      const result_update_status = await ctx.services.tournament.updateStatusEntriesInTournament(ctx.req.query.id, Number(lniToId(ctx.req.body.id)), Number(ctx.req.body.status))
                      if(result_update_status == null)
                        return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                        });
                      return ctx.res.json({"message": "Вы успешно изменили статус игрока."});
                    }
                    else{
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Возникла ошибка, попробуйте позже!"
                            }]
                        });
                    }
                }
                //GET REQUEST
                const data_players = await ctx.services.tournament.getTournamentPlayers(ctx.req.query.id);
                return ctx.res.render('referee_entries_tournament', {data: data_players})
            }
            
            else if(ctx.req.query.action == 'drawing'){
                //POST REQUEST
                if (ctx.req.method == "POST"){
                    if( !Number.isInteger(Number(ctx.req.body.player_number)) || !Number.isInteger(Number(lniToId(ctx.req.body.rni))))
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Возникла ошибка, попробуйте позже!"
                            }]
                        }); 
                    const check_in_draw = await ctx.services.tournament.checkDrawPlayerInTournament(ctx.req.query.id, Number(lniToId(ctx.req.body.rni)))
                    if (check_in_draw == null)
                      return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                      });
                    if(check_in_draw == 0){
                      const result_add_draw = await ctx.services.tournament.addDrawPlayerInTournament(ctx.req.query.id, Number(lniToId(ctx.req.body.rni)), ctx.req.body.player_number)
                      if(result_add_draw == null)
                        return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                        });
                    }else{
                      const result_update_draw = await ctx.services.tournament.updateDrawPlayerInTournament(ctx.req.query.id, Number(lniToId(ctx.req.body.rni)), ctx.req.body.player_number)
                      if(result_update_draw == null)
                        return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                        });
                    }
                    //return ctx.res.json({"message": "Вы успешно добавили игрока в сетку."});
                    if(Number(status_tournament.type) == 1){

                      if(status_tournament.number_subtournaments == 1 && status_tournament.particions_number == 32){
                          const getInfoSubTournament = (player_number) => {
                              const getNumberGame = (number_game = 1) => {
                                  if( (number_game*2) < player_number ){
                                      number_game += 1
                                      return getNumberGame(number_game)
                                  }
                                  return number_game
                              }
                              return {
                                  "game_number": getNumberGame(),
                                  "player_number": (player_number % 2 == 0) ? 2 : 1
                              }
                          }
                          const info_subtournament = getInfoSubTournament(ctx.req.body.player_number)
                          const data = await ctx.services.tournament.getSubTournamentForOrdinalNumber(ctx.req.query.id, 1)
                          if(data == null)
                            return ctx.res.status(400).json({ errors: 
                              [{
                                  msg: "Возникла ошибка, попробуйте позже!"
                              }]
                            });
                          const data_parse = JSON.parse(data.data)
                          data_parse['round_1']['game_' + info_subtournament.game_number]['player_' + info_subtournament.player_number].rni = ctx.req.body.rni
                          data_parse['round_1']['game_' + info_subtournament.game_number]['player_' + info_subtournament.player_number].name = ctx.req.body.name

                          const result_update_data = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, data.subtournament_id, 'data', JSON.stringify(data_parse))
                          if(result_update_data == null)
                              return ctx.res.status(400).json({ errors: 
                                  [{
                                      msg: "Возникла ошибка, попробуйте позже!"
                                  }]
                              });  
                          return ctx.res.json({"message": "Вы успешно добавили игрока в сетку."});
                      }

                      //Информация о позиции в сетке    
                      const getInfoSubTournament = (number) =>{
                        let number_subtournament = 1;
                        while (number > number_subtournament*8) {
                            number_subtournament++;
                        }
                        let number_game = ((number_subtournament * 8)  - 8) + 2;
                        while ( number_game < number){
                            number_game += 2;
                        }
                        let number_player = (number_game > number ? 1 : 2)//Лучше проверять четность
                        
                        return {
                            "tournament_number": number_subtournament,
                            "tournament_game_number": (number_game - ((number_subtournament * 8)  - 8))/2,
                            "number_player": number_player
                        };
                      }
                      //
                      const info_subtournament = getInfoSubTournament(ctx.req.body.player_number)
                      const data = await ctx.services.tournament.getSubTournamentForOrdinalNumber(ctx.req.query.id, info_subtournament.tournament_number)
                      if(data == null)
                        return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                        });
                      const data_parse = JSON.parse(data.data)
                      data_parse['round_1']['game_' + info_subtournament.tournament_game_number]['player_' + info_subtournament.number_player].rni = ctx.req.body.rni
                      data_parse['round_1']['game_' + info_subtournament.tournament_game_number]['player_' + info_subtournament.number_player].name = ctx.req.body.name

                      const result_update_data = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, data.subtournament_id, 'data', JSON.stringify(data_parse))
                      if(result_update_data == null)
                          return ctx.res.status(400).json({ errors: 
                              [{
                                  msg: "Возникла ошибка, попробуйте позже!"
                              }]
                          });  
                      return ctx.res.json({"message": "Вы успешно добавили игрока в сетку."});

                    }else{
                      const getInfoSubTournament = (number) =>{
                        const getGame = (number) =>{
                            for(let i=1; i <= 32; i++){
                                if( (number/2) <= i)
                                    return i;
                            }
                        }
                        
                        return {
                            "tournament_game_number": getGame(number),
                            "number_player": number % 2 === 0 ? 2 : 1
                        }
                      }
                      const info_subtournament = getInfoSubTournament(ctx.req.body.player_number)
                      //console.log(info_subtournament)
                      const data = await ctx.services.tournament.getSubTournamentForOrdinalNumber(ctx.req.query.id, 1)
                      if(data == null)
                        return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                        });
                      
                      const data_parse = JSON.parse(data.data)
                      //console.log(data_parse['round_1']['game_1']['player_' + info_subtournament.number_player].rni)
                      data_parse['round_1']['game_' + info_subtournament.tournament_game_number]['player_' + info_subtournament.number_player].rni = ctx.req.body.rni
                      data_parse['round_1']['game_' + info_subtournament.tournament_game_number]['player_' + info_subtournament.number_player].name = ctx.req.body.name

                      const result_update_data = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, data.subtournament_id, 'data', JSON.stringify(data_parse))
                      if(result_update_data == null)
                          return ctx.res.status(400).json({ errors: 
                              [{
                                  msg: "Возникла ошибка, попробуйте позже!"
                              }]
                          });  
                      return ctx.res.json({"message": "Вы успешно добавили игрока в сетку."});
                    }
                }
                //GET REQUEST
                const data_players = await ctx.services.tournament.getDrawTournament(ctx.req.query.id);
                return ctx.res.render('referee_drawing_tournament', {data: data_players, status_tournament: status_tournament})
            }
            else if(ctx.req.query.action == 'grid'){
              if (ctx.req.method == "POST"){
                if(ctx.req.body.action == 'winner'){
                  const data = await ctx.services.tournament.getSubTournament(ctx.req.query.id, ctx.req.body.subtorunament)
                  const data_parse = JSON.parse(data.data)
                  if(Number(status_tournament.type) == 1){
                    
                    data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['winnder'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                    data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['points'] = ctx.req.body.points
                    const reverse_player = (ctx.req.body.player == '1') ? '2' : '1'
                    if(data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player].name == 'null'){
                      data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] = {"name": "X", "rni": "-1"}
                    }
                    if(status_tournament.number_subtournaments == 1 && status_tournament.particions_number == 32) {
                      const all_games = 16
                      const final_round = 5
                      const getNumberGamesFromRound = (round, games = 1, count = 1) => {
                          if(count != round){
                              games *= 2
                              count++
                              return getNumberGamesFromRound(round, games, count)
                          }
                          return games
                      }
                      const getOffsetGame = (all_games, games_current_round, current_game) => {
                          let count = 0;
                          for(let i=0; i < all_games; i += (all_games/games_current_round)){
                              if(i >= current_game){
                                  break
                              }
                              count++
                          }
                          return (count-1) * ((all_games/games_current_round)/2)
                      }
                      const current_round = Number(ctx.req.body.round)
                      const current_game = Number(ctx.req.body.game)
                      const current_player = Number(ctx.req.body.player)
                      const current_number_games = getNumberGamesFromRound(current_round) 
                      const current_number_next_games = current_number_games*2

                      if(Number(ctx.req.body.round) != final_round){
                        const first_game = Number(Math.ceil(current_game/2)) + getOffsetGame(all_games, current_number_games, current_game)
                        const second_game = first_game + (all_games/current_number_next_games)
                        const next_player = (current_game % 2 == 0) ? 2 : 1

                        /*console.log("current_round: " +  current_round)
                        console.log("current_game: " +  current_game)
                        console.log("current_player: " +  current_player)
                        console.log("current_number_games: " +  current_number_games)
                        console.log("first_game: " +  first_game)
                        console.log("second_game: " +  second_game)
                        console.log("next_player: " +  next_player)*/

                        data_parse['round_' + (current_round+1) ]['game_' + first_game]['player_' + next_player] = data_parse['round_' + current_round]['game_' + current_game]['player_' + current_player]
                        data_parse['round_' + (current_round+1)]['game_' + second_game]['player_' + next_player] = data_parse['round_' + current_round]['game_' + current_game]['player_' + reverse_player] 
                      }else{
                        const win_position = (current_game * 2) - 1

                        const result_parse = JSON.parse(data.result)
                        result_parse['win_players'][win_position-1] = data_parse['round_' + current_round]['game_' + current_game]['player_' + current_player]
                        result_parse['win_players'][win_position] = data_parse['round_' + current_round]['game_' + current_game]['player_' + reverse_player] 
                     

                        const check_all_winners = () => {
                          let result = true
                          for(let i= 0; i <= 31; i++){
                              if(result_parse['win_players'][i].name == 'null'){
                                result = false
                              }
                          }
                          return result
                        }

                        if(check_all_winners()){
                          const sort = (arr) =>{
                            let buff_el = null
                            for (let i = 0; i < arr.length; i++) {
                              if(arr[i].name == 'X' && (i+1 < arr.length && arr[i+1].name != 'X')){
                                buff_el = arr[i]
                                if(i+1 < arr.length-1){
                                  for (let q = i+1; q < arr.length; q++) {
                                      arr[q-1] = arr[q]
                                  }
                                  //console.log(arr)
                                  arr[arr.length-1] = buff_el   
                                  i=0;
                                }
                              }
                            }
                          }
                          sort(result_parse['win_players'])
                        }

                        const result_update_result = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'result', JSON.stringify(result_parse))
                        if(result_update_result == null)
                            return ctx.res.status(400).json({ errors: 
                                [{
                                    msg: "Возникла ошибка, попробуйте позже!"
                                }]
                            });  
                      }
                      
                    }else{
                      if(ctx.req.body.round == '1'){
                        if(ctx.req.body.game == '1'){
                          data_parse['round_2']['game_1']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                          data_parse['round_2']['game_3']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                        }
                        else if(ctx.req.body.game == '2'){
                          data_parse['round_2']['game_1']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                          data_parse['round_2']['game_3']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                        }
                        else if(ctx.req.body.game == '3'){
                          data_parse['round_2']['game_2']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                          data_parse['round_2']['game_4']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                        }
                        else if(ctx.req.body.game == '4'){
                          data_parse['round_2']['game_2']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                          data_parse['round_2']['game_4']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                        }
                      }else if(ctx.req.body.round == '2'){
                        if(ctx.req.body.game == '1'){
                          data_parse['round_3']['game_1']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                          data_parse['round_3']['game_2']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                        }
                        else if(ctx.req.body.game == '2'){
                          data_parse['round_3']['game_1']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                          data_parse['round_3']['game_2']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                        }
                        else if(ctx.req.body.game == '3'){
                          data_parse['round_3']['game_3']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                          data_parse['round_3']['game_4']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                        }
                        else if(ctx.req.body.game == '4'){
                          data_parse['round_3']['game_3']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                          data_parse['round_3']['game_4']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                        }
                      }else if(ctx.req.body.round == '3'){
                        const index_arr = ((Number(ctx.req.body.game) * 2)-2) + 1
                        const result_parse = JSON.parse(data.result)
                        result_parse['win_players'][index_arr-1] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        result_parse['win_players'][index_arr] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + reverse_player] 
                      
                        
                        if(result_parse['win_players'][0].name != 'null' && 
                          result_parse['win_players'][1].name != 'null' && 
                          result_parse['win_players'][2].name != 'null' && 
                          result_parse['win_players'][3].name != 'null' &&
                          result_parse['win_players'][4].name != 'null' && 
                          result_parse['win_players'][5].name != 'null' && 
                          result_parse['win_players'][6].name != 'null' && 
                          result_parse['win_players'][7].name != 'null'
                        ){
                         // console.log(result_parse['win_players'])
                          const sort = (arr) =>{
                            let buff_el = null
                            for (let i = 0; i < arr.length; i++) {
                              if(arr[i].name == 'X' && (i+1 < arr.length && arr[i+1].name != 'X')){
                                  buff_el = arr[i]
                                  if(i+1 < arr.length-1){
                                      for (let q = i+1; q < arr.length; q++) {
                                          arr[q-1] = arr[q]
                                      }
                                      //console.log(arr)
                                      arr[arr.length-1] = buff_el   
                                      i=0;
                                  }
                              }
                            }
                          }
                          sort(result_parse['win_players'])
                        }
                        const result_update_result = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'result', JSON.stringify(result_parse))
                        if(result_update_result == null)
                            return ctx.res.status(400).json({ errors: 
                                [{
                                    msg: "Возникла ошибка, попробуйте позже!"
                                }]
                            });  
                      }
                    }
                  }else{
                    
                    if(ctx.req.body.round == '1'){
                      if(ctx.req.body.game == '1'){
                        //data_parse['round_2']['game_1']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]

                        data_parse['round_2']['game_1']['player_1']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_2']['game_1']['player_1']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_2']['game_1']['player_1']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '2'){
                        //data_parse['round_2']['game_1']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_2']['game_1']['player_2']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_2']['game_1']['player_2']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_2']['game_1']['player_2']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '3'){
                        //data_parse['round_2']['game_2']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_2']['game_2']['player_1']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_2']['game_2']['player_1']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_2']['game_2']['player_1']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '4'){
                        //data_parse['round_2']['game_2']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_2']['game_2']['player_2']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_2']['game_2']['player_2']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_2']['game_2']['player_2']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '5'){
                        //data_parse['round_2']['game_3']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_2']['game_3']['player_1']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_2']['game_3']['player_1']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_2']['game_3']['player_1']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '6'){
                        //data_parse['round_2']['game_3']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_2']['game_3']['player_2']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_2']['game_3']['player_2']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_2']['game_3']['player_2']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '7'){
                        //data_parse['round_2']['game_4']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_2']['game_4']['player_1']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_2']['game_4']['player_1']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_2']['game_4']['player_1']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '8'){
                        //data_parse['round_2']['game_4']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_2']['game_4']['player_2']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_2']['game_4']['player_2']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_2']['game_4']['player_2']['points'] = ctx.req.body.points
                      }
                      //console.log('1')
                    }else if(ctx.req.body.round == '2'){
                      if(status_tournament.particions_number == 4){
                        const result_parse = JSON.parse(data.result)
                        result_parse['winnder']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        result_parse['winnder']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        result_parse['points'] = ctx.req.body.points

                        const result_update_result = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'result', JSON.stringify(result_parse))
                        if(result_update_result == null)
                            return ctx.res.status(400).json({ errors: 
                                [{
                                    msg: "Возникла ошибка, попробуйте позже!"
                                }]
                            });
                        return ctx.res.json({"message": "Вы успешно обновили сетку."});//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                      }
                      if(ctx.req.body.game == '1'){
                        //data_parse['round_3']['game_1']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_3']['game_1']['player_1']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_3']['game_1']['player_1']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_3']['game_1']['player_1']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '2'){
                        //data_parse['round_3']['game_1']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_3']['game_1']['player_2']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_3']['game_1']['player_2']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_3']['game_1']['player_2']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '3'){
                        //data_parse['round_3']['game_2']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_3']['game_2']['player_1']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_3']['game_2']['player_1']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_3']['game_2']['player_1']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '4'){
                        //data_parse['round_3']['game_2']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_3']['game_2']['player_2']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_3']['game_2']['player_2']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_3']['game_2']['player_2']['points'] = ctx.req.body.points
                      }
                      
                    }else if(ctx.req.body.round == '3'){
                      if(ctx.req.body.game == '1'){
                        if(status_tournament.particions_number == 8){
                          const result_parse = JSON.parse(data.result)
                          result_parse['winnder']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                          result_parse['winnder']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                          result_parse['points'] = ctx.req.body.points

                          const result_update_result = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'result', JSON.stringify(result_parse))
                          if(result_update_result == null)
                              return ctx.res.status(400).json({ errors: 
                                  [{
                                      msg: "Возникла ошибка, попробуйте позже!"
                                  }]
                              });
                          return ctx.res.json({"message": "Вы успешно обновили сетку."});//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        }
                        //data_parse['round_3']['game_1']['player_1'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_4']['game_1']['player_1']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_4']['game_1']['player_1']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_4']['game_1']['player_1']['points'] = ctx.req.body.points
                      }
                      else if(ctx.req.body.game == '2'){
                        //data_parse['round_3']['game_1']['player_2'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]
                        data_parse['round_4']['game_1']['player_2']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        data_parse['round_4']['game_1']['player_2']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        data_parse['round_4']['game_1']['player_2']['points'] = ctx.req.body.points
                      }
                      
                    }else if(ctx.req.body.round == '4'){
                      if(ctx.req.body.game == '1'){
                        const result_parse = JSON.parse(data.result)
                        result_parse['winnder']['name'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['name']
                        result_parse['winnder']['rni'] = data_parse['round_'+ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player]['rni']
                        result_parse['points'] = ctx.req.body.points

                        const result_update_result = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'result', JSON.stringify(result_parse))
                        if(result_update_result == null)
                            return ctx.res.status(400).json({ errors: 
                                [{
                                    msg: "Возникла ошибка, попробуйте позже!"
                                }]
                            });  
                        return ctx.res.json({"message": "Вы успешно обновили сетку."}); //!!!!!!!!!!!!!!!!!!!!!!!!!!!
                      }
                    }
                    
                  }
                  const result_update_data = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'data', JSON.stringify(data_parse))
                    if(result_update_data == null)
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Возникла ошибка, попробуйте позже!"
                            }]
                        });
                  
                  return ctx.res.json({"message": "Вы успешно обновили сетку."});
                }else if(ctx.req.body.action == 'replace'){
                  const data = await ctx.services.tournament.getSubTournament(ctx.req.query.id, ctx.req.body.subtorunament)
                  const data_parse = JSON.parse(data.data)
                  const result_parse = JSON.parse(data.result)
                  result_parse.replacements.push({
                    'player': data_parse['round_' + ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player],
                    'replace': {
                      'name': ctx.req.body.replace_name != 'X' ? (ctx.req.body.replace_name.split(' ')[0] + ' ' +ctx.req.body.replace_name.split(' ')[1][0] + '.' + ctx.req.body.replace_name.split(' ')[2][0] + '.') : 'X',
                      'rni': ctx.req.body.replace_rni
                    },
                    'points': '50'
                  })

                  data_parse['round_' + ctx.req.body.round]['game_' + ctx.req.body.game]['player_' + ctx.req.body.player] = result_parse.replacements[ result_parse.replacements.length-1 ].replace
                  
                  if (Number(lniToId(ctx.req.body.replace_rni)) != -1){
                    const result_update_status = await ctx.services.tournament.updateStatusEntriesInTournament(ctx.req.query.id, Number(lniToId(ctx.req.body.replace_rni)), 4)
                    if(result_update_status == null)
                      return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                      });
                  }

                  const result_update_data = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'data', JSON.stringify(data_parse))
                    if(result_update_data == null)
                        return ctx.res.status(400).json({ errors: 
                            [{
                                msg: "Возникла ошибка, попробуйте позже!"
                            }]
                        });
                  const result_update_result = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'result', JSON.stringify(result_parse))
                  if(result_update_result == null)
                      return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                      });
                    return ctx.res.json({"message": "Вы успешно заменили игрока."});
                }else if(ctx.req.body.action == 'cancel_replace'){
                  //console.log('cancel_replace----------------------------')
                  const data = await ctx.services.tournament.getSubTournament(ctx.req.query.id, ctx.req.body.subtorunament)
                  const result_parse = JSON.parse(data.result)
                  
                  const indexOfPlayer = () =>{
                    for(let i = 0; i < result_parse['replacements'].length; i++){
                      if(result_parse['replacements'][i].player.rni == ctx.req.body.player){
                        return i;
                      }
                    }
                    return -1;
                  }
                  const index = indexOfPlayer();
                  const replace = result_parse['replacements'][index].replace.rni;
                  result_parse['replacements'].splice(index, 1)

                  if(Number(replace) != -1){
                    const result_update_status = await ctx.services.tournament.updateStatusEntriesInTournament(ctx.req.query.id, Number(lniToId(replace)), 3)
                    if(result_update_status == null)
                      return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                      });
                  }

                  const result_update_result = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'result', JSON.stringify(result_parse))
                  if(result_update_result == null)
                      return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                      });
                    return ctx.res.json({"message": "Вы успешно отменили замену игрока."});
                //REPORT   
                }else if(ctx.req.body.action == 'report'){

                  const sub_tournamnets = await ctx.services.tournament.getSubTournaments(ctx.req.query.id)
                  const data_players = await ctx.services.tournament.getTournamentPlayers(ctx.req.query.id);
                  if(data_players == null)
                    return ctx.res.status(400).json({ errors: 
                      [{
                          msg: "Возникла ошибка, на турнир не заявилось ни 1 участника!"
                      }]
                    });

                  /*if(status_tournament.number_subtournaments == 1 && status_tournament.particions_number == 32) {
                    let last_list = []
                    const push_player = (player) =>{
                      const exist_player = (player) =>{
                        for(let i = 0; i < last_list.length; i++){
                          const element = last_list[i]
                          if(element.name == player.name)
                            return true;
                        }
                        return false;
                      }
                      if(player.name == 'X')
                        return;
                      if(exist_player(player) == false)
                        last_list.push(player)
                    }
                    return
                  }*/

                  let last_list = []
                  const points = () => {
                    switch (Number(status_tournament.type_points)) {
                      case 1:
                        return [0, 0, 0, 0, 0, 0, 0, 0].reverse();
                      case 2:
                        return [54, 56, 58, 60, 63, 64, 66, 68].reverse();
                      case 3:
                        return [50, 52, 54, 56, 58, 60, 62, 64].reverse();
                      case 4:
                        return [46, 48, 50, 52, 54, 56, 58, 60].reverse();
                      case 5:
                        return [42, 44, 46, 48, 50, 52, 54, 56].reverse();
                      default:
                        return [];
                    }
                  }
                  
                 // const type_points = Number(status_tournament.type_points) == 0) ? [64, 62, 60, 58, 56, 54, 52, 50] : [60, 58, 56, 54, 52, 50, 48, 46]
                  const push_player = (player) =>{
                    const exist_player = (player) =>{
                      for(let i = 0; i < last_list.length; i++){
                        const element = last_list[i]
                        if(element.name == player.name)
                          return true;
                      }
                      return false;
                    }
                    if(player.name == 'X')
                      return;
                    if(exist_player(player) == false)
                      last_list.push(player)
                  }


                  for(let sub_tournament of sub_tournamnets){
                    let count_null = 0
                    const result_sub_tournament = sub_tournament.result
                    const winners_sub_tournament = result_sub_tournament.win_players
                    const replacements_sub_tournament = result_sub_tournament.replacements

                    const get_point_player = (count_player) => {
                      if(status_tournament.number_subtournaments == 1 && status_tournament.particions_number == 32) {
                        return 0
                      }
                      return points()[count_player]
                    }

                    for(let i = 0; i < winners_sub_tournament.length; i++){
                      if(winners_sub_tournament[i].name != 'null')
                        push_player( {name: winners_sub_tournament[i].name, rni: lniToId(winners_sub_tournament[i].rni), points: get_point_player(i), place: i+1} )
                      else
                        count_null++
                    }
                    const check_null = () => {
                      if(status_tournament.number_subtournaments == 1 && status_tournament.particions_number == 32) {
                        if(count_null != 0 && count_null != 32){
                          return false
                        }
                      }
                      if(count_null != 0 && count_null != 8){
                        return false
                      }
                      return true
                    }
                    if(!check_null())
                    {
                      return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, одна из сеток заполнена не полностью!"
                        }]
                      });
                    }

                    for(let i = 0; i < replacements_sub_tournament.length; i++){
                      push_player( {name: replacements_sub_tournament[i].player.name, rni: lniToId(replacements_sub_tournament[i].player.rni), points: replacements_sub_tournament[i].points, place: -1} )
                    }

                  }
                  if(last_list.length == 0)
                    return ctx.res.status(400).json({ errors: 
                      [{
                          msg: "Возникла ошибка, отсутсвует хоть 1 заполненная сетка!"
                      }]
                    });
                  for(let i = 0; i < data_players.length; i++){
                    if(Number(data_players[i].status) == 3 || Number(data_players[i].status) == 4)
                      push_player( {name: data_players[i].last_name + ' ' + data_players[i].first_name[0] + '.' + data_players[i].patronymic[0]+'.', rni: data_players[i].lni, points: 50, place: -1} )
                  }
                  //console.log(last_list)
                  //return ctx.res.end()
                  
                  const result_add_results = await ctx.services.tournament.addResultInTournamet(ctx.req.query.id, last_list)
                  if(result_add_results == null)
                    return ctx.res.status(400).json({ errors: 
                      [{
                          msg: "Возникла ошибка, попробуйте позже!"
                      }]
                    });
                  /*
                  last_list.forEach(async (e) => {
                    await ctx.services.player.updatePointsPlayer(lniToId(e.rni))
                  })*/
                  
                  return ctx.res.json({"message": "Вы успешно загрузили отчет."});

                  //console.log(last_list)
                }else if(ctx.req.body.action == 'update_schedule'){
                  const result_update = await ctx.services.tournament.updateScheduleSubtournament(ctx.req.body.subtorunament, ctx.req.body.text )
                  if(result_update == null)
                    return ctx.res.status(400).json({ errors: 
                      [{
                          msg: "Возникла ошибка, попробуйте позже!"
                      }]
                    });
                  return ctx.res.json({"message": "Вы успешно обновили расписание."});
                  //console.log(ctx.req.body.text)
                  //return ctx.res.end()
                }else if(ctx.req.body.action == 'update_points'){
                  const data = await ctx.services.tournament.getSubTournament(ctx.req.query.id, ctx.req.body.subtorunament)
                  const result_parse = JSON.parse(data.result)
                  const l = result_parse.replacements
                  for(let i = 0; i < l.length; i++){
                    if(l[i].player.rni == ctx.req.body.player){
                      l[i].points = ctx.req.body.points
                      break;
                    }
                  };
                  const result_update_result = await ctx.services.tournament.updateSubTournament(ctx.req.query.id, ctx.req.body.subtorunament, 'result', JSON.stringify(result_parse))
                  if(result_update_result == null)
                      return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                      });
                  return ctx.res.json({"message": "Вы успешно обновили очки."});
                }
                return ctx.res.end()
              }

              //GET REQUEST
              const data = await ctx.services.tournament.getSubTournaments(ctx.req.query.id)
              const data_players = await ctx.services.tournament.getTournamentPlayers(ctx.req.query.id);
              let replacement_players = [] 
              let substitute_players = []
              if (data_players != null)
                data_players.forEach(element => {
                  if(Number(element.status) == 3)
                    replacement_players.push(element)
                  if(Number(element.status) == 3 || Number(element.status) == 4)
                  substitute_players.push(element)

                });
              //console.log(data)
              //console.log(status_tournament)
              if(Number(status_tournament.type) == 1)
                return ctx.res.render('referee_grid_tournament', {data: data, replacement_players: replacement_players, substitute_players: substitute_players, status_tournament: status_tournament})
              else
                return ctx.res.render('referee_grid2_tournament', {sub_tournament: data[0], status_tournament: status_tournament})
            }else if(ctx.req.query.action == 'schedule'){
              //POST REQUEST
              if (ctx.req.method == "POST"){
                if(ctx.req.body.action == 'create'){
                  const result_create_schedule = await ctx.services.tournament.createScheduleTournament(ctx.req.query.id)
                  if(result_create_schedule == null)
                      return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                      });
                  return ctx.res.json({"message": "Вы успешно обновили сетку."});
                }else if(ctx.req.body.action == 'update'){
                  //console.log(ctx.req.body)
                  const result_get_schedule = await ctx.services.tournament.getScheduleTournament(ctx.req.query.id)
                  if(result_get_schedule == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                  if(ctx.req.body.type == "m_title"){
                    result_get_schedule.title = ctx.req.body.text
                  }else{
                    const start = Number(ctx.req.body.start)
                    const type = ctx.req.body.type
                    const index = (type == "title") ? Number(ctx.req.body.index) : Number(ctx.req.body.index)+1
                    result_get_schedule.starts[start-1]['court_' + (index)][type] = ctx.req.body.text
                    //console.log(ctx.req.body)
                    //console.log( result_get_schedule.starts[start-1] )
                  }
                  const result_update_schedule = await ctx.services.tournament.updateScheduleTournament(ctx.req.query.id, JSON.stringify(result_get_schedule))
                  if(result_update_schedule == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                  return ctx.res.json({"message": "Вы успешно обновили раписание."});
                  //return ctx.res.end()
                }else if(ctx.req.body.action == 'delete'){
                  const result_get_schedule = await ctx.services.tournament.getScheduleTournament(ctx.req.query.id)
                  if(result_get_schedule == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                    
                    result_get_schedule.starts.splice(Number(ctx.req.body.start)-1, 1)
                    const result_update_schedule = await ctx.services.tournament.updateScheduleTournament(ctx.req.query.id, JSON.stringify(result_get_schedule))
                    if(result_update_schedule == null)
                      return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                      });
                    return ctx.res.json({"message": "Вы успешно обновили раписание."});
                    //console.log(result_get_schedule)

                    //return ctx.res.end()
                }else if(ctx.req.body.action == 'update_color'){
                  const result_get_schedule = await ctx.services.tournament.getScheduleTournament(ctx.req.query.id)
                  if(result_get_schedule == null)
                    return ctx.res.status(400).json({ errors: 
                        [{
                            msg: "Возникла ошибка, попробуйте позже!"
                        }]
                    });
                  
                  result_get_schedule.starts[Number(ctx.req.body.start)-1]['background'] = ctx.req.body.color
                  const result_update_schedule = await ctx.services.tournament.updateScheduleTournament(ctx.req.query.id, JSON.stringify(result_get_schedule))
                    if(result_update_schedule == null)
                      return ctx.res.status(400).json({ errors: 
                          [{
                              msg: "Возникла ошибка, попробуйте позже!"
                          }]
                      });
                  return ctx.res.json({"message": "Вы успешно обновили цвет расписания."});

                }else{
                  return ctx.res.end()
                }
              }
              //GET REQUEST
              const data = await ctx.services.tournament.getScheduleTournament(ctx.req.query.id)
              return ctx.res.render('referee_schedule_tournament', {data: data})
              
            }else if(ctx.req.query.action == 'edit'){
              //POST REQUEST
              if (ctx.req.method == "POST"){

                const data = {
                  name: ctx.req.body.name,
                  payment: ctx.req.body.payment,
                  type: ctx.req.body.type,
                  prize: ctx.req.body.prize,
                  format: ctx.req.body.format,
                  gender: ctx.req.body.gender,
                  date_birdth: ctx.req.body.date_birdth,
                  date_start: ctx.req.body.date_start,
                  date_end: ctx.req.body.date_end,
                  place: ctx.req.body.place,
                  count: ctx.req.body.count,
                  court: ctx.req.body.court,
                  count_court: ctx.req.body.count_court,
                  referee: ctx.req.body.referee,
                  phone_referee: ctx.req.body.phone_referee,
                  email_referee: ctx.req.body.email_referee,
                  type_points: ctx.req.body.type_points,
                  c_info: ctx.req.body.c_info,
                  color: ctx.req.body.color
                }

                if(status_tournament.particions_number != data.count){
                  const result_delete_subtournaments = await ctx.services.tournament.deleteSubTournaments(ctx.req.query.id)
                  if(result_delete_subtournaments == null)
                    return ctx.res.status(400).json({ errors: 
                      [{
                          msg: "Возникла ошибка, попробуйте позже!"
                      }]
                    });
                  const result_create_subtournaments = await ctx.services.tournament.createSubTournaments(ctx.req.query.id, data.type, data.count)
                  if(result_create_subtournaments == null)
                    return ctx.res.status(400).json({ errors: 
                      [{
                          msg: "Возникла ошибка, попробуйте позже!"
                      }]
                    });
                }else if(status_tournament.type != data.type){
                    
                }

                const result_update_tournament = await ctx.services.tournament.updateTournament(ctx.req.query.id, data)
                if(result_update_tournament == null)
                  return ctx.res.status(400).json({ errors: 
                    [{
                        msg: "Возникла ошибка, попробуйте позже!"
                    }]
                  });
                //console.log(data)
                return ctx.res.json({"message": "Вы успешно сохранили турнир."});
                //if ( (Number.isInteger(Number(lniToId(ctx.req.body.id)))) == false)
              }
              //GET REQUEST
              const data = await ctx.services.tournament.getTournament(ctx.req.query.id)
              //console.log(data)
              return ctx.res.render('referee_edit_tournament', {data: data[0]})
            }else if(ctx.req.query.action == 'delete'){
              //POST REQUEST
              if (ctx.req.method == "POST"){
                const result_delete_tournament = await ctx.services.tournament.deleteTournament(ctx.req.query.id)
                if(result_delete_tournament == null)
                  return ctx.res.status(400).json({ errors: 
                    [{
                        msg: "Возникла ошибка, попробуйте позже!"
                    }]
                  });
                return ctx.res.json({"message": "Вы успешно удалили турнир."});
              }
            }else{
                return ctx.res.redirect("/allTournaments")
            }

        }
        const data = await ctx.services.tournament.getTournaments(null);
        //console.log(data)
        if(data.length == 0)
            return ctx.res.render("error")
        return ctx.res.render('all_tournaments', {data: data})
    }
}
module.exports = { AllTournamentsAction }

//'{"round_1":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_5":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_6":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_7":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_8":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}}},"round_2":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"points":"null"},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"points":"null"},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"points":"null"},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"points":"null"}},"round_3":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"points":"null"},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"points":"null"}},"round_4":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"points":"null"}}}'
//16play - {"round_1":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_5":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_6":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_7":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_8":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}}},"round_2":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}}},"round_3":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}}},"round_4":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}}}}
//16play win - {"winnder":"null", "points":"null"}
/*

if sub_tournament.result.replacements.length != 0
                  
                  each v in sub_tournament.result.replacements
                    tr
                      td
                      td
                      td
                      td
                      td
                      td(style = "border-left: 0; border-top: 0;") 
                      td 
                        if v.replace.rni == -1
                          | X
                        else
                          | !{v.replace.name}(!{v.replace.rni})
                      td(style ="background:#ff00005e;") !{v.player.name}(!{v.player.rni})
                      td -
                      td !{v.points}
                      */

/*
if sub_tournament.result.replacements.length != 0
              div#change-players(style="max-width: 230px;")
                h4 Замены
                table.table.table-bordered.table-sm(style='color:white')
                  thead
                    tr
                      th(style='border-top: 0px; min-width: 60px;') Игрок(РНИ)
                      th(style='border-top: 0px; min-width: 160px;') Заменен на(РНИ)
                      th(style='border-top: 0px;') Очки
                  tbody
                    each v in sub_tournament.result.replacements
                      tr
                        td(style="white-space: nowrap;")
                          if v.replace.rni == -1
                            | X
                          else
                            | !{v.replace.name}(!{v.replace.rni})
                        td(style="white-space: nowrap;") !{v.player.name}(!{v.player.rni})
                        td(style="white-space: nowrap;") !{v.points}

                        */
/*
inline//{"win_players":[{"name":"null","rni":"null","points":"null"},{"name":"null","rni":"null","points":"null"},{"name":"null","rni":"null","points":"null"},{"name":"null","rni":"null","points":"null"},{"name":"null","rni":"null","points":"null"},{"name":"null","rni":"null","points":"null"},{"name":"null","rni":"null","points":"null"},{"name":"null","rni":"null","points":"null"}]}
//{"player":{"name":"null","rni":"null"},"replace":{"name":"null","rni":"null"},"points":"null"}
{
   "win_players":[
      {
         "name":"null",
         "rni":"null",
         "points":"null"
      },
      {
         "name":"null",
         "rni":"null",
         "points":"null"
      },
      {
         "name":"null",
         "rni":"null",
         "points":"null"
      },
      {
         "name":"null",
         "rni":"null",
         "points":"null"
      },
      {
         "name":"null",
         "rni":"null",
         "points":"null"
      },
      {
         "name":"null",
         "rni":"null",
         "points":"null"
      },
      {
         "name":"null",
         "rni":"null",
         "points":"null"
      },
      {
         "name":"null",
         "rni":"null",
         "points":"null"
      }
   ]
}
*/

/*
{
   "round_1":{
      "game_1":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_2":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_3":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_4":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      }
   },
   "round_2":{
      "game_1":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_2":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_3":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_4":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      }
   },
   "round_3":{
      "game_1":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_2":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_3":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      },
      "game_4":{
         "player_1":{
           "name": "null",
           "rni": "null"
         },
         "player_2":{
           "name": "null",
           "rni": "null"
         },
         "winnder":"null",
         "points":"null"
      }
   }
}*/