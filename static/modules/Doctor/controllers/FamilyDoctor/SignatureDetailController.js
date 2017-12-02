"use strict";
define(["module-directive-bundling-doctor-all",
        "module-filter-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);
            app.controller('SignatureController', ['$scope', '$state', '$translate', 'familySignatureServices', 'webapiServices', function ($scope, $state, $translate, services, webapiServices) {
                  var successMsg = "添加成功";
                  var id = $state.params.id
                  $scope.Data = { Email: "", Address: "", PostCode: "", Relation: "-1", IDType: '0', Nationality: 'ISO 3166-2:CN', Province: '', City: '', District: '' };
                  $scope.memberCount = 0;
                  $scope.memberOver = 0;
                  // 证件类型
                  $scope.docmType = [];
                  // 国籍
                  $scope.Nationality = nationalityJSON;

                  optionsServices.get({ optionName: 'Gender' }, function (obj) {
                      $scope.Genders = obj.Data;
                  });

                  optionsServices.get({ optionName: 'relationship' }, function (obj) {
                      $scope.Relationships = obj.Data;
                  });

                  // 获取证件类型
                  optionsServices.get({ optionName: 'idtype' }, function (obj) {
                      $scope.docmType = obj.Data;
                  })

                  $scope.$watch('Data.IDType', function (newValue, oldValue, scope) {
                      var numberInput = $('#IDNumber');
                      numberInput.rules("remove");
                      var val = $scope.Data.IDType;
                      if (val == 0) {
                          numberInput.rules("add", { required: false, idNumber: true, messages: { required: "请输入正确身份号" } });
                      } else if (val == 1) {
                          numberInput.rules("add", { required: false, household: true, messages: { required: "请输入正确户口本号" } });
                      } else if (val == 2) {
                          numberInput.rules("add", { required: false, passport: true, messages: { required: "请正确输入您的护照编号" } });
                      } else if (val == 3) {
                          numberInput.rules("add", { required: false, soldiers: true, messages: { required: "请输入正确的军官证号" } });
                      } else if (val == 4) {
                          numberInput.rules("add", { required: false, drive: true, messages: { required: "请输入正确驾驶证号" } });
                      } else if (val == 5) {
                          numberInput.rules("add", { required: false, hkandmacao: true, messages: { required: "请输入正确港澳通行证证号" } });
                      } else if (val == 6) {
                          numberInput.rules("add", { required: false, twcode: true, messages: { required: "请输入正确台湾通行证证号" } });
                      } else if (val == 99) {

                      }
                  })

                  //用户当前就诊人数量
                  webapiServices.getMemberCount({}, function (obj) {
                      $scope.memberCount = obj.Data.MemberCount;
                      $scope.memberOver = obj.Data.MemberOver;
                  });

                  //编辑初始化数据
                  if (id) {
                      userMembersServices.get({ ID: id }, function (obj) {
                          $scope.relationEdit = obj.Data.Relation == 0 ? true : false;
                          $scope.Data = $.extend($scope.Data, obj.Data);
                          $scope.Data.Gender = "" + $scope.Data.Gender;
                          $scope.Data.IDType = "" + $scope.Data.IDType;
                          $scope.Data.Relation = "0" + $scope.Data.Relation;
                          $('#selectYear').attr('rel', $scope.Data.Birthday.split('-')[0]);
                          $('#selectMonth').attr('rel', $scope.Data.Birthday.split('-')[1]);
                          $('#selectDay').attr('rel', $scope.Data.Birthday.split('-')[2]);
                          // 初始化时间
                          $.ms_DatePicker({
                              YearSelector: "#selectYear",
                              MonthSelector: "#selectMonth",
                              DaySelector: "#selectDay"
                          });
                          //不可修改项
                          if (!$scope.Data.IDNumber)
                              $("#IDNumber").attr("placeholder", "");
                          if ($scope.Data.IDNumber && $scope.Data.IDNumber.length > 0) {
                              if ($scope.Data.Gender)
                                  $("#Gender").attr("disabled", "disabled");
                              if ($scope.Data.Birthday)
                                  $("#Birthday").attr("disabled", "disabled");
                              $("#IDNumber").attr("disabled", "disabled");
                              $("#docmType").attr("disabled", "disabled");
                              $("#MemberName").attr("disabled", "disabled");
                              $("#selectYear").attr("disabled", "disabled");
                              $("#selectMonth").attr("disabled", "disabled");
                              $("#selectDay").attr("disabled", "disabled");
                          }
                          successMsg = obj.Data != null ? "修改成功" : "添加成功";
                          // 地区选择
                          addressInit('cmbProvince', 'cmbCity', 'cmbArea', $scope.Data.Province, $scope.Data.City, $scope.Data.District);
                      });
                  } else {
                      // 初始化时间
                      $.ms_DatePicker({
                          YearSelector: "#selectYear",
                          MonthSelector: "#selectMonth",
                          DaySelector: "#selectDay"
                      });
                      // 地区选择
                      addressInit('cmbProvince', 'cmbCity', 'cmbArea');
                  }

                  jQuery.validator.addMethod("mobile", function (value, element) {
                      var length = value.length;
                      var mobile = /^(((1[0-9]{2})|(15[0-9]{1}))+\d{8})$/
                      return this.optional(element) || (length == 11 && mobile.test(value));
                  }, "手机号码格式错误");

                  jQuery.validator.addMethod("phone", function (value, element) {
                      var tel = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
                      return this.optional(element) || (tel.test(value));
                  }, "电话号码格式错误");

                  jQuery.validator.addMethod("idNumber", function (value, element) {
                      if (value == null)
                          value = "";
                      return this.optional(element) || (isIdCardNo(value.toUpperCase()));
                  }, "身份证号不正确");

                  jQuery.validator.addMethod("email", function (value, element) {
                      var mail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                      return this.optional(element) || (mail.test(value));
                  }, "邮箱格式不正确");

                  jQuery.validator.addMethod("emaillength", function (value, element) {
                      var mail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                      return this.optional(element) || value.length < 30;
                  }, "邮箱不能超过30个字符");

                  $.validator.addMethod("selected", function (value, element) {
                      if (value != "?") {
                          return true;

                      }
                      else {
                          return false;
                      }

                  }, "必须选择一项");

                  // 护照编号验证
                  jQuery.validator.addMethod("passport", function (value, element) {
                      return this.optional(element) || checknumber(value);
                  }, "请正确输入您的护照编号");

                  // 军官证（士兵证）验证
                  jQuery.validator.addMethod("soldiers", function (value, element) {
                      return this.optional(element) || soldierscard(value);
                  }, "请输入正确的军官证号");

                  // 驾驶证号验证
                  $.validator.addMethod("drive", function (value, element) {
                      return this.optional(element) || (isIdCardNo(value.toUpperCase()));
                  }, '请输入正确驾驶证号');

                  // 港澳通行证验证
                  $.validator.addMethod("hkandmacao", function (value, element) {
                      return this.optional(element) || hkandmacao(value);
                  }, '请输入正确港澳通行证号');

                  // 台湾通行证验证
                  $.validator.addMethod("twcode", function (value, element) {
                      return this.optional(element) || twcode(value);
                  }, '请输入正确台湾通行证号');

                  // 户口本号验证
                  $.validator.addMethod("household", function (value, element) {
                      return this.optional(element) || household(value);
                  }, '请输入正确户口本号');

                  // 年
                  $.validator.addMethod("selectYear", function (value, element) {
                      var bool = null;
                      if (value == 0) {
                          bool = false;
                      } else {
                          isSelectData();
                          bool = true;
                      }
                      return bool;
                  }, '请选择年');

                  // 月
                  $.validator.addMethod("selectMonth", function (value, element) {
                      var bool = null;
                      if (value == 0) {
                          bool = false;
                      } else {
                          isSelectData();
                          bool = true;
                      }
                      return bool;
                  }, '请选择月');

                  // 日
                  $.validator.addMethod("selectDay", function (value, element) {
                      var bool = null;
                      if (value == 0) {
                          bool = false;
                      } else {
                          isSelectData();
                          bool = true;
                      }
                      return bool;
                  }, '请选择日');

                  /**
                   * 如果选择的年月日全部正确
                   *
                  */
                  function isSelectData() {
                      var year = $('#selectYear').val();
                      var month = $('#selectMonth').val();
                      var day = $('#selectDay').val();
                      var $addBirthday = $('#Birthday');
                      if (year != 0 && month != 0 && day != 0) {
                          $scope.Data.Birthday = year + '-' + month + '-' + day;
                          if (!$scope.$$phase) {
                              $scope.$apply();
                          }
                      } else {
                          $scope.Data.Birthday = '';
                      }
                  }

                  $("#myForm").validate({
                      errorPlacement: function (error, element) {
                          //error是错误提示元素span对象  element是触发错误的input对象
                          error.appendTo(element.parent());
                      },
                      submitHandler: function (form) {
                          $scope.fn.onSubmit();
                      },
                      rules: {
                          selectYear: {
                              required: true,
                              selectYear: true
                          },
                          selectMonth: {
                              required: true,
                              selectMonth: true
                          },
                          selectDay: {
                              required: true,
                              selectDay: true
                          }
                      }
                  });

                  $scope.GoBack = function () {
                      history.back();
                  };

                  $scope.XToUp = function () {
                      var number = $scope.Data.IDNumber;
                      if (number != null && (number.length == 15 || number.length == 18) && $("#IDNumber").valid()) {
                          $scope.Data.IDNumber = number.toUpperCase();
                      }

                  }

                  $scope.setSexAndBirthday = function () {
                      // 如果是身份证或者驾驶证的话验证
                      if ($scope.Data.IDType == 0 || $scope.Data.IDType == 4) {
                          if ($scope.Data.IDNumber != "" && $("#IDNumber").valid()) {
                              var value = $scope.Data.IDNumber;
                              var birthdayAndSex = GetBirthdaySexFromIdCard(value);
                              $scope.Data.Gender = birthdayAndSex.sex;
                              $scope.Data.Birthday = birthdayAndSex.birthday;
                              $("#Gender").val("string:" + $scope.Data.Gender).attr("disabled", "disabled").valid();
                              $("#Birthday").val($scope.Data.Birthday).attr("disabled", "disabled").valid();
                              $('#selectYear').val($scope.Data.Birthday.split('-')[0]).attr("disabled", "disabled").trigger('change');
                              $('#selectMonth').val($scope.Data.Birthday.split('-')[1]).attr("disabled", "disabled").trigger('change');
                              $('#selectDay').val($scope.Data.Birthday.split('-')[2]).attr("disabled", "disabled");
                          } else {
                              $("#Gender").removeAttr("disabled");
                              $("#Birthday").removeAttr("disabled");
                              $('#selectYear').removeAttr("disabled");
                              $('#selectMonth').removeAttr("disabled");
                              $('#selectDay').removeAttr("disabled");
                          }
                      }
                  }

                  $scope.fn = {};
                  $scope.fn.onSubmit = function () {

                      if ($scope.Data.Gender == null || $scope.Data.Gender == "" || $scope.Data.Birthday == null || $scope.Data.Birthday == "") {
                          layer.msg("请填写证件号或性别及出生日期", { icon: 2, shade: 0.5 });
                          return;
                      }

                      var successFun = function (response) {
                          if (response.Status == 1)
                              layer.msg("发生错误");
                          else if (response.Data == "0" || response.Data == false) {
                              layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                          } else if (response.Data) {
                              layer.msg(successMsg);
                              if ($scope.Data.Relation == 0 || $scope.Data.Relation == "0") {
                                  var loginInfo = apiUtil.getLoginInfo();

                                  loginInfo.UserCNName = $scope.Data.MemberName;
                                  apiUtil.setLoginInfo(loginInfo);
                                  $scope.$parent.loginInfo.UserCNName = loginInfo.UserCNName;
                              }

                              $state.go("User.MyFamilies");
                          } else
                              layer.msg(response.Msg);
                      };

                      var errorFun = function (response) {
                          layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                      }

                      $scope.Data.Province = $('#cmbProvince :selected').text();
                      $scope.Data.City = $('#cmbCity :selected').text();
                      $scope.Data.District = $('#cmbArea :selected').text();

                      if (id) {
                          //修改
                          userMembersServices.update($scope.Data, successFun, errorFun);
                      } else {
                          //新增
                          userMembersServices.add($scope.Data, successFun, errorFun);
                      }
                  }



                  /**
                    * 身份证号码验证
                    *
                    */
                  function isIdCardNo(num) {
                      var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
                      var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                      var varArray = new Array();
                      var intValue;
                      var lngProduct = 0;
                      var intCheckDigit;
                      var intStrLen = num.length;
                      var idNumber = num;
                      if ((intStrLen != 15) && (intStrLen != 18)) {
                          return false;
                      }

                      // check and set value
                      for (var i = 0; i < intStrLen; i++) {
                          varArray[i] = idNumber.charAt(i);
                          if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                              return false;
                          } else if (i < 17) {
                              varArray[i] = varArray[i] * factorArr[i];
                          }
                      }

                      if (intStrLen == 18) {
                          //check date
                          var date8 = idNumber.substring(6, 14);
                          if (isDate8(date8) == false) {
                              return false;
                          }
                          // calculate the sum of the products
                          for (var i = 0; i < 17; i++) {
                              lngProduct = lngProduct + varArray[i];
                          }
                          // calculate the check digit
                          intCheckDigit = parityBit[lngProduct % 11];
                          // check last digit
                          if (varArray[17] != intCheckDigit) {
                              return false;
                          }
                      }
                      else {        //length is 15
                          //check date
                          var date6 = idNumber.substring(6, 12);
                          if (isDate6(date6) == false) {

                              return false;
                          }
                      }
                      return true;
                  }

                  /**
                    * 判断是否为“YYMMDD”式的时期
                    *
                    */
                  function isDate6(sDate) {
                      if (!/^[0-9]{6}$/.test(sDate)) {
                          return false;
                      }
                      var year, month, day;
                      year = parseInt("19" + sDate.substring(0, 2));
                      month = sDate.substring(2, 4);
                      day = sDate.substring(4, 6);
                      if (year < 1700 || year > 2500) return false;
                      if (month < 1 || month > 12) return false;
                      if (day < 1 || day > 31) return false;
                      return true
                  }


                  /**
                    * 判断是否为“YYYYMMDD”式的时期
                    *
                    */
                  function isDate8(sDate) {
                      if (!/^[0-9]{8}$/.test(sDate)) {
                          return false;
                      }
                      var year, month, day;
                      year = sDate.substring(0, 4);
                      month = sDate.substring(4, 6);
                      day = sDate.substring(6, 8);
                      var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                      if (year < 1700 || year > 2500) return false
                      if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
                      if (month < 1 || month > 12) return false
                      if (day < 1 || day > iaMonthDays[month - 1]) return false
                      return true
                  }

                  //根据身份证获取生日和性别
                  function GetBirthdaySexFromIdCard(idCard) {

                      var birthday = "", sex = "";

                      if (idCard == null || (idCard.length != 15 && idCard.length != 18))
                          return false;

                      //处理18位的身份证号码从号码中得到生日和性别代码
                      if (idCard.length == 18) {
                          birthday = idCard.substr(6, 4) + "-" + idCard.substr(10, 2) + "-" + idCard.substr(12, 2);
                          sex = idCard.substr(14, 3);
                      }
                      //处理15位的身份证号码从号码中得到生日和性别代码
                      if (idCard.length == 15) {
                          birthday = "19" + idCard.substr(6, 2) + "-" + idCard.substr(8, 2) + "-" + idCard.substr(10, 2);
                          sex = idCard.substr(12, 3);
                      }

                      //性别代码为偶数是女性奇数为男性
                      if (parseInt(sex) % 2 == 0)
                          sex = "1";//女
                      else
                          sex = "0";//男

                      return { birthday: birthday, sex: sex };
                  }

                  // 验证护照
                  function checknumber(number) {
                      var str = number;
                      //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
                      var Expression = /(P\d{7})|(G\d{8})/;
                      var objExp = new RegExp(Expression);
                      if (objExp.test(str) == true) {
                          return true;
                      } else {
                          return false;
                      }
                  };

                  // 验证军官证（士兵证）
                  function soldierscard(number) {
                      var reg = /[南|北|沈|兰|成|济|广|海|空|参|政|后|装]字第\d+号/
                      number = number.replace(/(^\s*)|(\s*$)/g, "");
                      if (reg.test(number) === false) {
                          return false;
                      } else {
                          return true;
                      }
                  }

                  // 验证港澳通行证
                  function hkandmacao(number) {
                      var reg = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/;
                      if (reg.test(number) === false) {
                          return false;
                      } else {
                          return true;
                      }
                  }

                  // 台湾通行证
                  function twcode(number) {
                      var re1 = /^[0-9]{8}$/;
                      var re2 = /^[0-9]{10}$/;
                      if ((re1.test(number)) || (re2.test(number)) === false) {
                          return false;
                      } else {
                          return true;
                      }
                  }

                  // 户口本号
                  function household(number) {
                      var reg = /^[a-zA-Z0-9]{3,21}$/;
                      if (reg.test(number) === false) {
                          return false;
                      } else {
                          return true;
                      }
                  }

              }
            ]);
        });