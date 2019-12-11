#! /usr/bin/env bash
npm config get registry # 查看registry
npm config set registry=http://registry.npmjs.org # 修改registry

echo '请进行登录'
npm login  # 登录
echo '---publish---'
npm publish  # 发布
npm config set registry=http://registry.npm.taobao.org # 再次设置为淘宝镜像
echo '发布完成'
exit # 退出