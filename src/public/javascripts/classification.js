function get_query(){
    var url = location.search;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}

$(document).ready(async function() {
	const query = get_query()
	if(query.gender != null){
		$('#select-sex option:contains('+ query.gender +')').attr('selected','selected')
	}
    $('.namePlayer').click(function(){
        window.open('/rating?details='+$(this).parent().find("td").eq(3).html())
    })
    $( "#select-sex" ).change(function() {
	  	window.location.href = "/rating?page="+query.page + "&gender=" + $("#select-sex option:selected").text()
	});

    /*const pages = document.getElementsByClassName("page-link")

	for (let i = 0; i < pages.length; i++) {
	  const page = pages[i]
	  page.setAttribute("href", "/rating?page="+query.page + "&gender=" + $("#select-sex option:selected").text());
	}*/
})