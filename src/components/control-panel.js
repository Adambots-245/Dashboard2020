function ColorWheel(id, startDeg) {

    //Color Wheel controller object designed by Sanjay Bhuvaneswaran
  
    this.degrees = startDeg;
  
    var spinFactor = 360;
  
    function spin(deg) {
      document.getElementById(id).style.transform = "rotate(" + 0 + "deg)";
      document.getElementById(id).style.transform = "rotate(" + deg + "deg)";
    }
  
    spin(this.degrees);
  
    this.spinFullCircle = function(times) {
      //Color stays the same
      spin(360 * times);
      this.degrees = (360 * times) + startDeg;
    }
  
    var getColor = () => {
      var deg = this.degrees, color = "Unknown";
      deg %= 360;
  
      if (deg % 45 == 0) deg -= 22.5;
      if (deg < 0) deg += 360;
  
      if ((deg > 0 && deg < 45) || (deg > 180 && deg < 225)) color = "Yellow";
      else if ((deg > 45 && deg < 90) || (deg > 225 && deg < 270)) color = "Red";
      else if ((deg > 90 && deg < 135) || (deg > 270 && deg < 315)) color = "Green";
      else if ((deg > 135 && deg < 180) || (deg > 315 && deg < 360)) color = "Blue";
  
      return color;
      
    }
  
    this.color = getColor;
  
    this.alignToColor = function(col) {
  
      var currentColor = getColor().toLowerCase().split("")[0], target = col.toLowerCase().split("")[0];
  
      if (currentColor == target) return;
  
      switch (target) {
        case "b":
          this.degrees = (spinFactor + 135 + 22.5);
        break;
        case "y":
          this.degrees = (spinFactor + 22.5);
        break;
        case "r":
          this.degrees = (spinFactor + 45 + 22.5);
        break;
        case "g":
          this.degrees = (spinFactor + 90 + 22.5);
        break;
      }
  
      spin(this.degrees);
      spinFactor += 360;
  
      return getColor();
  
    }
  
  }