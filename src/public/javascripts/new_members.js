$(document).ready(async function() {
    let map_users = new Map()

    
    const viewMap = (type) =>{
        let c = 1
        if (type == 'Все'){
            $( "tbody tr" ).each(function( index ) {
                $(this).show();
            });
        }else{
            $( "tbody tr" ).each(function( index ) {
                const current_element = $(this);
                if (type == 'Игроки'){
                    if($(this).find("td").eq(1).html() == 'Представитель')
                        $(this).hide();
                    if($(this).find("td").eq(1).html() == 'Игрок')
                        $(this).show();
                }else if(type == 'Представители'){
                    if($(this).find("td").eq(1).html() == 'Игрок')
                        $(this).hide();
                    if($(this).find("td").eq(1).html() == 'Представитель')
                        $(this).show();
                }
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
    $('#set-type').change(function() {
        const type = $("#set-type option:selected").text();
        if(type == 'Представители'){
            $('#set-type').width(115);
        }else{
            $('#set-type').width(60);
        }
        //$(".table tbody tr").remove()
        viewMap(type);
    });

    async function loadTable(){
        let result = ''
        const res = await axios.post('https://lk.mta-donskoy.ru/get_new_members', {}, {
            timeout: 4000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (response) => {
                if(response.data.message){
                    const data = response.data.message;
                    //console.log(data)
                    let c = 1;
                    for (const [key, value] of Object.entries(data)) {
                        map_users.set(key, [])
                        value.forEach(e =>{
                            (map_users.get(key)).push(e)
                            //console.log(e.r_id +' ' + (e.r_id == null))
                            $(".table tbody").append("<tr><td>" + c + "</td><td>" + 'Игрок' + "</td><td>" + e.last_name+ ' '+ e.first_name[0]+'.' + e.patronymic[0] + '.' + "</td><td> <button  class='view btn btn-primary' id='" + e.player_id + "'><i class='fas fa-eye' style='color: black;'></i>  </button></td></tr>")
                            c++;
                            $('#' + e.player_id).click(function(){
                                document.location.href='/new_members?id='+$(this).attr('id')
                            })
                        })
                        $( document.createElement('option') ).text(key).appendTo( $('#set-type') );
                    }
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
            $('.modal-body').html(result);
            $('#exampleModal').modal('show');
            return;
        }
    }
    await loadTable();

    /*$('.view').click(function(e){
        document.location.href='/new_members?id='+$(this).attr('id') + '&type=' + $(this).parent().parent().find("td").eq(1).html()
    })*/
})