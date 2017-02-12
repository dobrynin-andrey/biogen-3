import $ from 'jquery';
require("jquery-mousewheel");

/**
 * Created by Andrey on 12.02.2017.
 */

$(document).ready(function () {

    $('#reload').click(function () {
        location.reload();
    });

    $('#button').click(function () {


        //$('#grafik').bind("DOMSubtreeModified",function(){
        /* console.log(this);
         console.log(1);
         console.log($('iframe').length);

         if ($('iframe').length > 1 ) {
         $('iframe').remove();
         $('canvas').remove();
         console.log(2);
         }*/
        // });

        /* Берем значения из полей*/
        var h = Number($('#h').val());
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


    });
});












// window.onload = function () {
//
//     var H = document.getElementById('h').value;
//     console.log(H);
// };











/*


 import sys
 import math
 from PyQt5.QtWidgets import (QWidget, QDesktopWidget, QPushButton, QSizePolicy, QApplication, QMessageBox, QLabel, QLineEdit, QGridLayout)
 from PyQt5.QtGui import QIcon
 from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
 from matplotlib.figure import Figure
 import matplotlib.pyplot as plt


 # Визуализация приложения
 class Example(QWidget):
 def __init__(self):
 super().__init__()
 self.initUI()

 def center(self):
 qr = self.frameGeometry()
 cp = QDesktopWidget().availableGeometry().center()
 qr.moveCenter(cp)
 self.move(qr.topLeft())


 def initUI(self):

 okButton = QPushButton("Рассчитать")

 # Click on button okButton
 okButton.clicked.connect(self.rkm4)
 okButton.clicked.connect(self.plot)
 # okButton.clicked.connect(PlotCanvas)

 step = QLabel('Размер шага:')
 final_x = QLabel('Решать с x = [0, xfinal]:')
 nach_x = QLabel('Начальное значение X:')
 nach_y = QLabel('Начальное значение Y:')
 znach_function= QLabel('Функция:')

 self.stepEdit = QLineEdit()
 self.final_xEdit = QLineEdit()
 self.nach_xEdit = QLineEdit()
 self.nach_yEdit = QLineEdit()
 self.znach_functionEdit = QLineEdit()

 lbl_otvet = QLabel('Ответ:')
 self.otvet = QLabel(self)

 grafic_lbl = QLabel('График:')

 #lbl_log = QLabel('Лог:')
 #self.log = QLabel(self)
 #znach_functionEdit.textChanged[str].connect(self.rkm4)

 grid = QGridLayout()
 grid.setSpacing(2)
 grid.addWidget(step, 1, 0)
 grid.addWidget(self.stepEdit, 1, 1)
 grid.addWidget(final_x, 1, 2)
 grid.addWidget(self.final_xEdit, 1, 3)
 grid.addWidget(nach_x, 2, 0)
 grid.addWidget(self.nach_xEdit, 2, 1)
 grid.addWidget(nach_y, 2, 2)
 grid.addWidget(self.nach_yEdit, 2, 3)
 grid.addWidget(znach_function, 3,0)
 grid.addWidget(self.znach_functionEdit, 3, 1,1,3)
 grid.addWidget(lbl_otvet, 4, 0)
 grid.addWidget(self.otvet, 4, 1,1,3)

 #grid.addWidget(lbl_log, 6, 0)
 #grid.addWidget(self.log, 6, 1, 1, 1)


 #m = PlotCanvas(self, width=5, height=4)
 #m.move(0,0)


 #Canvas and Toolbar
 self.figure = plt.figure(figsize=(15,5))
 self.canvas = FigureCanvas(self.figure)
 #self.toolbar = NavigationToolbar(self.canvas, self)
 grid.addWidget(grafic_lbl, 5, 0)
 grid.addWidget(self.canvas, 5,1,2,3)
 grid.addWidget(okButton, 6, 0)
 # grid.addWidget(self.toolbar, 7,0,1,2)



 self.setLayout(grid)

 # self.statusBar().showMessage('Ready')
 self.resize(700, 550)
 self.center()
 self.setWindowTitle('Вычисление ОДУ методом Рунге-Кутты')
 self.setWindowIcon(QIcon('exe.png'))
 self.show()

 def closeEvent(self, event):
 reply = QMessageBox.question(self, 'Выход', "Вы действительно хотите выйти?", QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
 if reply == QMessageBox.Yes:
 event.accept()
 else:
 event.ignore()


 def rkm4(self):
 # Метод Рунге-Кутты 4-го порядка
 # Пример dy/dx = sin(x)+cos(y), y(0)=5;

 # Параметры
 h_str = self.stepEdit.text()    # Размер шага
 h = float(h_str)

 xfinal_str = self.final_xEdit.text()   # Решать с x = [0, xfinal]
 xfinal = float(xfinal_str)


 # Начальные значения
 x_str = self.nach_xEdit.text()
 X = float(x_str)
 y_str = self.nach_yEdit.text()
 Y = float(y_str)

 self.Y0 = Y

 self.Xframe = [X]
 self.Yframe = [Y]
 # Определим функцию ОДУ
 function_str = self.znach_functionEdit.text()   # math.sin(x)+math.cos(y)
 #function = eval(function_str)
 self.lable_fun = function_str


 def functionODU (x, y):
 f = eval(function_str)
 return f
 # Цикл метода РК4
 for i in range(math.ceil(xfinal/h)):

 k1 = functionODU (X        , Y           )
 k2 = functionODU (X + 0.5*h, Y + 0.5*k1*h)
 k3 = functionODU (X + 0.5*h, Y + 0.5*k2*h)
 k4 = functionODU (X +     h, Y +     k3*h)

 Y = Y + h/6*(k1 + 2*k2 + 2*k3 + k4)
 # Поместим y в массив
 self.Yframe += [Y]
 # Поместим x в массив
 self.Xframe += [X]
 # Обновим x
 X = X + h;

 self.otvet.setText('Y('+ str(self.Y0) + ') = ' + str(self.Yframe[-1]))
 self.otvet.adjustSize()


 # print ('Это х: ', self.Xframe)
 # print ('Это у: ', self.Yframe)
 # print ('Ответ: y('+ str(self.Y0) + ') =', self.Yframe[-1])


 # График результата
 def plot(self):
 plt.cla()
 ax = self.figure.add_subplot(111)
 plt.xlabel("X")
 plt.ylabel("Y")
 ax.plot(self.Xframe, self.Yframe, "b-", label='self.lable_fun')
 ax.set_title(str(self.lable_fun))
 self.canvas.draw()


 class PlotCanvas(FigureCanvas, Example):

 def __init__(self, parent=None, width=5, height=4, dpi=100):
 fig = Figure(figsize=(width, height), dpi=dpi)
 self.axes = fig.add_subplot(111)

 FigureCanvas.__init__(self, fig)
 self.setParent(parent)

 FigureCanvas.setSizePolicy(self,
 QSizePolicy.Expanding,
 QSizePolicy.Expanding)
 FigureCanvas.updateGeometry(self)
 self.plot()


 if __name__ == '__main__':
 app = QApplication(sys.argv)
 ex = Example()
 sys.exit(app.exec_())




 */