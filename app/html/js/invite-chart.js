  window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer",
    {
      theme: "theme4",
      animationEnabled: true,
      axisX: {
        valueFormatString: "MM.DD",
        interval:1,
        intervalType: "day",
        lineColor:"#50E3C2",
        lineDashType:"dash",
        labelFontColor:"#50E3C2",
        tickColor:"#50E3C2",
        tickThickness: 1,
        labelAngle:-45
        
      },
      axisY:{
        includeZero: false,
        lineColor:"#fff",
        labelFontColor:"#fff",
        tickColor:"#fff"
        
      },
      data: [
      {        
        type: "line",
        lineThickness: 4,
        color: "rgba(255,158,54,0.15)",    
        dataPoints: [
        { x: new Date(2015, 05, 19), y: 600 , indexLabel: "600",indexLabelFontColor:"#FF9E36",markerColor: "#FF9E36"},
        { x: new Date(2015, 05, 20), y: 1000 , indexLabel: "1000",indexLabelFontColor:"#FF9E36",markerColor: "#FF9E36" },
        { x: new Date(2015, 05, 21), y: 800 , indexLabel: "800",indexLabelFontColor:"#FF9E36",markerColor: "#FF9E36" },
        { x: new Date(2015, 05, 22), y: 200 , indexLabel: "200",indexLabelFontColor:"#FF9E36",markerColor: "#FF9E36" },
        { x: new Date(2015, 05, 23), y: 900 , indexLabel: "900",indexLabelFontColor:"#FF9E36",markerColor: "#FF9E36" },
        { x: new Date(2015, 05, 24), y: 700 , indexLabel: "700",indexLabelFontColor:"#FF9E36",markerColor: "#FF9E36" },
        { x: new Date(2015, 05, 25), y: 1000 , indexLabel: "1000",indexLabelFontColor:"#FF9E36",markerColor: "#FF9E36" }
        
        ]
      }
      
      
      ]
    });

chart.render();
}