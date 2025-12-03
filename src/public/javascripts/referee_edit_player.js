function get_query(){
    var url = location.search;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}

$(document).ready(function() {
    var query = get_query();

    const input_phone =  $("#InputPhone");
    const reg_but = $('#reg-but');
    const but_male = $('#but-male');
    const but_female = $('#but-female');

    const input_Rphone =  $("#InputRPhone");
    const but_Rmale = $('#but-Rmale');
    const but_Rfemale = $('#but-Rfemale');

    const modal = (text) =>{
        $('.modal-body').html('');
        $('.modal-body').html(text);
        $('#exampleModal').modal('show');
    }
    //-----
    for (var i = 1; i < 31; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-Rday-2'));
    }

    for (var i = 1900; i < 2023; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-Ryear-2'));
    }

    $('#set-Ryear-2').change(function() {
        const v_d = $("#set-Rday-2 option:selected").text();
        const v_y = $("#set-Ryear-2 option:selected").text();
        const v_m = $("#set-Rmonth-2 option:selected").text();
        if(v_m == 'Месяц' || v_m != 'Февраля'){
            return;
        }
        $("#set-Rday-2 option").remove();
        $( document.createElement('option') ).text('День').appendTo($('#set-Rday-2'));
        const days = getDays($("#set-Rmonth-2 option:selected").text(), Number(v_y));
        for (var i = 1; i <= days; i++) {
            $( document.createElement('option') ).text(i).appendTo($('#set-Rday-2'));
        }
        if ( v_d != 'День' && Number(v_d) <= Number(days)){
            $('#set-Rday-2').val(v_d).change();
        }
    });
    $('#set-Rmonth-2').change(function() {
        const v_d = $("#set-Rday-2 option:selected").text();
        const v_m = $("#set-Rmonth-2 option:selected").text();
        const v_y = $("#set-Ryear-2 option:selected").text();
        if (v_m == 'Месяц'){
            return;
        }
        $("#set-Rday-2 option").remove();

        $( document.createElement('option') ).text('День').appendTo($('#set-Rday-2'));
        const days = getDays($("#set-Rmonth-2 option:selected").text(), (v_y == 'Год') ? 2021 : Number(v_d));
        for (var i = 1; i <= days; i++) {
            $( document.createElement('option') ).text(i).appendTo($('#set-Rday-2'));
        }
        if ( v_d != 'День' && Number(v_d) <= Number(days)){
            $('#set-Rday-2').val(v_d).change();
        }
    });
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

    //Select male------------------------------------
    but_Rmale.on('click',function() {
        if(but_Rmale.hasClass( "btn-light" )){
            but_Rmale.removeClass( "btn-light" );
            but_Rmale.addClass( "btn-success" );
            if(but_Rfemale.hasClass( "btn-success" )){
                but_Rfemale.removeClass( "btn-success" );
                but_Rfemale.addClass( "btn-light" );
            }
        }
    });
    but_Rfemale.on('click',function() {
        if(but_Rfemale.hasClass( "btn-light" )){
            but_Rfemale.removeClass( "btn-light" );
            but_Rfemale.addClass( "btn-success" );
            if(but_Rmale.hasClass( "btn-success" )){
                but_Rmale.removeClass( "btn-success" );
                but_Rmale.addClass( "btn-light" );
            }
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
    //-------------
    for (var i = 1; i < 31; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-Rday'));
    }

    for (var i = 1900; i < 2004; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-Ryear'));
    }
    
    $('#set-Ryear').change(function() {
        const v_d = $("#set-Rday option:selected").text();
        const v_y = $("#set-Ryear option:selected").text();
        const v_m = $("#set-Rmonth option:selected").text();
        if(v_m == 'Месяц' || v_m != 'Февраля'){
            return;
        }
        $("#set-Rday option").remove();
        $( document.createElement('option') ).text('День').appendTo($('#set-day'));
        const days = getDays($("#set-Rmonth option:selected").text(), Number(v_y));
        for (var i = 1; i <= days; i++) {
            $( document.createElement('option') ).text(i).appendTo($('#set-Rday'));
        }
        if ( v_d != 'День' && Number(v_d) <= Number(days)){
            $('#set-Rday').val(v_d).change();
        }
    });
    $('#set-month').change(function() {
        const v_d = $("#set-Rday option:selected").text();
        const v_m = $("#set-Rmonth option:selected").text();
        const v_y = $("#set-Ryear option:selected").text();
        if (v_m == 'Месяц'){
            return;
        }
        $("#set-Rday option").remove();

        $( document.createElement('option') ).text('День').appendTo($('#set-Rday'));
        const days = getDays($("#set-Rmonth option:selected").text(), (v_y == 'Год') ? 2021 : Number(v_d));
        for (var i = 1; i <= days; i++) {
            $( document.createElement('option') ).text(i).appendTo($('#set-Rday'));
        }
        if ( v_d != 'День' && Number(v_d) <= Number(days)){
            $('#set-Rday').val(v_d).change();
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

    //--------------
    input_Rphone.mask("+7(999) 999-9999");
    //Phone mask-----------------------------------
    input_phone.mask("+7(999) 999-9999");
    
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

    if($("#set-Rday").attr( "value" )){
        $('#set-Rday option:eq('+ $("#set-Rday").attr( "value" ) +')').attr('selected','selected')
    }
    if($("#set-Rmonth").attr( "value" )){
        $('#set-Rmonth option:contains('+ $("#set-Rmonth").attr( "value" ) +')').attr('selected','selected')
    }
    if($("#set-Ryear").attr( "value" )){
        $('#set-Ryear option:contains('+ $("#set-Ryear").attr( "value" ) +')').attr('selected','selected')
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

    if($("#set-Rday-2").attr( "value" )){
        $('#set-Rday-2 option:eq('+ $("#set-Rday-2").attr( "value" ) +')').attr('selected','selected')
    }
    if($("#set-Rmonth-2").attr( "value" )){
        $('#set-Rmonth-2 option:contains('+ $("#set-Rmonth-2").attr( "value" ) +')').attr('selected','selected')
    }
    if($("#set-Ryear-2").attr( "value" )){
        $('#set-Ryear-2 option:contains('+ $("#set-Ryear-2").attr( "value" ) +')').attr('selected','selected')
    }

    if($("#set-representative").attr( "value" )){
        $('#set-representative option:contains('+ $("#set-representative").attr( "value" ) +')').attr('selected','selected')
    }

    $("#save").click(async function (e){
        result = ''
        e.preventDefault();
        const fio = $('#InputFIO').val();
        const Rfio = $('#InputRFIO').val();
        const phone = (input_phone.val().length < 16 ? null : input_phone.val()) 
        const Rphone = (input_Rphone.val().length < 16 ? null : input_Rphone.val()) 
        const email = $('#InputEmail').val();
        const Remail = $('#InputREmail').val();
        const gender = () =>{
            if(but_male.hasClass( "btn-light" ) && but_female.hasClass( "btn-light" )){
                return null;
            }
            return ( but_male.hasClass( "btn-light" ) ? true : false)
        }
        const Rgender = () =>{
            if(but_Rmale.hasClass( "btn-light" ) && but_Rfemale.hasClass( "btn-light" )){
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
        const Rdate_birth = () =>{
            const v_d = $("#set-Rday option:selected").text();
            const v_y = $("#set-Ryear option:selected").text();
            const v_m = $("#set-Rmonth option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-Rmonth").val() + '-' + v_d);
        }

        const citizenship = $('#InputCitizenship').val();
        const city = $('#InputCity').val();
        
        const serial_pass = $('#InputSerPass').val();
        const Rserial_pass = $('#InputRSerPass').val();
        const number_pass = $('#InputNumPass').val();
        const Rnumber_pass = $('#InputRNumPass').val();
        const date_give_pass = () =>{
            const v_d = $("#set-day-2 option:selected").text();
            const v_y = $("#set-year-2 option:selected").text();
            const v_m = $("#set-month-2 option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-month-2").val() + '-' + v_d);
        }
        const Rdate_give_pass = () =>{
            const v_d = $("#set-Rday-2 option:selected").text();
            const v_y = $("#set-Ryear-2 option:selected").text();
            const v_m = $("#set-Rmonth-2 option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-Rmonth-2").val() + '-' + v_d);
        }
        const name_org_give_pass = $('#InputNameOrg').val();
        const Rname_org_give_pass = $('#InputRNameOrg').val();

        const r_type = $("#set-representative option:selected").text();
        if (fio == ''){
            result = result + '<p>• Не заполнено ФИО игрока!</p>';
        }else{
            const split_fio = fio.split(' ')
            if(split_fio[0] == undefined || split_fio[1] == undefined)
                result = result + '<p>• Не заполнено ФИО игрока!</p>';
            if( /^[а-яА-Я-]+$/.test(split_fio[0]) == false || /^[а-яА-Я-]+$/.test(split_fio[1]) == false){
                result = result + '<p>• ФИО игрока может содержать только буквы, тире и пробелы.</p>';
            }
        }
        if (Rfio == ''){
            result = result + '<p>• Не заполнено ФИО представителя!</p>';
        }else{
            const split_fio = Rfio.split(' ')
            if(split_fio[0] == undefined || split_fio[1] == undefined)
                result = result + '<p>• Не заполнено ФИО игрока!</p>';
            if( /^[а-яА-Я-]+$/.test(split_fio[0]) == false || /^[а-яА-Я-]+$/.test(split_fio[1]) == false){
                result = result + '<p>• ФИО представителя может содержать только буквы, тире и пробелы.</p>';
            }
        }
        if (phone == null){
            result = result + '<p>• Не заполнен контактный телефон игрока!</p>';
        }
        if (Rphone == null){
            result = result + '<p>• Не заполнен контактный телефон представителя!</p>';
        }
        if (email == ''){
            result = result + '<p>• Не заполнена электронная почта игрока!</p>';
        }
        if (Remail == ''){
            result = result + '<p>• Не заполнена электронная почта Представителя!</p>';
        }
        if(gender() == null){
            result = result + '<p>• Не выбран пол игрока!</p>';
        }
        if(gender() == null){
            result = result + '<p>• Не выбран пол представителя!</p>';
        }
        if(date_birth() == null){
            result = result + '<p>• Не выбрана дата рождения игрока!</p>';
        }
        if(Rdate_birth() == null){
            result = result + '<p>• Не выбрана дата рождения представителя!</p>';
        }
        if (citizenship == ''){
            result = result + '<p>• Не заполнено гражданство!</p>';
        }
        if (city == ''){
            result = result + '<p>• Не заполнен город!</p>';
        }
        if (serial_pass == ''){
            result = result + '<p>• Не заполнена серия паспорта игрока!</p>';
        }
        if (Rserial_pass == ''){
            result = result + '<p>• Не заполнена серия паспорта представителя!</p>';
        }
        if (number_pass == ''){
            result = result + '<p>• Не заполнен номер паспорта игрока!</p>';
        }
        if (Rnumber_pass == ''){
            result = result + '<p>• Не заполнен номер паспорта представителя!</p>';
        }
        if (date_give_pass() == ''){
            result = result + '<p>• Не выбрана дата выдачи паспорта игрока!</p>';
        }
        if (Rdate_give_pass() == ''){
            result = result + '<p>• Не выбрана дата выдачи паспорта представителя!</p>';
        }
        if (name_org_give_pass == ''){
            result = result + '<p>• Не заполнена организация выдавшая паспорт игроку!</p>';
        }
        if (Rname_org_give_pass == ''){
            result = result + '<p>• Не заполнена организация выдавшая паспорт представителю!</p>';
        }
        if(result != ''){
            return modal(result)
        }

    
        const data =
            { 
                fio: fio,
                phone: phone,
                email: email,
                gender: gender(),
                date_birth: date_birth(),
                citizenship: citizenship,
                city: city,
                serial_pass: serial_pass,
                number_pass: number_pass,
                date_give_pass: date_give_pass(),
                name_org_give_pass: name_org_give_pass,

                r_type: r_type,
                r_fio: Rfio,
                r_phone: Rphone,
                r_email: Remail,
                r_gender: Rgender(),
                r_date_birth: Rdate_birth(),
                r_serial_pass: Rserial_pass,
                r_number_pass: Rnumber_pass,
                r_date_give_pass: Rdate_give_pass(),
                r_name_org_give_pass: Rname_org_give_pass,

            }

        const json = JSON.stringify(
            {
                id: query.id,
                r_id: query.r_id,
                action: 'update_player_and_representative',
                value: data
            }
        );
        //console.log(data)
        await axios.post('https://lk.mta-donskoy.ru/update_player', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                //console.log(response.data.message);
                //setTimeout(() => document.location.href='/form/1', 150);
                result = response.data.message
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

})