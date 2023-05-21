function paintChart(typeChart, chartData, style, user={invested:29460, criptoName:""}){

    //crear chart every call
    document.getElementById("graphic_chart").innerHTML='';

    anychart.onDocumentReady(function () {
    
    isAsync = false;
    
    var dataTable = anychart.data.table();
    chartData=chartData.concat(chartData)
    dataTable.addData(chartData);

    var chart = anychart.stock();
    //velas
    if(typeChart==0){

        var mapping2 = dataTable.mapAs({ 'open': 1, 'high': 2, 'low': 3, 'close': 4 });
        //velas
        chart.plot(0).candlestick(mapping2);

    }else if(typeChart==1 && style == 4){  

        //lineal whithout fill

        var mapping = dataTable.mapAs({value: 1});
        var series= chart.plot().area(mapping).fill(['0.1 transparent', '1 transparent'], 90, false).stroke('transparent');

    }else if(typeChart==1){  

        //lineal
        //https://docs.anychart.com/Graphics/Fill_Settings

        var mapping = dataTable.mapAs({value: 1});
        var series= chart.plot().area(mapping).fill(['0.1 black', '1 blue'], 90, true).stroke('transparent');
    }

       

    //validated if it is investion
    if(user.invested > 0){
        chart.plot(0).yGrid().stroke('grey 0.2');

        chart.title(user.criptoName);
        var marker = chart.plot(0).lineMarker();
        marker.value(user.invested);
        marker.stroke({
            thickness: 2,
            color: "grey",
            dash: "3",
        }); 
    }


    if(style ==1 ){
    // create scroller series with mapped data
    
    }
    if(style ==2 && user.invested > 0){

        var plot = chart.plot();

        plot.baseline(user.invested);

        // set plot baseline value
        plot.baseline(user.invested);

        //create line and text markers for baseline
        plot.lineMarker(0).value(user.invested).scaleRangeMode('consider');
        plot
        .textMarker(0)
        .value(user.invested)
        .align('left')
        .anchor('left-bottom')
        .offsetX(5)
        .text(user.invested.toString())
         

        //set positive and negative stroke
        series.normal().stroke('2 #2FA85A');
        series.normal().negativeStroke('2 #EE4237');
    }

    if(style ==3 ){

        chart.plot(0).legend(false);


        // setup color scale ranges
        var lower = 21.35;
        var higher = 21.5;
        var colorScale = anychart.scales.ordinalColor();
        colorScale.ranges([
        {
            less: lower,
            color: {
            angle: 90,
            keys: ['#2fa85a', '.95 #ecef17']
            }
        },
        {
            from: lower,
            to: higher,
            color: '#ecef17'
        },
        {
            greater: higher,
            color: {
            angle: 90,
            keys: ['.15 #EE4237', '#1af300']
            }
        }
        ]);
        series.colorScale(colorScale);

        // set series stroke settings using color scale
        series.stroke(function () {
            return anychart.color.setThickness(this.scaledColor, 2);
        });


    }
    if(style==4){
        // set rising/falling and normal stroke settings
        series.risingStroke('#2FA85A', 2, null, 'round', 'round');
        series.fallingStroke('#EE4237', 2, null, 'round', 'round');
        series.stroke('#2FA85A', 2, null, 'round', 'round');
    }



    chart.plot(0).yAxis().orientation('right');
    chart.background('transparent')
    chart.scroller(false);

    var interactivity={scrollOnMouseWheel: true,zoomOnMouseWheel: true}
        chart.interactivity(interactivity);
        chart.container("graphic_chart");
        chart.draw();


        isAsync = true;

    });
}
    