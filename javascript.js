$(function(){

    $("#slider").slider({
        min: 3,
        max: 30,
        slide: function(event, ui) {
            $("#circle").height(ui.value);
            $("#circle").width(ui.value);
        }
    });
    
    var brushdown = false; //is mouse down on canvas?
    var paintNotErase = true;
    var canvas = document.getElementById("paint");
    var context = canvas.getContext("2d");
    var canvasContainer = $("#canvasContainer");
    var mouse = {x: 0, y: 0};

    //load from local storage
    if(localStorage.getItem("drawingCanvas") != null) {
        var img = new Image();
        img.onload = function() {
            context.drawImage(img, 0, 0);
        }
        img.src = localStorage.getItem("drawingCanvas");
    }

    // drawing parameters
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoint = "round";

    // on click
    canvasContainer.mousedown(function(e){
        // set brushdown to true
        brushdown = true;
        context.beginPath();
        // get coordinates of mouse
        mouse.x = (e.pageX - this.offsetLeft);
        mouse.y = (e.pageY - this.offsetTop);
        context.moveTo(mouse.x, mouse.y);
    });

    canvasContainer.mousemove(function(e){
        mouse.x = (e.pageX - this.offsetLeft);
        mouse.y = (e.pageY - this.offsetTop);
        if (brushdown == true) {
            if(paintNotErase) {
                // painting, set paramaters of brush
                context.strokeStyle = $("#brushColor").val();
        } else {
            // erasing, so set color to white
            context.strokeStyle = "white";
        }
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
     }
    });

    canvasContainer.mouseup(function(e){
        brushdown = false;
    });

    canvasContainer.mouseleave(function(e){
        brushdown = false;
    });
    
$("#erase").click(function(){
    $("#erase").toggleClass("eraseSelected")                       
    paintNotErase = !paintNotErase;
});

// reset button
$("#reset").click(function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    paintNotErase = true;
    $("#erase").removeClass('eraseSelected');
});

// save button
$("#save").click(function(){
        //does browser support local storage
        if(typeof(localStorage) != null) {
            // store data
            localStorage.setItem("drawingCanvas", canvas.toDataURL());
            // flash "saved" modal
        } else {
            window.alert('Your browser does not support saving the drawing');
        }
});

// change brush size
$("#slider").slider({
    min: 3,
    max: 30,
    slide: function(event, ui) {
        $("#circle").height(ui.value);
        $("#circle").width(ui.value);
        context.lineWidth = ui.value;
    }
});

// change color
$("#brushColor").change(function(){
    $("#circle").css("background-color", $(this).val());

})



}); //IIFE