
async function get_api_chart_data(chart,idCripto="BTC", style){
    await fetch(`https://api.binance.com/api/v3/klines?symbol=${idCripto}USDT&interval=5m&limit=100`)
    .then(response => response.arrayBuffer())
    .then(buffer => {
        const data = new Uint8Array(buffer);
        const decoder = new TextDecoder();
        const json = decoder.decode(data);
        const array = JSON.parse(json);

        paintChart(chart, array, style)
    })
    .catch(error => console.error(error));
}

//paintChart(1,testData,1);

function paintChart(typeChart, chartData, style){

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

       

        chart.plot(0).yGrid().stroke('grey 0.2');

            chart.title("Bitcoin");
            var marker = chart.plot(0).lineMarker();
            marker.value(29460);
            marker.stroke({
            thickness: 2,
            color: "grey",
            dash: "3",
        }); 


    if(style ==1 ){
    // create scroller series with mapped data
    
    }
    if(style ==2 ){

        var plot = chart.plot();

        plot.baseline(29460);

        // set plot baseline value
        plot.baseline(29460);

        //create line and text markers for baseline
        plot.lineMarker(0).value(29460).scaleRangeMode('consider');
        plot
        .textMarker(0)
        .value(29460)
        .align('left')
        .anchor('left-bottom')
        .offsetX(5)
        .text('29,460')
         

        //set positive and negative stroke
        series.normal().stroke('4 #2FA85A');
        series.normal().negativeStroke('3 #EE4237');
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
            return anychart.color.setThickness(this.scaledColor, 3);
        });


    }
    if(style==4){
        // set rising/falling and normal stroke settings
        series.risingStroke('#2FA85A', 3, null, 'round', 'round');
        series.fallingStroke('#EE4237', 3, null, 'round', 'round');
        series.stroke('#2FA85A', 3, null, 'round', 'round');
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
    