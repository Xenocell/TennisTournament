let select_change = null

const createMenu = (parent) =>{
    const block = document.createElement('div');
    const but_win = document.createElement('button');
    const i_but_win = document.createElement('i');
    const but_close = document.createElement('button');
    const i_but_close = document.createElement('i');
    //
    const block2 = document.createElement('div');
    const input = document.createElement('input');
    const but_accept = document.createElement('button');
    const i_but_accept = document.createElement('i');
    const but_close2 = document.createElement('button');
    const i_but_close2 = document.createElement('i');

    $(block).css("display", "flex")
    $(but_win).addClass("btn btn-primary").appendTo(block)
    $(i_but_win).addClass("fas fa-trophy").appendTo(but_win)
    

    $(but_close).addClass(" btn btn-light ml-1").appendTo(block)
    $(i_but_close).addClass("fas fa-times").appendTo(but_close)
    $(but_close).click(function e(){
        $(this).parent().remove()
        parent.show()
    })
    $(but_win).click(function e(){
        $(this).parent().hide()
        $(block2).css("display", "flex")
    })


    $(block2).css("display", "none")
    $(input).css("max-width", "65px").appendTo(block2)
    $(but_accept).addClass("btn btn-success ml-1").appendTo(block2)
    $(i_but_accept).addClass("fas fa-check").appendTo(but_accept)
    $(but_close2).addClass(" btn btn-light ml-1").appendTo(block2)
    $(i_but_close2).addClass("fas fa-times").appendTo(but_close2)

    $(but_accept).click(async function e(){
        if( $(input).val() == '')
            return
        const subtournament = parent.parent().parent().parent().parent().attr('tournament')
        const round = parent.parent().attr('round')
        const game = parent.parent().attr('game')
        const player = parent.parent().attr('player')
        const points = $(input).val()
        await updateGrid(subtournament, round, game, player, points, 'winner')
        //alert("tournament: " + parent.parent().parent().parent().parent().attr('tournament') + " round: " + parent.parent().attr('round') + " game: " + parent.parent().attr('game') + " player: " + parent.parent().attr('player'))
    })


    $(but_close2).click(function e(){
        $(this).parent().hide()
        $(block).show()
    })

    return [block, block2];
}

const modal = (text) =>{
    $('.modal-alert-body').html('');
    $('.modal-alert-body').html(text);
    $('#exampleModal').modal('show');
}

function get_query(){
    var url = location.search;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}

const updateGrid = async (subtorunament, round, game, player, points, action) =>{
    var query = get_query();
    const json = JSON.stringify(
        { 
            subtorunament: subtorunament,
            round: round,
            game: game,
            player: player,
            points: points,
            action: action
        }
    );
    //console.log(json)

    let result = ''
    const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments'  + ('?id='+query.id) + ('&action=grid'), json, {
        timeout: 4000,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        (response) => {
           //result = response.data.message
           setTimeout(() => window.location.reload(), 150);
           return
        }
    ).catch(error => {
        if (error.response) {
            const errors = error.response.data.errors;
            if (errors.length == 1){
                result = result + errors[0].msg;
            }else{
                errors.forEach(element => {
                    result = result + '<p>• ' + element.msg + '</p>';
                })
            }
        }else{
            result = result + error;
        }
    });
    if(result != ''){
        modal(result)
        return;
    }
}


const report = async () =>{
    var query = get_query();
    const json = JSON.stringify(
        { 
            action: 'report'
        }
    );
    let result = ''
    const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments'  + ('?id='+query.id) + ('&action=grid'), json, {
        timeout: 4000,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        (response) => {
           result = response.data.message
           //setTimeout(() => window.location.reload(), 150);
           return
        }
    ).catch(error => {
        if (error.response) {
            const errors = error.response.data.errors;
            if (errors.length == 1){
                result = result + errors[0].msg;
            }else{
                errors.forEach(element => {
                    result = result + '<p>• ' + element.msg + '</p>';
                })
            }
        }else{
            result = result + error;
        }
    });
    if(result != ''){
        modal(result)
        return;
    }
}

$(document).ready(async function() {
    let last_click = null
    $('.sp').click( function e(){
        $(this).hide()
        /*if(last_click){
            $(last_click).parent().find( "span" ).show()
            $(last_click).remove()
        }*/
        const m = createMenu( $(this) )
        //last_click = m
        $(m[0]).appendTo($(this).parent())
        $(m[1]).appendTo($(this).parent())
        //alert( $(this).parent().parent().parent().parent().attr('tournament') )
    })
    $('#report').click( async function e(){
        await report()
    })
})
