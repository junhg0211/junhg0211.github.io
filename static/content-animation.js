const observer = new IntersectionObserver(e => {
    e.forEach(box => {
        if (box.isIntersecting) {
            box.target.style.transform = "";
            box.target.style.opacity = 1;
        } else {
            box.target.style.transform = "translate(100px, 0)";
            box.target.style.opacity = 0;
        }
    });
});

const boxes = document.querySelectorAll(".content");
boxes.forEach(box => observer.observe(box));
