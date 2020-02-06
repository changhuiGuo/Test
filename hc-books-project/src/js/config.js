/**
* 项目通用的配置文件 
*/
; var Config =
{
    //根路径
    rootPath: "../",
    //获取微信签名等信息接口的统一路径
    tongyiWxAddress: "http://smartbox.yikel.cn/wechatAuth/getStrSign",

    // ---------------------------- 正式环境 ---------------------------- //
    //接口地址
    //  remoteAddress: "http://smartbox1.yikel.cn/api/",  
    //微信支付路径
    // WxPayUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx514de7190265c900&redirect_uri=http%3A%2F%2Fsmartbox1.yikel.cn%2Fapi%2Fwechat%2FwxAuth&response_type=code&scope=snsapi_userinfo&state="

    // ---------------------------- 测试环境 ---------------------------- //
    //接口地址
    remoteAddress: "http://test.yikel.com/api/",
    //微信支付路径
    WxPayUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6914fdfd5fce8e7e&redirect_uri=http%3A%2F%2Ftest.yikel.com%2Fapi%2Fwechat%2FwxAuth&response_type=code&scope=snsapi_userinfo&state="
}
;






    

 