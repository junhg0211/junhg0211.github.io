var page = 0;
var phase = 0; // 0: idle, 1: moving down, 2: moving up

var targetY = 0;
var y = 0;

var frameDurationInMillis = 1000 / 60;

function tick() {
    targetY = window.innerHeight * page;

    y += (targetY - y) / 20;

    window.scrollTo(0, y);
}

document.addEventListener("wheel", (event) => {
    if (event.deltaY > 0) {
        if (page < 2) {
            page = page + 1;
            phase = 1;
        }
    } else {
        if (page > 0) {
            page = page - 1;
            phase = 2;
        }
    }

    // window.scrollTo(0, 0);
});

window.addEventListener('scroll', tick);

window.setInterval(tick, frameDurationInMillis);

function calculate() {
    var duration = parseFloat(document.getElementById("duration").value);
    var tracks = parseFloat(document.getElementById("tracks").value);
    var deadline = parseFloat(document.getElementById("deadline").value);

    var result = parseInt(5 / Math.sqrt(deadline) * tracks * duration * 2.5) * 1000;

    document.getElementById("result").innerHTML = `${duration}분, ${tracks}트랙, ${deadline}일 마감 :: ${result} KRW`;
}