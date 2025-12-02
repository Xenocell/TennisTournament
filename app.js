// require
const path = require('path');
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const fs = require('fs');
const http = require('http');
const https = require('https')

// local modules
const config = require('./src/config/config');
const routes = require('./src/routes/index')
const models = require('./src/models/index');
const repositories = require('./src/repository/index');
const services = require('./src/services/index');
const middlewares = require('./src/middlewares/index');

//Init local modules
const database_conn = new models.MysqlDB(config.db).connection();
const user_repository = new repositories.UserRepository(database_conn);
const user_service = new services.UserService(user_repository);
const session = new models.MSession(config.db);
const alert_service = new services.AlertService(config.mail).createTransport();
const email_repository = new repositories.UpdateEmailRepository(database_conn);
const email_service = new services.UpdateEmailService(email_repository);

const session_repository = new repositories.SessionRepository(database_conn);
const session_service = new services.SessionService(session_repository);

const account_repository = new repositories.AccountRepository(database_conn);
const account_service = new services.AccountService(account_repository);

const player_repository = new repositories.PlayerRepository(database_conn);
const player_service = new services.PlayerService(player_repository);

const representative_repository = new repositories.RepresentativeRepository(database_conn);
const representative_service = new services.RepresentativeService(representative_repository);

const tournament_repository = new repositories.TournamentRepository(database_conn)
const tournament_service = new services.TournamentService(tournament_repository)

const transition_repository = new repositories.TransitionRepository(database_conn)
const transition_service = new services.TransitionService(transition_repository)

const auth_middleware = new middlewares.CheckAuth;
auth_middleware.init()

//httpslOption
const httpsOptions ={
  cert: fs.readFileSync('./ssl/certificate.crt'),
  ca: fs.readFileSync('./ssl/ca_bundle.crt'),
  key: fs.readFileSync('./ssl/private.key')
}

// Create Express application
const app = express();
const httpServer = http.createServer(app);
//const httpsServer = https.createServer(httpsOptions, app);

//Redirect from http
/*app.use((req, res, next) =>{
  if(req.protocol == 'http'){
    res.redirect(301, `https://${req.headers.host}${req.url}`)
  }
  next();
});
*/


// Install Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(morgan('dev'))
app.use(session.get())

app.use( auth_middleware.handler(user_service) )

//app.set("public", path.resolve("./src/public"));
app.use(express.static(path.join(__dirname + "/src", 'public')));

// Path routing
app.use(routes.Root);
app.use(routes.Auth({
  session: session_service
}));

app.use(routes.User(
  {
    account: account_service,
    alert: alert_service,
    session: session_service,
    player: player_service,
    representative: representative_service,
    tournament: tournament_service,
    transition: transition_service
  }
))


// View engine
app.set('views', path.join(__dirname + "/src", 'views'));
app.set('view engine', 'pug');

// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
  res.status(404);
  res.render('error');
});


//Start
httpServer.listen(3000, '10.0.0.4', () => {
  console.log('Start http server.')
});
/*
httpsServer.listen(443, '87.249.44.179', () =>{
  console.log('Start https server.')
});*/
