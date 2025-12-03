const mysql = require('mysql2')
class MysqlDB {
    constructor(config_db) {
        this.config = config_db
        this.pool = null
    }
    connection(){
        this.pool =  mysql.createPool({
            connectionLimit: this.config.connect_limit,
            host: this.config.host,
            user: this.config.user,
            password: this.config.password,
            database: this.config.database
        });
        return this
    }
    getPool(){
        return this.pool;
    }
    async query(statement, callback){
        this.pool.getConnection(async (err, conn) => {
            if(err) {
                callback(err);
            } else {
                conn.query(statement, async (error, results, fields) => {
                    conn.release();
                    callback(error, results, fields);
                });
            }
        })
    }
    async query_async(statement){
        return await new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if(err) {
                    console.log(err);
                    reject(err);
                } else {
                    conn.query(statement, (error, results, fields) => {
                        console.log(error + ' | ' + statement);
                        conn.release();
                        resolve(results);
                    });
                }
            })
        })
    }
}

module.exports = { MysqlDB }