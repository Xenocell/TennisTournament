//const env = process.env.NODE_ENV; // 'dev' or 'test'

const env = 'debug';

const dev = {
    app: {
        port: 3000
    },
};

const debug = {
    app: {
        port: 8080
    },
    db: {
        host: '',
        user: '',
        password: '',
        database: '',
        connect_limit: 4
    },
    mail: {
        service: 'gmail',
        user: '',
        pass: ''
    }
};



const config = {
    dev,
    debug
};



module.exports = config[env];
