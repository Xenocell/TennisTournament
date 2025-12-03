require('../../utils/string')

class PlayerRepository {
    constructor(db) {
        this.db = db;
    }
    
    async create_address_info(data) {
        const str_query = "INSERT INTO address_info (postal_code, city, region, street, house, corpus, flat) VALUES ({0}, '{1}', '{2}', '{3}', '{4}', '{5}', '{6}')".format(
            data.postal_code,
            data.city,
            data.region,
            data.street,
            data.house,
            data.corpus,
            data.flat
        )
        return await this.db.query_async(str_query);
    }
    async update_address_info(player_id, address_info_id, data) {
        const str_query = "UPDATE address_info SET postal_code={0}, city='{1}', region='{2}', street='{3}', house='{4}', corpus='{5}', flat={6} WHERE {7} LIMIT 1".format(
            data.postal_code,
            data.city,
            data.region,
            data.street,
            data.house,
            data.corpus,
            data.flat,
            (player_id) ? 
                ('address_id IN (SELECT address_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('address_id='+address_info_id)
        )
        return await this.db.query_async(str_query);
    }

    async update_passport_info(player_id, passport_info_id, data) {
        const str_query = "UPDATE passport_info SET series='{0}', number='{1}', date_issue='{2}', organization='{3}' WHERE {4} LIMIT 1".format(
            data.series,
            data.number,
            data.date_issue,
            data.organization,
            (player_id) ? 
                ('passport_id IN (SELECT passport_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('passport_id='+passport_info_id)
        )
        return await this.db.query_async(str_query);
    }
    async update_sport_info(player_id, sport_info_id, data) {
        const str_query = "UPDATE sports_info SET organization='{0}', city='{1}', last_name_trainer='{2}', first_name_trainer='{3}', patronymic_trainer='{4}', start_year='{5}', last_name_first_trainer='{6}', first_name_first_trainer='{7}', patronymic_first_trainer='{8}', first_organization='{9}', city_first_organization='{10}' WHERE {11} LIMIT 1".format(
            data.organization,
            data.city,
            data.last_name_trainer,
            data.first_name_trainer,
            data.patronymic_trainer,
            data.start_year,
            data.last_name_first_trainer,
            data.first_name_first_trainer,
            data.patronymic_first_trainer,
            data.first_organization,
            data.city_first_organization,
            (player_id) ? 
                ('sport_id IN (SELECT sport_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('sport_id='+sport_info_id)
        )
        return await this.db.query_async(str_query);
    }

    async update_player(player_id, data) {
        const str_query = "UPDATE players SET first_name='{0}', last_name='{1}', patronymic='{2}', gender={3}, date_birth='{4}', citizenship='{5}', city='{6}', phone_number='{7}', email='{8}' WHERE player_id={9} LIMIT 1".format(
            data.first_name,
            data.last_name,
            data.patronymic,
            data.gender,
            data.date_birth,
            data.citizenship,
            data.city,
            data.phone_number,
            data.email,
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async create_passport_info(data) {
        const str_query = "INSERT INTO passport_info (series, number, date_issue, organization) VALUES ('{0}', '{1}', '{2}', '{3}')".format(
            data.series,
            data.number,
            data.date_issue,
            data.organization
        )
        return await this.db.query_async(str_query);
    }

    async create_sport_info(data) {
        const str_query = "INSERT INTO sports_info (organization, city, last_name_trainer, first_name_trainer, patronymic_trainer, start_year, last_name_first_trainer, first_name_first_trainer, patronymic_first_trainer, first_organization, city_first_organization) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', '{10}')".format(
            data.organization,
            data.city,
            data.last_name_trainer,
            data.first_name_trainer,
            data.patronymic_trainer,
            data.start_year,
            data.last_name_first_trainer,
            data.first_name_first_trainer,
            data.patronymic_first_trainer,
            data.first_organization,
            data.city_first_organization
        )
        return await this.db.query_async(str_query);
    }
    async first_check(data){
        const str_query = "SELECT COUNT(*) > 0 AS result FROM players WHERE first_name='{0}' AND last_name='{1}' AND patronymic='{2}'".format(
            data.first_name,
            data.last_name,
            data.patronymic
        )
        return await this.db.query_async(str_query);
    }
    async create_player(data) {
        const str_query_representative = "INSERT INTO players (account_id, representative_id, first_name, last_name, patronymic, gender, date_birth, citizenship, city, phone_number, email, address_info_id, passport_info_id, sport_info_id, status, create_at, update_at) VALUES ({0}, {1}, '{2}', '{3}', '{4}', {5}, '{6}', '{7}', '{8}', '{9}', '{10}', {11}, {12}, {13}, 0, NOW(), NOW())".format(
            data.account_id,
            data.representative_id,
            data.first_name,
            data.last_name,
            data.patronymic,
            data.gender,
            data.date_birth,
            data.citizenship,
            data.city,
            data.phone_number,
            data.email,
            data.address_info_id,
            data.passport_info_id,
            data.sport_info_id
        )
        return await this.db.query_async(str_query_representative);
    }

    async get_player(account_id, player_id) {
        const str_query = "SELECT player_id, representative_id, first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,\'%e-%m-%Y\') AS date_birth, citizenship, city, phone_number, email, address_info_id, passport_info_id, sport_info_id, status FROM players WHERE {0} LIMIT 1".format(
            (account_id != null) ? ('account_id='+account_id) : ('player_id='+player_id)
        )
        return await this.db.query_async(str_query);
    }
    async get_address_info(player_id, address_info_id) {
        const str_query = "SELECT postal_code, city, region, street, house, corpus, flat FROM address_info WHERE {0} LIMIT 1".format(
            (player_id) ? 
                ('address_id IN (SELECT address_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('address_id='+address_info_id)
        )
        return await this.db.query_async(str_query);
    }
    async get_passport_info(player_id, passport_info_id) {
        const str_query = "SELECT series, number, DATE_FORMAT(date_issue,\'%e-%m-%Y\') AS date_issue, organization FROM passport_info WHERE {0} LIMIT 1".format(
            (player_id) ? 
                ('passport_id IN (SELECT passport_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('passport_id='+passport_info_id)
        )
        return await this.db.query_async(str_query);
    }
    async get_sport_info(player_id, sport_info_id) {
        const str_query = "SELECT * FROM sports_info WHERE {0} LIMIT 1".format(
            (player_id) ? 
                ('sport_id IN (SELECT sport_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('sport_id='+sport_info_id)
        )
        return await this.db.query_async(str_query);
    }
    async get_new_players(){
        //const sqr_query = "SELECT player_id, account_id, first_name, last_name, patronymic FROM players WHERE status=0"
        const sqr_query = "SELECT player_id, account_id, first_name, last_name, patronymic, (SELECT representative_id FROM representatives WHERE account_id=players.account_id) AS r_id FROM players WHERE status=0"
        return await this.db.query_async(sqr_query);
    }
    async get_players(account_id){
        const sqr_query = "SELECT player_id, account_id, first_name, last_name, patronymic, status FROM players WHERE account_id={0}".format(
            account_id
        )
        return await this.db.query_async(sqr_query);
    }
    async get_all_players(){
        const sqr_query = "SELECT player_id, account_id, first_name, last_name, patronymic, status, (SELECT representative_id FROM representatives WHERE representatives.representative_id=players.representative_id) AS r_id FROM players"
        return await this.db.query_async(sqr_query);
    }
    async update_value_player(player_id, key, value) {
        const sqr_query = "UPDATE players SET {0}={1} WHERE player_id={2} LIMIT 1".format(
            key,
            Number.isInteger(value) ? Number(value) : "'"+ value +"'",
            player_id
        )
        return await this.db.query_async(sqr_query);
    }

    async delete_address_info(player_id, address_info_id) {
        const str_query = "DELETE FROM address_info WHERE {0} LIMIT 1".format(
            (player_id) ? 
                ('address_id IN (SELECT address_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('address_id='+address_info_id)
        )
        return await this.db.query_async(str_query);
    }
    async delete_passport_info(player_id, passport_info_id) {
        const str_query = "DELETE FROM passport_info WHERE {0} LIMIT 1".format(
            (player_id) ? 
                ('passport_id IN (SELECT passport_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('passport_id='+passport_info_id)
        )
        return await this.db.query_async(str_query);
    }
    async delete_sport_info(player_id, sport_info_id) {
        const str_query = "DELETE FROM sports_info WHERE {0} LIMIT 1".format(
            (player_id) ? 
                ('sport_id IN (SELECT sport_info_id FROM players WHERE player_id = '+ player_id +')') :
                ('sport_id='+sport_info_id)
        )
        return await this.db.query_async(str_query);
    }
    async delete_player(player_id) {
        const str_query = "DELETE FROM players WHERE player_id={0} LIMIT 1".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async rejection_player(player_id, message) {
        const str_query = "INSERT INTO rejection_members (player_id, message) VALUES ({0}, '{1}')".format(
            player_id,
            message
        )
        return await this.db.query_async(str_query);
    }

    async get_rejection_player_message(player_id){
        const str_query = "SELECT message FROM rejection_members WHERE player_id = {0} ORDER BY rejection_id DESC LIMIT 1".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async check_accessory(player_id, account_id){
        const str_query = "SELECT IF(account_id = {0}, true, false) AS result FROM `players` WHERE player_id = {1} LIMIT 1".format(
            account_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async check_exist(player_id){
        const str_query = "SELECT COUNT(*) > 0 AS result FROM players WHERE player_id='{0}' LIMIT 1".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async get_classification(first_index, start, end, gender){
        //SELECT players.player_id, first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,'%e.%m.%Y') AS date_birth, city, tournament_results.points FROM players, tournament_results WHERE tournament_results.player_id = players.player_id ORDER BY tournament_results.points DESC LIMIT 0, 25
        //SELECT COUNT(player_id), first_name, last_name, patronymic, gender, date_birth, city FROM players LIMIT 5
        //const str_query = "SELECT player_id, first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,\'%e.%m.%Y\') AS date_birth, city FROM players LIMIT {0}, 25".format(
            //const str_query = "SELECT players.player_id, first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,'%e.%m.%Y') AS date_birth, city, (SELECT SUM(tournament_results.points) FROM tournament_results WHERE tournament_results.player_id=players.player_id ) AS PN, (SELECT COUNT(result_id) FROM tournament_results WHERE tournament_results.player_id=players.player_id) AS count_tournaments FROM players, tournament_results WHERE tournament_results.player_id = players.player_id ORDER BY PN DESC LIMIT {0}, 25".format(
        
        var str_query = ""
        if(gender == -1){
            str_query = "SELECT players.player_id, players.first_name, players.last_name, players.patronymic, players.gender, DATE_FORMAT(players.date_birth,'%e.%m.%Y') AS date_birth, players.city, players_points.points,(SELECT COUNT(result_id) FROM tournament_results WHERE (tournament_results.create_at BETWEEN '"+ start +"' AND '"+ end +"') AND tournament_results.player_id=players.player_id) AS count_tournaments, (SELECT COUNT(result_id) FROM tournament_results WHERE (tournament_results.create_at BETWEEN '"+ start +"' AND '"+ end +"') AND tournament_results.player_id=players.player_id AND tournament_results.position != -1 LIMIT 4) AS zachet_tournaments FROM players LEFT JOIN players_points ON players.player_id = players_points.player_id ORDER BY players_points.points DESC, players.player_id LIMIT {0}, 25".format(
                first_index
            )
        }else{
            str_query = "SELECT players.player_id, players.first_name, players.last_name, players.patronymic, players.gender, DATE_FORMAT(players.date_birth,'%e.%m.%Y') AS date_birth, players.city, players_points.points,(SELECT COUNT(result_id) FROM tournament_results WHERE (tournament_results.create_at BETWEEN '"+ start +"' AND '"+ end +"') AND tournament_results.player_id=players.player_id) AS count_tournaments, (SELECT COUNT(result_id) FROM tournament_results WHERE (tournament_results.create_at BETWEEN '"+ start +"' AND '"+ end +"') AND tournament_results.player_id=players.player_id AND tournament_results.position != -1 LIMIT 4) AS zachet_tournaments FROM players LEFT JOIN players_points ON players.player_id = players_points.player_id WHERE players.gender = {0} ORDER BY players_points.points DESC, players.player_id LIMIT {1}, 25".format(
                gender,
                first_index
            )
        }
        return await this.db.query_async(str_query);
    }
    async get_classification_p(player_id){
        //SELECT players.player_id, first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,'%e.%m.%Y') AS date_birth, city, tournament_results.points FROM players, tournament_results WHERE tournament_results.player_id = players.player_id ORDER BY tournament_results.points DESC LIMIT 0, 25
        //SELECT COUNT(player_id), first_name, last_name, patronymic, gender, date_birth, city FROM players LIMIT 5
        //const str_query = "SELECT player_id, first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,\'%e.%m.%Y\') AS date_birth, city FROM players LIMIT {0}, 25".format(
            //const str_query = "SELECT players.player_id, first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,'%e.%m.%Y') AS date_birth, city, (SELECT SUM(tournament_results.points) FROM tournament_results WHERE tournament_results.player_id=players.player_id ) AS PN, (SELECT COUNT(result_id) FROM tournament_results WHERE tournament_results.player_id=players.player_id) AS count_tournaments FROM players, tournament_results WHERE tournament_results.player_id = players.player_id ORDER BY PN DESC LIMIT {0}, 25".format(
        const str_query = "SELECT players.player_id, players.first_name, players.last_name, players.patronymic, players.gender, DATE_FORMAT(players.date_birth,'%e.%m.%Y') AS date_birth, players.city, (SELECT players_points.points FROM players_points WHERE players_points.player_id = players.player_id) AS PN, (SELECT COUNT(result_id) FROM tournament_results WHERE tournament_results.player_id=players.player_id) AS count_tournaments FROM players WHERE players.player_id={0} ORDER BY PN DESC".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async get_count_players(gender){
        var str_query = ""
        if(gender == -1){
            str_query = "SELECT COUNT(*) AS result FROM players"
        }else{
            str_query = "SELECT COUNT(*) AS result FROM players WHERE players.gender = " + gender
        }
        return await this.db.query_async(str_query);
    }
    async ban(player_id, date){
        const str_query = "INSERT INTO players_banned (player_id, date) VALUES ({0}, '{1}')".format(
            player_id,
            date
        )
        return await this.db.query_async(str_query);
    }
    async get_ban(player_id){
        const str_query = "SELECT DATE_FORMAT(date,'%e.%m.%Y') AS date FROM players_banned WHERE player_id={0} ORDER BY ban_id DESC LIMIT 1".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async create_points(player_id){
        const str_query = "INSERT INTO players_points (player_id, points) VALUES ({0}, 0)".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async update_points(player_id){
        const str_query = "UPDATE players_points SET points=(SELECT IF(sum(points) IS NULL, 0,sum(points)) FROM (SELECT points, player_id FROM tournament_results WHERE create_at > (LAST_DAY(NOW()) - INTERVAL 3 MONTH) AND tournament_results.player_id={0} ORDER BY points DESC LIMIT 6) AS points) WHERE player_id={1} LIMIT 1".format(
            player_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async add_payment(player_id, year){
        const str_query = "INSERT INTO payments (player_id, year) VALUES ({0}, '{1}')".format(
            player_id,
            year
        )
        return await this.db.query_async(str_query);
    }

    async delete_payment(player_id, year){
        const str_query = "DELETE FROM payments WHERE player_id={0} AND year={1}".format(
            player_id,
            year
        )
        return await this.db.query_async(str_query);
    }

    async get_payments(player_id){
        const str_query = "SELECT year, DATE_FORMAT(date_payment,'%e.%m.%Y') AS date_payment FROM `payments` WHERE YEAR(concat(payments.year, '-01-01')) >= YEAR(NOW()) AND player_id={0} LIMIT 2".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async exist_payment(player_id, year){
        const str_query = "SELECT IF(COUNT(id_payment) > 0, true, false) AS exist FROM payments WHERE player_id={0} AND year={1}".format(
            player_id,
            year
        )
        return await this.db.query_async(str_query);
    }

    async get_min_player(player_id){
        const str_query = "SELECT gender, status, DATE_FORMAT(date_birth,'%e.%m.%Y') AS date_birth, (SELECT players_points.points FROM players_points WHERE players_points.player_id = players.player_id) AS points FROM players WHERE player_id={0} LIMIT 1".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }
    /////////////
    async delete_representative_by_player(player_id){
        const str_query = "DELETE FROM `representatives` WHERE `representative_id` = (SELECT representative_id FROM players WHERE `player_id` = {0})".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_player_points_by_player(player_id){
        const str_query = "DELETE FROM `players_points` WHERE `player_id` = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_player_banned_by_player(player_id){
        const str_query = "DELETE FROM `players_banned` WHERE `player_id` = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_passport_by_player(player_id){
        const str_query = "DELETE FROM `passport_info` WHERE `passport_id` = (SELECT passport_info_id FROM players WHERE `player_id` = {0})".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_player_by_player(player_id){
        const str_query = "DELETE FROM `players` WHERE `player_id` = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async delete_payments_by_player(player_id){
        const str_query = "DELETE FROM `payments` WHERE `player_id` = {0}".format(
            player_id
        )
        return await this.db.query_async(str_query);
    }
    /*async create(data) {
        const str_query_address = "INSERT INTO address_info (postal_code, city, region, street, house, corpus, flat) VALUES ({0}, '{1}', '{2}', '{3}', '{4}', '{5}', '{6}')".format(
            data.address.postal_code,
            data.address.city,
            data.address.region,
            data.address.street,
            data.address.house,
            data.address.corpus,
            data.address.flat
        )
        const res_1 = await this.db.query_async(str_query_address);
        if(res_1.length == 0)
            return null;
        
        const str_query_passport = "INSERT INTO passport_info (series, number, date_issue, organization) VALUES ('{0}', '{1}', '{2}', '{3}')".format(
            data.passport.series,
            data.passport.number,
            data.passport.date_issue,
            data.passport.organization
        )
        const res_2 = await this.db.query_async(str_query_passport);
        if(res_2.length == 0)
            return null;    
        
        const str_query_sport = "INSERT INTO sports_info (organization, city, last_name_trainer, first_name_trainer, patronymic_trainer, start_year, last_name_first_trainer, first_name_first_trainer, patronymic_first_trainer, first_organization, city_first_organization) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', '{10}')".format(
            data.sport.organization,
            data.sport.city,
            data.sport.last_name_trainer,
            data.sport.first_name_trainer,
            data.sport.patronymic_trainer,
            data.sport.start_year,
            data.sport.last_name_first_trainer,
            data.sport.first_name_first_trainer,
            data.sport.patronymic_first_trainer,
            data.sport.first_organization,
            data.sport.city_first_organization
        )
        const res_3 = await this.db.query_async(str_query_sport);
        if(res_3.length == 0)
            return null; 
        
        const str_query_player = "INSERT INTO players (account_id, first_name, last_name, patronymic, gender, date_birth, citizenship, phone_number, email, address_info_id, passport_info_id, sport_info_id, status, create_at, update_at) VALUES ({0}, '{1}', '{2}', '{3}', {4}, '{5}', '{6}', '{7}', '{8}', {9}, {10}, {11}, -1, NOW(), NOW())".format(
            data.player.account_id,
            data.player.first_name,
            data.player.last_name,
            data.player.patronymic,
            data.player.gender,
            data.player.date_birth,
            data.player.citizenship,
            data.player.phone_number,
            data.player.email,
            res_1.insertId,
            res_2.insertId,
            res_3.insertId
        )
        return await this.db.query_async(str_query_player);
    }

    async get_1(account_id) {
        
        const str_player = "SELECT player_id, first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,\'%d-%m-%Y\') AS date_birth, citizenship, phone_number, email, address_info_id, passport_info_id, sport_info_id, status FROM players WHERE account_id={0} LIMIT 1".format(
            account_id
        )
        const res_1 = await this.db.query_async(str_player);
        if(res_1.length == 0)
            return null; 
        //   
        const str_address = "SELECT postal_code, city, region, street, house, corpus, flat FROM address_info WHERE address_id={0} LIMIT 1".format(
            Number(res_1[0].address_info_id)
        )
        const res_2 = await this.db.query_async(str_address);
        if(res_2.length == 0)
            return null; 
        //
        const str_passport = "SELECT series, number, DATE_FORMAT(date_issue,\'%d-%m-%Y\') AS date_issue, organization FROM passport_info WHERE passport_id={0} LIMIT 1".format(
            Number(res_1[0].passport_info_id)
        )
        const res_3 = await this.db.query_async(str_passport);
        if(res_3.length == 0)
            return null;
        //
        const str_sport = "SELECT * FROM sports_info WHERE sport_id={0} LIMIT 1".format(
            Number(res_1[0].sport_info_id)
        )
        const res_4 = await this.db.query_async(str_sport);
        if(res_4.length == 0)
            return null;

        const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];    
        const data = {
            address: {
                postal_code: res_2[0].postal_code,
                city: res_2[0].city,
                region: res_2[0].region,
                street: res_2[0].street,
                house: res_2[0].house,
                corpus: res_2[0].corpus,
                flat: res_2[0].flat
            },
            passport: {
                series: res_3[0].series,
                number: res_3[0].number,
                date_issue_day: res_3[0].date_issue.split('-')[0],
                date_issue_month: monthNames[Number(res_3[0].date_issue.split('-')[1])-1],
                date_issue_year: res_3[0].date_issue.split('-')[2],
                organization: res_3[0].organization
            },
            sport: {
                organization: res_4[0].organization,
                city: res_4[0].city,
                last_name_trainer: res_4[0].last_name_trainer,
                first_name_trainer: res_4[0].first_name_trainer,
                patronymic_trainer: res_4[0].patronymic_trainer,
                start_year: res_4[0].start_year,
                last_name_first_trainer: res_4[0].last_name_first_trainer,
                first_name_first_trainer: res_4[0].first_name_first_trainer,
                patronymic_first_trainer: res_4[0].patronymic_first_trainer,
                first_organization: res_4[0].first_organization,
                city_first_organization: res_4[0].city_first_organization
            },
            player: {
                first_name: res_1[0].first_name,
                last_name: res_1[0].last_name,
                patronymic: res_1[0].patronymic,
                gender: res_1[0].gender,
                date_birth_day: res_1[0].date_birth.split('-')[0],
                date_birth_month: monthNames[Number(res_1[0].date_birth.split('-')[1])-1],
                date_birth_year: res_1[0].date_birth.split('-')[2],
                citizenship: res_1[0].citizenship,
                phone_number: res_1[0].phone_number,
                email: res_1[0].email,
                status: res_1[0].status,
                player_id: res_1[0].player_id
            }
        };    

        return data;
    }
    async get_2() {
        const sqr_query = "SELECT player_id, account_id, first_name, last_name, patronymic FROM players WHERE status=0"
        return await this.db.query_async(sqr_query);
    }

    async get_3(player_id) {
        const str_player = "SELECT first_name, last_name, patronymic, gender, DATE_FORMAT(date_birth,\'%d-%m-%Y\') AS date_birth, citizenship, phone_number, email, address_info_id, passport_info_id, sport_info_id, status FROM players WHERE player_id={0} LIMIT 1".format(
            player_id
        )
        const res_1 = await this.db.query_async(str_player);
        if(res_1.length == 0)
            return null; 
        //   
        const str_address = "SELECT postal_code, city, region, street, house, corpus, flat FROM address_info WHERE address_id={0} LIMIT 1".format(
            Number(res_1[0].address_info_id)
        )
        const res_2 = await this.db.query_async(str_address);
        if(res_2.length == 0)
            return null; 
        //
        const str_passport = "SELECT series, number, DATE_FORMAT(date_issue,\'%d-%m-%Y\') AS date_issue, organization FROM passport_info WHERE passport_id={0} LIMIT 1".format(
            Number(res_1[0].passport_info_id)
        )
        const res_3 = await this.db.query_async(str_passport);
        if(res_3.length == 0)
            return null;
        //
        const str_sport = "SELECT * FROM sports_info WHERE sport_id={0} LIMIT 1".format(
            Number(res_1[0].sport_info_id)
        )
        const res_4 = await this.db.query_async(str_sport);
        if(res_4.length == 0)
            return null;

        const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];    
        const data = {
            address: {
                postal_code: res_2[0].postal_code,
                city: res_2[0].city,
                region: res_2[0].region,
                street: res_2[0].street,
                house: res_2[0].house,
                corpus: res_2[0].corpus,
                flat: res_2[0].flat
            },
            passport: {
                series: res_3[0].series,
                number: res_3[0].number,
                date_issue_day: res_3[0].date_issue.split('-')[0],
                date_issue_month: monthNames[Number(res_3[0].date_issue.split('-')[1])-1],
                date_issue_year: res_3[0].date_issue.split('-')[2],
                organization: res_3[0].organization
            },
            sport: {
                organization: res_4[0].organization,
                city: res_4[0].city,
                last_name_trainer: res_4[0].last_name_trainer,
                first_name_trainer: res_4[0].first_name_trainer,
                patronymic_trainer: res_4[0].patronymic_trainer,
                start_year: res_4[0].start_year,
                last_name_first_trainer: res_4[0].last_name_first_trainer,
                first_name_first_trainer: res_4[0].first_name_first_trainer,
                patronymic_first_trainer: res_4[0].patronymic_first_trainer,
                first_organization: res_4[0].first_organization,
                city_first_organization: res_4[0].city_first_organization
            },
            player: {
                first_name: res_1[0].first_name,
                last_name: res_1[0].last_name,
                patronymic: res_1[0].patronymic,
                gender: res_1[0].gender,
                date_birth_day: res_1[0].date_birth.split('-')[0],
                date_birth_month: monthNames[Number(res_1[0].date_birth.split('-')[1])-1],
                date_birth_year: res_1[0].date_birth.split('-')[2],
                citizenship: res_1[0].citizenship,
                phone_number: res_1[0].phone_number,
                email: res_1[0].email,
                status: res_1[0].status
            }
        };    

        return data;
    }

    async update_1(player_id, key, value) {
        const sqr_query = "UPDATE players SET {0}={1} WHERE player_id={2} LIMIT 1".format(
            key,
            Number.isInteger(value) ? Number(value) : "'"+ value +"'",
            player_id
        )
        return await this.db.query_async(sqr_query);
    }

    async delete(player_id) {
        const sqr_data = "SELECT address_info_id, passport_info_id, sport_info_id FROM players WHERE player_id={0} LIMIT 1".format(
            player_id
        )
        const res_1 = await this.db.query_async(sqr_data);
        if(res_1.length == 0){
            return null;
        }
        const sqr_delete_address = "DELETE FROM address_info WHERE address_id={0} LIMIT 1".format(
            res_1[0].address_info_id
        )
        const res_2 = await this.db.query_async(sqr_delete_address);
        if(!res_2){
            return null;
        }

        const sqr_delete_pass = "DELETE FROM passport_info WHERE passport_id={0} LIMIT 1".format(
            res_1[0].passport_info_id
        )
        const res_3 = await this.db.query_async(sqr_delete_pass);
        if(!res_3){
            return null;
        }

        const sqr_delete_sport = "DELETE FROM sports_info WHERE sport_id={0} LIMIT 1".format(
            res_1[0].sport_info_id
        )
        const res_4 = await this.db.query_async(sqr_delete_sport);
        if(!res_4){
            return null;
        }

        const sqr_delete_player = "DELETE FROM players WHERE player_id={0} LIMIT 1".format(
            player_id
        )
        const res_5 = await this.db.query_async(sqr_delete_player);
        if(!res_5){
            return null;
        }
        return true;
    }*/
}

module.exports = { PlayerRepository }