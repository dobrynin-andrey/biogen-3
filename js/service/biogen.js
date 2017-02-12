import $ from 'jquery';
require("jquery-mousewheel");
//require('malihu-custom-scrollbar-plugin');
//import fancybox from 'fancybox';
//fancybox($);

$(document).ready(function () {


    /**
     * Начальные значения переменных
     */

    var glubina = 8.2;  // Глубина водохранилища в м
    var L = 180;        // Длина в км = 180000 м
    var S = 1070;       // Площадь зеркала в км2
    var W = 8.8;        // Объем водохранилища в км3

    /* Начальные значения переменных  "Уравнения для гидрохимических переменных" */

    //  W - объем водохранилища
    var t;              // - время

    /**
     * Основные функции
     */

    function SpeedTransform (Ui, L, S, Gi, Ci) {  // Скорость биохимической транформации соответствующего соединения Ci, Q+
        var Ri = (Ui - L - S - Gi) * Ci;
        return Ri;
    }
    
    function SpeedPotrebleniya () {               // Выражение для удельных скоростей потребления Uij
        var Ui = Ki / ( 1 + Ci / Fi );
        return Ui;
    }

    /* Уравнение для гидрохимических переменных */



    var test = SpeedTransform (5,L,S,3,3);
    $('#biogen__button').click(function () {
        $('#biogen__answer').val(test);
    });


});

