import $ from 'jquery';
require("jquery-mousewheel");

$(document).ready(function () {

    /**
     * Переменные гидробионтов
     * Ci (i=1-8) - относится к водной среде
     */
    var C1 = 863550; //Number($('#FH').val());     // (FH) - рыбы;
    var C2 = 2; //Number($('#ZO').val());     // (ZO) - зоопланктон;
    var C3 = 3; //Number($('#MF').val());     // (MF) - макрофиты;
    var C4 = 4; //Number($('#PH').val());     // (PH) - фитопланктон;
    var C5 = 5; //Number($('#BA').val());     // (BA) - бактерии;
    var C6 = 6; //Number($('#MP').val());     // (MP) - минеральный фосфор;
    var C7 = 7; //Number($('#DO').val());     // (DO) - растворимый органический фосфор;
    var C8 = 8; //Number($('#DE').val());     // (DE) - детритный фосфор;
    var C9 = 9; //Number($('#IP').val());     // (IP) - интерстициальный фосфор;

    console.log(C1,C2,C3,C4,C5,C6,C7,C8,C9);
    console.log("------------------------------------");


    /*****************************************************
     *****{ Константы }***********************************
     *****************************************************/

    /**
     *  Константа трансформации веществ - Ki
     *
     *  Ki = Kio*Rti*Rli
     *  Kio - оптимальное значение скорости потребления веществ;
     *  Rti и Rli - коэффициенты коррекции по температуре и освещенности;
     *
     *  T - температура воды, Градус Цельсия oC;
     *  Aik - константы;
     */

    var J = 0.00001; // Массовый поток на межфазной поверхности
    var E = 0.00001; // Боковая нагрузка
    var L = 1; // Длина водохранилища

    var T = 2;
    var K1o = 1;
    var K2o = 1;
    var K3o = 1;
    var K4o = 1;
    var K5o = 1;
    var K6o = 1;
    var K7o = 1;
    var K8o = 1;


    /* Для корреляции по температуре в выражениях для гидробионтов и детрита */

    // Для i = 1;
    var A10 = 1;
    var A11 = 1;
    var A12 = 1;
    var A13 = 1;

    var Rt1 = A10 + (A11 * Math.exp(A12*T) - 1)/(1 + A13 * Math.exp(A12*T));

    // Для i = 2;
    var A20 = 1;
    var A21 = 1;
    var A22 = 1;
    var A23 = 1;

    var Rt2 = A20 + (A21 * Math.exp(A22*T) - 1)/(1 + A23 * Math.exp(A22*T));

    // Для i = 3;
    var A30 = 1;
    var A31 = 1;
    var A32 = 1;
    var A33 = 1;

    var Rt3 = A30 + (A31 * Math.exp(A32*T) - 1)/(1 + A33 * Math.exp(A32*T));

    // Для i = 4;
    var A40 = 1;
    var A41 = 1;
    var A42 = 1;
    var A43 = 1;

    var Rt4 = A40 + (A41 * Math.exp(A42*T) - 1)/(1 + A43 * Math.exp(A42*T));

    // Для i = 5;
    var A50 = 1;
    var A51 = 1;
    var A52 = 1;
    var A53 = 1;

    var Rt5 = A50 + (A51 * Math.exp(A52*T) - 1)/(1 + A53 * Math.exp(A52*T));


    // Для i = 8;
    var A80 = 1;
    var A81 = 1;
    var A82 = 1;
    var A83 = 1;

    var Rt8 = A80 + (A81 * Math.exp(A82*T) - 1)/(1 + A83 * Math.exp(A82*T));

    /* Корреляция по освещенности имеет вид (для i = 3; 4) */
    /**
     *  t - время суток;
     *  Ia - среднесуточная освещенность;
     *  f - фотопериод;
     *  tp - 12 часов или 0,5 сут.
     *  Ioi = 350 кал/(м2 * сут.) для i=4; 3. Для i=3 свое значение.
     *  Kai, Kbi и hoi - внутренние параметры модели;
     *  Для i!=4 и i!=3, Rli = 1;
     */

    var Rl1 = 1;
    var Rl2 = 1;
    var Rl5 = 1;
    var Rl6 = 1;
    var Rl7 = 1;
    var Rl8 = 1;

    var t = 1;
    var tp = 0.5;
    var f = 1;

    var I04 = 350; // кал/(см2*сутки) - для i = 4
    var I03 = 250; // кал/(см2*сутки) - для i = 3 - свое значение!

    var Ia = 1;
    var I = Ia * (1 + Math.cos((2*Math.PI * (t - tp)/f)));


    /* rei = I/I0i; */
    var re3 = I/I03;
    var re4 = I/I04;

    var Ka3 = 1;
    var Ka4 = 1;
    var Kb3 = 1;
    var Kb4 = 1;
    var h03 = 1;
    var h04 = 1;
    var Ke3 = Ka3 + Kb3*C3;
    var Ke4 = Ka4 + Kb4*C4;
    var rx3 = re3*(Math.exp(-Ke3*h03));
    var rx4 = re4*(Math.exp(-Ke4*h04));


    var Rl3 = (Math.exp(1))/(Ke3*h03)+(Math.exp(-rx3)-Math.exp(-re3));
    var Rl4 = (Math.exp(1))/(Ke4*h04)+(Math.exp(-rx4)-Math.exp(-re4));



    /* Находим Ki */

    var k1 = K1o*Rt1*Rl1;
    var k2 = K2o*Rt2*Rl2;
    var k3 = K3o*Rt3*Rl3;
    var k4 = K4o*Rt4*Rl4;
    var k5 = K5o*Rt5*Rl5;
    var k8 = K8o*Rt8*Rl8;


    /*****************************************************
     *****{ Константы END }*******************************
     *****************************************************/




var rationC1 = {

    /**
     * i=1: Для рыбы FH
     * Рацион:
     * Фитопланктон: C4 (PH);
     * Зоопланктон: C2 (ZO);
     * Детрит: C8 (DE);
     * Макрофиты: C3 (MF);
     */

    /**
     * Коэффициенты потребления
     */
    coofPotreb: {
        d11: 1,
        d12: 1,
        d13: 1,
        d14: 1,
        d15: 1,
        d16: 1,
        d17: 1,
        d18: 1
    },
    /* Рацион */
    F1: function () {
        var F1_ = this.coofPotreb.d12*C2 + this.coofPotreb.d13*C3 + this.coofPotreb.d14*C4 + this.coofPotreb.d18*C8;
        return F1_;
    },

    /* Удельная скорость потребления */
    U12: function (c1) {
       var U12_ =(k1*this.coofPotreb.d12*C2)/(this.F1() + c1);
        return U12_;
    },
    U13: function (c1) {
        var U13_ = (k1*this.coofPotreb.d13*C3)/(this.F1() + c1);
        return U13_;
    },
    U14: function (c1) {
        var U14_ = (k1*this.coofPotreb.d14*C4)/(this.F1() + c1);
        return U14_;
    },
    U18: function (c1) {
        var U18_ = (k1*this.coofPotreb.d18*C4)/(this.F1() + c1);
        return U18_;
    },

   U1: function (c1) {
       var U1_ = this.U12(c1) + this.U13(c1) + this.U14(c1) + this.U18(c1);
       return U1_;
   },
    /* Скорость выделения */
   r1: function (c1) {
        var r1_ = (this.coofPotreb.d11*this.U1(c1))/(1 + this.coofPotreb.d12*this.U1(c1)) + (1 - this.coofPotreb.d11/this.coofPotreb.d12);
       return r1_;
   },
    L1: function (c1) {
        var L1_ = this.r1(c1)*this.U1(c1);
        return L1_;
    },

    /* Скорость смертности */
    V11: 1,
    V12: 1,
    S1: function (c1) {
        var S1_ = this.V11 + this.V12*(c1/this.U1(c1));
        return S1_;
    },

    /* Скорость выедания */
    Ct1: 0, // В дальнейшем, когда будет учтен вылов рыбы человеком - будет Ct1 != 0.

    /* Скорость биохимической трансформации */
    R1: function (c1) {
        var R1_ = (this.U1(c1) - this.L1(c1) - this.S1(c1) - this.Ct1) * c1;
        return R1_;
    }
    /**
     *  Конец i=1: Для рыбы FH.
     */

    };
     /******************************************************
      *****{ Уравнение водного баланса }********************
      ******************************************************/
    var Q_plus = [10689, 8863, 8577, 9087, 8997, 8712, 8257, 8211, 6700, 6600, 6500,10414]; // Приток воды
    var Q_minus = [8577,8863, 8577, 9087, 8997, 8712, 8257, 8177, 8237, 8077, 8077, 7987]; // Убыль воды
    var Q_plus__minus = []; // Разность притока и убыли
    if (Q_plus.length == Q_minus.length) {
        for (var q = 0; q < Q_plus.length; q++) {
            Q_plus__minus[q] = Q_plus[q] - Q_minus[q];
        }
    } else {
        console.log("Ошибка: массивы притока и убыли не равны!");
    }
    var Q_ = [2112, 0, 0, 0, 0, 0, 0, 34, -1537, -1477, -1577, 2427];
    var W_ = 14028000; // Начальный объем водохранилища


/***--------------------------------------------------------------------------------***/
    /**
     *  Объем
     */
    var V = [0, 12280000, 13453000, 14028000, 14427000, 15600000]; // Начальный значения для "справочника" Оъема
    /**
     *  Глубина
     */
    var H = [0, 3.0, 3.3, 3.4, 3.6, 3.8]; // Начальный значения для "справочника" Глубины
/***--------------------------------------------------------------------------------***/
    var Y = W_; // Текущий объем
    var h = 1/4; // Каждые 6 часов
    var xfinal = 364; // 1 год
    var kv = xfinal/12*4; // Значение для определения месяца из 1456

    var Idex = [0]; // Массив 1456
    var n = 0; // Счетчик для месяца
    var Yframe = [Y/1000000]; // Массив Объема в млн. м3
    var X = []; // Массив Глубины
    var S = []; // Массив Площади
    var Fun;

 /******************************************************
  *****{ Уравнение для гидрохимических переменных }*****
  ******************************************************/
    function functionC1 (w,q_plus, q_minus, c, s) {
        Fun = w*rationC1.R1(C1) + q_plus*C1 - q_minus*c + J*s + E*L;
        return Fun;
    }
/******************************************************
 ******************************************************
 ******************************************************/

    var arrCiW =[]; // Массив значений полученных в результате уравнения для гидрохимических переменных
    var CiW = 0;

    for (var i=1; i<(xfinal/h); i++) {
        Idex.push(i); // Помещается в массив 364х4
        if (i > kv) {
            n++;
            kv = kv + xfinal/12*4;
        }
        for (var p = 0; p < V.length; p++) { // Цикл по значениям объема
            if (Y >= V[p] && Y <= V[p+1]) {
                var x = H[p] + ((Y - V[p]) * (H[p+1]-H[p])) / (V[p+1]-V[p]); // Вычисление глубины методом пропорции
                X.push(x); // Помещается в массив Глубины
                var s = Y/x;  // Вычисление площади водоема
                S.push(s/1000000); // Помещается в массив Площади в млн. м2
            }
        }
        Y = Y + Q_[n]*6; // Увеличение / уменьшение объема каждые 6 часов в зависимости от Q_
        Yframe.push(Y/1000000); // Помещение в массив Объема в млн. м3

        /**
         * РКМ4  function functionC1 (w,q_plus, q_minus, c, s)
         */

        var kk1 = functionC1 (Y            , Q_plus[n], Q_minus[n], C1            , S[i]);
        var kk2 = functionC1 (Y + 0.5*kk1*h, Q_plus[n], Q_minus[n], C1 + 0.5*kk1*h, S[i]);
        var kk3 = functionC1 (Y + 0.5*kk2*h, Q_plus[n], Q_minus[n], C1 + 0.5*kk2*h, S[i]);
        var kk4 = functionC1 (Y +     kk3*h, Q_plus[n], Q_minus[n], C1 +     kk3*h, S[i]);
        CiW = CiW + h/6*(kk1 + 2*kk2 + 2*kk3 + kk4);
        arrCiW.push(CiW/1000000); // Поместим y в массив
          /**
         * РКМ4 end
         */
    }

    /***--------------------------------------------------------------------------------***/

    /******************************************************
    *****{ Графики }***************************************
    ******************************************************/
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
        labels: Idex,
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
        labels: Idex,
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
        labels: Idex,
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

    var allctx = $("#allCharts");

    var allCharts = new Chart(allctx, {
        type: 'line',
        data: {
            labels: Idex,
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
                }]
            },
            title: {
                display: true,
                text: 'Общай график',
                position: 'top'
            }
        }
    });

    var data5 = {
        labels: Idex,
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
                data: arrCiW,
                spanGaps: false
            }
        ]
    };


    var ctx5 = $("#myChart5");

    var myChart5 = new Chart(ctx5, {
        type: 'line',
        data: data5,
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
                        labelString: ''
                    }
                }]
            },
            title: {
                display: true,
                text: 'Значения уравнения гидрохимических переменных',
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