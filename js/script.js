(function(){
  var app = {
    init: function(){
      if(location.search){
        app.fetchQuery(location.search.split('?variables=')[1]);
      }
      app.setupCanvas();
      app.setupSettings();
      app.drawImage();
    },
    setupCanvas: function(){
      app.canvas = document.getElementById('canvas');
      app.canvas.width = window.innerWidth;
      app.canvas.height = window.innerHeight;
      app.context = app.canvas.getContext('2d');
      app.context.strokeStyle = 'rgba(255,255,255,0.05)';
    },
    setupSettings: function(){
      app.settings = QuickSettings.create(100, 250, 'Variables');
      for(variable in app.variables){
        if(variable !== 'k'){
          app.settings.bindRange(variable, 1, 50, app.variables[variable], 1, app.variables);
        }
      }
      app.settings.addButton('Draw!', app.drawImage);
    },
    drawImage: function(){
      app.refreshScreen();
      for(var k = 0; k < 7000; k++){
        (function(index) {
          app.timeouts.push(setTimeout(function() {
            app.lineVariables.k = index;
            var firstPoint = [
              Math.sin(app.lineVariables.c * Math.PI * app.lineVariables.k / 7000),
              Math.cos(app.lineVariables.d * Math.PI * app.lineVariables.k / 7000)
            ];
            var secondPoint = [
              Math.sin(app.lineVariables.a * Math.PI * app.lineVariables.k / 7000),
              Math.cos(app.lineVariables.b * Math.PI * app.lineVariables.k / 7000)
            ];
            app.drawLine(firstPoint, secondPoint);
          }, k * app.duration));
        })(k);
      }
    },
    refreshScreen: function(){
      var params = 'variables=';
      app.context.setTransform(1, 0, 0, 1, 0, 0);
      app.context.clearRect(0, 0, app.canvas.width, app.canvas.height);
      app.context.fillStyle = "#000";
      app.context.fillRect(0, 0, app.canvas.width, app.canvas.height);
      app.context.translate(app.canvas.width / 2, app.canvas.height / 2);
      app.timeouts = [];
      app.lineVariables = JSON.parse(JSON.stringify(app.variables)); //freeze the variables until recalc
      for(var variable in app.lineVariables){
        params += app.lineVariables[variable] + ',';
      }
      params = params.substring(0, params.length - 1);
      try{
        window.history.pushState("", "", '?'+params)
      } catch(e){
        console.warn(e)
      }
    },
    drawLine: function(firstPoint, secondPoint){
      app.context.beginPath();
      app.context.moveTo(firstPoint[0] * app.multiplier, firstPoint[1] * app.multiplier);
      app.context.lineTo(secondPoint[0] * app.multiplier, secondPoint[1] * app.multiplier);
      app.context.stroke();
    },
    fetchQuery: function(query){
      if(query){
        var arr = query.split(',');
        if(arr.length > 1){
          for(var i = 0; i < arr.length; i++){
            var variable = app.getQueryVariable(+arr[i]);
            app.variables[appVariables[i]] = variable;
          }
        }
      }
    },
    getQueryVariable: function(number){
      if(!(isNaN(number)) && (number >= 1) && (number <= 50)){
        return number;
      } else {
        return 1;
      }
    },
    getRandom: function(){
      return Math.floor(Math.random() * 50) + 1;
    }
  };
  var appVariables = ['a','b','c','d'];
  app.variables = {};
  for(var i = 0; i < appVariables.length; i++){
    app.variables[appVariables[i]] = app.getRandom();
  }
  app.duration = 1;
  app.multiplier = 350;
  app.init();
}());
