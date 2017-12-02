define(["module-services-apiUtil"], function (apiUtil) {

    var app = angular.module("myApp", []);

    //返回结果拦截器
    function resultInterceptor(result, successCallback, $state, $rootScope) {
       
        //用户登录已过期，提示用户登录
        if (result.Status == 6) {
            layer.msg('您未登录或登录已超时，请重新登录', { icon: 2, shade: 0.5 });
            location.href = "/Login"
        }
        else if (result.Status == 7) {
            layer.msg('您无权限访问', { icon: 2, shade: 0.5 });
        }
        else {

            if (successCallback) {

                if (!$rootScope.$$phase) {

                    //数据变更应用到视图
                    $rootScope.$apply(function () {

                        successCallback(result);
                    })
                }
                else {
                    successCallback(result);
                }

            }
        }
    }

    //添加服务
    function addService(name, actions, baseUrl) {
        baseUrl = baseUrl || '';
        actions = actions || {};

        //扩展CRUD操作
        actions = $.extend({
            add: { method: 'POST' },//添加
            delete: { method: 'DELETE' },//删除
            update: { method: 'PUT' },//更新
            save: { method: 'POST' },//添加或更新
            get: { method: 'get' },//获取一条记录
            query: { method: 'get' },//查询记录
        }, actions);

        //添加服务
        app.factory(name + 'Services', ["$http", "$state", "$rootScope", "$q" ,function ($http, $state, $rootScope, $q) {
            var result = { promise: {} };

            angular.forEach(actions, function (action, actionName) {

                result[actionName] = function (param, successCallback, errorCallback) {

                    apiUtil.requestWebApi(baseUrl + (action.url || name), action.method, param, function (result) {
                        resultInterceptor(result, successCallback, $state, $rootScope);

                    }, function (result) {               
                        if (result && result.Msg)
                            console.error(result.Msg);

                        if (errorCallback) {
                            if (!$rootScope.$$phase) {

                                //数据变更应用到视图
                                $rootScope.$apply(function () {

                                    errorCallback(result);
                                })
                            }
                            else {
                                errorCallback(result);
                            }
                        }
                    });
                };

                // 增加promise调用方式
                result.promise[actionName] = function (param) {

                    return $q(function (resolve, reject) {
                        result[actionName](param, resolve, reject);
                    });
                    
                }
            });

            return result;

        }]);
    }

    //定义需要的服务
    var services = [
      'userOPDRegisters',//预约记录 2016年8月8日 郭明 添加
      "userRegistrations",//挂号记录 2016年11月22日 郭明 添加
      'hospitals',//医院  2016年8月8日 郭明 添加
      'departments',//科室 2016年8月8日 郭明 添加
      'sysICDs',//系统疾病 2016年8月8日 郭明 添加
      'sysDrugs',//系统药品库 2016年8月8日 郭明 添加
      'sysDicts',//系统字典   2016年8月8日 郭明 添加
      'userRecipeOrders',//用户处方订单  2016年8月8日 郭明 添加
      'userMembers',//用户家庭成员
      "doctorRecipeFormulaFiles",//医生处方集
      'users',//用户
      'options',
      'examItems',//检验检查项目 曾璐
      'examResults', //检验检查结果 曾璐
      'doctorMembers', //医生会员 
    ];


    angular.forEach(services, function (name) {
        addService(name, {
            update: { method: 'PUT' },
            add: { method: 'POST' }
        });
    });

    //订单服务 郭明 2017年1月10日
    addService("orders", { LogisticWithDelivery: { method: 'GET', url: '/Orders/LogisticWithDelivery' } })

    //医生服务 郭明 2016年8月11日 添加
    addService("doctors", {
        //获取邀请医生的列表（提供邀请状态）
        getInviteDoctorList: { method: 'GET', url: '/Doctors/InviteDoctorList' },
        //我的医生
        getMyVisitDoctors: { method: 'GET', url: '/Doctors/GetMyVisitDoctors' },
        //获取不同服务的服务次数和收入数据
        getSerivceTypeIncomes: { method: 'GET', url: '/Doctors/GetSerivceTypeIncomes' },
        //获取关注量
        getAttentionCount: { method: 'GET', url: '/Doctors/GetAttentionCount' },
        //获取评价量
        getEvaluationCount: { method: 'GET', url: '/Doctors/GetEvaluationCount' },
        //获取评价量
        getAttentions: { method: 'GET', url: '/Doctors/GetAttentions' },
        //获取评价量
        getMyConsulServicePrice: { method: 'GET', url: '/Doctors/GetMyConsulServicePrice' }
    });

    //诊断 2016年8月10日  郭明 添加
    addService("doctorDiagnosis", {
        //获取处方信息（主治医生）
        get: { method: 'GET', url: '/DoctorDiagnosis/DiagnoseRecipe' },
        //保存处方信息（主治医生）
        update: { method: 'POST', url: '/DoctorDiagnosis/DiagnoseRecipe' },
        //提交处方预览信息（主治医生）
        preview: { method: 'POST', url: global_ApiConfig.DoctorApiUrl + '/DoctorRecipe/Preview' },
        //获取诊断模板
        getFormulars: { method: 'GET', url: '/DoctorDiagnosis/GetFormulars' },
        //新建诊断模板
        insertFormular: { method: 'POST', url: '/DoctorDiagnosis/InsertFormular' },
        //更新诊断模板
        updateFormular: { method: 'POST', url: '/DoctorDiagnosis/UpdateFormular' },
        //删除诊断模板
        deleteFormular: { method: 'DELETE', url: '/DoctorDiagnosis/DeleteFormular' },
        //获取助理诊断
        getAssistantDiagnosis: { method: 'GET', url:global_ApiConfig.DoctorApiUrl + '/DoctorDiagnosis/GetAssistantDiagnosis' }

    });

    //领单业务
    addService("doctorTask", {
        //医生端之我的门诊
        getTaskList: { method: 'POST', url: '/Task/getTaskList' },
        //获取统计
        getStatistics: { method: 'GET', url: '/Task/Statistics' },
        //接单
        take: { method: 'GET', url: '/Task/Take' },
        //分诊
        triage: { method: 'POST', url: '/Task/Triage' },
        //叫号
        call: { method: 'GET', url: '/Task/Call' }

    }, global_ApiConfig.DoctorApiUrl);

    //医生患者 2016年8月10日 郭明 添加
    addService("doctorPatients", {


        //获取患者和就诊记录  郭明 2016年8月6日 add
        getPatientVisitList: { method: 'GET', url: 'DoctorPatients/GetPatientVisitList' },
        //获取检查结果
        getPatientInspectResult: { method: 'GET', url: 'DoctorPatients/GetPatientInspectResult' },
   
        //医生端获取患者电子病历 2016年9月26日 add
        getPatientEMRPageList: { method: 'GET', url: 'DoctorPatients/GetPatientEMRPageList' },
        //获取患者电子病历记录
        getPatientEMRRecord: { method: 'GET', url: 'DoctorPatients/GetPatientEMRRecord' },
        //获取患者处方
        getPatientRecipePageList: { method: 'GET', url: 'DoctorPatients/GetPatientRecipePageList' },
        //获取患者处方
        getPatientRecipe: { method: 'GET', url: 'DoctorPatients/GetPatientRecipe' },
        //处方退费
        refundPatientRecipe: { method: 'POST', url: 'DoctorPatients/RefundPatientRecipe' },
        //保存患者诊断
        savePatientDiagnose: { method: 'POST', url: 'DoctorPatients/SavePatientDiagnose' },
        //提交问诊小结
        submitPatientDiagnose: { method: 'POST', url: 'DoctorPatients/SubmitPatientDiagnose' },
        //保存患者处方
        savePatientRecipe: { method: 'POST', url: 'DoctorPatients/SavePatientRecipe' },
        //删除患者处方
        deletePatientRecipe: { method: 'POST', url: 'DoctorPatients/DeletePatientRecipe' },
        //处方收费
        chargePatientRecipe: { method: 'POST', url: 'DoctorPatients/ChargePatientRecipe' },
        // 补全就诊人缺失信息
        savePatientInfo: { method: 'POST', url: 'DoctorPatients/SavePatientInfo' }
    });

    //体检记录 2016年8月12日 添加
    addService("userEexaminations", {
        //我的健康档案列表（体检记录）
        getExaminedList: { method: 'GET', url: 'UserEexaminations/GetExaminedList' },
        //体检详情
        getExaminedDetail: { method: 'GET', url: 'UserEexaminations/GetExaminedDetail' },
    });

    //体检记录 2016年8月12日 添加
    addService("userMemberEMRs", {
        //我的健康档案列表（体检记录）
        getuserMemberEMRList: { method: 'GET', url: 'UserMemberEMRs' },
        //体检详情
        getuserMemberEMRDetail: { method: 'GET', url: 'UserMemberEMRs/GetUserMemberEMR' },

        saveuserMemberEMR: { method: 'Post', url: 'UserMemberEMRs' },
    });

    //用户关注  2016年8月10日 郭明 添加
    addService("userAttentions", {
        //获取邀请医生的列表（提供邀请状态）
        update: { method: 'PUT', url: '/UserAttentions' },
        //获取邀请医生的列表（提供邀请状态）
        get: { method: 'GET', url: '/UserAttentions' }
    });
    //用户地址  2016年8月10日 郭明 添加
    addService("userAddresses", {
        query: { method: 'GET', url: '/userAddresses/GetUserAddressList' },
        get: { method: 'GET', url: '/userAddresses/GetUserAddress' },
        add: { method: 'POST', url: '/userAddresses/AddUserAddress' },
        update: { method: 'POST', url: '/userAddresses/UpdateUserAddress' },
        delete: { method: 'POST', url: '/userAddresses/DeleteUserAddress' },
        setDefault: { method: 'POST', url: '/userAddresses/SetDefaultAddress' },
    });
    //医生排版  2016年8月10日  郭明 添加
    addService("doctorSchedules", {
        insert: { method: 'POST', url: '/DoctorSchdule/Insert' },
        getList: { method: 'GET', url: '/DoctorSchdule/GetList' },
        update: { method: 'POST', url: '/DoctorSchdule/Update' },
        changePage: { method: 'GET', url: '/DoctorSchdule/GetEntity' },
        changeStatus: { method: 'POST', url: '/DoctorSchdule/Status' },
        del: { method: 'GET', url: '/DoctorSchdule/Delete'},
        get: {method: 'GET', url: 'DoctorSchdule/GetSchduleTable'}
    }, global_ApiConfig.DoctorApiUrl);
    //医生排版  
    addService("schedules", {
        get: { method: 'GET', url: '/DoctorSchedule/GetScheduleList' },
        exist: { method: 'GET', url: '/DoctorSchedule/ExistsOPDRegister' }
    }, global_ApiConfig.requestWebApi);
    //医生服务  2016年8月10日  郭明 添加
    addService("doctorService", {
        //医生价格服务列表
        get: { method: 'GET', url: '/doctorPrice/getDoctorPriceServiceList' },
        update: { method: 'POST', url: '/doctorPrice/addOrEditeDoctorService' },
    });

    //医生配置  2017年5月22日  沈腾飞 添加
    addService("doctorConfigs", {
        update: { method: 'POST', url: '/DoctorConfig' },
        updateDiagnoseState: { method: 'POST', url: '/DoctorConfig/UpdateDiagnoseOnOffState' },
        updateDiagnoseOffDuration: { method: 'POST', url: '/DoctorConfig/UpdateDiagnoseOffDuration' },
    }, global_ApiConfig.DoctorApiUrl);

    //实时通信 2016年8月10日 郭明 添加
    addService("im", {
        //IM，视频通话获取签名
        getIMConfig: { method: 'GET', url: '/IM/Config' },
        //IM，视频通话获取签名
        getMediaConfig: { method: 'GET', url: '/IM/MediaConfig' },
        //活用用户的信息
        getUsers: { method: 'POST', url: '/IM/Users' },
        //获取历史记录
        getMessages: { method: 'GET', url: '/IM/Messages' },
        //患者获取候诊患者数量 郭明  2016年8月6日 add
        GetWaitingCount: { method: 'GET', url: '/IM/Room/WaitingCount' },
        //获取房间信息
        getChannel: { method: 'GET', url: '/IM/Room' },
        //获取房间状态 郭明  2016年8月6日 add
        getStatus: { method: 'GET', url: '/IM/Room/State' },
        //设置房间状态 郭明  2016年8月6日 add
        setStatus: { method: 'PUT', url: '/IM/Room/State' },
        //发送文件消息
        sendFileMessage: { method: 'POST', url: '/IM/SendFileMessage' },
        //发送图片消息
        sendImageMessage: { method: 'POST', url: '/IM/SendImageMessage' },
        //发送语音消息
        sendAudioMessage: { method: 'POST', url: '/IM/SendAudioMessage' },
    });

    //分诊接口 郭明 2016年11月22日 添加
    addService("triage", {
        //分诊叫号
        Call: { method: 'GET', url: 'Triage/Call' },
        //获取队列
        getQueue: { method: 'GET', url: 'Triage/GetQueue' },
    });

    //我的患者
    addService("doctorMembers", {
        //就诊记录
        GetMyMemberVisitList: { method: 'GET', url: 'DoctorMember/GetMyMemberVisitList' },
        //获取主诊医生和患者信息
        GetDoctorAndMemberInfo: { method: 'GET', url: 'DoctorMember/GetDoctorAndMemberInfo' },
        //获取患者的健康档案
        GetMemberExaminedList: { method: 'GET', url: 'DoctorMember/GetMemberExaminedList' },
        //获取患者的电子病历列表
        GetDoctorMemberEMRs: { method: 'GET', url: 'DoctorMember/GetDoctorMemberEMRs' },
        //获取患者的电子病历
        GetDoctorMemberEMR: { method: 'GET', url: 'DoctorMember/GetDoctorMemberEMR' },
        //获取患者下框框
        GetMyMemberDDL: { method: 'GET', url: 'DoctorMember/GetMyMemberDDL' },
        //获取会员信息
        GetMemberInfo: { method: 'GET', url: 'DoctorMember/GetMemberInfo' }
    });

    //义诊设置
    addService("doctorClinic", {
        //获取义诊
        GetDoctorClinicPagelist: { method: 'GET', url: 'DoctorClinics' },
        //保存义诊
        AddDoctorClinicData: { method: 'POST', url: 'DoctorClinic/AddDoctorClinicDataForWeb' }
    });

    addService('options', {
        //获取患者检验检查类型（用于输入框提示）
        getExamItemTypes: { method: 'GET', url: '/ExamItemTypes/Options' },
        //获取区域
        getRegions: { method: 'GET', url: '/options/region' },
    });

    //会诊平台
    addService('consultation', {
        //患者会诊记录
        getMemberConsultationRecords: { method: 'GET', url: '/ConsultationPatient/GetConsultationRecords' }

    }, global_ApiConfig.ConsultationApiUrl);

    //问诊服务详情
    addService("userOPDRegisters", {
        // 获取处方明细
        getRecipeFiles: { method: 'GET', url: '/UserOPDRegisters/GetRecipeFiles' }
    });

    //我得咨询 2016年8月25日 郭明 添加
    addService("userConsults", {
        //咨询我的
        ConsultMe: { method: 'GET', url: 'UserConsults/ConsultMe' },
        //我咨询的
        Consulted: { method: 'GET', url: 'UserConsults/Consulted' },        
    });

    //检查结果
    addService('UserInspectResults', {
        GetMyInspectResults: { method: 'GET', url: 'UserInspectResults/GetMyInspectResults' },
        GetDoctorMemberInspectResults: { method: 'GET', url: 'UserInspectResults/GetDoctorMemberInspectResults' },
        Dcm: { method: 'POST', url: 'UserInspectResults/Dcm' }
    });

    //健康服务站
    addService('HealthStationExam', {
        GetExamItem: { method: 'POST', url: 'HealthStationExam/GetExamItem' },
        GetTMCItem: { method: 'GET', url: 'HealthStationExam/GetTMCItem' },
    });

    //家庭医生签约
    addService('familySignature', {
        searchSignatures: { method: 'POST', url: '/Signature/Search' },
        getDetail: { method: 'GET', url: '/Signature/GetDetail' },
        consume: { method: 'POST', url: '/DoctorPackage/Consume' },
        getDoctorList: { method: 'GET', url: '/Signature/GetMyDoctor' },
        delete:{method:"POST",url:"/Signature/Delete"},
        changeStatus: { method: 'POST', url: '/Signature/ChangeStatus' },
        saveSignature: { method: 'POST', url: '/Signature/Save' },
        GetPageList: { method: 'GET', url: '/FDUserFamily/GetPageList' },
        MatchDoctorGroup: { method: 'GET', url: '/FDUserFamily/MatchDoctorGroup' },
        SaveMatch: { method: 'GET', url: '/FDUserFamily/SaveMatch' },
        ClearMatch: { method: 'GET', url: '/FDUserFamily/ClearMatch' }
    }, global_ApiConfig.FamilyDoctorPlatformApiUrl);

    //我的消息
    addService('UserNotice', {
        getMyMsg: { method: 'GET', url: 'Notice/GetMyMsg' },
        getMySentMsg: { method: 'GET', url: 'Notice/GetMySentMsg' },
        push: { method: 'POST', url: 'Notice/Push' },
        updateMsgToReaded: { method: 'POST', url: 'Notice/UpdateMsgToReaded' },
        updateAllToReaded: { method: 'POST', url: 'Notice/UpdateAllToReaded' },
        getMyUnreadCount: { method: 'GET', url: 'Notice/GetMyUnreadCount' },
        deleteMsg: { method: 'POST', url: 'Notice/DeleteMsg' },
    }, global_ApiConfig.CommonApiUrl);

    addService('webapi', {
        //登录
        login: { method: 'POST', url: 'users/Login' },
        //注销登录
        logout: { method: 'POST', url: '/users/logout' },
        //修改密码
        changePassword: { method: 'POST', url: '/users/changePassword' },
        getPatientsOfDoctor: { method: 'GET', url: '/OPDRegisters/PatientsOfDoctor' },

        getHealthRecord: { method: 'GET', url: '/MyFamilies' },
        //用户注册
        userRegister: { method: 'POST', url: '/users/userRegister' },
        //获取用户个人信息
        getUserInfo: { method: 'GET', url: '/users/getUserInfo' },
        //更新用户个人信息
        updateUserInfo: { method: 'POST', url: '/users/updateUserInfo' },
        //获取医生个人信息
        getDoctorInfo: { method: 'GET', url: '/doctors/getDoctorInfo' },
        //更新医生个人信息
        updateDoctorInfo: { method: 'POST', url: '/doctors/updateDoctorInfo' },
        //会员信息初始化
        initMemberInfo: { method: 'POST', url: '/users/initMemberInfo' },
        //找回密码第一步
        userFindPwdPre: { method: 'POST', url: '/users/userFindPwdPre' },
        //找回密码第二步
        userFindPwdNext: { method: 'POST', url: '/users/userFindPwdNext' },
        //我的交易
        getUserTransPagelist: { method: 'POST', url: '/userTrans/getUserTransPagelist' },
        addUserTrans: { method: 'POST', url: '/userTrans/addUserTrans' },
        //我的账户
        getUserAccount: { method: 'GET', url: '/userAccount/getUserAccount' },
        //用户充值
        userRecharge: { method: 'POST', url: '/userAccount/UserRecharge' },
        //设置支付密码
        setPayPassword: { method: 'POST', url: '/userAccount/SetPayPassword' },
        //设置手机号码
        bindMobile: { method: 'POST', url: '/userAccount/BindMobile' },
        //银行列表
        getBankList: { method: 'GET', url: '/bank/getBankList' },
        //我的银行卡
        addBankCard: { method: 'POST', url: '/userBankCard/addBankCard' },
        deleteBankCard: { method: 'POST', url: '/userBankCard/deleteBankCard' },
        updateBankCard: { method: 'POST', url: '/userBankCard/updateBankCard' },
        getBankCardList: { method: 'GET', url: '/userBankCard/getBankCardList' },
        getBankCard: { method: 'GET', url: '/userBankCard/getBankCard' },
        //提现
        getUserCashPagelist: { method: 'POST', url: '/userCashe/getUserCashPagelist' },
        getUserCashInfo: { method: 'GET', url: '/userCashe/getUserCashInfo' },
        addUserCash: { method: 'POST', url: '/userCashe/addUserCash' },

        //短信验证码
        sendSmsCode: { method: 'POST', url: '/Users/SendSmsCode' },
        //设置默认成员
        setDefaultMember: { method: 'GET', url: 'UserMembers/SetDefault' },
        //用户当前就诊人数量
        getMemberCount: { method: 'GET', url: 'UserMembers/GetMemberCount' },

        //app找加密码
        userFindPwd: { method: 'POST', url: '/users/userFindPwd' },

        //获取患者检验检查结果
        getExamItemWithResults: { method: 'GET', url: '/ExamItems/ExamItemWithResults' },
        //获取检验检查表单HTML
        getExamItemTypesHTML: { method: 'GET', url: '/ExamItemTypes/HTML' },
        //获取患者检验检查结果(图表)
        getExamItemTypesForChart: { method: 'GET', url: '/ExamItemTypes/ForChart' },
        //获取患者检验检查结果(按医院、检查日期)
        getExamResultByHospitalAndDate: { method: 'GET', url: '/ExamResults/ByHospitalAndDate' },
        //获取患者检验检查结果(图表数据)
        getExamResultPlotChartData: { method: 'GET', url: '/ExamResults/PlotChartData' },

        //获取我的挂号预约
        getFamilyYuyue: { method: 'GET', url: '/Appointment/getFamilyYuyue' },
        //挂号预约取消
        cancelRegister: { method: 'Post', url: '/Appointment/CancelRegister' },

        //患者获取我的家庭医生
        getFamilyDoctorForWeb: { method: 'GET', url: '/UserFamilyDoctor/GetFamilyDoctorForWeb' },
        //医生获取我的家庭医生服务病人
        doctorGetForWeb: { method: 'GET', url: '/UserFamilyDoctor/DoctorGetForWeb' },

        //销售套餐
        saleUserPackage: { method: 'Post', url: '/UserPackages/Sale' },
        //获取会员购买的套餐列表
        getUserPackageConsumes: { method: 'GET', url: '/UserPackageConsumes/CurrentUserPackageConsumes' },

        //同步处方
        recipeSyn: { method: 'GET', url: '/BJCA/RecipeSyn' },
        //按预约ID批量同步处方
        recipesSynByOPDRegisterID: { method: 'GET', url: '/BJCA/RecipesSynByOPDRegisterID' },

        //新增家庭医生
        insertFamilyDoctor: { method: 'Post', url: '/UserFamilyDoctor/Insert' },

        //新增意见反馈
        addUserFeedback: { method: 'Post', url: '/UserFeedbacks/Add' },


        //新增意见反馈
        deleteUserFeedback: { method: 'Delete', url: '/UserFeedbacks/Delete' },
        //获取我的意见反馈列表
        getMyFeedbacks: { method: 'GET', url: '/UserFeedbacks/GetMyFeedbacks' },
        //获取意见反馈信息
        getMyFeedback: { method: 'GET', url: '/UserFeedbacks/GetFeedback' },
        //新增评价
        addServiceEvaluation: { method: 'Post', url: '/ServiceEvaluations/Add' },
        //获取评价列表
        getServiceEvaluations: { method: 'GET', url: '/ServiceEvaluations/Query' },
        //获取评价标签
        getAllServiceEvaluationTags: { method: 'GET', url: '/ServiceEvaluations/GetAllTags' },
        // 获取省市区
        getRegions: { method: 'GET', url: "/options/region" }
    });

    //药店个人中心相关
    addService('drugstore', {
        //就诊人信息
        checkOrgMember: { method: 'POST', url: '/UserMembers/CheckOrgMember' },
        //药店获取机构会员
        getOrgMember: { method: 'Get', url: '/UserMembers/GetOrgMember' },
    })
 
    //医生
    addService('doctorapi', {
        retractRecipe: { method: 'POST', url: "/DoctorRecipe/Retract" },
    }, global_ApiConfig.DoctorApiUrl);

    addService('personTagAlias', {
        getTagAlias: { method: 'GET', url: "PersonTagAlias" },
    }, global_ApiConfig.CommonApiUrl)

    //家庭医生管理
    addService('FamilyDoctor', {
        getOrgDoctorList: { method: 'GET', url: "/DoctorGroup/GetOrgDoctorList" },
        getRegions: { method: 'GET', url: "/Region/GetRegions" },
        getOrgList: { method: 'GET', url: '/DoctorGroup/GetOrgList' },
        getServiceCenterList : { method: 'GET', url: '/DoctorGroup/GetServiceCenterList' },
        getChildrenOrgList : { method: 'GET', url: '/DoctorGroup/GetChildrenOrgList' },
        getCenterSubRegions : { method: 'GET', url: '/Region/GetCenterSubRegions' },
        getOrgVilRegions : { method: 'GET', url: '/Region/getOrgVilRegions' },
        getOrgRegions: { method: 'GET', url: "/Region/GetOrgRegions" },
        modifyOrgRegions: { method: 'POST', url: "/Region/ModifyOrgRegions" },
        getOrgRegionDetail: { method: 'Get', url: "/Region/GetOrgRegionDetail" },
        getDoctorGroup: { method: 'GET', url: "/DoctorGroup/GetDoctorGroups" },
        getDoctorGroupDetail: { method: 'GET', url: "/DoctorGroup/GetDoctorGroupDetail" },
        EditDoctorGroup: { method: 'POST', url: '/DoctorGroup/EditDoctorGroup' },
        DeleteDoctorGroup: { method: 'POST', url: '/DoctorGroup/DeleteDoctorGroup' },
        signatureSave: { method: 'POST', url: '/Signature/Save' },
        getSignature: { method: 'GET', url: '/Signature/GetDetail' },
        getAllRegions: { method: 'Get', url: "/Region/GetAllRegions"},
        editRegion: { method: 'POST', url: "/Region/EditRegion"},
        getRegionDetail: {method: 'Get', url: "/Region/GetRegionDetail"}
    }, global_ApiConfig.FamilyDoctorPlatformApiUrl)

    return apiUtil;
});
