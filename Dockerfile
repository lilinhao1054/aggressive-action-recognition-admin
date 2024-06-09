# 设置 nginx 作为静态资源服务器
# 指定基础镜像nginx:alpine
FROM nginx:alpine

# 将我们自定义的网站静态文件复制到容器中
COPY dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露5173端口
EXPOSE 5173

# 启动 nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
