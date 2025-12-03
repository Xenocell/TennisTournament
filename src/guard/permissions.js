const roles = require('./roles')


const anonymous = [
    'auth:signup',
    'auth:signin',
    'users:auth',
    'users:createAccount',
    'users:confirmEmail',
    'users:calendar',
    'users:viewInfoTournament',
    'users:classification'
]
const player_ghost = [
    ...anonymous,
    'auth:logout',
    'users:form',
    'users:devices',
    'users:security',
    'users:destroySession',
    //'users:loadPassport',
    'users:createPlayer',
    //'users:viewLoadPassport',
    //'users:deletePlayer',
    //'users:updatePlayer'
]
/*const representative_ghost = [
    ...anonymous,
    ...player_ghost,
    'users:createRepresentative',
    'users:deleteRepresentative',
    'users:updateRepresentative'
]

const representative = [
    ...representative_ghost,
    'users:players',
    'users:viewCreatePlayer',
    'users:createPlayer',
    'users:myPlayers',
    'users:playerTournaments'
]
*/
const player = [
    //...representative_ghost,
    ...player_ghost,
    'users:playerTournaments',
    'users:viewPayments',
    'users:payments',
    'users:getpayments'
]

const referee = [
    ...anonymous,
    'auth:logout',
    'users:createTournaments',
    'users:referee',
    'users:getNewMembers',
    'users:newMembers',
    'users:viewNewRepresentative',
    'users:updateRepresentative',
    'users:updatePlayer',
    'users:tournaments',
    'users:viewCreateTournament',
    'users:createTournament',
    'users:refereePlayers',
    'users:allPlayers',
    'users:addPayment',
    'users:loadAddInfo',
    'users:getPaymentsPlayer',
    'users:editTournamentCinfo'
]

module.exports = {
	[roles.anonymous]: anonymous,
    [roles.player]: player,
    [roles.referee]: referee,
    //[roles.representative]: representative,
    //[roles.representative_ghost]: representative_ghost,
    [roles.player_ghost]: player_ghost
}