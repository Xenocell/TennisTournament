const { UserRepository } = require('./mysql/userRepository')
const { UpdateEmailRepository } = require('./mysql/updateEmailRepository')
const { SessionRepository } = require('./mysql/sessionRepository')
const { AccountRepository } = require('./mysql/accountRepository')
const { PlayerRepository } = require('./mysql/playerRepository')
const { RepresentativeRepository } = require('./mysql/representativeRepository')
const { TournamentRepository } = require('./mysql/tournamentRepository')
const { TransitionRepository } = require('./mysql/transitionRepository')

module.exports = {
    UserRepository,
    UpdateEmailRepository,
    SessionRepository,
    AccountRepository,
    PlayerRepository,
    RepresentativeRepository,
    TournamentRepository,
    TransitionRepository
}