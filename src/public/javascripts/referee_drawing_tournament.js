$(document).ready(async function() {
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
    let query = get_query()
    $('#end').click(function e(){
        document.location.href='/allTournaments'+('?id='+query.id)+'&action=grid'
    })

    $('.num').focusout(async function() {

        //const number_player = $(this).parent().parent().find("td").eq(0).html()
        const rni_player = $(this).parent().parent().find("td").eq(4).html()
        const name_player = $(this).parent().parent().find("td").eq(3).html()
        //const hash_player = $(this).parent().parent().find("td").eq(1).html()
        if($(this).val() != '' && Number.isInteger(Number($(this).val()))){
            const json = JSON.stringify(
                { 
                    player_number: $(this).val(),
                    rni: rni_player,
                    name: name_player.split(' ')[0] + ' ' + name_player.split(' ')[1][0] + '.' + name_player.split(' ')[2][0]+'.'
                }
            );
            let result = ''

            const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments' + ('?id='+query.id) + ('&action=drawing'), json, {
                timeout: 4000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                (response) => {
                    if(response.data.message){
                        const data = response.data.message;
                        console.log(data)
                        return;
                    }
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
    })
})