var container = document.querySelector(".container");
var size_form = document.querySelector("form");
var download_form = document.getElementById("download-form");
var white_option = document.querySelector(".white-option");
var black_option = document.querySelector(".black-option");
var red_option = document.querySelector(".red-option");
var blue_option = document.querySelector(".blue-option");
var green_option = document.querySelector(".green-option");
var custom_option = document.querySelector(".custom-option");
var tools = document.querySelector(".tools");
var color_selector = document.querySelector(".color-selector");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var div = document.querySelector(".div");

canvas.style.display = "none";

var boxes = [];
var mapping = {
    rows: 0,
    cols: 0,
    tsize: 0
};

var selector = {
    selectedColor: "black",
    selectedTool: "Pencil"
}

var mouseholded, mouseactive = false;

function createPixelContainer(tsize) {
    var tempDiv = document.createElement('div');
    tempDiv.style.width = tsize + "px";
    tempDiv.style.height = tsize + "px";
    tempDiv.classList.add("border");
    tempDiv.addEventListener('click', (e) => {
        mouseholded = setInterval((e) => {
            mouseactive = !mouseactive;
        }, 10);
    });

    tempDiv.addEventListener("mouseup", (e) => {
        clearInterval(mouseholded);
    });

    boxes.push(tempDiv);
    return tempDiv;
}

container.addEventListener("mousemove", (e) => {
    if(mouseactive) {
        if(selector.selectedTool === "Pencil") {
            if(selector.selectedColor === "custom") {
                var rgbColor = `rgb(${color_selector.children[1].value}, ${color_selector.children[2].value}, ${color_selector.children[3].value})`;
                e.target.style.backgroundColor = rgbColor;
            }else {
                e.target.style.backgroundColor = selector.selectedColor;
            }
        }else if(selector.selectedTool === "Eraser") {
            e.target.style.backgroundColor = "";
        }
    }
});

white_option.addEventListener('click', (e) => {
    selector.selectedColor = white_option.innerHTML;
});

black_option.addEventListener('click', (e) => {
    selector.selectedColor = black_option.innerHTML;
});

red_option.addEventListener('click', (e) => {
    selector.selectedColor = red_option.innerHTML;
});

blue_option.addEventListener('click', (e) => {
    selector.selectedColor = blue_option.innerHTML;
});

green_option.addEventListener('click', (e) => {
    selector.selectedColor = green_option.innerHTML;
});

custom_option.addEventListener("click", (e) => {
    selector.selectedColor = "custom";
});

async function autoDownloadCanvas(filename="image", downloadtype) {
    if(downloadtype === "mst") {
        canvas.width = mapping.rows;
        canvas.height = mapping.cols;
        for(var r = 0; r < mapping.rows; r++) {
            for(var c = 0; c < mapping.cols; c++) {
                var box = r * mapping.cols + c;
                if(boxes[box].style.backgroundColor) {
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = boxes[box].style.backgroundColor;
                }else{
                    ctx.globalAlpha = 0;
                }
                ctx.fillRect(c, r, 1, 1);
            }
        }
    }else if(downloadtype === "rst") {
        canvas.width = mapping.rows * (mapping.tsize - 2);
        canvas.height = mapping.cols * (mapping.tsize - 2);
        for(var r = 0; r < mapping.rows; r++) {
            for(var c = 0; c < mapping.cols; c++) {
                var box = r * mapping.cols + c;
                if(boxes[box].style.backgroundColor) {
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = boxes[box].style.backgroundColor;
                }else{
                    ctx.globalAlpha = 0;
                }
                ctx.fillRect(c * (mapping.tsize - 2), r * (mapping.tsize - 2), (mapping.tsize - 2), (mapping.tsize - 2));
            }
        }
    }
    let link = document.getElementById('link');
    link.setAttribute('download', filename + '.png');
    link.setAttribute('href', canvas.toDataURL("image/png"));
    link.click();
}

download_form.addEventListener("submit", (e) => {
    e.preventDefault();
    var selectedButton;
    if(e.target.children[1].checked) {
        autoDownloadCanvas(e.target.children[0].value, "mst");
    }else if(e.target.children[3].checked){
        autoDownloadCanvas(e.target.children[0].value, "rst");
    }
});

size_form.addEventListener('submit', (e) => {
    e.preventDefault();
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    size_form.style.display = "none";
    var rows = e.target.children[2].value;
    var cols = e.target.children[4].value;
    var tsize = parseInt(e.target.children[6].value);
    container.style.width = rows * (tsize + 2) + "px";
    container.style.height = cols * (tsize + 2) + "px";
    for(var r = 0; r < rows; r++) {
        for(var c = 0; c < cols; c++) {
            container.append(createPixelContainer(tsize));
        }
    }
    mapping.cols = cols;
    mapping.rows = rows;
    mapping.tsize = tsize + 2;
});

for(var i = 0; i < tools.children.length; i++) {
    tools.children[i].addEventListener("click", (e) => {
        selector.selectedTool = e.target.innerHTML;
    });
}

setInterval((e) => {
    if(selector.selectedTool === "Pencil") {
        tools.children[0].style.backgroundColor = "gray";
        tools.children[1].style.backgroundColor = "white";
        tools.children[2].style.backgroundColor = "white";
        tools.children[3].style.backgroundColor = "white";
        tools.children[4].style.backgroundColor = "white";
    }else if(selector.selectedTool === "Line") {
        tools.children[0].style.backgroundColor = "white";
        tools.children[1].style.backgroundColor = "gray";
        tools.children[2].style.backgroundColor = "white";
        tools.children[3].style.backgroundColor = "white";
        tools.children[4].style.backgroundColor = "white";
    }else if(selector.selectedTool === "Color Picker") {
        tools.children[0].style.backgroundColor = "white";
        tools.children[1].style.backgroundColor = "white";
        tools.children[2].style.backgroundColor = "gray";
        tools.children[3].style.backgroundColor = "white";
        tools.children[4].style.backgroundColor = "white";
    }else if(selector.selectedTool === "Color Fill") {
        tools.children[0].style.backgroundColor = "white";
        tools.children[1].style.backgroundColor = "white";
        tools.children[2].style.backgroundColor = "white";
        tools.children[3].style.backgroundColor = "gray";
        tools.children[4].style.backgroundColor = "white";
    }else if(selector.selectedTool === "Eraser") {
        tools.children[0].style.backgroundColor = "white";
        tools.children[1].style.backgroundColor = "white";
        tools.children[2].style.backgroundColor = "white";
        tools.children[3].style.backgroundColor = "white";
        tools.children[4].style.backgroundColor = "gray";
    }

    if(selector.selectedColor === "black") {
        black_option.style.backgroundColor = "darkgray";
    }else if(selector.selectedColor === "white") {
        white_option.style.backgroundColor = "darkgray";
    }else if(selector.selectedColor === "red") {
        red_option.style.backgroundColor = "darkgray";
    }else if(selector.selectedColor === "blue") {
        green_option.style.backgroundColor = "darkgray";
    }else if(selector.selectedColor === "green") {
        blue_option.style.backgroundColor = "darkgray";
    }else if(selector.selectedColor === "custom") {
        custom_option.style.backgroundColor = "darkgray";
    }

    var rgbColor = `rgb(${color_selector.children[1].value}, ${color_selector.children[2].value}, ${color_selector.children[3].value})`;
    color_selector.children[0].style.backgroundColor = rgbColor;
}, 100);

