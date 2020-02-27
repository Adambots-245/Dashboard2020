//A script created by Cannicide for drawing custom arrows based on String configurations

var arrowClass = 1;

function Arrow(svgid, direction, coords) {

  var x = coords.x;
  var y = coords.y;
  var size = coords.z;
  var width, height;

  if (coords.last == "none") {
    if (["right", "left"].indexOf(direction) > -1) {
      //Is horizontal
      coords.last = "right";
    }
    else {
      //Is vertical
      coords.last = "down";
    }
  }

  if (direction == "right") {
    width = size;
    height = 2;
    if (coords.last == "down") {
      y = y;
      x = x - 2;
    }
    else if (coords.last == "up") {
      y = y - size - 2;
      x = x - 2;
    }
    else if (coords.last == "right") {
      x = x;
      y = y - 2;
    }
  }
  else if (direction == "left") {
    width = size;
    height = 2;
    if (coords.last == "up") {
      x = x - size;
      y = y - size - 2;
    }
    else if (coords.last == "left") {
      x = x - size - size;
      y = y - 2;
    }
    else {
      x = x - size;
      y = y;
    }
  }
  else if (direction == "up") {
    width = 2;
    height = size;
    if (coords.last == "left") {
      x = x - size - 2;
      y = y - size;
    }
    else if (coords.last == "up") {
      x = x - 2;
      y = y - size - size; 
    }
    else {
      x = x;
      y = y - size;
    }
  }
  else if (direction == "down") {
    width = 2;
    height = size;
    if (coords.last == "right") {
      x = x;
      y = y - 2;
    }
    else if (coords.last == "left") {
      x = x - size - 2;
      y = y - 2;
    }
    else if (coords.last == "down") {
      x = x - 2;
      y = y;
    }
  }

  var elem = `<rect width="${width}" height="${height}" x="${x}" y="${y}" ${coords.arrow ? "arrow" : ""}></rect>`;

  document.getElementById(svgid).innerHTML += elem;


  if (coords.arrow) {
    var svg = document.querySelector("#" + svgid).getBoundingClientRect();
    var y1 = svg.top;
    var x1 = svg.left;

    document.body.innerHTML += `<arrow class="arr${arrowClass}"></arrow>`;
    var arrow = document.querySelector("arrow.arr" + arrowClass);
    arrow.style.top = y1 + y;
    arrow.style.left = x1 + x;

    if (direction == "right") {
        arrow.style.transform = "rotate(-90deg) translateX(35%) translateY(-25%)";
      }
      if (direction == "left") {
        arrow.style.transform = "rotate(90deg) translateX(-30%)";
        arrow.style.left = x1 + x + size;
      }
      else {
        arrow.style.transform = "translateX(-40%) translateY(-30%)";
      }

    arrowClass += 1;
  }

  return {x: width + x, y: height + y, z: size, last: direction};

}


function parseArrowStr(str, svgID, startPos, size) {
  //KEY:
  // ^ = up
  // | = down
  // < = left
  // > = right

  //startPos possible starting positions:
  // "right" = starting x is size

  var options = false;

  str.split("").forEach((d, i) => {
    if (!options) {
      options = {x: 0, y: 0, z: size, arrow: true};
      if (startPos) {
          options.x += startPos[0];
          options.y += startPos[1];
      }
    }

    var direction;

    switch (d) {
      case "^":
        direction = "up";
      break;
      case "|":
        direction = "down";
      break;
      case "<":
        direction = "left";
      break;
      case ">":
        direction = "right";
      break;
    }

    options = Arrow(svgID, direction, options);

  });
}