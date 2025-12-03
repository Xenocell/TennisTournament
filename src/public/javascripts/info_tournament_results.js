$(document).ready(function() {
    $(".minus").click(function e(){
        const value_zoom = $(".value-zoom").html()
        const new_value = Number(Number(value_zoom)-5)
        $("#main-table").css("zoom", new_value.toString() + "%");
        $(".value-zoom").html(new_value)
    })
    $(".plus").click(function e(){
        const value_zoom = $(".value-zoom").html()
        const new_value = Number(Number(value_zoom)+5)
        $("#main-table").css("zoom", new_value.toString() + "%");
        $(".value-zoom").html(new_value)
    })
})