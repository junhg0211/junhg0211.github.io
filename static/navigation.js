const navigation = document.querySelector("#navigation");
const titleBox = document.querySelector("#title-content");

new IntersectionObserver(e => {
    e.forEach(box => {
        if (box.isIntersecting) {
            navigation.style.transform = "translate(0, -100%)";
        } else {
            navigation.style.transform = "";
        }
    });
}).observe(titleBox);
