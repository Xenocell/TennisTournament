$(document).ready(async function() {

    let map_payments = new Map()

    $('#set-year').change(function() {
        const v_y = $("#set-year option:selected").text();
        $(".table tbody tr").remove()
        setTable(v_y);
    });
    const getDate = (date) =>{
        return date.slice(0, 10) + ' ' + date.slice(11, 19)
    }
    const setTable = (year) =>{
        let c = 1
        if (year == 'Все'){
            map_payments.forEach((value, key, _) => {
                value.forEach(element => {
                    $(".table tbody").append("<tr><td>" + c + "</td><td>" + element.sum + "</td><td>" + getDate(element.date_payment)  + "</td></tr>")
                    c++;
                });
            });
        }else{
            //console.log(map_payments.get(year))
            map_payments.get(Number(year)).forEach(element => {
                $(".table tbody").append("<tr><td>" + c + "</td><td>" + element.sum + "</td><td>" + getDate(element.date_payment)  + "</td></tr>")
                c++;
            });
        }
    }
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

    $('#table-update').click( async () => {
        $('#table-update').hide();
        $('.spinner').show();
        await loadTable();
    });

    async function loadTable(){
        result = ''
        const res = await axios.post('https://lk.mta-donskoy.ru/get_payments', {}, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                if(response.data.message){
                    let payments = response.data.message;
                    payments.sort(function (a, b) {
                        return new Date(a.date_payment) - new Date(b.date_payment);
                    });
                    payments.forEach(element => {
                        const y = new Date(element.date_payment).getFullYear();
                        if (!map_payments.has(y)){
                            map_payments.set(y, [element])
                            $( document.createElement('option') ).text(y).appendTo( $('#set-year') );
                        }
                        else{
                            (map_payments.get(y)).push(element)
                        }
                    });
                    console.log(map_payments)
                    setTable('Все');
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
});