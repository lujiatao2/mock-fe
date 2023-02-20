FROM node:18.13.0-alpine
COPY . /app
WORKDIR /app
RUN rm -rf .idea dist node_modules \
    && npm install \
    && npm run build

FROM nginx:1.23.3-alpine
ENV MOCK_BE_IP=192.168.3.102
ENV MOCK_BE_PORT=10001
ENV MOCK_FE_PORT=10002
COPY --from=0 /app/dist /mock
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD /start.sh ${MOCK_BE_IP} ${MOCK_BE_PORT} ${MOCK_FE_PORT}