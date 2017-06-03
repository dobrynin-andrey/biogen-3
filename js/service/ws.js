import $ from 'jquery';
import jQuery from 'jquery';
window.$ = $;
window.jQuery = jQuery;
/* Средства взаимодействия модуля с 1С через веб-сервисы */

var oAPI = new function() {

	/////////////////////////////////////////////////////////////////////////////////
	//Базовые свойства
	/////////////////////////////////////////////////////////////////////////////////

	this.user         = "";
	this.login        = "";
	this.passwordHash = "";
	this.clientID     = "";
	this.session      = "";
	this.permissions  = {};
	this.typeSession  = "";
	this.notification = "";
	this.eduOrganization = false;

	this.sessionActive = false; //Признак того, что пользователь авторизован

    this.opened = []; //Содержит массив дочерних окон. [ИмяОкна] = СсылкаНаОкно. Массив не очищается от закрытых окон.

	/////////////////////////////////////////////////////////////////////////////////
	//Вспомогательные свойства
	/////////////////////////////////////////////////////////////////////////////////

	this.callback  = undefined;

	//$.cookie.raw = true;
	//$.cookie.defaults = {path: "/"};

    this.dataProperties = {
        getName: function(value) {

            for (var num in oAPI.dataProperties) {
                if (!oAPI.dataProperties.hasOwnProperty(num)) {
                    continue;
                }
                if (oAPI.dataProperties[num] == value) {
                    return num;
                }
            }

            return '';

        },
        'eduActivity': 'УчебнаяАктивность',
        'parentActivity': 'РодительскаяАктивность',
        'userActivity': 'ПрохождениеОбучения',
        'teacherActivity': 'ПроведениеПреподавателемОбучения',
        'childActivities': 'ПодчиненныеАктивности',
        'user': 'Пользователь',
        'name': 'Наименование',
        'type': 'Тип',
        'id': 'Идентификатор',
        'parent': 'Родитель',
        'number': 'Номер',
        'startDate': 'ДатаНачала',
        'endDate': 'ДатаОкончания',
        'classroom': 'Аудитория',
        'templateActivity': 'Мероприятие',
        'sequentialTasks': 'ПоследовательноеПрохождениеЗаданий',
        'availableChildActivities': 'ПодчиненныеМероприятияДоступны',
        'numberTemplateActivity': 'НомерМероприятия',
        'templateParentActivity': 'ОбщееМероприятие',
        'autoScore': 'АвтоматическаяОценка',
        'status': 'Статус',
        'controlFileAnswerTask': 'КонтролироватьПрикреплениеФайлаКОтвету',
        'statusEducation': 'СтатусОбучения',
        'statusActivity': 'СтатусПрохождения',
        /* Сделано функциями, так как при загрузке файла, перевод терминов еще не подгрузился */
        'statusEducationText': {
            0: function () {
                return ''
            }, 1: function () {
                return oLanguage.SCHEDULED
            }, 2: function () {
                return oLanguage.NEW
            }, 3: function () {
                return oLanguage.ACTIVE
            }, 4: function () {
                return oLanguage.COMPLETED
            }, 5: function () {
                return oLanguage.INCOMPLETE
            }, 6: function () {
                return oLanguage.VERIFIED
            }, 7: function () {
                return oLanguage.TO_REVISION
            }
        },
        'statusApplicationText': {
            0: function () {
                return ''
            }, 1: function () {
                return oLanguage.PENDING
            }, 2: function () {
                return oLanguage.APPROVED
            }, 3: function () {
                return oLanguage.REJECTED
            }, 4: function () {
                return oLanguage.CANCELLED
            }
        },
        'active': 'Активно',
        'actual': 'Актуально',
        'timeStamp': 'ДатаЧисло',
        'startDateUserActivity': 'ДатаНачалаПрохождения',
        'endDateUserActivity': 'ДатаОкончанияПрохождения',
        'startDateEntryActivity': 'ДатаОткрытияЗаписи',
        'endDateEntryActivity': 'ДатаЗакрытияЗаписи',
        'dateUserActivity': 'ДатаПрохождения',
        'dateControl': 'ДатаКонтроля',
        'dateControlNumber': 'ДатаКонтроляЧисло',
        'territory': 'Территория',
        'comment': 'Комментарий',
        'descriptionOpenEducation': 'ОписаниеОткрытогоОбучения',
        'commentToUserFromManager': 'КомментарийУчастникуОтМенеджера',
        'descriptionOpenEducationToUser': 'ОписаниеОткрытогоОбученияДляУчастника',
        'commentToUserContext': 'КомментарийУчастникуОтМенеджераКонтекстный',
        'commentToUserFromTeacher': 'КомментарийУчастникуОтПреподавателя',
        'commentToTeacherFromManager': 'КомментарийПреподавателюОтМенеджера',
        'commentToTeacherContext': 'КомментарийПреподавателюОтМенеджераКонтекстный',
        'mark': 'Оценка',
        'marks': 'Оценки',
        'scaleMarks': 'ШкалаОценок',
        'score': 'Баллы',
        'result': 'Результат',
        'availableQuizResults': 'ДоступенПросмотрРезультатовТестирования',
        'availableResultsElectronicResource': 'ДоступенПросмотрСтатистикиЭлектронногоРесурса',
        'allowUserComplete': 'ЗавершаетУчащийся',
        'isEducationalOrganization': 'ЭтоОбразовательнаяОрганизация',
        'electronicResource': 'ЭлектронныйРесурс',
        'itemElectronicResource': 'ЭлементСодержания',
        'electronicResources': 'ЭлектронныеРесурсы',
        'answersQuestions': 'ОтветыНаВопросы',
        'question': 'Вопрос',
        'availableFileUpload': 'РазрешеноПрикреплятьФайлы',
        'availableUsersFileUpload': 'РазрешеноУчащимсяПрикреплятьФайлы',
        'autoComplete': 'ЗавершаетсяАвтоматически',
        'availableUsersFiles': 'ДоступныПользовательскиеФайлы',
        'eduTemplate': 'Сценарий',
        'eduTemplateName': 'НаименованиеСценария',
        'files': 'Файлы',
        'file': 'Файл',
        'userFiles': 'ФайлыПользователя',
        'message': 'Сообщение',
        'text': 'Текст',
        'context': 'Контекст',
        'contextName': 'НаименованиеКонтекста',
        'login': 'Логин',
        'email': 'АдресЭлектроннойПочты',
        'task': 'Задание',
        'tasks': 'Задания',
        'toRevision': 'ВозвращеноНаДоработку',
        'count': 'Количество',
        'countTasks': 'КоличествоЗаданий',
        'onElectronicResource': 'НаОсновеЭлектронногоРесурса',
        'fragment' : 'Фрагмент',
        'countMessages': 'КоличествоСообщений',
        'countTopics': 'КоличествоТем',
        'topic': 'Тема',
        'topicName': 'НаименованиеТемы',
        'author': 'Автор',
        'addressee': 'ПолучательСообщения',
        'lastMessage': 'ПоследнееСообщение',
        'parentMessage': 'РодительскоеСообщение',
        'date': 'Дата',
        'dateView': 'ДатаПросмотра',
        'creationDate': 'ДатаСоздания',
        'link': 'Ссылка',
        'textString': 'ТекстоваяСтрока',
        'fullName': 'ПолноеИмя',
        'title': 'Заголовок',
        'datePublication': 'ДатаПубликации',
        'pin': 'Закрепить',
        'highlight': 'Выделить',
        'newsItem': 'Новость',
        'news': 'Новости',
        'isFolder': 'ЭтоГруппа',
        'modifiedDate': 'ДатаИзменения',
        'operationComplete': 'ОперацияЗавершена',
        'description': 'Описание',
        'tags': 'Метки',
        'order': 'Порядок',
        'childElements': 'ПодчиненныеЭлементы',
        'resources': 'Ресурсы',
        'resource': 'Ресурс',
        'addDate': 'ДатаДобавления',
        'book': 'Книга',
        'books': 'Книги',
        'webLink': 'ВебСсылка',
        'BBK': 'ББК',
        'UDK': 'УДК',
        'ISBN': 'ISBN',
        'countNewPersonalMessages': 'КоличествоНовыхЛичныхСообщений',
        'countNewForumMessages': 'КоличествоНовыхСообщенийФорума',
        'countNewNews': 'КоличествоНовыхНовостей',
        'addNews': 'ДобавлениеНовостей',
        'countUsersOnline': 'КоличествоПользователейОнлайн',
        'numParentMessage': 'НомерРодительскогоСообщения',
        'haveAttachments': 'ЕстьВложения',
        'education': 'Обучение',
        'teaching': 'Преподавание',
        'applicationToEducation': 'ЗаявкаНаОбучение',
        'reviewDate': 'ДатаРассмотрения',
        'entryToEducation': 'ЗаписьНаОбучение',
        'library': 'Библиотека',
        'forum': 'Форум',
        'messages': 'Сообщения',
        'calendar': 'Календарь',
        'users': 'Пользователи',
        'denyMailing': 'ЗапретитьРассылкуНаАдресЭлектроннойПочты',
        'denyNewMessagesMailing': 'ЗапретитьУведомленияОНовыхЛичныхСообщениях',
        'denyNewForumTopicsMailing': 'ЗапретитьУведомленияОНовыхСообщенияхФорума',
        'hideContactInformation': 'СкрытьКонтактнуюИнформацию',
        'hideAdditionalInformation': 'СкрытьДополнительныеСведения',
        'eduGroups': 'УчебныеГруппы',
        'usersCatalog': 'КаталогПользователей',
        'myEduGroups': 'СвоиУчебныеГруппы',
        'usersGroups': 'ГруппыПользователей',
        'participants': 'Участники',
        'participant': 'Участник',
        'group': 'Группа',
        'contactInformation': 'КонтактнаяИнформация',
        'representation': 'Представление',
        'kindName': 'НаименованиеВида',
        'kind': 'Вид',
        'additionalInformation': 'ДополнительныеСведения',
        'value': 'Значение',
        'typeValue': 'ТипЗначения',
        'boolean': 'Булево',
        'webSite': 'ВебСтраница',
        'photo': 'Фотография',
        'singleTask': 'ЕдинственноеЗадание',
        'role': 'Роль',
        'roleName': 'НаименованиеРоли',
        'teachers': 'Преподаватели',
        'teacher': 'Преподаватель',
        'availableParticipantsList': 'ДоступенСписокУчастников',
        'availableTeachersList': 'ДоступенСписокПреподавателей',
        'availableForumCategory': 'ДоступенРазделФорума',
        'forumCategory': 'РазделФорума',
        'providingEducation': 'ПроведениеОбучения',
        'dateProvidingEducation': 'ДатаПроведения',
        'startDateUserActivityNumber': 'ДатаНачалаПрохожденияЧисло',
        'endDateUserActivityNumber': 'ДатаОкончанияПрохожденияЧисло',
        'startDateActivityNumber': 'ДатаНачалаПроведенияЧисло',
        'endDateActivityNumber': 'ДатаОкончанияПроведенияЧисло',
        'webAddress': 'АдресВИнтернете',
        'color': 'Цвет',
        'conducted': 'Проведено',
        'checked': 'Проверено',
        'checkedDateNumber': 'ДатаПроверкиЧисло',
        'organizers': 'Организаторы',
        'organizer': 'Организатор',
        'numString': 'НомерСтроки',
        'string': 'Строка',
        'numeric': 'Число',
        'property': 'Свойство',
        'properties': 'Свойства',
        'variants': 'Варианты',
        'variant': 'Вариант',
        'variantName': 'НаименованиеВарианта',
        'variantDescription': 'ТекстОписанияВарианта',
        'taskDescription': 'ТекстОписанияЗадания',
        'taskAttempt': 'ПопыткаВыполненияЗадания',
        'attempt': 'ПопыткаВыполнения',
        'taskFiles': 'ФайлыЗадания',
        'teacherComment': 'КомментарийПреподавателя',
        'verifiedTeacher': 'ПроверенПреподавателем',
        'mustVerifiedTeacher': 'ПроверяетсяПреподавателем',
        'answerText': 'ТекстОтвета',
        'answerAttemptComplete': 'ПопыткаЗавершена',
        'electronicEducation': 'ЭлектронноеОбучение',
        'mustCheckEducation': 'ВыставляетсяОценка',
        'complete': 'Завершено',
        'importance': 'Значимость',
        'performed': 'Выполнено',
        'hideEduDate': 'СкрытьВремяПроведения',
        'avatar': 'Аватар',
        'isErrors': 'ЕстьОшибки',
        'textError': 'ТекстОшибки',
        'startDateAccess': 'ДатаНачалаДоступа',
        'endDateAccess': 'ДатаОкончанияДоступа',
        'list': 'Список',
        'using': 'Используется',
        'usedDate': 'ДатаИспользования',
        'code': 'Код',
        'pinCode': 'ПинКод',
        'pinCodes': 'ПинКоды',
        'availableForActivate': 'ДоступенДляАктивации',
        'codeError': 'КодОшибки',
        'notification': 'Уведомление',
        'eduGroupEO': 'УчебнаяГруппаОО',
        'showQuizResults': 'ПоказыватьРезультатыТестирования',
        'showAnswersQuizResults': 'ПоказыватьОтветыВРезультатахТестирования',
        'showScoreQuizResults': 'ПоказыватьОценкуВРезультатахТестирования',
        'weight': 'Вес',
        'psychological': 'Психологический',
        'fullUserAnswer': 'РазвернутыйОтветПользователя',
        'selected': 'Выбран',
        'right': 'Верный',
        'wrongNotSelected': 'ОшибочныйНеВыбран',
        'wrongSelected': 'ОшибочныйВыбран',
        'rightNotSelected': 'ВерныйНеВыбран',
        'rightSelected': 'ВерныйВыбран',
        'accessTime': 'ВремяДоступа',
        'requiredOption': 'ТребуетсяОпция',
        'availableOptions': 'ДоступныеОпции',
        'optionName': 'НаименованиеОпции',
        'searchResults': 'РезультатыПоиска',
        'portionLength': 'РазмерПорции',
        'object': 'Объект',
        'elementCollection': 'ЭлементПодборки',
        'elementGlossary': 'ЭлементГлоссария',
        'refObjectRes': 'СсылкаНаОбъектСУЗ',
        'foundWords': 'НайденныеСлова',
        'namePredefinedData': 'ИмяПредопределенныхДанных',
        'tooltip': 'Подсказка',
        'minProgressToUserComplete': 'МинимальныйПрогрессЗавершенияУчащимся',
        'minScoreToUserComplete': 'МинимальныйБаллЗавершенияУчащимся',
        'countAttachedFiles': 'КоличествоПрикрепленныхФайлов',
        'countAttachedFilesToUserComplete': 'КоличествоФайловДляЗавершенияУчастником',
        'percentProgress': 'ЗавершеноВПроцентах',
        'issuedFor': 'ЗаЧтоВыдан',
        'issuedWhen': 'КогдаВыдан',
        'certificate': 'Сертификат'
    };


	/////////////////////////////////////////////////////////////////////////////////
	//Базовые методы
	/////////////////////////////////////////////////////////////////////////////////

	// Подготавливает API
	//
	this.init = function(app) {


		$.cookie(oSettingsPortal.storageName('version'), oSettings.version);

		//Устанавливаем параметры сессии

		oAPI.session         = $.cookie(oSettingsPortal.storageName('session'));

		oAPI.user            = $.localStorage.get(oSettingsPortal.storageName('user'));
		oAPI.login           = $.localStorage.get(oSettingsPortal.storageName('login'));
		oAPI.clientID        = $.localStorage.get(oSettingsPortal.storageName('clientID'));
		oAPI.passwordHash    = $.localStorage.get(oSettingsPortal.storageName('passwordHash'));
		oAPI.permissions     = $.localStorage.get(oSettingsPortal.storageName('permissions'));
		oAPI.typeSession     = $.localStorage.get(oSettingsPortal.storageName('typeSession'));
		oAPI.notification    = $.localStorage.get(oSettingsPortal.storageName('notification'));
		oAPI.eduOrganization = $.localStorage.get(oSettingsPortal.storageName('eduOrganization'));

		if (oAPI.session) {

			oAPI.sessionActive = true;

			//Устаналиваем автоматическое обновление данных об активности сессии

			oAPI.getData('session/setActiveDate', undefined, undefined, undefined, oSettingsUsers, true, true);

			setInterval(function () {
				// Фиксируем активность раз в пять минут
				oAPI.getData('session/setActiveDate', undefined, undefined, undefined, oSettingsUsers, true, true);
			}, 60*5*1000);

		}

		//Определяем действие, которе следует выполнить после инициализации

		oAPI.doAfterInit = "";

		if (!oAPI.sessionActive && !oPage.public) {

			var onlyStandardAuthentication = true;
			var onlyCASAuthentication = true;
			var onlyOpenIDAuthentication = true;
			var authenticationSettings = oSettingsUsers.features.authentication;

			for (var nameAuthentication in authenticationSettings) {

				if (!authenticationSettings.hasOwnProperty(nameAuthentication)) {
					continue;
				}

				if (authenticationSettings[nameAuthentication].available && nameAuthentication !== 'standard') {
					onlyStandardAuthentication = false;
				}

				if (nameAuthentication == 'standard' && !authenticationSettings[nameAuthentication].available) {
					onlyStandardAuthentication = false;
				}

				if (authenticationSettings[nameAuthentication].available && nameAuthentication !== 'cas') {
					onlyCASAuthentication = false;
				}

				if (nameAuthentication == 'cas' && !authenticationSettings[nameAuthentication].available) {
					onlyCASAuthentication = false;
				}

				if (authenticationSettings[nameAuthentication].available && nameAuthentication !== 'openid') {
					onlyOpenIDAuthentication = false;
				}

				if (nameAuthentication == 'openid' && !authenticationSettings[nameAuthentication].available) {
					onlyOpenIDAuthentication = false;
				}

			}

			if (onlyStandardAuthentication) {
				oAPI.doAfterInit = "showAuthorizationWindow";
			}

			if (onlyCASAuthentication) {
				oAPI.doAfterInit = "doCASAuthentication";
			}

			if (onlyOpenIDAuthentication) {
				oAPI.doAfterInit = "doOpenIDLookup"; // Выполняем поиск доступной OpenID авторизации
			}

			if (!oAPI.doAfterInit) {
				oAPI.doAfterInit = "goToIndex";
			}

		}

		if (oAPI.sessionActive &&
			!oPage.public &&
			oAPI.typeSession == 'openid' &&
			oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.available') &&
			oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.checkOnLoad')) {

			oAPI.doAfterInit = "doOpenIDCheck"; // Будет выполнена проверка доступности аутентификации OpenID

		}

		//Определяем директивы стандартного окна аутентификации и регистрации

		if (oCommon.getSetting('oSettingsUsers', 'features.authentication.standard.available') ||
			oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.available')) {

			app.directive('auth', function () {
				return {
					restrict: 'A',
					templateUrl: 'auth.html',
					link: function ($scope, elm, attrs, ctrl) {
						attrs.$set('id', 'authorizationWindow');
						attrs.$set('class', 'modal fade');
						attrs.$set('tabindex', '-1');
						attrs.$set('role', 'dialog');
						attrs.$set('aria-labelledby', 'authorizationWindowLabel');
						attrs.$set('aria-hidden', 'true');

						$(elm).ready(function () {

							$(elm).on("open", function () {
								if (!$(this).is(":visible")) {
									$('#authorizationFormOK').html('').hide();
									$('#authorizationFormError').html('').hide();
									$(this).modal({keyboard: true, backdrop: 'static'});
								}
							});

							$(elm).on("close", function () {
								$(this).modal('hide');
							});

							$(elm).on("message", function (event, type, display, text) {
								if (display && display == 'show') {
									$('#authorizationForm' + type).html(text).show();
								} else {
									$('#authorizationForm' + type).html('').hide();
								}
							});

							if (oAPI.doAfterInit == "showAuthorizationWindow") {
								oAPI.showStandardAuthentication(); //Открываем окно авторизации сразу после инициализации
							}

							if (!oPage.public) {
								$('.close', elm).hide();
							}

						});

					},
					controller: function ($scope, $translate) {

						$scope.submit = oAPI.submitStandardAuthentication;
						$scope.registrationAvailable = oSettingsUsers.features.registration.available;
						$scope.restoreAvailable = oSettingsUsers.features.restore.available;

                        $translate(['SIGN_IN_TITLE','LOGIN','PASSWORD','SHORT_SESSION','SIGN_IN','SIGN_UP','FORGOT_PASSWORD']).then(function (translations) {
                            $scope.SIGN_IN_TITLE = translations.SIGN_IN_TITLE;
                            $scope.LOGIN = translations.LOGIN;
                            $scope.PASSWORD = translations.PASSWORD;
                            $scope.SHORT_SESSION = translations.SHORT_SESSION;
                            $scope.SIGN_IN = translations.SIGN_IN;
                            $scope.SIGN_UP = translations.SIGN_UP;
                            $scope.FORGOT_PASSWORD = translations.FORGOT_PASSWORD;
                        });

					}
				};
			});

		}


		if (oCommon.getSetting('oSettingsUsers', 'features.registration.available')
            && oCommon.getSetting('oSettingsUsers', 'features.registration.form')) {

			app.directive('reg', function() {
				return {
					restrict: 'A',
					templateUrl: 'reg.html',
					link: function($scope, elm, attrs, ctrl) {

						attrs.$set('id', 'registrationWindow');
						attrs.$set('class', 'modal fade');
						attrs.$set('tabindex', '-1');
						attrs.$set('role', 'dialog');
						attrs.$set('aria-labelledby', 'regWindowLabel');
						attrs.$set('aria-hidden', 'true');

						$(elm).ready(function() {

							$(elm).on( "open", function() {
								$('#regFormError').html('').hide();
								$(this).modal({keyboard: true, backdrop: 'static'});
							});

							$(elm).on( "close", function() {
								$(this).modal('hide');
							});

							$(elm).on( "message", function(event, type, display, text) {
								if (display && display == 'show') {
									$('#regForm' + type).html(text).show();
								} else {
									$('#regForm' + type).html('').hide();
								}
							});

							if (!oPage.public) {
								$('.close', elm).hide();
							}

                            $('.datepicker').datepicker();

						});

					},
					controller: function($scope, $translate) {

                        $translate(['SIGN_UP_TITLE','SIGN_UP_STEP_2','PIN_CODE','OPTION','NOTHING_SELECTED','REGISTER', 'REGISTER_BACK']).then(function (translations) {

                            $scope.SIGN_UP_TITLE = translations.SIGN_UP_TITLE;
                            $scope.SIGN_UP_STEP_2 = translations.SIGN_UP_STEP_2;
                            $scope.PIN_CODE = translations.PIN_CODE;
                            $scope.OPTION = translations.OPTION;
                            $scope.NOTHING_SELECTED = translations.NOTHING_SELECTED;
                            $scope.REGISTER = translations.REGISTER;
                            $scope.REGISTER_BACK = translations.REGISTER_BACK;

                        });

                        //$scope.additionalInformation = {};

                        $scope.closeAdditionalInformation = function() {

                            $scope.additionalInformation = undefined;

                        };

                        $scope.doForm = function() {

                            $scope.form = $.extend([], oCommon.getSetting('oSettingsUsers', 'features.registration.form'));

                            $scope.pinCode = {
                                value: ''
                            };

                            for (var num in $scope.form) {

                                if (!$scope.form.hasOwnProperty(num)) {
                                    continue;
                                }

                                $scope.form[num].data = {
                                    value: ''
                                };
                                $scope.form[num].confirmData = {
                                    value: ''
                                };

                                if ($scope.form[num].typeValue == 'boolean') {
                                    $scope.form[num].variants = [
                                        {value: 'true', name: oLanguage.YES},
                                        {value: 'false', name: oLanguage.NO}
                                    ];
                                }

                            }


                        };

                        $scope.doForm();


                        $scope.submitRegData = function() {

                            // Проверяем поля с подтверждением

                            var registrationWindow = $('#registrationWindow');

                            registrationWindow.trigger('message', ['Error', 'hide']);

                            for (var num in $scope.form) {

                                if (!$scope.form.hasOwnProperty(num)) {
                                    continue;
                                }

                                if ($scope.form[num].confirm && $scope.form[num].data.value && $scope.form[num].data.value !== $scope.form[num].confirmData.value) {

                                    registrationWindow.trigger('message', ['Error', 'show', oLanguage.FIELD_FORM_ERR($scope.form[num].confirmName)]);

                                    return;

                                }


                            }

                            // Формируем данные о пользователе для отправки на сервер

                            var regData = {
                                userData: [],
                                additionalInformation: [],
                                publication: oSettingsPortal.name
                            };

                            for (var numF in $scope.form) {

                                if (!$scope.form.hasOwnProperty(numF)) {
                                    continue;
                                }

                                var valueData = $scope.form[numF].data.value;

                                if ($scope.form[numF].typeValue == 'date') {
                                    valueData = moment(valueData, 'L').format('YYYY-MM-DD');
                                }

                                regData.userData.push({
                                    name: $scope.form[numF].id,
                                    value: valueData
                                });

                            }

                            // Добавляем поле publication для совместимости со старой версией в массив userData

                            regData.userData.push({
                                name: 'publication',
                                value: oSettingsPortal.name
                            });

                            // Добавляем поле pinCode (оно не входит в основной массив полей формы и хранится отдельно)

                            if ($scope.pinCode.value) {
                                regData.userData.push({
                                    name: 'pinCode',
                                    value: $scope.pinCode.value
                                });
                            }

                            // Формируем дополнительные данные

                            var locationObject = oTools.getURLAsArray(location.search);

                            if ('pinCodeOption' in locationObject) {
                                regData.additionalInformation.push({name: "pinCodeOption", value: locationObject.pinCodeOption});
                            }

                            if ('additionalInformation' in $scope) {

                                for (var numAI in $scope.additionalInformation) {

                                    if (!$scope.additionalInformation.hasOwnProperty(numAI)) {
                                        continue;
                                    }

                                    regData.additionalInformation.push({
                                        name: $scope.additionalInformation[numAI].propertyId,
                                        value: $scope.additionalInformation[numAI].value
                                    });

                                }

                            }

                            // Обрабатывает ответ сервера после регистрации
                            //
                            function onRegistration(regResult) {

                                if (regResult && 'login' in regResult) {

                                    $('#registrationWindow').trigger('close');

                                    $('#authorizationWindow').trigger('open').trigger('message', ['OK', 'show', oLanguage.AFTER_REGISTER(regResult.login)]);

                                    $('#inputLogin').val(regResult.login);

                                    $scope.doForm();

                                }

                                if (regResult && 'additionalInformation' in regResult) {

                                    $scope.additionalInformation = oCommon.getAdditionalData(regResult);

                                }

                            }

                            // Отсылаем на сервер данные формы

                            oAPI.getData('user/new', $.toJSON(regData), onRegistration, undefined, oSettingsUsers);

                        }

					}
				};
			});

		}

		if (oCommon.getSetting('oSettingsUsers', 'features.authentication.cas.available')) {

			oAPI.submitResponseFromCASServer();

		}

        if (oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.available')) {
            oAPI.openID.initial();
        }

		//Выполняем стандартные действия после инициализации

		if (oAPI.doAfterInit) {

			if (oAPI.doAfterInit == "doCASAuthentication") {
				oAPI.goToCASServer();
			}

			if (oAPI.doAfterInit == "doOpenIDLookup") {
				oAPI.openID.lookup();
			}

			if (oAPI.doAfterInit == "doOpenIDCheck") {
				oAPI.openID.check();
			}

			if (oAPI.doAfterInit == "goToIndex") {
				oAPI.open('?page=index'); //Бесконечного цикла не будет, так как стартовая страница публичная.
			}

		}


	};

	// Открывает страницу или файл
	//
	this.open = function(link, outputHref) {

		if (!link) {
			return;
		}

		if (link.indexOf('?') == 0) {

			var linkObject = oTools.getURLAsArray(link);

			if ('page' in linkObject) {

				location.href = oSettingsPortal.baseDesktop + '/' + linkObject.page + '.html' + link;
				return;

			}

			if ('res' in linkObject) {

				var xmlRequest = getSoapRequest("getLink", {"search": convertQueryForRequest(link), "base": oSettingsPortal.baseRes}, 'http://v8.1c.ru/kms/3/portal');
				doRequest(xmlRequest, oAPI.open, oSettingsRes, linkObject.res);
				return;

			}

			if ('book' in linkObject) {

				var hrefBook = oSettingsPortal.baseDesktop + '/book.html' + link;

				if ('window' in linkObject && linkObject.window == 'new') {
					oAPI.open(hrefBook)
				} else {
					location.href = hrefBook;
				}

				return;

			}

			if ('user' in linkObject) {

				var hrefUser = oSettingsPortal.baseDesktop + '/user.html' + link;

				if ('window' in linkObject && linkObject.window == 'new') {
					oAPI.open(hrefUser)
				} else {
					location.href = hrefUser;
				}

				return;

			}

			if ('file' in linkObject) {

				if (!window.oSettingsEdu) {
					alert('Error!');
					return;
				}

				var key = userKey();
				var fileGUID = linkObject.file;
				var idOwner = 'common';
				var nameOwner = 'common';

				if ('idOwner' in linkObject) {
					idOwner = linkObject.idOwner;
				}

				if ('nameOwner' in linkObject) {
					nameOwner = linkObject.nameOwner;
				}

				var clientSettings = {
					'baseDesktop': oSettingsPortal.baseDesktop,
					'baseFiles': oSettingsPortal.baseFiles
				};

				$.ajax({
					type: "POST",
					url: oSettingsEdu.url + '/file/url/'+nameOwner+'/'+idOwner+'/'+fileGUID+searchRequest(),
					async: false,
					data:  $.toJSON(clientSettings),
					username: oSettingsEdu.user,
					password: oSettingsEdu.password,
					complete: function(jqXHR, textStatus) {
						oAPI.response(jqXHR, textStatus, oCommon.download);
					}

				});

			}

		} else {

			//Запоминаем url с которого ушли на внешнюю страницу

			var linkArray = oTools.getURLAsArray(link);

			if ('window' in linkArray && linkArray.window == 'new') {

                var windowName = link;

                if (windowName in oAPI.opened && oAPI.opened[windowName] && !oAPI.opened[windowName].closed) {

                    oAPI.opened[windowName].focus();

                } else {

                    oAPI.opened[windowName] = window.open(link, '_blank');


                    $( oAPI.opened[windowName] ).on("beforeunload", function() {oAPI.beforeUnloadOpened()})

                }

			} else {

				if (!outputHref) {
					outputHref = location.href;
				}

				$.sessionStorage.set(oSettingsPortal.storageName('outputHref'), outputHref);

				location.href = link;

			}

		}

	};

    // Срабатывает после закрытия открытой страницы в новом окне
    // ВАЖНО! функция по умолчанию пустая и переопределяется каждой страницей.
    //
    this.beforeUnloadOpened = function() {

    };

	//Посылает запрос на сервер и возвращает результат в callback
	//
	this.getData = function(query, data, callback, alertCallback, service, async, hidden) {

		if (!async) {
			async = false;
		}

		if (!service) {
			if (window.oSettingsEdu) {
				service = window.oSettingsEdu;
			} else {
				if (!hidden) {
					alert('Error!');
				} else {
					console.log(query);
				}
				return;
			}
		}

		$.ajax({
			type: "POST",
			url: service.url+'/'+query+searchRequest(),
			async: async,
			username: service.user,
			password: service.password,
			data: data,
			complete: function(jqXHR, textStatus) {
				oAPI.response(jqXHR, textStatus, callback, alertCallback, hidden);
			}

		});

	};

	// Получает значение конкретного свойства из данных сервера
	//
	this.value = function(data, name, type) {

		if (name in oAPI.dataProperties) {
			name = oAPI.dataProperties[name];
		}

		if (type == 'text') {
			return oJSON.text(data, name);
		} else if(type == 'date') {
			return oTools.dateFormat(oJSON.text(data, name));
		} else if(type == 'number') {
			return Number(oJSON.text(data, name));
		} else if(type == 'boolean') {
			return oTools.stringToBoolean(oJSON.text(data, name));
		} else if(type == 'array') {
			return oJSON.array(data, name);
		} else if(type == 'json') {
			return jQuery.parseJSON(oAPI.value(data, name, 'text'));
		} else if(type == 'raw') {
			if (data && name in data) {return data[name]} else {return ''}
		} else if(type == 'object') {
			return oJSON.prop(data, name);
		} else {
			return oJSON.prop(data, name); //Тоже что и object
		}

	};

	///////////////////////////////////////
	// Внутренние методы

	// Передает ответ сервера обратно в плеер через функцию обратного вызова
	//
	this.response = function(resultRequest, textStatus, callback, alertCallback, hidden, contentType) {

		var response = processResponse(resultRequest, textStatus, contentType);
		var dataResponse = '';

		if (response.closeSession) {

			oAPI.deleteSession(oAPI.session);

		} else {

			if (response.isError && !hidden) {

				if (alertCallback) {
					alertCallback(response.message);
				} else {
					alert(response.message);
				}

			} else {

				if (response.xml) {
					dataResponse = $.xml2json(response.xml, true);
				}

                if (response.html) {
                    dataResponse = response.html;
                }

				if (response.data) {
					dataResponse = response.data;
				}

				if (response.link) {
					dataResponse = response.link;
				}

			}

			if (callback) {
				callback(dataResponse); //Вызываем функцию для обработки ответа от LMS, даже в случае ошибки
			}

		}

		return response;

	};

	// Показывает стандартную форму авторизации
	//
	this.showStandardAuthentication = function() {

		var scope = angular.element(document.getElementById('authorizationWindow')).scope();
		scope.submit = oAPI.submitStandardAuthentication;
		scope.$apply();

		$('#authorizationWindow').trigger('open');
	};

	// Отправляет данные авторизации на сервер для открытия сессии
	//
	this.submitStandardAuthentication = function() {

		var password = $.trim($('#inputPassword').val());

		if (password) {
			oAPI.passwordHash = CryptoJS.SHA1(password).toString(CryptoJS.enc.Base64);
		} else {
			oAPI.passwordHash = "";
		}

		oAPI.login    = $.trim($('#inputLogin').val());
		oAPI.clientID = guidGenerator();

		var usePinCode = ('usePinCode' in oSettingsUsers.features.registration) ? oSettingsUsers.features.registration.usePinCode : false;
		var key        = CryptoJS.SHA1(oSettings.version + oAPI.passwordHash + oAPI.clientID).toString(CryptoJS.enc.Base64);
		var userData   = $.toJSON({"login": oAPI.login, "clientID": oAPI.clientID, "key": key, "version": oSettings.version, "usePinCode": usePinCode});

		var alert = function(message) {
			$('#authorizationWindow').trigger('message', ['Error', 'show', message]);
		};

		oAPI.getData('session/new/standard', userData, oAPI.setSession, alert, oSettingsUsers);

	};

	// Выполняет переход на CAS сервер для аутентификации
	//
	this.goToCASServer = function() {
		var CASSettings = oSettingsUsers.features.authentication.cas;
		location.href = CASSettings.url + "/login?service=" + CASSettings.service;
	};

	// Выполняет переход на CAS сервер для выхода
	//
	this.exitFromCASServer = function() {
		var CASSettings = oSettingsUsers.features.authentication.cas;
		location.href = CASSettings.url + "/logout?service=" + CASSettings.service;
	};

	// Проверяет тикет с CAS сервера и открывает сессию
	//
	this.submitResponseFromCASServer = function() {

		var locationObject = oTools.getURLAsArray(location.search);

		if ('ticket' in locationObject) {
			oAPI.clientID = locationObject.ticket;
			oAPI.passwordHash = "";
			oAPI.getData('session/new/cas', $.toJSON({'clientID': oAPI.clientID, "version": oSettings.version, "publication": oSettingsPortal.name}), oAPI.setSession, undefined, oSettingsUsers);
		}

	};

	this.openID = new function() {

		function getFrame() {

			var frameOpenID = $('#openIDFrame');

			if (!frameOpenID.length) {
				$('body').append('<iframe id="openIDFrame" src="" style="visibility: hidden; position: absolute; left: 0; top: 0; height:0; width:0; border: none; display: none;"></iframe>');
				frameOpenID = $(frameOpenID.selector);
			}

			return frameOpenID[0];

		}


		function before(eventName) {

			// Устанавливаем в куки код публикации, в которой выполняем авторизацию.
			// Код необходим в 1С для получения настроек публикации.
			// Запись будет удалена после выполнения запроса.
			// Запись обща для всех публикаций, поэтому одновременная
			// аутентификация в одном браузере разных публикаций невозможна,
			// но это маловероятно или вообще невозможно.

			oAPI.passwordHash = "";

			$.cookie('publication', oCommon.getSetting('oSettingsPortal', 'name'));
			$.cookie(oSettingsPortal.storageName('event'), eventName);

		}

		function after() {

			$.removeCookie('publication');
			$.removeCookie(oSettingsPortal.storageName('openidEvent'));

		}

		function getRedirect() {
			//return 'https://sdo.1c.ru/test/redirect.html';
			return oCommon.locationOrigin(oSettingsEdu.user, oSettingsEdu.password) + oCommon.getSetting('oSettingsUsers', 'url') + '/openid/process';
		}

        this.initial = function () {
            getFrame();
        };

		// Проверяет, авторизован ли пользователь
		//
		this.lookup = function() {

			var frame = getFrame();

			$(frame).contents().find('html').html(
			'<html><head></head><body><form name="lookup" id="lookup" method="post" action="'
			+oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.provider') + '?cmd=lookup'+'"> \
			<input type="hidden" name="openid.return_to" value="'+getRedirect()+'"/> \
			<input type="hidden" name="openid.auth.check" value="true"/> \
			</form></body></html>');

			before('lookup');

			$(frame).contents().find('#lookup').submit(); // Отправляем форму
			// Результат проверки удет доступен во фрейме. Из него будет вызвана функция processResponse

		};

		this.check = function() {

			var frame = getFrame();

			$(frame).contents().find('html').html(
			'<html><head></head><body><form name="check" id="check" method="post" action="'
			+oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.provider') + '?cmd=lookup'+'"> \
			<input type="hidden" name="openid.return_to" value="'+getRedirect()+'"/> \
			<input type="hidden" name="openid.auth.check" value="true"/> \
			</form></body></html>');

			before('check');

			$(frame).contents().find('#check').submit(); // Отправляем форму
			// Результат проверки удет доступен во фрейме. Из него будет вызвана функция processResponse

		};

		// Отправляет запрос на авторизацию провайдеру
		//
		this.authentication = function() {

			var frame = getFrame();

			$(frame).contents().find('html').html(
			'<html><head></head><body><form name="auth" id="auth" method="post" action="'
			+oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.provider') + '?cmd=auth'+'"> \
			<input type="hidden" name="openid.return_to" value="'+getRedirect()+'"/> \
			<input type="hidden" name="openid.auth.check" value="true"/> \
            <input type="hidden" name="openid.auth.user" value="'+$.trim($('#inputLogin').val())+'"/> \
			<input type="hidden" name="openid.auth.pwd" value="'+$.trim($('#inputPassword').val())+'"/> \
			<input type="hidden" name="opeind.auth.short" value="'+String($("#inputShortSession").is(':checked'))+'"/> \
			</form></body></html>');

			before('authentication');

			$(frame).contents().find('#auth').submit();

		};

		// Отменяет аутентификацию провайдера
		//
		this.logout = function() {

			var frame = getFrame();

			$(frame).contents().find('html').html(
			'<html><head></head><body><form name="logout" id="logout" method="post" action="'
			+oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.provider') + '?cmd=logout'+'"> \
			</form></body></html>');

			$(frame).contents().find('#logout').submit();

		};

		// Вызывается из фрейма для установки сессии или показа окна авторизации
		//
		this.processResponse = function(sessionDataString, eventName) {

			var response;

			if (eventName == 'check') {

				if (!oAPI.sessionActive) {
					return;
				}

				response = oAPI.response(sessionDataString, 'success', '', '', true, 'application/json');

				if (!response || response.isError) {
					oAPI.exit();
				}


			} else {

				if (oAPI.sessionActive) {
					return;
				}

				var alert = function(message) {
					$('#authorizationWindow').trigger('message', ['Error', 'show', message]);
				};

				response = oAPI.response(sessionDataString, 'success', oAPI.setSession, (eventName == 'lookup') ? '' : alert, (eventName == 'lookup') ? true : false, 'application/json');

				if (!response || response.isError) {

					var scope = angular.element(document.getElementById('authorizationWindow')).scope();
					scope.submit = oAPI.openID.authentication;
					scope.$apply();

					$('#authorizationWindow').trigger('open');

				}

			}


			after();

		};



	};

	// Устанавливает номер сессии, полученный от сервера после авторизации
	//
	this.setSession = function(sessionData) {

		if (sessionData) {

			oAPI.session         = sessionData.session;
			oAPI.user            = sessionData.user;
			oAPI.login           = sessionData.login;
			oAPI.typeSession     = sessionData.typeSession;
			oAPI.notification    = sessionData.notification;
			oAPI.eduOrganization = sessionData.eduOrganization;

			if (sessionData.clientID) {
				oAPI.clientID        = sessionData.clientID;
			}

			oAPI.permissions = {};

			for (var num in sessionData.permissions) {

				if (!sessionData.permissions.hasOwnProperty(num)) {
					continue;
				}

				var permissionName = oAPI.dataProperties.getName(num);

				if (permissionName) {
                    oAPI.permissions[permissionName] = sessionData.permissions[num];
                }

			}

			if ($("#inputShortSession").is(':checked')) {
                $.cookie(oSettingsPortal.storageName('session'), oAPI.session);
			} else {
                $.cookie(oSettingsPortal.storageName('session'), oAPI.session, {expires: oSettingsPortal.cookiesExpires});
			}

			$.localStorage.set(oSettingsPortal.storageName('user'), oAPI.user);
			$.localStorage.set(oSettingsPortal.storageName('login'), oAPI.login);
			$.localStorage.set(oSettingsPortal.storageName('clientID'), oAPI.clientID);
			$.localStorage.set(oSettingsPortal.storageName('passwordHash'), oAPI.passwordHash);
			$.localStorage.set(oSettingsPortal.storageName('permissions'), oAPI.permissions);
			$.localStorage.set(oSettingsPortal.storageName('typeSession'), oAPI.typeSession);
			$.localStorage.set(oSettingsPortal.storageName('notification'), oAPI.notification);
			$.localStorage.set(oSettingsPortal.storageName('eduOrganization'), oAPI.eduOrganization);

			if (oPage.public) {
				oAPI.open('?page=index');
			} else {
				location.reload();
			}

		}


	};

	// Показывает форму или страницу регистрации
	//
	this.register = function() {

		if (!oSettingsUsers.features.registration.available) {
			return;
		}

		if (oSettingsUsers.features.registration.url) {
			location.href = oSettingsUsers.features.registration.url;
		} else {
			$('#registrationWindow').trigger('open');
		}

	};



	// Открывает страницу восстановления пароля
	//
	this.restore = function() {

		if (!oSettingsUsers.features.restore.available) {
			return;
		}

		if (oSettingsUsers.features.restore.url) {
			location.href = oSettingsUsers.features.restore.url;
		} else {
			oAPI.open("?page=restore");
		}

	};

	// Зыкрывает сессию на сервере
	//
	this.exit = function() {

		oAPI.getData('session/close', '', oAPI.deleteSession, undefined, oSettingsUsers);

	};

	// Закрывает сессию на клиенте
	//
	this.deleteSession = function(session) {

		$.removeCookie(oSettingsPortal.storageName('session'));

		$.removeCookie(oSettingsPortal.storageName('calendarView'));
		$.removeCookie(oSettingsPortal.storageName('calendarDate'));

		$.localStorage.remove(oSettingsPortal.storageName('login'));
		$.localStorage.remove(oSettingsPortal.storageName('clientID'));
		$.localStorage.remove(oSettingsPortal.storageName('passwordHash'));
		$.localStorage.remove(oSettingsPortal.storageName('permissions'));
		$.localStorage.remove(oSettingsPortal.storageName('user'));
		$.localStorage.remove(oSettingsPortal.storageName('typeSession'));
		$.localStorage.remove(oSettingsPortal.storageName('notification'));
		$.localStorage.remove(oSettingsPortal.storageName('eduOrganization'));
        $.localStorage.remove(oSettingsPortal.storageName('avatar'));
        $.localStorage.remove(oSettingsPortal.storageName('userName'));

		if (session) {

			if (oAPI.typeSession == "cas") {

				oAPI.exitFromCASServer();

			} else if (oAPI.typeSession == "openid") {

				if (oCommon.getSetting('oSettingsUsers', 'features.authentication.openid.cancelAuthProvider')) {
					oAPI.openID.logout();
				}

				oAPI.open('?page=index');

			} else {
				oAPI.open('?page=index');
			}

		}

	};

	// Помещает файл пользователя на сервер
	//
	this.upload = function(files, typeOwner, idOwner, callback) {

		if (!window.oSettingsEdu) {
			alert('Команда не поддерживается!');
			return;
		}

		if (!files.length) {
			alert('Файлы не выбраны!');
			return;
		}

		var uploadString = oTools.objectToParamString({'files': files});

		$.ajax({
			type: "POST",
			url: oSettingsEdu.url + '/file/upload/'+typeOwner+'/'+idOwner+searchRequest(),
			async: true,
			username: oSettingsEdu.user,
			password: oSettingsEdu.password,
			data: uploadString,
			complete: function(jqXHR, textStatus) {
				oAPI.response(jqXHR, textStatus, callback);
			}
		});

	};

	/////////////////////////////////////////////////////////////////////////////////
	//Вспомогательные функции
	/////////////////////////////////////////////////////////////////////////////////

	// Преобразует ответ 1С в js объект
	//
	function processResponse(responseFromServer, textStatus, contentType) {

		var response = {
			data: '',
			xml: '',
            html: '',
			message: '',
			headMessage: '',
			link: '',
			isError: false,
			closeSession: false
		};

		var typeResponse = '';
		var textResponse = '';

		if (typeof responseFromServer == 'string') {

			textResponse = responseFromServer;

		} else {

            if (!contentType) {
                contentType = responseFromServer.getResponseHeader("Data-type"); // Свой заголовок (имеет приоритет)
            }

			if (!contentType) {
				contentType = responseFromServer.getResponseHeader("content-type");
			}

			if ('readyState' in responseFromServer && 'responseText' in responseFromServer && textStatus) {

				if (responseFromServer.readyState !== 4) {
					return;
				}
				if (textStatus == 'success') {
					textResponse = responseFromServer.responseText;
				} else {
					if (responseFromServer.responseText) {
						textResponse = responseFromServer.responseText;
					} else {
						textResponse = 'Error:' + responseFromServer.statusText + " (" + responseFromServer.status + ")";
					}
				}

			} else {

				textResponse = "Error:Неожиданный ответ сервера. Перезагрузите страницу и попробуйте еще раз.";

			}
		}

		if (contentType == 'application/xml') {
			typeResponse = 'xml';
		}

        if (contentType && contentType.indexOf('text/html') == 0) {
            typeResponse = 'html';
        }

		if (contentType == 'application/json') {
			typeResponse = 'json';
		}

		if (textResponse.indexOf('link:') == 0) { //Используется для электронных ресурсов
			typeResponse = 'link';
		}

		if (textResponse.indexOf('Error:') == 0) {
			typeResponse = 'error';
		}


		switch (typeResponse) {

			case 'xml':

				response.xml = textResponse;
				break;

            case 'html':

                response.html = textResponse;
                break;

			case 'error':

				response.isError = true;
				response.message = textResponse.substr(6);
				break;

			case 'link':

				response.isError = false;
				response.link = textResponse.substr(5);
				break;

			case 'json':

				var jsonResponse = jQuery.parseJSON(textResponse);
				var message = '';

				if ('error' in jsonResponse && jsonResponse.error) {

					response.isError = true;

					if (jsonResponse.error == 'noUserSession'
						|| jsonResponse.error == 'userSessionClose'
						|| jsonResponse.error == 'noKeySession'
						|| jsonResponse.error == 'errorKeySession'
						|| jsonResponse.error == 'noPermissions') {

						response.closeSession = true;

					}

                    if (typeof oLanguage !== "undefined") {

                        if (jsonResponse.error in oLanguage.errors) {

                            if (typeof oLanguage.errors[jsonResponse.error] == 'function') {
                                message += oLanguage.errors[jsonResponse.error](jsonResponse.data) + " ";
                            } else {
                                message += oLanguage.errors[jsonResponse.error] + " ";
                            }

                        } else {

                            message +=  oLanguage.ERROR + ' : ' + jsonResponse.error + " ";

                        }

                    } else {

                        message +=  jsonResponse.error + " ";

                    }

				}

				if ('data' in jsonResponse) {
					response.data = jsonResponse.data;
				}

				response.message = message;

				break;

			default:

				response.isError = true;

				if (textResponse) {
					response.message = textResponse;
				} else {
					response.message = "Пустой ответ сервера.";
				}

		}

		if (response.isError) {
			response.headMessage = 'Ошибка';
		}

		return response;

	}

	// Делает запрос к базе данных и возвращает данные
	//
	function doRequest(xmlDocumentRequest, callback, settings, param) {

		$.ajax({
			type: "POST",
			url: settings.wsURL,
			async: false,
			username: settings.wsUsername,
			password: settings.wsPassword,
			data: xmlDocumentRequest,
			complete: function(jqXHR, textStatus) {
				
				if (textStatus == 'success') {

					oAPI.response($.trim($(jqXHR.responseText).text()), param, callback);

				} else {
					
					alert(jqXHR.statusText + " (" + jqXHR.status + ")");

				}

			}

		});

	}

	// Возвращает текст заданного SOAP-запроса.
	//
	function getSoapRequest(nameMethod, parameters, namespace) {
		
		var textRequest = "<?xml version='1.0' encoding='UTF-8' standalone='no' ?>";
		
		textRequest += "<SOAP-ENV:Envelope SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>"; 
		textRequest += "<SOAP-ENV:Body>";
		textRequest += "<tns:"+nameMethod+" xmlns:tns='"+namespace+"'>";
		 
		if(parameters) {
			for (var nameParam in parameters) {
				textRequest += "<"+nameParam+" xsi:type='xsd:string'>"+ parameters[nameParam] +"</"+nameParam+">"; 					
			}
		}  
		 
		textRequest += "</tns:"+nameMethod+">";
		textRequest += "</SOAP-ENV:Body>";
		textRequest += "</SOAP-ENV:Envelope>";
		
		return textRequest;
		
		
	}

	// Преобразует строку запроса в пригодную для посылке в SOAP-запросе форму.
	//
	function convertQueryForRequest(textQuery){

		var re1 = /&/g;
		var re2 = /\"/g;
		var re3 = /'/g;
		var re4 = /</g;
		var re5 = />/g;

		return textQuery.replace(re1,"&amp;").replace(re2,"&quot;").replace(re3,"&#39;").replace(re4,"&lt;").replace(re5,"&gt;");
	
	}

	//Получает случайный GUID
	//
	function guidGenerator() {
	    
	    var S4 = function() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    };
	    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());

	}

	function userKey() {
		if (oAPI.session) {
			return CryptoJS.SHA1(oSettings.version + oAPI.passwordHash + oAPI.clientID + oAPI.session).toString(CryptoJS.enc.Base64);
		} else {
			return "";
		}
	}

	function searchRequest() {
		if (oAPI.session) {
			return '?key='+userKey()+'&session='+oAPI.session;
		} else {
			return '';
		}
	}

};