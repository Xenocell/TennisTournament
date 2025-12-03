
$(document).ready(async function() {
    $('#iframe_15').attr('src', window.location.href + '&active=administrations');
    $('#view-administrations').click(function(){
        $('#iframe_15').attr('src', window.location.href + '&active=administrations');
    })
    $('#view-addinfo').click(function(){
        $('#iframe_15').attr('src', window.location.href + '&active=additional_information');
    })
    $('#view-lists').click(function(){
        $('#iframe_15').attr('src', window.location.href + '&active=lists');
    })
    $('#view-results').click(function(){
        $('#iframe_15').attr('src', window.location.href + '&active=results');
    })
    $('#view-schedule').click(function(){
        $('#iframe_15').attr('src', window.location.href + '&active=schedule');
    })
    $('#close').click(function(){
        window.close();
    })
})

