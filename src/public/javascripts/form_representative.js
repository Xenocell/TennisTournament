$(document).ready(function() {
    if($(".table").length){
        $(".container").css( "maxWidth", "550px");
    }

    const input_phone =  $("#InputPhone");
    const reg_but = $('#reg-but');
    const but_male = $('#but-male');
    const but_female = $('#but-female');

    function ValidateEmail(mail) 
    {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
        {
            return (true)
        }
        return (false)
    }

    for (var i = 2021; i > 1970; i--) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-year-3'));
    }
    //Select date pass------------------------------
    for (var i = 1; i < 31; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-day-2'));
    }

    for (var i = 2021; i > 1970; i--) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-year-2'));
    }
    
    $('#set-year-2').change(function() {
        const v_d = $("#set-day-2 option:selected").text();
        const v_y = $("#set-year-2 option:selected").text();
        const v_m = $("#set-month-2 option:selected").text();
        if(v_m == 'Месяц' || v_m != 'Февраля'){
            return;
        }
        $("#set-day-2 option").remove();
        $( document.createElement('option') ).text('День').appendTo($('#set-day-2'));
        const days = getDays($("#set-month-2 option:selected").text(), Number(v_y));
        for (var i = 1; i <= days; i++) {
            $( document.createElement('option') ).text(i).appendTo($('#set-day-2'));
        }
        if ( v_d != 'День' && Number(v_d) <= Number(days)){
            $('#set-day-2').val(v_d).change();
        }
    });
    $('#set-month-2').change(function() {
        const v_d = $("#set-day-2 option:selected").text();
        const v_m = $("#set-month-2 option:selected").text();
        const v_y = $("#set-year-2 option:selected").text();
        if (v_m == 'Месяц'){
            return;
        }
        $("#set-day-2 option").remove();

        $( document.createElement('option') ).text('День').appendTo($('#set-day-2'));
        const days = getDays($("#set-month-2 option:selected").text(), (v_y == 'Год') ? 2021 : Number(v_d));
        for (var i = 1; i <= days; i++) {
            $( document.createElement('option') ).text(i).appendTo($('#set-day-2'));
        }
        if ( v_d != 'День' && Number(v_d) <= Number(days)){
            $('#set-day-2').val(v_d).change();
        }
    });
    //Select birth day------------------------------
    for (var i = 1; i < 31; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-day'));
    }

    for (var i = 2021; i > 1970; i--) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-year'));
    }
    $('#set-year').change(function() {
        const v_d = $("#set-day option:selected").text();
        const v_y = $("#set-year option:selected").text();
        const v_m = $("#set-month option:selected").text();
        if(v_m == 'Месяц' || v_m != 'Февраля'){
            return;
        }
        $("#set-day option").remove();
        $( document.createElement('option') ).text('День').appendTo($('#set-day'));
        const days = getDays($("#set-month option:selected").text(), Number(v_y));
        for (var i = 1; i <= days; i++) {
            $( document.createElement('option') ).text(i).appendTo($('#set-day'));
        }
        if ( v_d != 'День' && Number(v_d) <= Number(days)){
            $('#set-day').val(v_d).change();
        }
    });
    $('#set-month').change(function() {
        const v_d = $("#set-day option:selected").text();
        const v_m = $("#set-month option:selected").text();
        const v_y = $("#set-year option:selected").text();
        if (v_m == 'Месяц'){
            return;
        }
        $("#set-day option").remove();

        $( document.createElement('option') ).text('День').appendTo($('#set-day'));
        const days = getDays($("#set-month option:selected").text(), (v_y == 'Год') ? 2021 : Number(v_d));
        for (var i = 1; i <= days; i++) {
            $( document.createElement('option') ).text(i).appendTo($('#set-day'));
        }
        if ( v_d != 'День' && Number(v_d) <= Number(days)){
            $('#set-day').val(v_d).change();
        }
    });

    let getDays = (month, year) =>{
        let isLeap = (year) =>{
            return !(new Date(year, 1, 29).getMonth()-1)
        }
        const months = {
            Января: 31,
            Февраля: (isLeap(year)) ? 29 : 28,
            Марта: 31,
            Апреля: 30,
            Мая: 31,
            Июня: 30,
            Июля: 31,
            Августа: 31,
            Сентября: 30,
            Октября: 31,
            Ноября: 30,
            Декабря: 31,
        };
        return months[month]
    }
    //Phone mask-----------------------------------
    input_phone.keydown(function(e){
        if( !Number.isInteger(Number(e.key)) && e.keyCode != 8 && !(input_phone.val().length == 0 && e.keyCode == 187) ) {
            e.preventDefault();
            return;
        }
        class PhoneMask {
            constructor(code_country, template) {
                this.code_country = code_country;
                this.template = template;
            }
            getMask() {
                return  this.code_country + this.template;
            }
            getCodeCountry(){
                return this.code_country;
            }
            getTemplate(){
                return this.template;
            }
            getNumber(number){
                const buff = number;
                const mask = this.getMask();
                const code = this.getCodeCountry();

                const insertString = (string, start, text) =>{
                    return string.substring(0, start) + text + string.slice(start)
                }
                if(number == '+'){
                    return code + ' ';
                }
                if (number.substring(0, code.length) != code){
                    number = insertString(number, 0, code);
                }
                for (let i = 0; i < mask.length; i++) {
                    if (number[i] != mask[i] && mask[i] != '_' && i <= number.length){
                        number = insertString(number, i, mask[i]);
                    }
                }
                return number;
            }
        }
        const mask = new PhoneMask('+7', ' ___ ___-__-__');
        if(input_phone.val().length+1 > mask.getMask().length && e.keyCode != 8){
            e.preventDefault();
            return;
        }
        if (e.keyCode != 8){
            e.preventDefault();
            input_phone.val(mask.getNumber(input_phone.val() + e.key));
        }
        if(input_phone.val().length == mask.getMask().length){
            input_phone.addClass( "valid" );
        }else{
            input_phone.removeClass( "valid" );
        }
    });

    const modal = (text) =>{
        $('.modal-alert-body').html('');
        $('.modal-alert-body').html(text);
        $('#exampleModal').modal('show');
    }

    /*$("#ImgPassport").on('change', async function(e) {
        const data = new FormData()
        await data.append('passport', e.target.files[0])
        await axios.post('https://lk.mta-donskoy.ru/load_passport', data, {
            timeout: 4000
        })
    });*/
    //-----------------------------------------------
    let result = ''
    $('#reg-but').on('click', async function(e) {
        result = ''
        e.preventDefault();
        const fio = $('#InputFIO').val();
        const phone = (input_phone.hasClass( "valid" )) ? input_phone.val() : null;
        const email = $('#InputEmail').val();
        const gender = () =>{
            if(but_male.hasClass( "btn-light" ) && but_female.hasClass( "btn-light" )){
                return null;
            }
            return ( but_male.hasClass( "btn-light" ) ? true : false)
        }
        const date_birth = () =>{
            const v_d = $("#set-day option:selected").text();
            const v_y = $("#set-year option:selected").text();
            const v_m = $("#set-month option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-month").val() + '-' + v_d);
        }
        const serial_pass = $('#InputSerPass').val();
        const number_pass = $('#InputNumPass').val();
        const date_give_pass = () =>{
            const v_d = $("#set-day-2 option:selected").text();
            const v_y = $("#set-year-2 option:selected").text();
            const v_m = $("#set-month-2 option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-month").val() + '-' + v_d);
        }
        const name_org_give_pass = $('#InputNameOrg').val();

        if (fio == ''){
            result = result + '<p>• Не заполнено ФИО!</p>';
        }
        if (phone == null){
            result = result + '<p>• Не заполнен контактный телефон!</p>';
        }
        if (email == ''){
            result = result + '<p>• Не заполнена электронная почта!</p>';
        }
        if(gender() == null){
            result = result + '<p>• Не выбран пол!</p>';
        }
        if(date_birth() == null){
            result = result + '<p>• Не выбрана дата рождения!</p>';
        }
        if (serial_pass == ''){
            result = result + '<p>• Не заполнена серия паспорта!</p>';
        }
        if (number_pass == ''){
            result = result + '<p>• Не заполнен номер паспорта!</p>';
        }
        if (date_give_pass() == ''){
            result = result + '<p>• Не выбрана дата выдачи паспорта!</p>';
        }

        if (name_org_give_pass == ''){
            result = result + '<p>• Не заполнена организация выдавшая паспорт!</p>';
        }

        if(result != ''){
            return modal(result)
        }
        const json = JSON.stringify(
            { 
                fio: fio,
                phone: phone,
                email: email,
                gender: gender(),
                date_birth: date_birth(),
                status: 0,
                serial_pass: serial_pass,
                number_pass: number_pass,
                date_give_pass: date_give_pass(),
                name_org_give_pass: name_org_give_pass
            }
        );
        result = ''
        const res = await axios.post('https://lk.mta-donskoy.ru/createRepresentative', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                console.log(response.data.message);
                setTimeout(() => document.location.href='/form/2', 150);
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

    $('#repeated').on('click', async function(e) {
        e.preventDefault();
        result = ''
        const fio = $('#InputFIO').val();
        //const phone = (input_phone.hasClass( "valid" )) ? input_phone.val() : null;
        const phone = input_phone.val();
        const email = $('#InputEmail').val();
        const gender = () =>{
            if(but_male.hasClass( "btn-light" ) && but_female.hasClass( "btn-light" )){
                return null;
            }
            return ( but_male.hasClass( "btn-light" ) ? true : false)
        }
        const date_birth = () =>{
            const v_d = $("#set-day option:selected").text();
            const v_y = $("#set-year option:selected").text();
            const v_m = $("#set-month option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-month").val() + '-' + v_d);
        }
        const serial_pass = $('#InputSerPass').val();
        const number_pass = $('#InputNumPass').val();
        const date_give_pass = () =>{
            const v_d = $("#set-day-2 option:selected").text();
            const v_y = $("#set-year-2 option:selected").text();
            const v_m = $("#set-month-2 option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-month").val() + '-' + v_d);
        }
        const name_org_give_pass = $('#InputNameOrg').val();

        if (fio == ''){
            result = result + '<p>• Не заполнено ФИО!</p>';
        }
        if (phone == null){
            result = result + '<p>• Не заполнен контактный телефон!</p>';
        }
        if (email == ''){
            result = result + '<p>• Не заполнена электронная почта!</p>';
        }
        if(gender() == null){
            result = result + '<p>• Не выбран пол!</p>';
        }
        if(date_birth() == null){
            result = result + '<p>• Не выбрана дата рождения!</p>';
        }
        if (serial_pass == ''){
            result = result + '<p>• Не заполнена серия паспорта!</p>';
        }
        if (number_pass == ''){
            result = result + '<p>• Не заполнен номер паспорта!</p>';
        }
        if (date_give_pass() == ''){
            result = result + '<p>• Не выбрана дата выдачи паспорта!</p>';
        }

        if (name_org_give_pass == ''){
            result = result + '<p>• Не заполнена организация выдавшая паспорт!</p>';
        }

        if(result != ''){
            return modal(result)
        }
        if(file != null){
            const photo = new FormData()
            await photo.append('passport', file)
            await axios.post('https://lk.mta-donskoy.ru/load_passport', photo, {
                timeout: 4000
            }).then(
                (response) => {
                    console.log(response.data.message);
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
        const data =
            { 
                fio: fio,
                phone: phone,
                email: email,
                gender: gender(),
                date_birth: date_birth(),
                status: 0,
                serial_pass: serial_pass,
                number_pass: number_pass,
                date_give_pass: date_give_pass(),
                name_org_give_pass: name_org_give_pass
            };
        const json = JSON.stringify(
            { 
                id: -1,
                action: 'all',
                value: data
            }
        );
        await axios.post('https://lk.mta-donskoy.ru/update_representative', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                console.log(response.data.message);
                setTimeout(() => document.location.href='/form/1', 150);
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
    //Select male------------------------------------
    but_male.on('click',function() {
        if(but_male.hasClass( "btn-light" )){
            but_male.removeClass( "btn-light" );
            but_male.addClass( "btn-success" );
            if(but_female.hasClass( "btn-success" )){
                but_female.removeClass( "btn-success" );
                but_female.addClass( "btn-light" );
            }
        }
    });
    but_female.on('click',function() {
        if(but_female.hasClass( "btn-light" )){
            but_female.removeClass( "btn-light" );
            but_female.addClass( "btn-success" );
            if(but_male.hasClass( "btn-success" )){
                but_male.removeClass( "btn-success" );
                but_male.addClass( "btn-light" );
            }
        }
    });

    $('#next').click(function e(){
        document.location.href='/form/2'
    })
    $('#cancel').click(function e(){
        $('#acceptModal').modal('show');
    })
    $('#accept-delete').click(async function e(){
        $('#acceptModal').modal('hide');
        result = ''
        await axios.post('https://lk.mta-donskoy.ru/delete_representative', {}, {
            timeout: 4000
        }).then(
            (response) => {
                result = response.data.message
                setTimeout(() => document.location.href='/form/1', 150);
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

    //set date_birdth
    if($("#set-day").attr( "value" )){
        $('#set-day option:eq('+ $("#set-day").attr( "value" ) +')').attr('selected','selected')
    }
    if($("#set-month").attr( "value" )){
        $('#set-month option:contains('+ $("#set-month").attr( "value" ) +')').attr('selected','selected')
    }
    if($("#set-year").attr( "value" )){
        $('#set-year option:contains('+ $("#set-year").attr( "value" ) +')').attr('selected','selected')
    }

    //set date-pass
    if($("#set-day-2").attr( "value" )){
        $('#set-day-2 option:eq('+ $("#set-day-2").attr( "value" ) +')').attr('selected','selected')
    }
    if($("#set-month-2").attr( "value" )){
        $('#set-month-2 option:contains('+ $("#set-month-2").attr( "value" ) +')').attr('selected','selected')
    }
    if($("#set-year-2").attr( "value" )){
        $('#set-year-2 option:contains('+ $("#set-year-2").attr( "value" ) +')').attr('selected','selected')
    }
    //
    const input = $('#photo');
    let file = null;

    $('#pass-but').on('click', function(e) {
        if($(this).text() == 'Отменить изменение'){
            $(this).text('Изменить фото паспорта')
            file = null;
            return;
        }else{
            input.click(); 
        }
    })

    input.on('change', function(e) {    
        file = e.target.files[0];
        let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if(!validExtensions.includes(file.type)){
            alert("This is not an Image File!");
            return;
        }
        $('#pass-but').text('Отменить изменение')
        return;
    });
});