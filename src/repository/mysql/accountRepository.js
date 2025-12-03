require('../../utils/string')

class AccountRepository {
    constructor(db) {
        this.db = db;
    }
    async create(acc) {
        const str_query = "INSERT INTO accounts (role_id, login, password, type, create_at, update_at) VALUES (2, '{0}', '{1}', {2}, NOW(), NOW())".format(
            acc.get_login(),
            acc.get_password(),
            acc.get_type()
        )
        return await this.db.query_async(str_query);
    }

    async change_login(player_id, login){
        const str_query = "UPDATE accounts SET login='{0}' WHERE account_id = (SELECT account_id FROM players WHERE player_id = {1}) LIMIT 1".format(
            login,
            player_id
        )
        return await this.db.query_async(str_query);
    }
    async change_password(player_id, password){
        const str_query = "UPDATE accounts SET password='{0}' WHERE account_id = (SELECT account_id FROM players WHERE player_id = {1}) LIMIT 1".format(
            password,
            player_id
        )
        return await this.db.query_async(str_query);
    }

    async check(acc){
        const str_query = "SELECT COUNT(*) > 0 AS result FROM accounts WHERE login='{0}' LIMIT 1".format(
            acc.get_login()
        )
        return await this.db.query_async(str_query);
    }
    async load(acc){
        const str_query = "SELECT account_id, role_id, type, password FROM accounts WHERE login='{0}' LIMIT 1".format(
            acc.get_login()
        )
        const res_1 = await this.db.query_async(str_query);
        if(res_1.length == 0)
            return null; 
        
        let data = {
            account_id: res_1[0].account_id,
            role_id: res_1[0].role_id,
            password: res_1[0].password,
            type: res_1[0].type
        };
/*
        switch(res_1[0].role_id) {
            case 2:{
                const q = "SELECT status FROM players WHERE account_id='{0}' LIMIT 1".format(
                    res_1[0].account_id
                )
                const res_2 = await this.db.query_async(q);
                if(res_2.length != 0)
                    data.status = res_2[0].status;
                break;
            } 
            case 5:{
                const q = "SELECT status FROM representatives WHERE account_id='{0}' LIMIT 1".format(
                    res_1[0].account_id
                )
                const res_2 = await this.db.query_async(q);
                if(res_2.length != 0)
                    data.status = res_2[0].status;
                break;
            }

            default:
                break;
        }*/
        return data;
    }

    async delete_by_player(player_id){
        const str_query = "DELETE FROM `accounts` WHERE `account_id` = (SELECT account_id FROM players WHERE `player_id` = {0})".format(
            player_id 
        )
        return await this.db.query_async(str_query);
    }
}

module.exports = { AccountRepository }