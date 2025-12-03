var mysql2 = require('mysql2/promise');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

class MSession {
    constructor(config) {
        this.pool =  mysql2.createPool({
            connectionLimit: 1,
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });
        this.store = null
    }
    get(){
        const sessionStore = new MySQLStore({
            //expiration: 604800000,
        }, this.pool);
        this.store = sessionStore;
        return session({
            key: 'session',
            secret: 'YWLwRMuDXwi6f3Afbz6wdwWi2VjDmTLT',
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            cookie: { 
                maxAge: 31556926000*2
            }
        });
    }
    closeStore(){
        this.store.close()
    }
}

module.exports = { MSession }