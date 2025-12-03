$(document).ready(function() {
    const but_prize = $('#but-prize')
    const but_rating = $('#but-rating')
    const but_os = $('#but-os')
    const but_aos = $('#but-aos')
    const but_k = $('#but-k')
    const but_male = $('#but-male')
    const but_female = $('#but-female')
    const but_hard = $('#but-hard')
    const but_grunt = $('#but-grunt')
    const current_year = new Date().getFullYear()
    var label_color = "null"

    const modal = (text) =>{
        $('.modal-body').html('');
        $('.modal-body').html(text);
        $('#exampleModal').modal('show');
    }


    but_hard.on('click',function() {
        if(but_hard.hasClass( "btn-light" )){
            but_hard.removeClass( "btn-light" );
            but_hard.addClass( "btn-success" );
            if(but_grunt.hasClass( "btn-success" )){
                but_grunt.removeClass( "btn-success" );
                but_grunt.addClass( "btn-light" );
            }
        }
    });
    but_grunt.on('click',function() {
        if(but_grunt.hasClass( "btn-light" )){
            but_grunt.removeClass( "btn-light" );
            but_grunt.addClass( "btn-success" );
            if(but_hard.hasClass( "btn-success" )){

                but_hard.removeClass( "btn-success" );
                but_hard.addClass( "btn-light" );
            }
        }
    });

    but_prize.on('click',function() {
        if(but_prize.hasClass( "btn-light" )){
            but_prize.removeClass( "btn-light" );
            but_prize.addClass( "btn-success" );
            $('#prize-form').show()
            $('.gr-points').hide()
            $('#InputCinfo').hide()
            if(but_rating.hasClass( "btn-success" )){
                $('#vznos-form').hide()
                but_rating.removeClass( "btn-success" );
                but_rating.addClass( "btn-light" );
            }
        }
    });
    but_rating.on('click',function() {
        if(but_rating.hasClass( "btn-light" )){
            but_rating.removeClass( "btn-light" );
            but_rating.addClass( "btn-success" );
            $('#vznos-form').show()
            $('.gr-points').show()
            $('#InputCinfo').show()
            if(but_prize.hasClass( "btn-success" )){
                $('#prize-form').hide()
                but_prize.removeClass( "btn-success" );
                but_prize.addClass( "btn-light" );
            }
        }
    });
    but_os.on('click',function() {
        if(but_os.hasClass( "btn-light" )){
            but_os.removeClass( "btn-light" );
            but_os.addClass( "btn-success" );
            if(but_aos.hasClass( "btn-success" )){
                but_aos.removeClass( "btn-success" );
                but_aos.addClass( "btn-light" );
            }
            if(but_k.hasClass( "btn-success" )){
                but_k.removeClass( "btn-success" );
                but_k.addClass( "btn-light" );
            }
        }
    });
    but_aos.on('click',function() {
        if(but_aos.hasClass( "btn-light" )){
            but_aos.removeClass( "btn-light" );
            but_aos.addClass( "btn-success" );
            if(but_os.hasClass( "btn-success" )){
                but_os.removeClass( "btn-success" );
                but_os.addClass( "btn-light" );
            }
            if(but_k.hasClass( "btn-success" )){
                but_k.removeClass( "btn-success" );
                but_k.addClass( "btn-light" );
            }
        }
    });
    but_k.on('click',function() {
        if(but_k.hasClass( "btn-light" )){
            but_k.removeClass( "btn-light" );
            but_k.addClass( "btn-success" );
            if(but_os.hasClass( "btn-success" )){
                but_os.removeClass( "btn-success" );
                but_os.addClass( "btn-light" );
            }
            if(but_aos.hasClass( "btn-success" )){
                but_aos.removeClass( "btn-success" );
                but_aos.addClass( "btn-light" );
            }
        }
    });
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

    /*for (var i = 2007; i <= 2015; i++){
        e = document.createElement('option');
        $(e).text(i == 2007 ? 2007 : (i-1 + '-' + Number(i))).appendTo($('#set-year-players'));
    }*/
    for (var i = 1960; i <= 2021; i++){
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-year1-players'));
    }
    for (var i = 1960; i <= 2021; i++){
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-year2-players'));
    }
    for (var i = current_year+2; i >= current_year; i--) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-year-start'));
    }
    for (var i = current_year+2; i >= current_year; i--) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-year-end'));
    }
    for (var i = 1; i <= 31; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-day-end'));
    }
    for (var i = 1; i <= 31; i++) {
        e = document.createElement('option');
        $(e).text(i).appendTo($('#set-day-start'));
    }


    let result = ''
    $('#reg-but').on('click', async function(e) {
        result = ''
        e.preventDefault();
        
        const name = $('#InputNameTour').val();
        var payment = $('#InputPayment').val();
        const type = () =>{
            if(but_prize.hasClass( "btn-light" ) && but_rating.hasClass( "btn-light" )){
                return null;
            }
            return ( but_prize.hasClass( "btn-light" ) ? true : false)
        }
        var prize = $('#InputPrize').val();
        const format = () =>{
            if(but_os.hasClass( "btn-light" ) && but_aos.hasClass( "btn-light" ) && but_k.hasClass( "btn-light" )){
                return null;
            }
            return ( but_os.hasClass( "btn-success" ) ? 1 : ( but_aos.hasClass( "btn-success" ) ? 2 : ( but_k.hasClass( "btn-success" ) ? 3 : null)))
        }
        const gender = () =>{
            if(but_male.hasClass( "btn-light" ) && but_female.hasClass( "btn-light" )){
                return null;
            }
            return ( but_male.hasClass( "btn-light" ) ? true : false)
        }
        const date_birdth = ($("#set-year1-players option:selected").text() == 'Год' && $("#set-year2-players option:selected").text() == 'Год') ? '0-0' : ($("#set-year1-players option:selected").text() == 'Год' || $("#set-year2-players option:selected").text() == 'Год') ? null : $("#set-year1-players option:selected").text()+'-'+$("#set-year2-players option:selected").text() ;
        
        const date_start = () =>{
            const v_d = $("#set-day-start option:selected").text();
            const v_y = $("#set-year-start option:selected").text();
            const v_m = $("#set-month-start option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-month-start").val() + '-' + v_d);
        }
        const date_end = () =>{
            const v_d = $("#set-day-end option:selected").text();
            const v_y = $("#set-year-end option:selected").text();
            const v_m = $("#set-month-end option:selected").text();
            if (v_d == 'День' || v_y == 'Год' || v_m == 'Месяц'){
                return null;
            }
            return String(v_y + '-' + $("#set-month-end").val() + '-' + v_d);
        }
        const place = $('#InputPlace').val();
        //const count = $("#count-players option:selected").text()
        
        const particions_number = !type() ? $("#count-players option:selected").text() : $( "#count-players option:selected" ).attr("particions_number");
        const subtournaments = !type() ? 1 : $( "#count-players option:selected" ).attr("subtournaments");

        const court = () =>{
            if(but_hard.hasClass( "btn-light" ) && but_grunt.hasClass( "btn-light" )){
                return null;
            }
            if(but_hard.hasClass( "btn-success" )){
                return but_hard.text();
            }else if(but_grunt.hasClass( "btn-success" )){
                return but_grunt.text();
            }else{
                return null;
            }
           // return ( but_os.hasClass( "btn-light" ) ? true : false)
        }
        const type_points = $("#type-points").val();
        var c_info = $('#InputCinfo').val();
        if (c_info == ''){
            c_info = ' '
        }

        const count_court = $("#count-court option:selected").text()
        const referee = $('#InputReferee').val();
        const phone_referee = $('#InputPhoneReferee').val();
        const email_referee = $('#InputEmailReferee').val();

        if (name == ''){
            result = result + '<p>• Не заполнено наименование турнира!</p>';
        }
        if(type() == null){
            result = result + '<p>• Не выбран тип турнира!</p>';
        }
        if(format() == null){
            result = result + '<p>• Не выбран формат!</p>';
        }
        //console.log(type())
        /*if(!(/^\d+$/.test(payment)) && payment != '' && type()){
            result = result + '<p>• Поле взноса может состоять только из цифр!</p>';
        }
        if(!(/^\d+$/.test(prize)) && prize != '' && !type()){
            result = result + '<p>• Поле призового фонда может состоять только из цифр!</p>';
        }*/
        if(payment == ''){
            payment = '-'//result + '<p>• Поле взноса не может быть пустым!</p>';
        }
        if(prize == ''){
            prize = '-'//result + '<p>• Поле призового фонда не может быть пустым!</p>';
        }
        if(gender() == null){
            result = result + '<p>• Не выбран пол!</p>';
        }
        if(date_birdth == null){
            result = result + '<p>• Не выбран год рождения участников!</p>';
        }

        if(date_start() == null){
            result = result + '<p>• Не выбрана дата начала турнира!</p>';
        }
        if(date_end() == null){
            result = result + '<p>• Не выбрана дата окончания турнира!</p>';
        }
        if (place == ''){
            result = result + '<p>• Не заполнено место проведения!</p>';
        }
        if (court() == null){
            result = result + '<p>• Не заполнен тип корта!</p>';
        }
        if (referee == ''){
            result = result + '<p>• Не заполнен главный судья!</p>';
        }
        if (phone_referee == ''){
            result = result + '<p>• Не заполнен контактный телефон судьи!</p>';
        }
        if (email_referee == ''){
            result = result + '<p>• Не адрес электронной почты судьи!</p>';
        }
        
        if(result != ''){
            return modal(result)
        }

        const json = JSON.stringify(
            { 
                name: name,
                payment: (payment == '' ? 0 : payment),
                type: type(),
                prize: (prize == '' ? 0 : prize),
                format: format(),
                gender: gender(),
                date_birdth: date_birdth,
                date_start: date_start(),
                date_end: date_end(),
                place: place,
                //count: count,
                court: court(),
                count_court: count_court,
                referee: referee,
                phone_referee: phone_referee,
                email_referee: email_referee,
                type_points: type_points,
                c_info: c_info,
                particions_number: particions_number,
                subtournaments: subtournaments,
                color: label_color
            }
        );
        console.log(json)
        //return
        const res = await axios.post('https://lk.mta-donskoy.ru/createTournament', json, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
               result = response.data.message
               setTimeout(() => document.location.href='/createTournament', 150);
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

    const pickr = Pickr.create({
        el: '.color-picker',
        theme: 'nano', // or 'monolith', or 'nano'
        default: (label_color == "null" ? '#FFFFFF' : label_color),
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],

        components: {

            // Main components
            preview: true,
            opacity: true,
            hue: true,

            // Input / output Options
            interaction: {
                hex: false,
                rgba: false,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: false,
                clear: true,
                save: true
            }
        }
    });
    pickr.on('save', (color, instance) => {
        if(color){
            label_color = color.toRGBA().toString()
            console.log('Event: "save"');
            //pickr.hide()
        }
        else{
            label_color = "null"
        }
    })
})