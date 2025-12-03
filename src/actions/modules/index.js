const { CreateAccountAction } = require('./createAccountAction')
const { SignupUserAction } = require('./signupAction')
const { LogoutUserAction } = require('./logoutAction')
const { FormAction } = require('./formAction')
const { SigninUserAction } = require('./signinAction')
const { EditNameAction } = require('./editNameAction')
const { EditPhoneAction } = require('./editPhoneAction')
const { EditCityAction } = require('./editCityAction')
const { EditMailAction } = require('./editMailAction')
const { ConfirmEditMailAction } = require('./confirmEditMailAction')
const { AuthUserAction } = require('./authUserAction')
const { PaymentsAction } = require('./paymentsAction')
const { GetPaymentsAction } = require('./getPaymentsAction')
const { SecurityAction } = require('./securityAction')
const { GetDevicesAction } = require('./getDevicesAction')
const { DestroySessionAction } = require('./destroySessionAction')
const { ViewCreatePlayerAction } = require('./viewCreatePlayerAction')
const { LoadPassportAction } = require('./loadPassportAction')
const { CreatePlayerAction } = require('./createPlayerAction')
const { RefereeAction } = require('./refereeAction')
const { GetNewMembersAction } = require('./getNewMembers')
const { NewMembersAction } = require('./newMembersAction')
const { CreateRepresentativeAction } = require('./createRepresentativeAction')
const { ViewNewRepresentativeAction } = require('./viewNewRepresentative')
const { UpdateRepresentativeAction } = require('./updateRepresentativeAction')
const { DeleteRepresentativeAction } = require('./deleteRepresentativeAction')
const { DeletePlayerAction } = require('./deletePlayerAction')
const { UpdatePlayerAction } = require('./updatePlayerAction')
const { TournamentsAction } = require('./tournamentsAction')
const { ViewCreateTournamentAction } = require('./viewCreateTournamentAction')
const { CreateTournamentAction } = require('./createTournament')
const { PlayersAction } = require('./playersAction')
const { MyPlayersAction } = require('./myPlayersAction')
const { RefereePlayersAction } = require('./refereePlayersAction')
const { AllPlayersAction } = require('./allPlayersAction')
const { AllTournamentsAction } = require('./allTournamentsAction')
const { CalendarAction } = require('./calendarAction')
const { PlayerTournamentsAction } = require('./playerTournamentsAction')
const { ViewInfoTournament } = require('./viewInfoTournament')
const { CreatePlayerAndRepresentative } = require('./createPlayerAndRepresentative')
const { ClassificationAction } = require('./classificationAction')
const { AddPaymentAction } = require('./addPaymentAction')
const { LoadAdditionalInformationAction } = require('./loadAdditionalInformationAction')
const { GetPaymentsPlayerAction } = require('./getPaymentsPlayerAction')
const { EditTournamentCinfoAction } = require('./editTournamentCinfoAction')

module.exports = {
    CreateAccountAction,
    SignupUserAction,
    SigninUserAction,
    LogoutUserAction,
    FormAction,
    EditNameAction,
    EditPhoneAction,
    EditCityAction,
    EditMailAction,
    ConfirmEditMailAction,
    AuthUserAction,
    PaymentsAction,
    GetPaymentsAction,
    SecurityAction,
    GetDevicesAction,
    DestroySessionAction,
    ViewCreatePlayerAction,
    LoadPassportAction,
    CreatePlayerAction,
    RefereeAction,
    GetNewMembersAction,
    NewMembersAction,
    CreateRepresentativeAction,
    ViewNewRepresentativeAction,
    UpdateRepresentativeAction,
    DeleteRepresentativeAction,
    DeletePlayerAction,
    UpdatePlayerAction,
    TournamentsAction,
    ViewCreateTournamentAction,
    CreateTournamentAction,
    PlayersAction,
    MyPlayersAction,
    RefereePlayersAction,
    AllPlayersAction,
    AllTournamentsAction,
    CalendarAction,
    PlayerTournamentsAction,
    ViewInfoTournament,
    CreatePlayerAndRepresentative,
    ClassificationAction,
    AddPaymentAction,
    LoadAdditionalInformationAction,
    GetPaymentsPlayerAction,
    EditTournamentCinfoAction
}