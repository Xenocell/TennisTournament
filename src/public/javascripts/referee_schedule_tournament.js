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

const createMenuChangeSchedule = (parent) =>{
    const block = document.createElement('div');
    const input = document.createElement('input');

    $(input).val(parent.text()).appendTo(block)

    $(input).focusout(async function(){
        let t = parent.parent().attr('v')
        let s = null
        if(t != "m_title"){
            t = parent.parent().parent().attr('v')
            s = parent.parent().parent().attr('start')
        }

        if($(this).val() != parent.text() ){
            await update_schedule(s, t, parent.parent().index(), $(this).val())
            parent.text( $(this).val() )
            parent.show()
            $(this).parent().remove()
            return
        }
        parent.show()
        $(this).parent().remove()
    });
    return block;
}

const update_schedule = async (start, type, index, text) =>{
    var query = get_query();
    const json = JSON.stringify(
        { 
            start: start,
            type: type,
            index: index,
            text: text,
            action: 'update'
        }
    );
    let result = ''
    const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments'  + ('?id='+query.id) + ('&action=schedule'), json, {
        timeout: 4000,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        (response) => {
           //result = response.data.message
           console.log(response.data.message)
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

$(document).ready(async function() {
    var query = get_query();
    $('.edit').click( function(e){
       // alert( $(this).index() )
        $(this).hide()
        const m = createMenuChangeSchedule( $(this) )
        $(m).appendTo($(this).parent())
        $(m).find("input:text").focus();

    })
    $('.clear-color').click(async function(e){
        const start = $(this).parent().parent().attr('start')
        let result = ''
        const json = JSON.stringify(
            {
                start: start,
                color: "#ffffff00",
                action: 'update_color'
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments'  + ('?id='+query.id) + ('&action=schedule'), json, {
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
    })
    $('.input-color').change(async function() {
        //alert( $(this).val() )
        const start = $(this).parent().parent().attr('start')
        let result = ''
        const json = JSON.stringify(
            {
                start: start,
                color: $(this).val(),
                action: 'update_color'
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments'  + ('?id='+query.id) + ('&action=schedule'), json, {
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
    });

    $('.delete').click(async function(e){
        const start = $(this).parent().parent().attr('start')
        let result = ''
        const json = JSON.stringify(
            {
                start: start,
                action: 'delete'
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments'  + ('?id='+query.id) + ('&action=schedule'), json, {
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
     })

    $('#create').click(async function(e){
        let result = ''
        const json = JSON.stringify(
            { 
                action: 'create'
            }
        );
        const res = await axios.post('https://lk.mta-donskoy.ru/allTournaments'  + ('?id='+query.id) + ('&action=schedule'), json, {
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
       // alert('test')
    })
})