#!/bin/sh

# 启动脚本。

sed -i "s/MOCK_BE_IP/${1}/" /etc/nginx/nginx.conf
sed -i "s/MOCK_BE_PORT/${2}/" /etc/nginx/nginx.conf
sed -i "s/MOCK_FE_PORT/${3}/" /etc/nginx/nginx.conf
nginx -g "daemon off;"
