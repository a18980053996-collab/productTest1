<map version="1.0.1">
  <node TEXT="登录鉴权流程">
    <node TEXT="前台">
      <node TEXT="打开登录页"/>
      <node TEXT="输入账号 / 密码 / 验证码"/>
      <node TEXT="点击账号登录"/>
    </node>
    <node TEXT="校验">
      <node TEXT="验证码是否正确">
        <node TEXT="否：提示验证码错误，刷新验证码，抖动按钮"/>
      </node>
      <node TEXT="账号密码是否匹配">
        <node TEXT="否：账号或密码错误 n/5，刷新验证码"/>
      </node>
      <node TEXT="当日连续错误是否满 5 次">
        <node TEXT="是：账号已禁用，请联系管理员"/>
      </node>
    </node>
    <node TEXT="结果">
      <node TEXT="成功：进入用户管理"/>
      <node TEXT="用户管理：查询、分页、详情"/>
      <node TEXT="暂不做找回密码，后台重置"/>
    </node>
  </node>
</map>
