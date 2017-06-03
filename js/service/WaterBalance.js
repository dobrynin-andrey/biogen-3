import $ from 'jquery';
require("jquery-mousewheel");

$(document).ready(function () {

    var W_ = [2112, 0, 0, 0, 0, 0, 0, 34, -1537, -1477, -1577, 2427];

/***--------------------------------------------------------------------------------***/
    /**
     *  Объем
     */
    var V = [0, 12.28, 13.453, 14.028, 14.427, 15.6];
    /**
     *  Глубина
     */
    var H = [0, 3.0, 3.3, 3.4, 3.6, 3.8];
    var H_t = [];

    var V_t_1 = 15.6;  //$('#h').val();

    function getTanDeg(deg) {
        var rad = deg * Math.PI/180;
        return Math.tan(rad);
    }

    for (var p = 0; p < V.length; p++) {
        console.log(p);

        if (V_t_1 >= V[p] && V_t_1 <= V[p+1]) {
            console.log(V[p]);
            console.log(V_t_1);
            console.log(V[p+1]);
            console.log(H[p]);
            console.log(H[p+1]);
            var tg = (H[p+1] - H[p])/(V[p+1] - V[p]);
            //var tg_ = (3.6 - 3.4)/(14.427 - 14.028);

            /*var tg_rad = getTanDeg(tg);
            console.log(tg_rad);
            var H_t_rad = (V[p+1] - V[p]) * tg_rad;
            console.log(H_t_rad);*/
            var H_t_1 = H[p] + (V[p+1] - V[p]) * tg;

            console.log(tg);
            console.log("H_t_1 " + H_t_1);
            var S_t_1 = V[p+1]/H_t_1;
            console.log("S_t_1 " + S_t_1);


            var x = H[p] + ((V_t_1 - V[p]) * (H[p+1]-H[p])) / (V[p+1]-V[p]);
            console.log("x " + x);
            var S = V[p+1]/x;
            console.log("S " + S);
           /* H_t.push(function (p) {


            });
            console.log(H_t);*/
        }
    }






/***--------------------------------------------------------------------------------***/
    var Y = 1;

    console.log(W_);
    var h = 1/4;
    console.log(h);
    var xfinal = 364;
    //console.log(xfinal);
    //console.log(xfinal/h);
    //console.log(xfinal/12*4);
    var kv = xfinal/12*4;
    //console.log(kv);


    function functionODU (x, y) {
        var F = x;
         //console.log(F);
        return F;

    }

    var I = [0];
    var n = 0;
    var ch = 4;
    var Yframe = [W_[n]];
    // Цикл метода РК4
    console.log(W_[n]);
    for (var i=1; i<(xfinal/h); i++) {
        I.push(i);

        if (i >= ch) {
            //console.log(ch);

            ch = ch + 4;

        }
        if (i > kv) {
            //console.log(kv);
            //console.log(W_[n]);
            //console.log(Y);
            n++;
            Y = 0;
            kv = kv + xfinal/12*4;
            //console.log(Y);

        }
        var k1 = functionODU (W_[n]        , Y           );
        //  console.log(k1);
        var k2 = functionODU (W_[n] + 0.5*h, Y + 0.5*k1*h);
        // console.log(k2);
        var k3 = functionODU (W_[n] + 0.5*h, Y + 0.5*k2*h);
        //console.log(k3);
        var k4 = functionODU (W_[n] +     h, Y +     k3*h);
        if (i == 1453) {
            console.log(k1);
            console.log(k2);
            console.log(k3);
            console.log(k4);
        }


        Y = Y + h/6*(k1 + 2*k2 + 2*k3 + k4);

        //console.log(Y);
        // Поместим y в массив
        Yframe.push(Y);
        // Поместим x в массив
        //Xframe.push(X);
        // Обновим x
        //console.log(W_[n]);
        W_[n] = W_[n] + h;

    }
       console.log(Yframe);
       console.log(I);

    var test = 1 + 0.25/6*(2112 + 2*(2112 + 0.5*0.25) + 2*(2112 + 0.5*0.25) + (2112 + 0.15));
    console.log(test);
    var test2 = test + 0.25/6*(2112 + 2*(2112 + 0.5*0.25) + 2*(2112 + 0.5*0.25) + (2112 + 0.15));
    console.log(test2);
    W_ = [2112, 0, 0, 0, 0, 0, 0, 34, -1537, -1477, -1577, 2427];

    var data = {
        labels: V,
        datasets: [
            {
                label: V,
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(50, 49, 96, 0.57)",
                borderColor: "rgb(50, 49, 96)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgb(50, 49, 96)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(50, 49, 96)",
                pointHoverBorderColor: "rgba(50, 49, 96, 0.57)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: H,
                spanGaps: false,
            }
        ]
    };

    var data2 = {
        labels: I,
        datasets: [
            {
                label: V,
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(50, 49, 96, 0.57)",
                borderColor: "rgb(50, 49, 96)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgb(50, 49, 96)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(50, 49, 96)",
                pointHoverBorderColor: "rgba(50, 49, 96, 0.57)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: Yframe,
                spanGaps: false,
            }
        ]
    };


    var ctx2 = $("#myChart2");

    var myChart2 = new Chart(ctx2, {
        type: 'line',
        data: data2,
        options: {
            scales: {
                xAxes: [{
                    display: true
                }]
            }
        }
    });

    var ctx = $("#myChart");

    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                xAxes: [{
                    display: true
                }]
            }
        }
    });









    /*


        $('#reload').click(function () {
            location.reload();
        });

        $('#button').click(function () {

            var W_ = [2112, 0, 0, 0, 0, 0, 0, 34, -1537, -1477, -1577, -1577, 2427];



            /* Берем значения из полей*/
      /*  var h = Number($('#h').val());

        var xfinal = Number($('#xfinal').val());
        var X = Number($('#X').val());
        var Y = Number($('#Y').val());
        var f = $('#f').val();
        var answer = $('#answer').val();
        //console.log(h, xfinal, X, Y, f);


        var Y0 = Y;
        var X0 = X;
        var Yframe = [X];
        var Xframe = [Y];

        // Расчет
        var x;
        var y;
        function functionODU (x, y) {
            var F = eval(f);
            // console.log(F);
            return F;

        }

        // Цикл метода РК4
        for (var i=1; i<(xfinal/h); i++) {
            var k1 = functionODU (X        , Y           );
            //  console.log(k1);
            var k2 = functionODU (eval(X + 0.5*h), eval(Y + 0.5*k1*h));
            // console.log(k2);
            var k3 = functionODU (X + 0.5*h, Y + 0.5*k2*h);
            //console.log(k3);
            var k4 = functionODU (X +     h, Y +     k3*h);
            // console.log(k4);

            Y = Y + h/6*(k1 + 2*k2 + 2*k3 + k4);
            // Поместим y в массив
            Yframe.push(Y);
            // Поместим x в массив
            Xframe.push(X);
            // Обновим x
            X = X + h;
            // console.log(X);
        }
        //   console.log(Yframe);
        //  console.log(Xframe);
        $('#answer').val('Y('+ String(Y0) + ') = ' + String(Yframe[Yframe.length - 1]));


        // Math.sin(x)+Math.cos(y)






        var data = {
            labels: Xframe,
            datasets: [
                {
                    label: f,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(50, 49, 96, 0.57)",
                    borderColor: "rgb(50, 49, 96)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgb(50, 49, 96)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(50, 49, 96)",
                    pointHoverBorderColor: "rgba(50, 49, 96, 0.57)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: Yframe,
                    spanGaps: false,
                }
            ]
        };

        var ctx = $("#myChart");

        var myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    xAxes: [{
                        display: false
                    }]
                }
            }
        });
        // delete myChart;
        // delete data;
        // delete ctx;


    });*/
});