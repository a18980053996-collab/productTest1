<map version="1.0.1">
  <node TEXT="登录鉴权 · 系统流程">
    <node TEXT="状态">
      <node TEXT="未登录"/>
      <node TEXT="已登录"/>
      <node TEXT="failCount 0-5"/>
    </node>
    <node TEXT="主路径">
      <node TEXT="提交登录"/>
      <node TEXT="校验非空"/>
      <node TEXT="验证码匹配"/>
      <node TEXT="账号密码匹配"/>
      <node TEXT="写 session, failCount=0"/>
      <node TEXT="进入用户管理"/>
    </node>
    <node TEXT="异常">
      <node TEXT="failCount>=5: 已禁用"/>
      <node TEXT="空字段: 对应提示 + 抖动"/>
      <node TEXT="验证码错: 刷新码, 不清 failCount"/>
      <node TEXT="密码错: failCount+1, n/5 或禁用"/>
      <node TEXT="退出: 清 session 回未登录"/>
    </node>
  </node>
</map>
