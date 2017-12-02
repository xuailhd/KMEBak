/**
* Created with JetBrains PhpStorm.
* User: xuheng
* Date: 12-8-8
* Time: 下午2:00
* To change this template use File | Settings | File Templates.
*/
var templates = [
{
    "pre": "",
    'title': '健康贴士',
    'preHtml': '<table cellpadding=0 cellspacing=0 style="width:100%;border-collapse:collapse;"><tbody style="width:90%;"><tr><td align="center" style="width:20%;padding-top:1%;padding-bottom:1%;"><image src="http://www.kkol.com.cn/api/Content/images/xmjd_yinshi.png" ></image></td><td style="padding-top:1%;padding-bottom:1%;"><span style="color:#24489E;">饮食</span></td></tr><tr><td style="width:20%;"></td><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;"></td><td style="padding-top:1%;padding-bottom: 1%; "><span style="color:Green">原则：</span><span style="color:#7E7E80">原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr ><td style="width: 20%;"></td> <td style="border-bottom:1px dashed  #CCC ; "></td></tr><tr><td style="width: 20%;"></td><td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green">适宜：</span><span style=" color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr style=""><td style="width: 20%;"></td> <td style="border-bottom:1px dashed  #CCC ;"> </td></tr> <tr> <td style="width: 20%;"></td> <td style="padding-top: 1%;padding-bottom: 1%; "> <span style="color:Green">禁忌：</span><span style=" color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span> </td></tr><tr><td style="width:20%;"></td><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;" align="center"><image src="http://www.kkol.com.cn/api/Content/images/xmjd_yundong.png" ></image></td><td style="padding-top:1%;padding-bottom:1%;"><span style="color:#24489E;">运动</span></td></tr><tr><td style="width:20%;"></td> <td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;"></td><td style="padding-top:1%;padding-bottom: 1%;"><span style=" color:#7E7E80">原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr><td style="width:20%;"></td><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;" align="center"><image src="http://www.kkol.com.cn/api/Content/images/xmjd_xinli.png"></image></td><td style="padding-top:1%;padding-bottom:1%;"><span style="color:#24489E;">心理</span></td></tr><tr ><td style="width:20%;"></td> <td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;"></td><td style="padding-top:1%;padding-bottom: 1%;"><span style=" color:#7E7E80">原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr><td style="width:20%;"></td><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;" align="center"><image src="http://www.kkol.com.cn/api/Content/images/xmjd_zhuyishixiang.png"></image></td><td style="padding-top: 1%;padding-bottom: 1%; "> <span style="color:#24489E;">注意事项</span> </td></tr><tr ><td style="width: 20%;"></td><td style="border-bottom:1px dashed #CCC;"> </td></tr><tr><td style="width: 20%;"></td><td style="padding-top: 1%;padding-bottom: 1%;"><span style="color:Green">①</span><span style=" color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span> </td></tr><tr > <td style="width: 20%;"></td> <td style="border-bottom:1px dashed  #CCC ; "> </td></tr> <tr> <td style="width: 20%;padding-bottom: 1%;padding-top: 1%;"></td> <td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green">②</span><span style="color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span> </td></tr></tbody></table>',
    "html": '<table cellpadding=0 cellspacing=0 style="width:100%;border-collapse:collapse;"><tbody style="width:90%;"><tr><td align="center" style="width:20%;padding-top:1%;padding-bottom:1%;"><image src="http://www.kkol.com.cn/api/Content/images/xmjd_yinshi.png" ></image></td><td style="padding-top:1%;padding-bottom:1%;"><span style="color:#24489E;">饮食</span></td></tr><tr><td style="width:20%;"></td><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;"></td><td style="padding-top:1%;padding-bottom: 1%; "><span style="color:Green">原则：</span><span style="color:#7E7E80">原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr ><td style="width: 20%;"></td> <td style="border-bottom:1px dashed  #CCC ; "></td></tr><tr><td style="width: 20%;"></td><td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green">适宜：</span><span style=" color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr style=""><td style="width: 20%;"></td> <td style="border-bottom:1px dashed  #CCC ;"> </td></tr> <tr> <td style="width: 20%;"></td> <td style="padding-top: 1%;padding-bottom: 1%; "> <span style="color:Green">禁忌：</span><span style=" color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span> </td></tr><tr><td style="width:20%;"></td><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;" align="center"><image src="http://www.kkol.com.cn/api/Content/images/xmjd_yundong.png" ></image></td><td style="padding-top:1%;padding-bottom:1%;"><span style="color:#24489E;">运动</span></td></tr><tr><td style="width:20%;"></td> <td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;"></td><td style="padding-top:1%;padding-bottom: 1%;"><span style=" color:#7E7E80">原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr><td style="width:20%;"></td><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;" align="center"><image src="http://www.kkol.com.cn/api/Content/images/xmjd_xinli.png"></image></td><td style="padding-top:1%;padding-bottom:1%;"><span style="color:#24489E;">心理</span></td></tr><tr ><td style="width:20%;"></td> <td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;"></td><td style="padding-top:1%;padding-bottom: 1%;"><span style=" color:#7E7E80">原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr><td style="width:20%;"></td><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="width:20%;" align="center"><image src="http://www.kkol.com.cn/api/Content/images/xmjd_zhuyishixiang.png"></image></td><td style="padding-top: 1%;padding-bottom: 1%; "> <span style="color:#24489E;">注意事项</span> </td></tr><tr ><td style="width: 20%;"></td><td style="border-bottom:1px dashed #CCC;"> </td></tr><tr><td style="width: 20%;"></td><td style="padding-top: 1%;padding-bottom: 1%;"><span style="color:Green">①</span><span style=" color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span> </td></tr><tr > <td style="width: 20%;"></td> <td style="border-bottom:1px dashed  #CCC ; "> </td></tr> <tr> <td style="width: 20%;padding-bottom: 1%;padding-top: 1%;"></td> <td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green">②</span><span style="color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span> </td></tr></tbody></table>'

},
   {
       "pre": "",
       'title': '原因',
       'preHtml': '<table cellpadding=0 cellspacing=0 style="width:100%;border-collapse:collapse;"><tbody style="width:90%;"><tr > <td style="border-bottom:1px dashed  #CCC ; "></td></tr><tr><td style="padding-top:1%;padding-bottom:1%;"><span style="color:Green">①</span><span style="color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span> </td>  </tr>  <tr > <td style="border-bottom:1px dashed  #CCC ; "></td></tr><tr><td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green"> ②</span><span style=" color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr ><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="padding-bottom:1%;padding-top:1%;"><span style="color:Green">③</span><span style="color:#7E7E80">原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr ><td style="border-bottom:1px dashed #CCC;"></td></tr></tbody></table>',
       "html": '<table cellpadding=0 cellspacing=0 style="width:100%;border-collapse:collapse;"><tbody style="width:90%;"><tr > <td style="border-bottom:1px dashed  #CCC ; "></td></tr><tr><td style="padding-top:1%;padding-bottom:1%;"><span style="color:Green">①</span><span style="color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span> </td>  </tr>  <tr > <td style="border-bottom:1px dashed  #CCC ; "></td></tr><tr><td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green"> ②</span><span style=" color:#7E7E80">原因<span  class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr ><td style="border-bottom:1px dashed #CCC;"></td></tr><tr><td style="padding-bottom:1%;padding-top:1%;"><span style="color:Green">③</span><span style="color:#7E7E80">原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr ><td style="border-bottom:1px dashed #CCC;"></td></tr></tbody></table>'
   },
   {
       "pre": "",
       'title': '专家建议',
       'preHtml': '<table cellpadding=0 cellspacing=0 style="width:100%;border-collapse:collapse;"><tbody style="width:90%;"><tr><td style="padding-top: 1%;padding-bottom:1%;"><span style="color:#24489E;" class="ue_t">[标题]</span></td></tr><tr><td style="border-bottom:1px dashed #CCC;"></td></tr><tr> <td style="padding-top:1%;padding-bottom:1%;"><span style="color:Green">①</span><span style=" color:#7E7E80">原则：原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr ><td style="border-bottom:1px dashed #CCC; "></td></tr><tr><td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green"> ②</span><span style=" color:#7E7E80">适宜：原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr style=""><td style="border-bottom:1px dashed  #CCC ;"></td></tr>   <tr>   <td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green">③</span><span style="color:#7E7E80">禁忌：原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr style=""><td style="border-bottom:1px dashed #CCC;"></td></tr></tbody></table>',
       "html": '<table cellpadding=0 cellspacing=0 style="width:100%;border-collapse:collapse;"><tbody style="width:90%;"><tr><td style="padding-top: 1%;padding-bottom:1%;"><span style="color:#24489E;" class="ue_t">[标题]</span></td></tr><tr><td style="border-bottom:1px dashed #CCC;"></td></tr><tr> <td style="padding-top:1%;padding-bottom:1%;"><span style="color:Green">①</span><span style=" color:#7E7E80">原则：原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr ><td style="border-bottom:1px dashed #CCC; "></td></tr><tr><td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green"> ②</span><span style=" color:#7E7E80">适宜：原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr style=""><td style="border-bottom:1px dashed  #CCC ;"></td></tr>   <tr>   <td style="padding-bottom: 1%;padding-top: 1%;"><span style="color:Green">③</span><span style="color:#7E7E80">禁忌：原因<span class="ue_t">[请输入具体原因的内容]</span></span></td></tr><tr style=""><td style="border-bottom:1px dashed #CCC;"></td></tr></tbody></table>'
   },
   {
       "pre": "",
       'title': '自定义图片',
       'preHtml': '<table cellpadding=0 cellspacing=0 style="width:100%;"><tbody style=" width:90%;border-collapse:collapse;"><tr><td style="width: 50%;padding-top:1%;padding-bottom: 1%;"> <span style="color:#0b8932">①</span><span class="ue_t">[请输入具体原因的内容]</span><p><br /></p><span style="color:#EE6682">②</span><span class="ue_t">[请输入具体原因的内容]</span><p><br /></p><span style="color:#46B2BA">③</span><span  class="ue_t">[请输入具体原因的内容]</span><p><br /></p></td> <td style="padding-top: 1%;padding-bottom: 1%;padding-bottom: 1%;padding-top: 1%;"><span class="ue_t">【此处插入照片】</span></td></tr></tbody></table>',
       "html": '<table cellpadding=0 cellspacing=0 style="width:100%;"><tbody style=" width:90%;border-collapse:collapse;"><tr><td style="width: 50%;padding-top:1%;padding-bottom: 1%;"> <span style="color:#0b8932">①</span><span class="ue_t">[请输入具体原因的内容]</span><p><br /></p><span style="color:#EE6682">②</span><span class="ue_t">[请输入具体原因的内容]</span><p><br /></p><span style="color:#46B2BA">③</span><span  class="ue_t">[请输入具体原因的内容]</span><p><br /></p></td> <td style="padding-top: 1%;padding-bottom: 1%;padding-bottom: 1%;padding-top: 1%;"><span class="ue_t">【此处插入照片】</span></td></tr></tbody></table>'
   },
   {
       "pre": "",
       'title': '诊断标准：定性结果(阳性正常)',
       'preHtml': '<iframe frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/定性结果.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&RefRange=阳性&IsNumberValue=false">',
       "html": '<iframe frameborder=0 scrolling=no src="http://www.kkol.com.cn/api/content/html/定性结果.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&RefRange=阳性&IsNumberValue=false">'
   },
   {
        "pre": "",
        'title': '诊断标准：定性结果(阴性正常)',
        'preHtml': '<iframe frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/定性结果.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&RefRange=阴性&IsNumberValue=false">',
        "html": '<iframe frameborder=0 scrolling=no src="http://www.kkol.com.cn/api/content/html/定性结果.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&RefRange=阴性&IsNumberValue=false">'
    },
   {
       "pre": "",
       'title': '诊断标准：定性结果(阴性阳性正常)',
       'preHtml': '<iframe frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/定性结果.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&RefRange=阴性阳性&IsNumberValue=false">',
       "html": '<iframe frameborder=0 scrolling=no src="http://www.kkol.com.cn/api/content/html/定性结果.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&RefRange=阴性阳性&IsNumberValue=false">'
   },
   {
       "pre": "",
       'title': '诊断标准：公式平均压',
       'preHtml': '<iframe frameborder=0 height=280 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/平均压.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">',
       "html": '<iframe frameborder=0 height=360 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/平均压.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">'
   },
   {
       "pre": "",
       'title': '诊断标准：公式踝臂指数',
       'preHtml': '<iframe frameborder=0 height=320 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/踝臂指数.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">',
       "html": '<iframe frameborder=0 height=300 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/踝臂指数.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">'
   },

   {
       "pre": "",
       'title': '诊断标准：公式体脂肪率',
       'preHtml': '<iframe frameborder=0 height=190 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/体脂肪率.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">',
       "html": '<iframe  frameborder=0 height=190 width=50% scrolling=no src="http://www.kkol.com.cn/api/content/html/体脂肪率.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">'
   },
   {
       "pre": "",
       'title': '诊断标准：公式握力体重指数',
       'preHtml': '<iframe frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/握力体重指数.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">',
       "html": '<iframe frameborder=0 height=300 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/握力体重指数.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">'
   },
   {
       "pre": "",
       'title': '诊断标准：公式腰臀比',
       'preHtml': '<iframe frameborder=0 height=230 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/腰臀比.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">',
       "html": '<iframe frameborder=0 height=230 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/腰臀比.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">'
   },
   {
       "pre": "",
       'title': '诊断标准：公式乙肝两对半',
       'preHtml': '<iframe frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/乙肝两对半.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=false">',
       "html": '<iframe frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/乙肝两对半.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=false">'
   },
   {
       "pre": "",
       'title': '诊断标准：公式体重指数',
       'preHtml': '<iframe frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/体重指数.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">',
       "html": '<iframe  frameborder=0 height=290 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/体重指数.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">'
   },
   {
       "pre": "",
       'title': '诊断标准：公式空腹血糖',
       'preHtml': '<iframe frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/空腹血糖.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">',
       "html": '<iframe  frameborder=0 height=260 width=100% scrolling=no src="http://www.kkol.com.cn/api/content/html/空腹血糖.htm?u.publishid={u.publishid}&u.organid={u.organid}&u.encryptpwd={u.encryptpwd}&u.verifycode={u.verifycode}&XMMC={XMMC}&IsNumberValue=true">'
   }


];