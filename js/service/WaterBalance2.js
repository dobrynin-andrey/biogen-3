import $ from 'jquery';
require("jquery-mousewheel");

$(document).ready(function () {

    /**
     * Переменные гидробионтов
     * Ci (i=1-8) - относится к водной среде
     */
    var C1 = 1; //863550; //Number($('#FH').val());     // (FH) - рыбы;
    var C2 = 1; //1.8273; //Number($('#ZO').val());     // (ZO) - зоопланктон; мг/м3  1827.3 мг/л
    var C3 = 1; //14940; //Number($('#MF').val());     // (MF) - макрофиты;   фитомассой 14 940 - 17 430 т.
    var C4 = 1; //1.3; //Number($('#PH').val());     // (PH) - фитопланктон; 0,3 млн/л  3.1. Фитопланктон. Содержание Хл а фитопланктона в водотоках бассейна оз. Телецкое изменялось от 0,10 до 5,20 мг/м3 и в среднем составило 1,27±0,12 мг/м3. Минимальное содержание Хл а (от 0,10 до 1,75 мг/м3) отмечено в реках
    var C5 = 1; //5; //Number($('#BA').val());     // (BA) - бактерии;
    var C6 = 1; //6; //Number($('#MP').val());     // (MP) - минеральный фосфор;
    var C7 = 1; //7; //Number($('#DO').val());     // (DO) - растворимый органический фосфор;
    var C8 = 1; //50; //Number($('#DE').val());     // (DE) - детритный фосфор; 20-50 м2/м3
    var C9 = 1; //9; //Number($('#IP').val());     // (IP) - интерстициальный фосфор;

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
        var U18_ = (k1*this.coofPotreb.d18*C8)/(this.F1() + c1);
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


    console.log("------------------------------------");
    console.log("F1: "+rationC1.F1());
    console.log("k1: "+k1);
    console.log("U12: "+rationC1.U12(C1));
    console.log("U13: "+rationC1.U13(C1));
    console.log("U14: "+rationC1.U14(C1));
    console.log("U18: "+rationC1.U18(C1));
    console.log("U1: "+rationC1.U1(C1));
    console.log("r1: "+rationC1.r1(C1));
    console.log("L1: "+rationC1.L1(C1));
    console.log("S1: "+rationC1.S1(C1));
    console.log("R1: "+rationC1.R1(C1));

    /* ------------------------------------------------------------------ */


var rationC2 = {
    /**
     * i=2: Для зоопланктона C2 = ZO
     * Рацион:
     * Фитопланктон: C4 (PH);
     * Бактерии: С5 (BA);
     * Детрит: C8 (DE);
     */

    /**
     * Коэффициенты потребления
     */
    coofPotreb : {
        d21 : 1,
        d22 : 1,
        d23 : 1,
        d24 : 1,
        d25 : 1,
        d26 : 1,
        d27 : 1,
        d28 : 1
    },
    //var k2 = 1;
    F2: function () {
      var F2_ =  this.coofPotreb.d24*C4 + this.coofPotreb.d25*C5 + this.coofPotreb.d28*C8;
        return F2_;
    },
    /* Удельная скорость потребления */
    U24: function (c2) {
        var U24_ = (k2*this.coofPotreb.d24*C4)/(this.F2() + c2);
        return U24_;
    },
    U25: function (c2) {
        var U25_ = (k2*this.coofPotreb.d25*C5)/(this.F2() + c2);
        return U25_;
    },
    U28: function (c2) {
        var U28_ = (k2*this.coofPotreb.d28*C8)/(this.F2() + c2);
        return U28_;
    },
    U2: function (c2) {
        var U2_ = this.U24(c2) + this.U25(c2) + this.U28(c2);
        return U2_;
    },

    /* Скорость выделения */
    r2: function (c2) {
        var r2_ = (this.coofPotreb.d21*this.U2(c2))/(1 + this.coofPotreb.d22*this.U2(c2)) + (1 - this.coofPotreb.d21/this.coofPotreb.d22);
        return r2_;
    },
    L2: function (c2) {
        var L2_ = this.r2(c2)*this.U2(c2);
        return L2_;
    },
    /* Скорость смертности */
    V21: 1,
    V22: 1,
    S2: function (c2) {
        var S2_ = this.V21 + this.V22*(c2/this.U2(c2));
        return S2_;
    },
    /* Скорость выедания */
    Ct2: rationC1.U12(C1) // Выедания зоопланктона рыбой

};

    console.log("------------------------------------");
    console.log("F2: "+rationC2.F2(C2));
    console.log("U24: "+rationC2.U24(C2));
    console.log("U25: "+rationC2.U25(C2));
    console.log("U28: "+rationC2.U28(C2));
    console.log("U2: "+rationC2.U2(C2));
    console.log("L2: "+rationC2.L2(C2));
    console.log("S2: "+rationC2.S2(C2));
    console.log("Ct2: "+rationC2.Ct2);

    /**
     *  Конец i=2: Для зоопланктона C2.
     */

    /* ------------------------------------------------------------------ */

var rationC3 = {

    /**
     * i=3: Для макрофитов C3 = MF
     * Рацион:
     * Минеральный фосфор: C6 (MP);
     * Интерстициальный фосфор: С9 (IP);
     */

    /**
     * Коэффициенты потребления
     */
    coofPotreb : {
        d31: 1,
        d32: 1,
        d33: 1,
        d34: 1,
        d35: 1,
        d36: 1,
        d37: 1,
        d38: 1,
        d39: 1
    },

    //var k3 = 1;

    F3: function () {
        var F3_ = this.coofPotreb.d36*C6 + this.coofPotreb.d39*C9;
        return F3_;
    },

    /* Удельная скорость потребления */
    U36: function () {
        var U36_ = (k3*this.coofPotreb.d36*C6)/(this.F3() + C3);
        return U36_;
    },
    U39: function () {
        var U39_ = (k3*this.coofPotreb.d39*C9)/(this.F3() + C3);
        return U39_;
    },
    U3: function () {
        var U3_ = this.U36() + this.U39();
        return U3_;
    },
    /* Скорость выделения */
    r3: function () {
        var r3_ = (this.coofPotreb.d31*this.U3())/(1 + this.coofPotreb.d32*this.U3()) + (1 - this.coofPotreb.d31/this.coofPotreb.d32);
        return r3_;
    },
    L3: function () {
        var L3_ = this.r3()*this.U3();
        return L3_;
    },

    /* Скорость смертности */
    V31: 1,
    V32: 1,
    S3: function () {
        var S3_ = this.V31 + this.V32*(C3/this.U3());
        return S3_;
    },

    /* Скорость выедания */
    Ct3: rationC1.U13(C1) // Выедания макрофитов рыбой

    /**
     *  Конец i=3: Для макрофитов C3.
     */

};
    
    console.log("------------------------------------");
    console.log("F3: "+rationC3.F3());
    console.log("U36: "+rationC3.U36());
    console.log("U39: "+rationC3.U39());
    console.log("U3: "+rationC3.U3());
    console.log("L3: "+rationC3.L3());
    console.log("S3: "+rationC3.S3());
    console.log("Ct3: "+rationC3.Ct3);



    /* ------------------------------------------------------------------ */
var rationC4 = {

    /**
     * i=4: Для фитопланктона C4. (PH) - фитопланктон;
     * Рацион:
     * Минеральный фосфор: C6 (MP);
     */

    /**
     * Коэффициенты потребления
     */
    coofPotreb: {
        d41: 1,
        d42: 1,
        d43: 1,
        d44: 1,
        d45: 1,
        d46: 1,
        d47: 1,
        d48: 1,
        d49: 1
    },

    //var k4 = 1;
    F4: C6,

    /* Удельная скорость потребления */
    U46: function (c4) {
        var U46_ = (k4)/(1 + c4/this.F4);
        return U46_;
    },
    U4: function (c4) {
        var U4_ = this.U46(c4);
        return U4_;
    },

    /* Скорость выделения */
    r4: function (c4) {
        var r4_ = (this.coofPotreb.d41*this.U4(c4))/(1 + this.coofPotreb.d42*this.U4(c4)) + (1 - this.coofPotreb.d41/this.coofPotreb.d42);
        return r4_;
    },
    L4: function (c4) {
        var L4_ = this.r4(c4)*this.U4(c4);
        return L4_;
    },

    /* Скорость смертности */
    V41: 1,
    V42: 1,
    S4: function (c4) {
        var S4_ = this.V41 + this.V42*(c4/this.U4(c4));
        return S4_;
    },

    /* Скорость выедания */
    Ct4: rationC2.U24(C2) + rationC1.U14(C1), // Выеданиея фитопланетона зоопланктоном и рыбой

    /* Скорость биохимической трансформации */
    R4: function (c4) {
        var R4_ = (this.U4(c4) - this.L4(c4) - this.S4(c4) - this.Ct4) * c4;
        return R4_;
    }
    /**
     *  Конец i=4: Для фитопланктона C4. (PH) - фитопланктон;
     */

};

    console.log("------------------------------------");
    console.log("F4: "+rationC4.F4);
    console.log("U46: "+rationC4.U46(C4));
    console.log("U4: "+rationC4.U4(C4));
    console.log("r4: "+rationC4.r4(C4));
    console.log("L4: "+rationC4.L4(C4));
    console.log("S4: "+rationC4.S4(C4));
    console.log("Ct4: "+rationC4.Ct4);
    console.log("R4: "+rationC4.R4(C4));


    /* ------------------------------------------------------------------ */
var rationC5 = {

    /**
     * i=5: Для бактерий C5. (BA) - бактерии;
     * Рацион:
     * Растворимый органический фосфор: C7 (DO);
     */

    /**
     * Коэффициенты потребления
     */
    coofPotreb: {
        d51: 1,
        d52: 1,
        d53: 1,
        d54: 1,
        d55: 1,
        d56: 1,
        d57: 1,
        d58: 1,
        d59: 1
    },

    //var k5 = 1;

    F5: C7,

    /* Удельная скорость потребления */
    U57: function () {
        var U57_ = (k5)/(1 + C5/this.F5);
        return U57_;
    },
    U5: function () {
        var U5_ = this.U57();
        return U5_;
    },

    /* Скорость выделения */
    r5: function () {
        var r5_ = (this.coofPotreb.d51*this.U5())/(1 + this.coofPotreb.d52*this.U5()) + (1 - this.coofPotreb.d51/this.coofPotreb.d52);
        return r5_;
    },
    L5: function () {
        var L5_ = this.r5()*this.U5();
        return L5_;
    },

    /* Скорость смертности */
    V51: 1,
    V52: 1,
    S5: function () {
        var S5_ = this.V51 + this.V52*(C5/this.U5());
        return S5_;
    },

    /* Скорость выедания */
    Ct5: rationC2.U25() // Выеданиея фитопланетона зоопланктоном и рыбой

    /**
     *  Конец i=5: Для бактерий C5. (BA) - бактерии;
     */

};

    console.log("------------------------------------");
    console.log("F5: "+rationC5.F5);
    console.log("U57: "+rationC5.U57());
    console.log("U5: "+rationC5.U5());
    console.log("L5: "+rationC5.L5());
    console.log("S5: "+rationC5.S5());
    console.log("Ct5: "+rationC5.Ct5);

    /* ------------------------------------------------------------------ */

var speedTansformC6 = {

    /**
     * i=6: Для мнерального фосфора C6. (MP) - минеральный фосфор;
     */

    /* Скорость трансформации */
    r6: function () {
        var r6_ = -rationC4.U4()*C4 - rationC3.U36()*C3 + rationC5.L5()*C5;  // минерального форсфора
        return r6_;
    }

    /**
     *  Конец i=6: Для мнерального фосфора C6. (MP) - минеральный фосфор;
     */

};

    console.log("------------------------------------");
    console.log("r6: "+speedTansformC6.r6());

    /* ------------------------------------------------------------------ */

var speedTansformC7 = {

    /**
     * i=7: Для растворимого органического фосфора C7. (DO) - растворимый органический фосфор;
     */

    /* Скорость трансформации */
    r7: function () {
        var r7_ = rationC4.L4()*C7 - rationC5.U5()*C5 + rationC2.L2()*C2 + rationC3.L3()*C8 + k8*C8;  // минерального форсфора
        return r7_;
    }

    /**
     *  Конец i=7: Для растворимого органического фосфора C7. (DO) - растворимый органический фосфор;
     */
};

    console.log("------------------------------------");
    console.log("r7: "+speedTansformC7.r7());

    /* ------------------------------------------------------------------ */

var speedTansformC8 = {

    /**
     * i=8: Для детритного фосфора C8. (DE) - детритный фосфор;
     */

    /* Скорость трансформации */
    r8: function () {
        var r8_ = C1*(rationC1.S1(C1)-rationC1.U18(C1)) + C2*(rationC2.S2()-rationC2.U28()) + rationC3.S3()*C3 + rationC4.S4()*C4 + rationC5.S5()*C5 - k8*C8;  // минерального форсфора
        return r8_;
    }

    /**
     *  Конец i=8: Для детритного фосфора C8. (DE) - детритный фосфор;
     */

};
    console.log("------------------------------------");
    console.log("r8: "+speedTansformC8.r8());

    
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
    var funRKM4;

 /******************************************************
  *****{ Уравнение для гидрохимических переменных }*****
  ******************************************************/
    function functionC1 (w,q_plus, q_minus, c, s) {
        Fun = w*rationC1.R1(c) + q_plus*C1 - q_minus*c + J*s + E*L;
        return Fun;
    }
    function functionC4 (w,q_plus, q_minus, c, s) {
        Fun = w*rationC4.R4(c) + q_plus*C4 - q_minus*c + J*s + E*L;
        return Fun;
    }
    function RKM4(c) {
        funRKM4 = c;
        return funRKM4;
    }
/******************************************************
 ******************************************************
 ******************************************************/

    var test = functionC4(1000, Q_plus[0], Q_minus[0], C1, 4.222);
    var test2 = rationC1.R1(C1);
    //console.log(test);
    console.log(test2);
    var arrCiW =[]; // Массив значений полученных в результате уравнения для гидрохимических переменных
    var CiW = C4;
    var step = 0.25;

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

        var kk1 = RKM4 (CiW               );
        var kk2 = RKM4 (CiW + 0.5*kk1*step);
        var kk3 = RKM4 (CiW + 0.5*kk2*step);
        var kk4 = RKM4 (CiW +     kk3*step);
        console.log(kk1);
        console.log(kk2);
        console.log(kk3);
        console.log(kk4);

        console.log(Y);
        console.log(CiW);
        var funCiW = functionC4(Y, Q_plus[n], Q_minus[n], CiW, s);
        console.log(funCiW);
        CiW = CiW + step/6*(kk1 + 2*kk2 + 2*kk3 + kk4);
        console.log(CiW);
        arrCiW.push(funCiW/1000000); // Поместим y в массив
        step++;
          /**
         * РКМ4 end
         */
    }

    console.log(arrCiW);
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
                text: 'Общий график',
                position: 'top'
            }
        }
    });

    var data5 = {
        labels: Idex,
        datasets: [
            {
                label: "С1",
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