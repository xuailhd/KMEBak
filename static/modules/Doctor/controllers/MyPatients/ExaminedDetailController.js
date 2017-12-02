"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"]);


            app.controller('ExaminedDetailController', ['$scope', '$http', '$location', '$state', '$translate', 'userMembersServices', 'userEexaminationsServices',
                    function ($scope, $http, $location, $routeParams, $translate, services, userEexaminationsServices) {


                        $scope.goBack = function () {
                            history.back();
                        };

                        var examId = $routeParams.params.examId;
                        var idNo = $routeParams.params.idNo;
                        var examDate = $routeParams.params.examDate;
                        var doctor = $routeParams.params.doctor;
                        $scope.item = {};
                        $scope.item.examDate = decodeURIComponent(examDate);
                        $scope.item.doctor = decodeURIComponent(doctor);

                        $scope.onSearch = function () {
                            userEexaminationsServices.getExaminedDetail({
                                examId: examId,
                                idNo: idNo
                            }, function (obj) {
                                if (obj != null && obj.Data != null) {
                                    var person = obj.Data.person;
                                    var examinedList = obj.Data.examinedList;

                                    if (person != null) {
                                        person.NationalityName = $scope.getNationalityName(person.Nationality);
                                        person.AgeName = $scope.getAge(person.BirthDate);
                                        person.GenderName = $scope.getSexStr(person.Gender);
                                        person.MarriageStatusName = $scope.getMerrayStr(person.MarriageStatus);
                                    }
                                    $scope.p = person;

                                    $scope.base = {};
                                    $scope.base.sg = unit(bind("DE04.10.167.00", "547"), "cm");
                                    $scope.base.tz = unit(bind("DE04.10.188.00", "568"), "kg");
                                    $scope.base.bmi = $scope.getBMI($scope.base.sg, $scope.base.tz);// bind("bmi", "");
                                    $scope.base.tw = unit(bind("DE04.10.186.00", "566"), "℃");

                                    $scope.xy = {};
                                    $scope.xy.ssy = unit(bind("DE04.10.174.00", "554"), "mmHg");
                                    $scope.xy.szy = unit(bind("DE04.10.176.00", "556"), "mmHg");;

                                    $scope.xyang = {};
                                    $scope.xyang.ml = unit(bind("1468", "1468"), "bpm");//498
                                    $scope.xyang.xybhd = unit(bind("1000", "1000"), "%");

                                    //711：餐前血糖，693：餐后血糖，776：随机血糖
                                    $scope.xt = {};
                                    var xt = bind("DE04.50.102.00", "776");
                                    if (xt == "")
                                        xt = bind("餐前血糖", "711");
                                    if (xt == "")
                                        xt = bind("餐后血糖", "693");
                                    $scope.xt.xt = unit(xt, "mmol/L");

                                    $scope.xd = {};
                                    var xdtImgSrc = bind("心电图", "8888");
                                    if (xdtImgSrc == null || xdtImgSrc == "")
                                        $scope.xdtAlt = "暂无心电图";
                                    else if (xdtImgSrc.toLowerCase().indexOf("http") >= 0)
                                        $scope.xd.xdt = xdtImgSrc;
                                    else
                                        $scope.xd.xdt = obj.Data.imgUrl + "/" + xdtImgSrc;

                                    $scope.xd.zs = "25.0mm/s"; //unit(bind(""), "mm/s");
                                    $scope.xd.zy = "10mm/mv";//unit(bind(""), "mm/mv");
                                    var xl = bind("DE04.10.206.00", "586");  //单导心电
                                    if (xl == "") {
                                        xl = bind("心率值", "1477");  //KM9020  12导心电
                                    }
                                    $scope.xd.xl = unit(xl, "bpm");
                                    $scope.xd.jcjg = bind("DE04.30.043.00", "666");
                                    if ($scope.xd.jcjg == "") {
                                        $scope.xd.jcjg = bind("心电结论", "1489");
                                    }

                                    if ($scope.xd.jcjg == "") {
                                        $scope.xd.jcjg = bind("5025对照说明详见附1", "1476");
                                    }
                                    //心电结论	Result	1489
                                    //结论	Analysis	1476	结论：5025对照说明详见附1

                                    $scope.ncg = {};
                                    $scope.ncg.nbxb = bind("DE04.50.045.00", "719");
                                    $scope.ncg.nyxsy = bind("1400", "1400");
                                    $scope.ncg.ntt = bind("DE04.50.063.00", "737");
                                    $scope.ncg.ndy = bind("DE04.50.034.00", "708");
                                    $scope.ncg.ndhs = bind("DE04.50.126.00", "800");
                                    $scope.ncg.nt = bind("DE04.50.062.00", "736");
                                    $scope.ncg.ndb = bind("DE04.50.050.00", "724");
                                    $scope.ncg.yx = bind("DE04.50.057.00", "731");
                                    $scope.ncg.nbz = bind("DE04.50.046.00", "720");
                                    $scope.ncg.wssc = bind("1401", "1401");
                                    $scope.ncg.jsg = bind("1402", "1402");
                                    $scope.ncg.g = bind("1403", "1403");
                                    $scope.ncg.nsjd = bind("DE04.50.066.00", "740");

                                    function bind(code, itemid) {
                                        if (examinedList == null)
                                            return "";
                                        var str = "";
                                        itemid = parseInt(itemid);
                                        $.each(examinedList, function (i, d) {
                                            if (d.ItemId == itemid) {
                                                str = d.Result;
                                                return false;
                                            } else if (d.ItemCode != null && $.trim(d.ItemCode) != "") {
                                                if (d.ItemCode == code || d.Name == code) {
                                                    str = d.Result;
                                                    return false;
                                                }
                                            }
                                        });
                                        return str;
                                    }

                                    function unit(val, unitStr) {
                                        if (val == null || val == "")
                                            return "";
                                        return val + unitStr;
                                    }

                                }
                            });
                        }
                        $scope.onSearch();

                        $scope.getMerrayStr = function (merrayStatus) {
                            switch (merrayStatus) {
                                case "10": return "未婚";
                                case "20": return "已婚";
                                case "21": return "初婚";
                                case "22": return "再婚";
                                case "23": return "复婚";
                                case "30": return "丧偶";
                                case "40": return "离婚";
                                case "90": return "未说明的婚姻状况";
                                default: return "";
                            }
                        }

                        $scope.getSexStr = function (sexStatus) {
                            switch (sexStatus) {
                                case "0": return "未知的性别";
                                case "1": return "男性";
                                case "2": return "女性";
                                case "9": return "未说明的性别";
                                default: return "";
                            }
                        }

                        $scope.getNationalityName = function (nationality) {
                            switch (nationality) {
                                case "01": return "汉族";
                                case "02": return "蒙古族";
                                case "03": return "回族";
                                case "04": return "藏族";
                                case "05": return "维吾尔族";
                                case "06": return "苗族";
                                case "07": return "彝族";
                                case "08": return "壮族";
                                case "09": return "布依族";
                                case "10": return "朝鲜族";
                                case "11": return "满族";
                                case "12": return "侗族";
                                case "13": return "瑶族";
                                case "14": return "白族";
                                case "15": return "土家族";
                                case "16": return "哈尼族";
                                case "17": return "哈萨克族";
                                case "18": return "傣族";
                                case "19": return "黎族";
                                case "20": return "傈僳族";
                                case "21": return "佤族";
                                case "22": return "畲族";
                                case "23": return "高山族";
                                case "24": return "拉祜族";
                                case "25": return "水族";
                                case "26": return "东乡族";
                                case "27": return "纳西族";
                                case "28": return "景颇族";
                                case "29": return "柯尔克孜族";
                                case "30": return "土族";
                                case "31": return "达斡尔族";
                                case "32": return "仫佬族";
                                case "33": return "羌族";
                                case "34": return "布朗族";
                                case "35": return "撒拉族";
                                case "36": return "毛南族";
                                case "37": return "仡佬族";
                                case "38": return "锡伯族";
                                case "39": return "阿昌族";
                                case "40": return "普米族";
                                case "41": return "塔吉克族";
                                case "42": return "怒族";
                                case "43": return "乌兹别克族";
                                case "44": return "俄罗斯族";
                                case "45": return "鄂温克族";
                                case "46": return "德昂族";
                                case "47": return "保安族";
                                case "48": return "裕固族";
                                case "49": return "京族";
                                case "50": return "塔塔尔族";
                                case "51": return "独龙族";
                                case "52": return "鄂伦春族";
                                case "53": return "赫哲族";
                                case "54": return "门巴族";
                                case "55": return "珞巴族";
                                case "56": return "基诺族";
                                default: return "汉族";
                            }

                        }

                        $scope.getAge = function (str) {

                            var age = -1;
                            if (str == null || str == "")
                                return age;

                            var today = new Date();
                            var todayYear = today.getFullYear();
                            var todayMonth = today.getMonth() + 1;
                            var todayDay = today.getDate();

                            var birthday = new Date(str.substring(0, 4) + '/' + str.substring(4, 6) + '/' + str.substring(6));
                            var birthdayYear = birthday.getFullYear();
                            var birthdayMonth = birthday.getMonth() + 1;
                            var birthdayDay = birthday.getDate();
                            if (todayYear - birthdayYear < 0)
                                return age;
                            if (todayMonth - birthdayMonth < 0) {
                                age = (todayYear - birthdayYear) - 1;
                            } else if (todayMonth == birthdayMonth) {
                                if (todayDay - birthdayDay >= 0)
                                    age = todayYear - birthdayYear;
                                else
                                    age = todayYear - birthdayYear - 1;
                            } else {
                                age = todayYear - birthdayYear;
                            }
                            return age;
                        }

                        $scope.getBMI = function (h, w) {
                            if (h == null || h == null || w == "" || w == "")
                                return "";
                            var hh = parseFloat(h.replace("cm", "")) / 100;
                            var ww = parseFloat(w.replace("kg", ""));

                            return ((ww) / (hh * hh)).toFixed(1);
                        }



                    }
            ]);
        });