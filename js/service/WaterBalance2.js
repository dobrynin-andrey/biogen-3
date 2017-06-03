import $ from 'jquery';
require("jquery-mousewheel");

$(document).ready(function () {



    /**
     * i=1: Для рыбы elements
     * Рацион:
     * Фитопланктон: C4 (PH);
     * Зоопланктон: C2 (ZO);
     * Детрит: C8 (DE);
     * Макрофиты: C3 (MF);
     */


    /**
     * Коэффициенты потребления
     */
    var d11 = 1;
    var d12 = 1;
    var d13 = 1;
    var d14 = 1;
    var d15 = 1;
    var d16 = 1;
    var d17 = 1;
    var d18 = 1;

    //var k1 = 1;

    var F1 = d12*C2 + d13*C3 + d14*C4 + d18*C8;

    /* Удельная скорость потребления */
    var U12 = (k1*d12*C2)/(F1 + C1);
    var U13 = (k1*d13*C3)/(F1 + C1);
    var U14 = (k1*d14*C4)/(F1 + C1);
    var U18 = (k1*d18*C8)/(F1 + C1);

    var U1 = U12 + U13 + U14 + U18;
    /* Скорость выделения */
    var R1 = (d11*U1)/(1 + d12*U1) + (1 - d11/d12);
    var L1 = R1*U1;

    /* Скорость смертности */
    var V11 = 1;
    var V12 = 1;
    var S1 = V11 + V12*(C1/U1);

    /* Скорость выедания */
    var Ct1 = 0; // В дальнейшем, когда будет учтен вылов рыбы человеком - бедет Ct1 != 0.

    console.log("------------------------------------");
    console.log("F1: "+F1);
    console.log("U12: "+U12);
    console.log("U13: "+U13);
    console.log("U14: "+U14);
    console.log("U18: "+U18);
    console.log("U1: "+U1);
    console.log("L1: "+L1);
    console.log("S1: "+S1);
    console.log("Ct1: "+Ct1);

    /**
     *  Конец i=1: Для рыбы elements.
     */


     /******************************************************
      *****{ Уравнение водного баланса }*******************
      ******************************************************/

    var Q_ = [2112, 0, 0, 0, 0, 0, 0, 34, -1537, -1477, -1577, 2427];
    var W_ = 14028000;

/***--------------------------------------------------------------------------------***/
    /**
     *  Объем
     */
    var V = [0, 12280000, 13453000, 14028000, 14427000, 15600000];
    /**
     *  Глубина
     */
    var H = [0, 3.0, 3.3, 3.4, 3.6, 3.8];
    var H_t = [];

    var V_t_1 = 15.6;  //$('#h').val();





/***--------------------------------------------------------------------------------***/
    var Y = W_;
    var h = 1/4; // Каждые 6 часов
    var xfinal = 364; // 1 год
    var kv = xfinal/12*4; // Значение для определения месяца из 1456

    var I = [0]; // Массив 1456
    var n = 0; // Счетчик для месяца
    var Yframe = [Y/1000000];
    var X = [];
    var S = [];
    // Цикл метода РК4
    for (var i=1; i<(xfinal/h); i++) {

        I.push(i);
        if (i > kv) {
            n++;
            kv = kv + xfinal/12*4;
        }

        for (var p = 0; p < V.length; p++) {
            if (Y >= V[p] && Y <= V[p+1]) {
               /* var tg = (H[p+1] - H[p])/(V[p+1] - V[p]);
                var H_t_1 = H[p] + (V[p+1] - V[p]) * tg;

                console.log(tg);
                console.log("H_t_1 " + H_t_1);
                var S_t_1 = V[p+1]/H_t_1;
                console.log("S_t_1 " + S_t_1);
*/


                var x = H[p] + ((Y - V[p]) * (H[p+1]-H[p])) / (V[p+1]-V[p]);
                X.push(x);
                var s = Y/x;
                S.push(s/1000000);
                // if (Y == 14028000) {
                //     console.log(s);
                // }

            }
        }


        Y = Y + Q_[n]*6;
        Yframe.push(Y/1000000);

    }

    //console.log(S);
    var data = {
        labels: V,
        datasets: [
            {
                label: "Справочник глубины (H) относительно объема (W)",
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
                spanGaps: false
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
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Площадь W, м. кв'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Глубина H, м'
                    }
                }]
            },
            title: {
                display: true,
                text: 'Справочник глубины (H) относительно объема (W)',
                position: 'top'
            }
        }
    });

    var data2 = {
        labels: I,
        datasets: [
            {
                label: "Объем, млн м3",
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
                spanGaps: false
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
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Год, 6 часов'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Объем, млн м3'
                    }
                }]
            },
            title: {
                display: true,
                text: 'Объем',
                position: 'top'
            }
        }
    });



    var data3 = {
        labels: I,
        datasets: [
            {
                label: "Глубина, м",
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
                data: X,
                spanGaps: false
            }
        ]
    };


    var ctx3 = $("#myChart3");

    var myChart3 = new Chart(ctx3, {
        type: 'line',
        data: data3,
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Год, 6 часов'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Глубина, м'
                    }
                }]
            },
            title: {
                display: true,
                text: 'Глубина',
                position: 'top'
            }
        }
    });

    var data4 = {
        labels: I,
        datasets: [
            {
                label: "Площадь, млн м2",
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
                data: S,
                spanGaps: false
            }
        ]
    };


    var ctx4 = $("#myChart4");

    var myChart4 = new Chart(ctx4, {
        type: 'line',
        data: data4,
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Год, 6 часов',
                        position: 'right'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Площадь, млн м2'
                    }
                }]
            },
            title: {
                display: true,
                text: 'Площадь',
                position: 'top'
            }
        }
    });

    var ctx5 = $("#allCharts");

    var allCharts = new Chart(ctx5, {
        type: 'line',
        data: {
            labels: I,
            datasets: [{
                label: "Глубина, м",
                backgroundColor: 'red',
                borderColor: 'red',
                pointBorderWidth: 1,
                pointRadius: 1,
                pointHitRadius: 10,
                data: X,
                fill: false
            }, {
                label: "Площадь, млн м2",
                fill: false,
                pointBorderWidth: 1,
                pointRadius: 1,
                pointHitRadius: 10,
                backgroundColor: 'blue',
                borderColor: 'blue',
                data: S
            }, {
                label: "Объем, млн м3",
                fill: false,
                pointBorderWidth: 1,
                pointRadius: 1,
                pointHitRadius: 10,
                backgroundColor: 'green',
                borderColor: 'green',
                data: Yframe
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Год, 6 часов',
                        position: 'right'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Площадь, млн м2'
                    }
                }]
            },
            title: {
                display: true,
                text: 'Общай график',
                position: 'top'
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