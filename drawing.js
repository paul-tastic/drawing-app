$(function(){

    // initial drawing parameters
    var brushdown = false; //is mouse down on canvas?
    var paintNotErase = true;
    var canvas = document.getElementById("paint");
    var context = canvas.getContext("2d");
    var canvasContainer = $("#canvasContainer");
    var mouse = {x: 0, y: 0};

    var minBrushSize = 5;
    context.lineWidth = minBrushSize;
    context.lineCap = "round";
    context.lineJoint = "round";

    // set canvas size base don screen size
    canvas.width = $("#canvasContainer").width();
    canvas.height = $("#canvasContainer").height();

    // check local storage and load if exists
    if(localStorage.getItem("drawingCanvas") != null) {
        var img = new Image();
        img.onload = function() {
            context.drawImage(img, 0, 0);
        }
        img.src = localStorage.getItem("drawingCanvas");
    }

    // on click
    canvasContainer.mousedown(function(e){
        // set brushdown to true
        brushdown = true;
        context.beginPath();
       
        console.log(canvasContainer.offset());
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

    // erase button
    $("#erase").click(function(){
                            
        paintNotErase = !paintNotErase;
        if (paintNotErase) {
            paintMode();
        } else {
            $("#status-alert").removeClass("hideMe");
            $("#erase").removeClass("btn-outline-primary");
            $("#erase").addClass("btn-warning");
            $("#circle").toggleClass("circleEraseSelected"); 
            $("#brush-text").text("eraser size");
            $("#erase").text("Paint")
        }        
    });

    function paintMode() {
        paintNotErase = true;
        $("#erase").text("Erase")
        $("#brush-text").text("brush size");
        $("#status-alert").addClass("hideMe");        
        $("#erase").removeClass("btn-warning");
        $("#erase").addClass("btn-outline-primary");
        $("#brushColor").val("#000000");
        $("#circle").css("background-color", "#000000");
        $("#slider").slider({value: minBrushSize});
        $("#circle").height(minBrushSize);
        $("#circle").width(minBrushSize);

    }

    // reset button
    $("#reset").click(function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        paintMode(); 
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

    // slider initial function 
    $("#slider").slider({
        min: minBrushSize,
        max: 30,
        slide: function(event, ui) {
            $("#circle").height(ui.value);
            $("#circle").width(ui.value);
        }
    });

    // change brush size
    $("#slider").slider({
        min: minBrushSize,
        max: 30,
        slide: function(event, ui) {
            $("#circle").height(ui.value);
            $("#circle").width(ui.value);
            context.lineWidth = ui.value;
        }
    });

    // change color drop down
    $("#brushColor").change(function() {
        $("#circle").css("background-color", $(this).val());
    })


}); //IIFE