

$(document).ready(async function() {
    const modal = (text) =>{
        $('.modal-body').html(text);
        $('#exampleModal').modal('show');
    }

    $('.view').click(function(){
        document.location.href='/allPlayers?id='+ $(this).attr('id') + '&action=view'
        //console.log($(this).attr('rid'))
    })
    $('.edit').click(function(){
        document.location.href='/allPlayers?id='+ $(this).attr('id') + '&r_id=' + $(this).attr('r_id') + '&action=edit'
        //console.log($(this).attr('rid'))
    })
    for (var i = 1; i < 31; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-day'));
    }
    let currentPlayer = -1;

    const getPayments = async (id) =>{
        let result = []
        let error = ''
        const json = JSON.stringify(
            { 
                player_id: id
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/getplayerpayments', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
               result = response.data.message
               //setTimeout(() => window.location.reload(), 150);
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                if (errors.length == 1){
                    error = error + errors[0].msg;
                }else{
                    errors.forEach(element => {
                        error = error + '<p>• ' + element.msg + '</p>';
                    })
                }
            }else{
                error = error + error;
            }
        });
        return [result, error]
    }

    $('.payment').click(async function(){
        currentPlayer = $(this).attr('id')
        const [result, err] = await getPayments(currentPlayer)
        if(err == ''){
            if(result.length == 0){
                $(".sum-payment").each(function() {
                    if($(this).hasClass('btn-success')){
                        $(this).removeClass('btn-success')
                        $(this).addClass('btn-warning')
                    }
                });
            }else{
                result.forEach( e => {
                    $('#s'+ e.year).removeClass('btn-warning')
                    $('#s'+ e.year).addClass('btn-success')
                })
            }
        }
        //console.log( result )
        $('#paymentModal').modal('show');
    })
    $('.ban').click(function(){
        currentPlayer = $(this).attr('id')
        $('#rejectionModal').modal('show');
    })

    $('.sum-payment').click( async function(){
        $('#paymentModal').modal('hide');
        //alert($(this).text())
        let result = ''
        const json = JSON.stringify(
            { 
                player_id: currentPlayer,
                year: $(this).text()
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/addpayment', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
               result = response.data.message
               //setTimeout(() => window.location.reload(), 150);
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

    $('.unban').click(async function(){
        currentPlayer = $(this).attr('id')
        let result = ''
        const json = JSON.stringify(
            { 
                action: 'unban',
                player_id: currentPlayer
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/allPlayers', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
               result = response.data.message
               setTimeout(() => window.location.reload(), 150);
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

    $('#send').click(async function(){
        const date_ban = () =>{
            const v_d = $("#set-day option:selected").text();
            const v_y = $("#set-year option:selected").text();
            const v_m = $("#set-month option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-month").val() + '-' + v_d);
        }
        const date = date_ban()
        if(date == null)
            return;
        $('#rejectionModal').modal('hide');
        let result = ''
        const json = JSON.stringify(
            { 
                action: 'ban',
                player_id: currentPlayer,
                date: date
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/allPlayers', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
               result = response.data.message
               setTimeout(() => window.location.reload(), 150);
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

    $("#search-players").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".table tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

})