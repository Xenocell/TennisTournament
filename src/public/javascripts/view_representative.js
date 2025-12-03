$(document).ready(function() {
    var modal = document.getElementById("myModal");
    $('#view-pass').click(e =>{
        modal.style.display = "block";
    })
    $('.close').click(e =>{
        modal.style.display = "none";
    })
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    const modal_alert = (text) =>{
        $('.modal-body').html('');
        $('.modal-body').html(text);
        $('#exampleModal').modal('show');
    };

    const modal_refuse = (text) =>{
        //$('.rejection-modal-body').html('');
        //$('.rejection-modal-body').html(text);
        $('#rejectionModal').modal('show');
    };

    $('#send').click( async () =>{
        const text_area = $('#exampleFormControlTextarea1').val();
        if(text_area.length == 0 || text_area.length > 255)
            return;
        $('#rejectionModal').modal('hide');
        
        let result = '';
        const json = JSON.stringify(
            { 
                id: getParameterByName('id'),
                action: 'update_status',
                value: 2,
                message: text_area
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/update_representative', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                result = result + response.data.message;
                setTimeout(() => document.location.href='/new_members', 500);
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
            modal_alert(result)
            return;
        }    

    })

    /*$('#exampleFormControlTextarea1').keydown(function(e){
        const text_area = $('#exampleFormControlTextarea1').val();
        const count = (255 - (text_area.length+1))
        if(count+1 == 0)
            return e.preventDefault();
        $('#symbols').text('Осталось символов: ' + (255 - (text_area.length+1)))
    })*/
    
    $('#refuse').click( () =>{
        modal_refuse('test')
    })

    $('#accept').click(async () =>{
        let result = '';
        const json = JSON.stringify(
            { 
                id: getParameterByName('id'),
                action: 'update_status',
                value: 1
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/update_representative', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                result = result + response.data.message;
                setTimeout(() => document.location.href='/new_members', 500);
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
            modal_alert(result)
            return;
        }    
    });

});