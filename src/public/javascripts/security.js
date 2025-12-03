$(document).ready(async function() {
    let data;
    let current_confirmation;
    let current_block;
    let s_id;

    const spinner = (state) =>{
        if(state){
            $('.curtain-spinner').show();
            $('#box-spinner').show();
            $('.spinner').show();
        }else{
            $('.curtain-spinner').hide();
            $('#box-spinner').hide();
            $('.spinner').hide();
        }
    }
    spinner(true);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    async function loadTable(){
        result = ''
        const res = await axios.post('https://lk.mta-donskoy.ru/get_devices', {}, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                if(response.data.message){
                    data = response.data.message;
                    s_id = response.data.s;
                    data.forEach((element, iter, arr) => {
                        const date = new Date(element.date);
                        const box_item = document.createElement('div');
                        $(box_item).addClass("box-item").appendTo($('#box-table'))
                        const box_image_item = document.createElement('div');
                        $(box_image_item).addClass("box-image-item align-self-center").appendTo(box_item)
                        const img = document.createElement('img');
                        
                        const getImageDevice = (os, device) =>{
                            switch(os) {
                                case 'Windows':
                                  return 'windows.png'
                              
                                case 'Android':
                                  return 'android_device.png'

                                case 'Windows Phone':
                                    return 'windows.png'
                                case 'iOS':
                                    switch(device) {
                                        case 'iPad':
                                          return 'ipad.png'
                                      
                                        case 'iPhone':
                                          return 'iphone.png'
                                      
                                        default:
                                          return 'ipad.png'
                                    }
                                case 'Mac OS':
                                    return 'macbook.png'

                                default:
                                  return 'linux_book.png'
                            }
                        }

                        $(img).attr('src',  '/images/devices/' + getImageDevice(element.os, element.device)).appendTo(box_image_item);

                        const box_description = document.createElement('div');
                        $(box_description).addClass("box-description").appendTo(box_item)
                        const h_4 = document.createElement('h4');
                        $(h_4).addClass('mt-2').text( element.os + (element.device == 'none' ? '' : '(' + element.device + ')') ).appendTo(box_description)
                        if(s_id == element.session_id){
                            const mark = document.createElement('i');
                            $(mark).addClass('fas fa-user-circle pl-1').appendTo(h_4);
                        }

                        const p = document.createElement('p');
                        $(p).text('Вошли '+ Number(date.getDay()+1) +' '+ months[date.getMonth()] +' '+ date.getFullYear() + '.').appendTo(box_description)

                        const box_close = document.createElement('div');
                        $(box_close).attr('id', iter).addClass("box-close align-self-center").appendTo(box_item)
                        const i = document.createElement('i');
                        $(i).addClass("far fa-times-circle").appendTo(box_close)
                    });
                    spinner(false);
                }
            }
        ).catch(error => {
            $('.spinner').hide();
            $('#table-update').show();
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
            $('.modal-body').html('');
            $('.modal-body').html(result);
            $('#exampleModal').modal('show');
            return;
        }
    }
    await loadTable();

    $('.box-close i').click(function(e){
        current_confirmation = data[Number($(this).parent().attr('id'))]
        $('#modal-confirmation').modal('show');
        current_block = $(this).parent().parent();
    });
    $('#confirm').click( async function(e){
        $('#modal-confirmation').modal('hide');
        if(s_id == current_confirmation.session_id)
            document.location.href='/logout'
        else{
            result = ''
            const res = await axios.post('https://lk.mta-donskoy.ru/destroy_session', { s_id: current_confirmation.session_id}, {
                timeout: 4000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                (response) => {
                    if(response.data.message){
                        result = result + response.data.message;
                        current_block.remove();
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
                $('.modal-body').html('');
                $('.modal-body').html(result);
                $('#exampleModal').modal('show');
                return;
            }
        }
    });

})