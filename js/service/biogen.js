import $ from 'jquery';
require("jquery-mousewheel");
//require('malihu-custom-scrollbar-plugin');
//import fancybox from 'fancybox';
//fancybox($);

$(document).ready(function () {

    /**
     * Переменные гидробионтов
     * Ci (i=1-8) - относится к водной среде
     */
    var C1 = val();     // (FH) - рыбы;
    var C2 = val();     // (ZO) - зоопланктон;
    var C3 = val();     // (MF) - макрофиты;
    var C4 = val();     // (PH) - фитопланктон;
    var C5 = val();     // (BA) - бактерии;
    var C6 = val();     // (MP) - минеральный фосфор;
    var C7 = val();     // (DO) - растворимый органический фосфор;
    var C8 = val();     // (DE) - детритный фосфор;
    var C9 = val();     // (IP) - ;





    /**
     * Начальные значения переменных
     */

    var glubina = 8.2;  // Глубина водохранилища в м;
    var L = 180;        // Длина в км = 180000 м;
    var S = 1070;       // Площадь зеркала в км2;
    var W = 8.8;        // Объем водохранилища в км3;

    /*Начальные значения переменных  "Уравнения для гидрохимических переменных" */

    //  W - объем водохранилищап
    var t;              // - время
    var Ri = 1;         // - скорость биохимической трасформации соответствующего соединения Ci, Q_+;
    var C_plus_i = 1;   // - расход реки и концентрация компонентов в ней;
    var Q_minus = 1;          // - расход попуска из водохранилища;
    var Ji = 1;         // - массовый поток на межфазной поверхности;
    // S - площадь зеркала водохранилища;
    var Ei = 1;         // - боковая нагрузка, характеризующая поступление с берегов;
    // L - длина водохранилища;
    var Q_plus = 1;
    var Ci = 1;


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

    function GidrohimPeremennye() {
        var dCiWdt = W*Ri+Q_plus*C_plus_i-Q_minus*Ci+Ji*S+Ei*L;
        return dCiWdt;
    }

    /* Уравнение водного баланса */

    /* Переменные уравнения водного баланса */

    var Qo = 1;         // - из реки Онон;
    var Qt = 1;         // - из дренажного канала и реки Турга;
    var Qp = 1;         // - на производство;
    var Qn = 1;         // - на испарение;
    var Qf = 1;         // - на фильтрацию;


    function VodnogoBalansa() {
        var dWdt = Qo + Qt + Qp + Qn + Qf;
        return dWdt;
    }

    var test = SpeedTransform (5,L,S,3,3);
    $('#biogen__button').click(function () {
        $('#biogen__answer').val(test);
    });


});

