function get_query(){
    var url = location.search;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}
const modal = (text) =>{
    $('.modal-alert-body').html('');
    $('.modal-alert-body').html(text);
    $('#exampleModal').modal('show');
}


$(document).ready(async function() {
    var query = get_query();
    let curr_player = -1;

    $('#accept-unreg').click(async function(){
        $('#unregModal').modal('hide');
        const json = JSON.stringify(
            { 
                id: curr_player,
                action: 'unreg'
            }
        );
        //console.log(json)
        let result = ''
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments' + ('?id='+query.id) + ('&action=entries'), json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                //console.log(response.data.message);
                result = response.data.message
                setTimeout(() => window.location.reload(), 150);
                //console.log(response.data.data);
                return
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                console.log(error.response.data)
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
    })
    $('.unreg').click(async function(){
        $('#unregModal').modal('show');
        curr_player = $(this).attr('id');
        /*const json = JSON.stringify(
            { 
                id: $(this).attr('id'),
                action: 'unreg'
            }
        );
        console.log(json)
        let result = ''
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments' + ('?id='+query.id) + ('&action=entries'), json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                //console.log(response.data.message);
                result = response.data.message
                setTimeout(() => window.location.reload(), 150);
                //console.log(response.data.data);
                return
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                console.log(error.response.data)
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
        }   */
    })

    $('.set-role').change(async function() {
        const player = $(this).parent().parent().find("td").eq(3).text()
        const status = $(this).find('option:selected').val()

        const json = JSON.stringify(
            { 
                id: player,
                status: status,
                action: 'change_status'
            }
        );
        let result = ''
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments' + ('?id='+query.id) + ('&action=entries'), json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                //console.log(response.data.message);
                result = response.data.message
                setTimeout(() => window.location.reload(), 150);
                //console.log(response.data.data);
                return
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                console.log(error.response.data)
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
        //alert( $(this).find('option:selected').val() )
        //alert( $( "#set-role option:selected" ).text() )
    });

    $('#declare').click(async function(){
        //console.log('test')
        const json = JSON.stringify(
            { 
                id: $('#RniInput').val(),
                action: 'add'
            }
        );
        //console.log(json)
        let result = ''
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments' + ('?id='+query.id) + ('&action=entries'), json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                //console.log(response.data.message);
                result = response.data.message
                setTimeout(() => window.location.reload(), 150);
                //console.log(response.data.data);
                return
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                console.log(error.response.data)
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
    })
})