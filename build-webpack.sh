#!/usr/bin/env sh

# 终止错误
set -e

# 进入目录
cd build-webpack

# 提交记录
# 初次提交时取消注释
# git init
git add -A 
git commit -m "build webpack"

# 提交到分支
git push -f git@github.com:ngd-b/webpackDemo.git master:build-webpack

