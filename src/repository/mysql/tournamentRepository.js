const { Console } = require('console');

require('../../utils/string')

class TournamentRepository {
    constructor(db) {
        this.db = db;
    }
    async create(data) {
        const str_query = "INSERT INTO tournaments (title, type, format, gender, year_birth, start_date, end_date, place, particions_number, court_type, court_count, head_referee, referee_phone, referee_mail, prize, payment, type_points, c_info, number_subtournaments, color) VALUES ('{0}', {1}, {2}, {3}, '{4}', '{5}', '{6}', '{7}', {8}, '{9}', {10}, '{11}', '{12}', '{13}', '{14}', '{15}', {16}, '{17}', {18}, '{19}')".format(
            data.title,
            data.type,
            data.format,
            data.gender,
            data.year_birth,
            data.start_date,
            data.end_date,
            data.place,
            (data.particions_number * data.subtournaments),
            data.court_type,
            data.court_count,
            data.head_referee,
            data.referee_phone,
            data.referee_mail,
            data.prize,
            data.payment,
            data.type_points,
            data.c_info,
            data.subtournaments,
            data.color
        )
        return await this.db.query_async(str_query);
    }

    async get_calendar(filter){
        const str_query = "SELECT *, DATE_FORMAT(start_date,'%e.%m.%Y') AS start_date, DATE_FORMAT(end_date,'%e.%m.%Y') AS end_date, DATE_FORMAT(DATE_SUB(end_date, INTERVAL IF(tournaments.type = 0, 4, 7) DAY),'%e.%m.%Y') AS end_date_reg, (SELECT IF(COUNT(result_id) > 0, true, false) FROM tournament_results WHERE tournament_results.tournament_id=tournaments.id_tournament) AS status FROM tournaments WHERE (tournaments.start_date BETWEEN '{0}' AND LAST_DAY('{1}')) ORDER BY tournaments.start_date;".format(
            filter.date.start,
            filter.date.end
        )
        return await this.db.query_async(str_query);
    }

    async get_all(player_id){
        /*const str_query = (player_id == null) ? "SELECT *, DATE_FORMAT(start_date,\'%e.%m.%Y\') AS start_date, DATE_FORMAT(end_date,\'%e.%m.%Y\') AS end_date, DATE_FORMAT(DATE_SUB(end_date, INTERVAL 7 DAY),\'%e.%m.%Y\') AS end_date_reg FROM tournaments" : 
        "SELECT *, DATE_FORMAT(start_date,\'%e.%m.%Y\') AS start_date, DATE_FORMAT(end_date,\'%e.%m.%Y\') AS end_date, DATE_FORMAT(DATE_SUB(end_date, INTERVAL 7 DAY),\'%e.%m.%Y\') AS end_date_reg, (SELECT tournament_id FROM tournaments_entries WHERE player_id={0} AND tournament_id= tournaments.id_tournament) AS t_id FROM tournaments".format(
            player_id
        )*/
        /*const str_query = (player_id == null) ? "SELECT *, DATE_FORMAT(start_date,\'%e.%m.%Y\') AS start_date, DATE_FORMAT(end_date,\'%e.%m.%Y\') AS end_date, DATE_FORMAT(DATE_SUB(end_date, INTERVAL 7 DAY),\'%e.%m.%Y\') AS end_date_reg FROM tournaments" : 
        "SELECT *, DATE_FORMAT(start_date,\'%e.%m.%Y\') AS start_date, DATE_FORMAT(end_date,\'%e.%m.%Y\') AS end_date, DATE_FORMAT(DATE_SUB(end_date, INTERVAL 7 DAY),\'%e.%m.%Y\') AS end_date_reg, (SELECT IF( EXISTS( SELECT * FROM tournaments_entries WHERE player_id={0} AND tournament_id= tournaments.id_tournament), true, false)) AS state_req, ((SELECT IF(COUNT(withdrawal_id) < 2, true, false) FROM tournaments_withdrawal WHERE tournaments_withdrawal.tournament_id=tournaments.id_tournament AND tournaments_withdrawal.player_id={1})) AS withdrawal_status FROM tournaments".format(
            player_id,
            player_id
        )*/
        const str_query = (player_id == null) ? "SELECT *, DATE_FORMAT(start_date,\'%e.%m.%Y\') AS start_date, DATE_FORMAT(end_date,\'%e.%m.%Y\') AS end_date, DATE_FORMAT(DATE_SUB(end_date, INTERVAL 7 DAY),\'%e.%m.%Y\') AS end_date_reg, (SELECT IF(COUNT(result_id) > 0, true, false) FROM tournament_results WHERE tournament_results.tournament_id=tournaments.id_tournament) AS status FROM tournaments ORDER BY tournaments.start_date" : 
        " SELECT *, (SELECT tournaments_entries.status FROM tournaments_entries WHERE tournaments_entries.player_id = {0} AND tournaments_entries.tournament_id=tournaments.id_tournament) AS p_status, (SELECT IF(COUNT(entries_id) < 8, true, false) FROM tournaments_entries WHERE tournaments_entries.status=3 AND tournaments_entries.tournament_id=tournaments.id_tournament) AS exist_spare, DATE_FORMAT(start_date,\'%e.%m.%Y\') AS start_date, DATE_FORMAT(end_date,\'%e.%m.%Y\') AS end_date, DATE_FORMAT(DATE_SUB(end_date, INTERVAL 7 DAY),\'%e.%m.%Y\') AS end_date_reg, ((SELECT IF(COUNT(withdrawal_id) < 2, true, false) FROM tournaments_withdrawal WHERE tournaments_withdrawal.tournament_id=tournaments.id_tournament AND tournaments_withdrawal.player_id={1})) AS withdrawal_status FROM tournaments ORDER BY tournaments.start_date".format(
            player_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async get_status(tournament_id){
        const str_query = "SELECT (SELECT IF(COUNT(tournament_results.result_id) > 0, true, false) FROM tournament_results WHERE tournament_results.tournament_id = {0}) AS status, type, particions_number, type_points, number_subtournaments FROM tournaments WHERE id_tournament={1}".format(
            tournament_id,
            tournament_id
        )
        return await this.db.query_async(str_query); 
    }

    async get_count_players(tournament_id){
        const str_query = "SELECT COUNT(entries_id) AS player_count FROM tournaments_entries WHERE tournament_id={0} AND status=1".format(
            tournament_id
        )
        return await this.db.query_async(str_query);

    }
    async get_count_w_players(tournament_id){
        const str_query = "SELECT COUNT(entries_id) AS player_count FROM tournaments_entries WHERE tournament_id={0} AND status=2".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async get_tournament(tournament_id){
        const str_query = "SELECT *, DATE_FORMAT(start_date,\'%e.%m.%Y\') AS start_date, DATE_FORMAT(end_date,\'%e.%m.%Y\') AS end_date, DATE_FORMAT(DATE_SUB(end_date, INTERVAL 6  DAY),\'%e.%m.%Y\') AS end_date_reg FROM tournaments WHERE id_tournament={0}".format(
            tournament_id
        ) 
        return await this.db.query_async(str_query);
    }

    async register_player(tournament_id, player_id, status, note, points){
        
        /*const str_query2 = "INSERT INTO tournaments_entries_snapshot (tournament_id, player_id, status) VALUES ({0}, '{1}', {2})".format(
            tournament_id,
            player_id,
            status
        )
        await this.db.query_async(str_query2);*/
        const str_query = "INSERT INTO tournaments_entries (tournament_id, player_id, status, note, create_at, update_at, points) VALUES ({0}, '{1}', {2}, '{3}', NOW(), NOW(), {4})".format(
            tournament_id,
            player_id,
            status,
            note,
            points
        )
        return await this.db.query_async(str_query);
    }
    async unregister_player(tournament_id, player_id){

        const str_query = "DELETE FROM tournaments_entries WHERE tournament_id={0} AND player_id={1} LIMIT 1".format(
            tournament_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async get_players(tournament_id){
        const str_query = "SELECT players.player_id, players.first_name, players.last_name, players.patronymic,DATE_FORMAT(players.date_birth,\'%e.%m.%Y\') AS date_birth, players.city, tournaments_entries.status, tournaments_entries.note, tournaments_entries.update_at, tournaments_entries.points AS PN FROM players, tournaments_entries WHERE players.player_id=tournaments_entries.player_id AND tournaments_entries.tournament_id = {0} ORDER BY tournaments_entries.update_at".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }
    async get_count_entries(tournament_id, player_id){
        const str_query = "SELECT COUNT(withdrawal_id) AS withdrawal_count FROM tournaments_withdrawal WHERE tournament_id={0} AND player_id={1}".format(
            tournament_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async update_status_entries(tournament_id, player_id, status){
        const str_query = "UPDATE tournaments_entries SET status={0}, update_at=NOW() WHERE tournament_id={1} AND player_id={2} LIMIT 1".format(
            status,
            tournament_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async add_withdrawal(tournament_id, player_id){
        const str_query = "INSERT INTO tournaments_withdrawal (tournament_id, player_id) VALUES ({0}, '{1}')".format(
            tournament_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async exist_player(tournament_id, player_id){
        const str_query = "SELECT COUNT(*) > 0 AS result FROM tournaments_entries WHERE player_id='{0}' AND tournament_id={1} LIMIT 1".format(
            player_id,
            tournament_id
        )
        return await this.db.query_async(str_query);
    }
    async get_subtournaments(tournament_id){
        const str_query = "SELECT * FROM sub_tournaments WHERE tournament_id={0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }
    async get_subtournament(tournament_id, subtournament_id){
        const str_query = "SELECT * FROM sub_tournaments WHERE tournament_id={0} AND subtournament_id={1} LIMIT 1".format(
            tournament_id,
            subtournament_id
        )
        return await this.db.query_async(str_query);
    }
    async get_subtournament_2(tournament_id, ordinal_number){
        const str_query = "SELECT * FROM sub_tournaments WHERE tournament_id={0} AND ordinal_number={1} LIMIT 1".format(
            tournament_id,
            ordinal_number
        )
        return await this.db.query_async(str_query);
    }
    async update_subtournament(tournament_id, subtournament_id, value, data){
        const str_query = "UPDATE sub_tournaments SET {0}='{1}' WHERE tournament_id={2} AND subtournament_id={3} LIMIT 1".format(
            value,
            data,
            tournament_id,
            subtournament_id
        )
        return await this.db.query_async(str_query);
    }
    async add_draw(tournament_id, player_id, number){
        const str_query = "INSERT INTO  tournaments_draws (tournament_id, player_id, number) VALUES ({0}, '{1}', {2})".format(
            tournament_id,
            player_id,
            number
        )
        return await this.db.query_async(str_query);
    }

    async check_draw(tournament_id, player_id){
        const str_query = "SELECT COUNT(*) > 0 AS result FROM tournaments_draws WHERE player_id='{0}' AND tournament_id={1} LIMIT 1".format(
            player_id,
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async get_draw(tournament_id){
        const str_query = "SELECT players.player_id, players.first_name, players.last_name, players.patronymic,DATE_FORMAT(players.date_birth,\'%e.%m.%Y\') AS date_birth, players.city, tournaments_entries.status, (SELECT number FROM tournaments_draws WHERE tournaments_draws.tournament_id={0} AND tournaments_draws.player_id=tournaments_entries.player_id) AS number, (tournaments_entries.points) AS PN FROM players, tournaments_entries WHERE players.player_id=tournaments_entries.player_id AND tournaments_entries.tournament_id = {1} AND tournaments_entries.status = 1 ORDER BY PN DESC, tournaments_entries.update_at".format(
            tournament_id,
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async update_draw(tournament_id, player_id, number){
        const str_query = "UPDATE tournaments_draws SET number='{0}' WHERE tournament_id={1} AND player_id={2} LIMIT 1".format(
            number,
            tournament_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async add_result(tournament_id, data){
        let values = ''
        for(let i = 0; i < data.length; i++){
            const element = data[i] 
            values = values + (i == 0 ? '' : ',') +'({0}, {1}, {2}, {3})'.format(
                tournament_id,
                element.rni,
                element.place, 
                element.points
            )
        }
        const str_query = "INSERT INTO tournament_results (tournament_id, player_id, position, points) VALUES " + values

       // console.log(str_query)
        return await this.db.query_async(str_query);
    }

    async get_credit_tournaments(player_id, start, end){
        const str_query = "SELECT *, DATE_FORMAT(tournaments.start_date,'%e.%m.%Y') AS start_date FROM tournament_results, tournaments WHERE (create_at BETWEEN '" + start +"' AND '"+ end +"') AND player_id = {0} AND tournaments.id_tournament=tournament_results.tournament_id ORDER BY tournament_results.points DESC LIMIT 10".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }
    
    async create_sub_tournaments(tournament_id, type, particions_number, subtournaments){
        let values = ''
        if(Number(type) == 1){
            
            if(particions_number == 32 && subtournaments == 1){
                const null_data = '{"round_1":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_5":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_6":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_7":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_8":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_9":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_10":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_11":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_12":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_13":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_14":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_15":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_16":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"}},"round_2":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_5":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_6":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_7":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_8":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_9":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_10":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_11":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_12":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_13":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_14":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_15":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_16":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"}},"round_3":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_5":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_6":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_7":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_8":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_9":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_10":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_11":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_12":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_13":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_14":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_15":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_16":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"}},"round_4":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_5":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_6":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_7":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_8":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_9":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_10":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_11":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_12":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_13":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_14":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_15":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_16":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"}},"round_5":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_5":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_6":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_7":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_8":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_9":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_10":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_11":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_12":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_13":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_14":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_15":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"},"game_16":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"},"winnder":"null","points":"null"}}}'
                const null_result = '{"win_players":[{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"}],"replacements":[]}'
                values = "({0}, {1}, '{2}', '{3}', '')".format(
                    tournament_id,
                    1,
                    null_data, 
                    null_result
                )
            }else{
                const null_data = '{ "round_1":{ "game_1":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_2":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_3":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_4":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" } }, "round_2":{ "game_1":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_2":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_3":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_4":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" } }, "round_3":{ "game_1":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_2":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_3":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" }, "game_4":{ "player_1":{ "name":"null", "rni":"null" }, "player_2":{ "name":"null", "rni":"null" }, "winnder":"null", "points":"null" } } }'
                const null_result = '{"win_players":[{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"},{"name":"null","rni":"null"}],"replacements":[]}'
                for(let i = 1; i <= subtournaments; i++){
                    values = values + (i == 1 ? '' : ',') +"({0}, {1}, '{2}', '{3}', '')".format(
                        tournament_id,
                        i,
                        null_data, 
                        null_result
                    )
                }
            }
        
        }else{
            if(Number(particions_number) == 16){
                const null_data = '{"round_1":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_5":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_6":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_7":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_8":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}}},"round_2":{"game_1":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}},"game_2":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}},"game_3":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}},"game_4":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}}},"round_3":{"game_1":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}},"game_2":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}}},"round_4":{"game_1":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}}}}'
                const null_result = '{"winnder":{"name":"null","rni":"null"},"points":"null"}'
                values = values + "({0}, {1}, '{2}', '{3}', '')".format(
                    tournament_id,
                    1,
                    null_data, 
                    null_result
                )
            }else if(Number(particions_number) == 8){
                const null_data = '{"round_1":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_3":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_4":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}}},"round_2":{"game_1":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}},"game_2":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}}},"round_3":{"game_1":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}}}}'
                const null_result = '{"winnder":{"name":"null","rni":"null"},"points":"null"}'
                values = values + "({0}, {1}, '{2}', '{3}', '')".format(
                    tournament_id,
                    1,
                    null_data, 
                    null_result
                )
            }else if(Number(particions_number) == 4){
                const null_data = '{"round_1":{"game_1":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}},"game_2":{"player_1":{"name":"null","rni":"null"},"player_2":{"name":"null","rni":"null"}}},"round_2":{"game_1":{"player_1":{"name":"null","rni":"null","points":"null"},"player_2":{"name":"null","rni":"null","points":"null"}}}}'
                const null_result = '{"winnder":{"name":"null","rni":"null"},"points":"null"}'
                values = values + "({0}, {1}, '{2}', '{3}', '')".format(
                    tournament_id,
                    1,
                    null_data, 
                    null_result
                )
            }
        }
    
        const str_query = "INSERT INTO sub_tournaments (tournament_id, ordinal_number, data, result, schedule) VALUES " + values
        return await this.db.query_async(str_query);
    }


    async delete_entries(tournament_id){
        const str_query = "DELETE FROM tournaments_entries WHERE tournament_id={0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async get_entries(tournament_id){
        const str_query = "SELECT players.player_id, players.first_name, players.last_name, players.patronymic,DATE_FORMAT(players.date_birth,'%e.%m.%Y') AS date_birth, players.city, tournaments_entries.status, tournaments_entries.note, (SELECT players_points.points FROM players_points WHERE players_points.player_id = players.player_id) AS PN FROM players, tournaments_entries WHERE players.player_id=tournaments_entries.player_id AND tournaments_entries.tournament_id = {0}".format( //ORDER BY PN  DESC
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async create_entries(tournament_id, data){
        let values = ''
        for(let i = 0; i < data.length; i++){
            const element = data[i] 
            values = values + (i == 0 ? '' : ',') +"({0}, {1}, {2}, '{3}')".format(
                tournament_id,
                element.player_id,
                element.status,
                element.note
            )
        }
        const str_query = "INSERT INTO tournaments_entries (tournament_id, player_id, status) VALUES " + values
        //console.log(str_query)
        return await this.db.query_async(str_query);
    }

    async up_player(tournament_id){
        
        const str_query = "UPDATE tournaments_entries SET status=1 WHERE status=3 AND tournament_id = {0} ORDER BY tournaments_entries.update_at LIMIT 1".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async update_schedule(subtournament_id, text){
        const str_query = "UPDATE sub_tournaments SET schedule='{0}' WHERE subtournament_id={1} LIMIT 1".format(
            text,
            subtournament_id
        )
        return await this.db.query_async(str_query);
    }

    async get_exist_schedule(tournament_id){
        const str_query = "SELECT IF(COUNT(schedule_id) > 0, true, false) AS exist FROM tournaments_schedule WHERE tournament_id={0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async create_schedule(tournament_id){
        const data = '{"title":"null","starts":[{"court_1":{"title":"null","player_1":"null","player_2":"null"},"court_2":{"title":"null","player_1":"null","player_2":"null"},"court_3":{"title":"null","player_1":"null","player_2":"null"},"court_4":{"title":"null","player_1":"null","player_2":"null"}, "background":"null"}]}'
        const str_query = "INSERT INTO  tournaments_schedule (tournament_id, data) VALUES ({0}, '{1}')".format(
            tournament_id,
            data
        )
        return await this.db.query_async(str_query);
    }

    async get_schedule(tournament_id){
        const str_query = "SELECT data FROM tournaments_schedule WHERE tournament_id={0} LIMIT 1".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async update_schedule_t(tournament_id, data){
        const str_query = "UPDATE tournaments_schedule SET data='{0}' WHERE tournament_id={1} LIMIT 1".format(
            data,
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async update_tournament(tournament_id, data){
        const str_query = "UPDATE `tournaments` SET `title`='{0}',`type`={1},`format`={2},`gender`={3},`year_birth`='{4}',`start_date`='{5}',`end_date`='{6}',`place`='{7}',`particions_number`={8},`court_type`='{9}',`court_count`={10},`head_referee`='{11}',`referee_phone`='{12}',`referee_mail`='{13}',`prize`='{14}',`payment`='{15}',`type_points`={16}, `c_info`='{17}', `color`='{18}' WHERE `id_tournament`={19} LIMIT 1".format(
            data.name,
            data.type,
            data.format,
            data.gender,
            data.date_birdth,
            data.date_start,
            data.date_end,
            data.place,
            data.count,
            data.court,
            data.count_court,
            data.referee,
            data.phone_referee,
            data.email_referee,
            data.prize,
            data.payment,
            data.type_points,
            data.c_info,
            data.color,

            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_subtournaments(tournament_id){
        const str_query = "DELETE FROM `sub_tournaments` WHERE `tournament_id` = {0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_tournament(tournament_id){
        const str_query = "DELETE FROM `tournaments` WHERE `tournament_id` = {0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_tournament(tournament_id){
        const str_query = "DELETE FROM `tournaments` WHERE `id_tournament` = {0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_schedule(tournament_id){
        const str_query = "DELETE FROM `tournaments_schedule` WHERE `tournament_id` = {0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_withdrawal(tournament_id){
        const str_query = "DELETE FROM `tournaments_withdrawal` WHERE `tournament_id` = {0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_results(tournament_id){
        const str_query = "DELETE FROM `tournament_results` WHERE `tournament_id` = {0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_draws(tournament_id){
        const str_query = "DELETE FROM `tournaments_draws` WHERE `tournament_id` = {0}".format(
            tournament_id
        )
        return await this.db.query_async(str_query);
    }

    async get_points(player_id){
        const str_query = "SELECT points FROM players_points WHERE player_id = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    //////
    async delete_withdrawal_by_player(player_id){
        const str_query = "DELETE FROM `tournaments_withdrawal` WHERE `player_id` = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_results_by_player(player_id){
        const str_query = "DELETE FROM `tournament_results` WHERE `player_id` = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_draws_by_player(player_id){
        const str_query = "DELETE FROM `tournaments_draws` WHERE `player_id` = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_entries_by_player(player_id){
        const str_query = "DELETE FROM `tournaments_entries` WHERE `player_id` = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async update_cinfo(tournament_id, text){
        const str_query = "UPDATE tournaments SET c_info='{0}' WHERE id_tournament={1} LIMIT 1".format(
            text,
            tournament_id
        )
        return await this.db.query_async(str_query);
    }


    
}

module.exports = { TournamentRepository }