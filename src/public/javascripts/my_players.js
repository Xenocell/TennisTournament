$(document).ready(async function() {
    $('.view').click(function(e){
        document.location.href='/form/1?player_id=' + $(this).attr('id')
        //document.location.href='/new_members?id='+$(this).attr('id') + '&type=' + $(this).parent().parent().find("td").eq(1).html()
    })
})