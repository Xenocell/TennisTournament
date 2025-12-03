function get_query(){
    var url = location.search;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}

$(document).ready(async function() {
    var query = get_query();
    const modal = (text) =>{
        $('.modal-body').html(text);
        $('#exampleModal').modal('show');
    }
    $('.details').click(function (){
        document.location.href='/allTournaments'+ '?id=' + $(this).attr('id') + '&type=' + $(this).attr('type') + ('&action=index')
        //alert( $(this).attr('id'))
    })
    $('.entries').click(function (){
        //console.log(query)
        document.location.href='/allTournaments'+ ('?id='+query.id) + ('&action=entries')
        //alert( $(this).attr('id'))
    })
    $('.drawing').click(function (){
        //console.log(query)
        document.location.href='/allTournaments'+ ('?id='+query.id) + ('&action=drawing')
        //alert( $(this).attr('id'))
    })
    $('.grid').click(function (){
        document.location.href='/allTournaments'+ ('?id='+query.id) + ('&action=grid')
    })
    $('.schedule').click(function (){
        document.location.href='/allTournaments'+ ('?id='+query.id) + ('&action=schedule')
    })
    $('.edit').click(function (){
        document.location.href='/allTournaments'+ ('?id='+query.id) + ('&action=edit')
    })
    $('.delete').click(function (){
        $('#rejectionModal').modal('show');
    })
    $('#accept-delete').click(async function (){
        $('#rejectionModal').modal('hide');
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments?id='+ query.id +'&action=delete', {}, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
               result = response.data.message
               setTimeout(() => document.location.href='/allTournaments', 150);
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

    })

    $('.aditionalinformation').click(function (){
        $('#iaditionalinformation').click();
    })

    $('#iaditionalinformation').change(async function() {
        var myFile = $(this).prop('files')[0];
        const data = new FormData()
        await data.append('addinfo', myFile, 'addinfo_tour_' + query.id + '.pdf')
        
        let result = ''

        await axios.post('https://lk.mta-donskoy.ru/loadaddinfo', data, {
            timeout: 4000
        }).then(
            (response) => {
                //console.log(response.data.message);
                modal(response.data.message)
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                if (errors.length == 1){
                    result = result + errors[0].msg;
                
                $("#iaditionalinformation").val(null);
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


        //alert( "Handler for .change() called." );
    });
})
