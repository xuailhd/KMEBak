define(["angular",
        "angular-amd",
        "angular-ui-route",
], function (angular, angularAMD) {

    console.log("loading Doctor/routes.js")
 
    
    // routes
    var registerRoutes = function ($stateProvider, $urlRouterProvider) {

        function amdRoute(url, view, controller, onEnter, onLeave) {
            
            controller = controller || view;
            return angularAMD.route({
                url: url,
                templateUrl: function ($stateParams) {
                    return "/static/modules/" + view + ".html"
                },
                controllerUrl: "/static/modules/" + controller + "Controller.js",
                onEnter: onEnter || function () { },
                onLeave: onEnter || function () { },
            });
        }
        $urlRouterProvider.otherwise("Doctor");

        // route
        $stateProvider     
        //医生首页
        .state("Doctor", amdRoute("/Doctor", "Doctor/controllers/index"))
        //医生首页
        .state("Doctor.Home", amdRoute("/Home", "Doctor/controllers/Home"))
        //关注我的人
        .state("Doctor.MyAttentions", amdRoute("/MyAttentions", "Doctor/controllers/MyAttentions"))
        //修改密码
        .state("Doctor.ChangePassword", amdRoute("/ChangePassword", "Common/controllers/ChangePassword"))  
        //修改信息
        .state("Doctor.PersonalInfo", amdRoute("/PersonalInfo", "Doctor/controllers/PersonalInfo"))

        //#region 诊室
        //进入诊室（主治医生）
        .state("Room", amdRoute("/Doctor/Room", "Doctor/controllers/Room"))
        //进入诊室（指定房间号码）
        .state("RoomByChannelID", amdRoute("/Doctor/Room/ChannelID-:ChannelID", "Doctor/controllers/Room", "Doctor/controllers/Room"))
        //#endregion

        //#region 我的设置
        //我的设置>义诊设置
        .state("Doctor.DoctorClinicSettings", amdRoute("/MySettings/Clinic/:tab", "Doctor/controllers/MySettings/DoctorClinicSet"))
        //我的设置>我的排版
        .state("Doctor.ScheduleSettings", amdRoute("/MySettings/Schedules/:tab", "Doctor/controllers/MySchedules/Schedules"))
        .state("Doctor.ScheduleSettingsAdd", amdRoute("/MySettings/AddSchedules/:id", "Doctor/controllers/MySchedules/AddSchedules"))
        //我的设置>服务设置
        .state("Doctor.MyServiceSettings", amdRoute("/MySettings/Services/:tab", "Doctor/controllers/MySettings/Services"))
        //#endregion

        //#region 我的处方
        .state("Doctor.RecipeFormFiles", amdRoute("/RecipeFormFiles", "Doctor/controllers/MyRecipes/RecipeFormFiles"))
        //我的处方>处方新增
        .state("Doctor.RecipeFormFileAdd", amdRoute("/RecipeFormFiles/Add", "Doctor/controllers/MyRecipes/RecipeFormFile"))
        //我的处方>处方编辑
        .state("Doctor.RecipeFormFileEdit", amdRoute("/RecipeFormFiles/:id/Edit", "Doctor/controllers/MyRecipes/RecipeFormFile"))
        //#endregion

        //#region 我的患者
        .state("Doctor.MyPatients", amdRoute("/MyPatients/:tab", "Doctor/controllers/MyPatients/Index"))
        //我的患者>详情
        .state("Doctor.MyPatientDetail", amdRoute("/MyPatients/:id/:tab", "Doctor/controllers/MyPatients/Detail"))
        //医生查看患者的体检详细
        .state("Doctor.ExaminedDetail", amdRoute("/ExaminedDetail/:examId/:idNo/:examDate/:doctor", "Doctor/controllers/MyPatients/ExaminedDetail"))
        //检验检查/明细
        .state("Doctor.MyPatientDetail.ExamItemDetail", amdRoute("/ExamItemDetail/:memberId/:examItemTypeId", "Doctor/controllers/MyPatients/ExamItemDetail"))
        //#endregion
        
        //#region 我的服务
        .state("Doctor.MyServices", amdRoute("/MyServices", "Doctor/controllers/MyServices/Index"))
        //我的服务>我的咨询
        .state("Doctor.MyServices.Consults", amdRoute("/Consults/:type", "Doctor/controllers/MyServices/Consults"))
        //我的服务>报告解读
        .state("Doctor.MyServices.Interpretations", amdRoute("/Interpretations", "Doctor/controllers/MyServices/Interpretations"))
        //我的服务>我的家庭医生
        .state("Doctor.MyServices.FamilyDoctors", amdRoute("/FamilyDoctors", "Doctor/controllers/MyServices/FamilyDoctors"))
        //我的服务>我的检查
        .state("Doctor.MyServices.Inquiries", amdRoute("/Inquiries/:type", "Doctor/controllers/MyServices/Inquiries"))
        //我的服务>我的检查>详细
        .state("Doctor.MyServices.InquiriesDetail", amdRoute("/InquiriesDetail/:id", "Doctor/controllers/MyServices/InquiriesDetail"))
        //#endregion

        //#region 我的账户
        .state("Doctor.MyAccount", amdRoute("/MyAccount/:tab", "Common/controllers/MyAccounts/Index"))
        //添加申请提现
        .state("Doctor.ApplyCashAdd", amdRoute("/MyAccount/:tab/ApplyCashAdd", "Common/controllers/MyAccounts/ApplyCashAdd"))
        //充值
        .state("Doctor.Recharge", amdRoute("/MyAccount/Recharge/:tab", "Common/controllers/MyAccounts/Recharge"))
        //支付设置
        .state("Doctor.PaySet", amdRoute("/MyAccount/PaySet/:tab", "Common/controllers/MyAccounts/PaySet"))
        //绑定手机号
        .state("Doctor.BindMobile", amdRoute("/MyAccount/BindMobile/:tab", "Common/controllers/MyAccounts/BindMobile"))
        //#endregion 

        //#region 意见反馈
        .state("Doctor.Feedbacks", amdRoute("/Feedbacks", "Common/controllers/Feedbacks"))
        //新增意见反馈
        .state("Doctor.Feedback", amdRoute("/Feedback/:id", "Common/controllers/Feedback"))
        //#endregion

        //#region 我的消息
        .state("Doctor.MyNotice", amdRoute("/MyNotice", "Common/controllers/MyNotice"))
        //消息详情
        .state("Doctor.NoticeDetail", amdRoute("/NoticeDetail/:id", "Common/controllers/MyNoticeDetail"))
        //#endregion

        //#region 线下看诊
        .state("Doctor.OfflineClinic", amdRoute("/OfflineClinic", "Doctor/controllers/OfflineClinic/Index"))
        //线下看诊(医生退款)
        .state("Doctor.OfflineClinic.Refund", amdRoute("/Refund", "Doctor/controllers/OfflineClinic/Refund"))
        //线下看诊(医生看诊)
        .state("Doctor.OfflineClinic.Clinic", amdRoute("/Clinic", "Doctor/controllers/OfflineClinic/Clinic"))
        //#endregion

        //#region 坐诊开方
        .state("Doctor.MemberRecipes", amdRoute("/MemberRecipes", "Doctor/controllers/MemberRecipes/Index"))
        //线下处方编辑
        .state("Doctor.MemberRecipesEdit", amdRoute("/MemberRecipes/:id/:OrgID/:OrgName/:RecipeType/Edit", "Doctor/controllers/MemberRecipes/Edit"))
        //线下处方查看
        .state("Doctor.MemberRecipesDetail", amdRoute("/MemberRecipes/:id/:OrgID/:OrgName/Detail", "Doctor/controllers/MemberRecipes/Detail"))
        //#endregion



        //健康服务站
        .state("HealthPlan", amdRoute("/Doctor/HealthPlan/:memberId", "Doctor/controllers/HealthServiceStation"))


        //健康教育
        .state("Doctor.HealthEducation", amdRoute("/HealthEducation", "Doctor/controllers/HealthEducation/Index"))
        .state("Doctor.HealthEducation.Add", amdRoute("/Add", "Doctor/controllers/HealthEducation/Add"))
        .state("Doctor.HealthEducation.List", amdRoute("/List", "Doctor/controllers/HealthEducation/List"))

        //#region 家庭医生设置
        //签约管理
        .state("Doctor.FamilyDoctorManage", amdRoute("/FamilyDoctor/Manage", "Doctor/controllers/FamilyDoctor/Manage/Index"))
        //签约协议管理
        .state("Doctor.FamilyDoctorManage.SignatureList", amdRoute("/SignatureList", "Doctor/controllers/FamilyDoctor/Manage/SignatureList"))
        .state("Doctor.FamilyDoctorManageSignatureEdit", amdRoute("/SignatureEdit/:id/Edit", "Doctor/controllers/FamilyDoctor/Manage/SignatureEdit"))

        //智能签约匹配
        .state("Doctor.FamilyDoctorSmartMatch", amdRoute("/FamilyDoctor/SmartMatch", "Doctor/controllers/FamilyDoctor/SmartMatch"))

        //团队维护
        .state("Doctor.FamilyDoctorManage.OrgDoctorGroup", amdRoute("/OrgDoctorGroup", "Doctor/controllers/FamilyDoctor/Manage/OrgDoctorGroup"))
        .state("Doctor.FamilyDoctorManageOrgDoctorGroupAdd", amdRoute("/OrgDoctorGroup/Add", "Doctor/controllers/FamilyDoctor/Manage/OrgDoctorGroupEdit"))
        .state("Doctor.FamilyDoctorManageOrgDoctorGroupEdit", amdRoute("/OrgDoctorGroup/:id/Edit", "Doctor/controllers/FamilyDoctor/Manage/OrgDoctorGroupEdit"))

        //社区区域设置
        .state("Doctor.FamilyDoctorManage.OrgRegion", amdRoute("/OrgRegion", "Doctor/controllers/FamilyDoctor/Manage/OrgRegion"))
        .state("Doctor.FamilyDoctorManageOrgRegionAdd", amdRoute("/OrgRegion/Add", "Doctor/controllers/FamilyDoctor/Manage/OrgRegionEdit"))
        .state("Doctor.FamilyDoctorManageOrgRegionEdit", amdRoute("/OrgRegion/:id/Edit", "Doctor/controllers/FamilyDoctor/Manage/OrgRegionEdit"))


        //区域管理
        .state("Doctor.RegionManage", amdRoute("/RegionManage", "Doctor/controllers/FamilyDoctor/RegionManage/Region"))
        .state("Doctor.RegionManageEdit", amdRoute("/RegionManage/:id/Edit", "Doctor/controllers/FamilyDoctor/RegionManage/RegionEdit"))


        //我的居民
        .state("Doctor.FamilyDoctorMySignatures", amdRoute("/FamilyDoctor/MySignatures", "Doctor/controllers/FamilyDoctor/MySignature/FamilyList"))
            //签约确认
        // .state("Doctor.FamilyDoctorMySignatures.SignatureConfirm", amdRoute("/SignatureConfirm", "Doctor/controllers/FamilyDoctor/MySignature/SignatureConfirm"))
        //     //家庭列表
        // .state("Doctor.FamilyDoctorMySignatures.FamilyList", amdRoute("/FamilyList", "Doctor/controllers/FamilyDoctor/MySignature/FamilyList"))
            //签约私人医生用户列表
        .state("Doctor.FamilyDoctorMySignatures.PersonalDoctor", amdRoute("/PersonalDoctor", "Doctor/controllers/FamilyDoctor/MySignature/PersonalDoctor"))
            //服务详情
        .state("Doctor.FamilyDoctorServiceDetail", amdRoute("/FamilyDoctor/Signatures/:id/Detail", "Doctor/controllers/FamilyDoctor/SignatureDetail"))
            //签约详情
        .state("Doctor.FamilyDoctorSignatureDetail", amdRoute("/FamilyDoctor/Signatures/:id/Services", "Doctor/controllers/FamilyDoctor/SignatureServices"))

        //#endregion
    };

    return {
        registerRoutes: registerRoutes
    }

});