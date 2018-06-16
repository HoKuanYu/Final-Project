$(document).ready(function() {
    spectrum();
    setInterval(spectrum, 3000);
    function spectrum(){
        var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        $('#game1').animate({color:hue}, 3000);
    }
});

$("#game1").click(function(event){
    window.location.href = "game1.html";
});