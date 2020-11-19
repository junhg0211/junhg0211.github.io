Number.prototype.format = function(){
    if (this == 0) return 0;
 
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');
 
    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
 
    return n;
};

window.addEventListener('scroll', tick);

window.setInterval(tick, frameDurationInMillis);

function calculate() {
    var duration = parseFloat(document.getElementById("duration").value);
    var tracks = parseFloat(document.getElementById("tracks").value);
    var deadline = parseFloat(document.getElementById("deadline").value);

    var result = parseInt(5 / Math.sqrt(deadline) * tracks * duration * 2.5) * 1000;

    document.getElementById("result").innerHTML = `${duration}분, ${tracks}트랙, ${deadline}일 마감 :: ${result.format()} KRW`;
}