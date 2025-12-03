const express = require('express');
const router = express.Router();

const action = require('../actions/index');
const modules  = require('../actions/modules/index');

const User = (services) => {
    

    router.post('/signup', action(new modules.CreateAccountAction(), services));
    router.post('/signin', action(new modules.AuthUserAction(), services));
    /*router.post('/update_name', action(new modules.EditNameAction(), services));
    router.post('/update_phone', action(new modules.EditPhoneAction(), services));
    router.post('/update_city', action(new modules.EditCityAction(), services));
    router.post('/update_mail', action(new modules.EditMailAction(), services));
    router.post('/get_payments', action(new modules.GetPaymentsAction(), services));
    router.post('/get_devices', action(new modules.GetDevicesAction(), services));
    router.post('/destroy_session', action(new modules.DestroySessionAction(), services));
    router.get('/confirm_update_mail/:id', action(new modules.ConfirmEditMailAction(), services));
    router.get('/security', action(new modules.SecurityAction(), services))
    router.get('/payments', action(new modules.PaymentsAction(), services))
    */
    router.get('/payments', action(new modules.PaymentsAction(), services))

    router.post('/get_payments', action(new modules.GetPaymentsAction(), services));
    
    router.get('/createPlayer', action(new modules.ViewCreatePlayerAction(), null));
    //
    router.get('/form/:id', action(new modules.FormAction(), services));
    //
    router.post('/load_passport', action(new modules.LoadPassportAction(), services));
    router.post('/createPlayer', action(new modules.CreatePlayerAction(), services));

    router.post('/createPlayerAndRepresentative', action(new modules.CreatePlayerAndRepresentative(), services));

    router.get('/referee', action(new modules.RefereeAction(), null));

    router.get('/new_members', action(new modules.NewMembersAction(), services));

    router.post('/get_new_members', action(new modules.GetNewMembersAction(), services))

    router.post('/createRepresentative', action(new modules.CreateRepresentativeAction(), services))
    router.post('/update_representative', action(new modules.UpdateRepresentativeAction(), services))
    router.post('/delete_representative', action(new modules.DeleteRepresentativeAction(), services))

    router.post('/delete_player', action(new modules.DeletePlayerAction(), services))
    router.post('/update_player', action(new modules.UpdatePlayerAction(), services))
    //router.get('/get_newRepresentative', action(new modules.ViewNewRepresentativeAction(), services))

    router.get('/tournaments', action(new modules.TournamentsAction(), null))
    router.get('/createTournament', action(new modules.ViewCreateTournamentAction(), null))
    router.post('/createTournament', action(new modules.CreateTournamentAction(), services))

    router.get('/createTournament', action(new modules.CreateTournamentAction(), services))
    router.get('/allTournaments', action(new modules.AllTournamentsAction(), services))
    router.post('/allTournaments', action(new modules.AllTournamentsAction(), services))

    router.get('/players', action(new modules.PlayersAction(), null))
    router.get('/myPlayers', action(new modules.MyPlayersAction(), services))
    router.get('/rPlayers', action(new modules.RefereePlayersAction(), services))

    router.get('/allPlayers', action(new modules.AllPlayersAction(), services))
    router.post('/allPlayers', action(new modules.AllPlayersAction(), services))

    router.get('/calendar', action(new modules.CalendarAction(), services))

    router.get('/pTournaments', action(new modules.PlayerTournamentsAction(), services))
    router.post('/pTournaments', action(new modules.PlayerTournamentsAction(), services))

    router.get('/infoTournament', action(new modules.ViewInfoTournament(), services))

    router.get('/rating', action(new modules.ClassificationAction(), services))

    router.post('/addpayment', action(new modules.AddPaymentAction(), services))
    router.post('/loadaddinfo', action(new modules.LoadAdditionalInformationAction(), services))
    router.post('/getplayerpayments', action(new modules.GetPaymentsPlayerAction(), services))
    
    router.post('/update_cinfo', action(new modules.EditTournamentCinfoAction(), services))
    //router.get('/allTournaments/:tournamentId/:action', action(new modules.ViewInfoTournament(), services))

    return router;
};

module.exports = { User }