$(document).ready(function() {
    spectrum();
    setInterval(spectrum, 3000);
    function spectrum(){
        var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        $('#game1').animate({color:hue}, 3000);
        $('#introduce').animate({color:hue}, 3000);
    }
});

$("#game1").click(function(event){
    window.location.href = "game1.html";
});

$("#introduce").click(function(){
    layer.ready(function(){
        console.log(123);
        layer.photos({
            photos: {
                "title":"",
                "id": "intro",
                "start": 0,
                "data": [{"alt": "1", "pid":"intor1", "src": "introduce/introduce1.jpg", "thumb": "introduce/introduce1.jpg"}
                        ,{"alt": "2", "pid":"intor2", "src": "introduce/introduce2.jpg", "thumb": "introduce/introduce2.jpg"}]
                },
            area: ["64%"],
            offset: ["5%", "18%"],
            anim: 3,
            closeBtn: 2,
            move: false
        });
    });
});