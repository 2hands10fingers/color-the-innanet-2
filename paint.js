$(document).ready(function() {

  var canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var c = canvas.getContext('2d');

  var piTwo = Math.PI * 2;
  var v = 70;

  function Circle(x, y, dx, dy, radius, fill, stroke) {

    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.fill = fill;
    this.stroke = stroke;
    this.direction = Math.PI * 2 * Math.random()
    this.active = true

    this.draw = function() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, piTwo, false);
      c.fillStyle = this.fill;
      c.strokeStyle = this.stroke;
      c.lineWidth = 0.75;
      c.stroke()
      c.fill();
      c.shadowBlur = 10;
      c.shadowColor = fill;
      
      var steps = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
      if (!this.active) {
        
        steps.forEach(function(i){
          c.globalAlpha = i
        })
      } else {
        steps.reverse()
        steps.forEach(function(i) {
          c.globalAlpha = i
        })
      }
      // this.updatePosition()
    }

    this.updatePosition = function() {
        var dx = this.x + this.dx * Math.cos(this.direction);
        var dy = this.y + this.dy * Math.sin(this.direction);
        
        if (dx < 0 || dx > canvas.width || dy < 0 || dy > canvas.height) {
          this.direction = Math.PI * 2 * Math.random();
          this.updatePosition();
        } else {
          this.x = dx;
          this.y = dy;
        }
      
    }

    this.update = function() {

      this.x += this.dx;
      this.y += this.dy;
      if (this.x + this.radius > innerWidth || this.x - this.radius < 0) { this.dx = -this.dx; }
      if (this.y + this.radius > innerHeight || this.y - this.radius < 0) { this.dy = -this.dy; }
      




      this.draw();

    }

    this.destroy = function() {
      this.active = false
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    var length = circleArray.length

  
   

    if (length > 350) {

      for (let i = 0; i < 100; i++) {
        circleArray[i].destroy()
    }
    circleArray = circleArray.filter( i => i.active)
    
//     for (var i = 0; i < length; i++) {
//       circleArray[i].update();
//
  } 
    
  for (var i = 0; i < length; i++) {
      circleArray[i].update();
  }
  

    // WORDS ARE IMPORTANT
    c.fillStyle = "#0000008f"
    c.fillRect((canvas.width / 2) - 155 ,(canvas.height / 2.29),275,135)
    c.fill();

    c.font = "bold 40px Arial";
    c.fillStyle = "red";
    c.fillText(" C ", (canvas.width / 2) - 155, (canvas.height / 2));
    c.fillStyle = "orange";
    c.fillText(" O ", (canvas.width / 2) - 123 , (canvas.height / 2));
    c.fillStyle = "yellow";
    c.fillText(" L ", (canvas.width / 2) - 89, (canvas.height / 2));
    c.fillStyle = "green";
    c.fillText(" O ", (canvas.width / 2) - 63, (canvas.height / 2));
    c.fillStyle = "blue";
    c.fillText(" R ", (canvas.width / 2) - 29 , (canvas.height / 2));

    c.fillStyle = "white";
    c.fillText("  T    ", (canvas.width / 2) - 8.6, (canvas.height / 2));
    c.fillText("    H  ", (canvas.width / 2) - 2, (canvas.height / 2));
    c.fillText("        E", (canvas.width / 2) - 10, (canvas.height / 2));
    c.fillText(" I N N A N E T ", (canvas.width / 2) - 150, (canvas.height / 1.85));

    c.font = "bold 19.5px Arial";
    c.fillText(" created by 2hands10fingers ", (canvas.width / 2) - 150, (canvas.height / 1.75));
    c.fillStyle = "black;"

  }



  var socket = io('http://localhost:3000');
  var circleArray = []
  var alphabet = [...Array(26)].map((_, y) => String.fromCharCode(y + 65))
  alphabet.forEach( capital_letter => alphabet.push(capital_letter.toLowerCase()))

  socket.on('packet', function(data) {
    var packet = JSON.parse(data)
    var data = packet.data
    var dataSize = packet.size
    if (data.length > 0) {

      // 16777215
      function randomSizer(num) {
        // console.log(num)
        if (parseInt(num) >= 1000) {
          return 10
        }
        return (parseInt(num) % 2 === 0) ? 1000 : 100
      }

      data.forEach( i => {
        var rec = alphabet.indexOf(i) < 10 ? '0' + alphabet.indexOf(i) : alphabet.indexOf(i).toString()
        // console.log(rec)
        const randomNum = '1677'+ rec +'215'
        // console.log(randomNum)
          var fill = '#'+Math.floor(Math.random()*parseInt(randomNum)).toString(16).split();
          var stroke = '#'+Math.floor(Math.random()*(randomNum)).toString(16).split();
          var radius= parseInt(dataSize) * 0.05
          var velocity = Math.random() * 2
          var x = Math.random() * innerWidth;
          var y = Math.random() * innerHeight;
          var dx =  velocity * Math.random() * Math.random() * 5;
          var dy = velocity * Math.random() * Math.random() * 5;

          setTimeout(()=> {
            circleArray.push(new Circle(x, y , dx, dy, radius, fill, stroke))
          }, 2000);

        })
      }

      

});
  animate()

});



