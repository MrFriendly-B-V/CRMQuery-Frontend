FROM node:14 as builder
COPY ./ /usr/local/src/
WORKDIR /usr/local/src/

RUN npm i
RUN npx webpack


FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y \
    nginx

COPY --from=builder /usr/local/src/dist/* /var/www/html/dist/
COPY ./img/* /var/www/html/img/
COPY ./*.html /var/www/html/
COPY ./config.json /var/www/html/config.json
RUN chmod -R a+r /var/www/html

COPY ./docker/run.sh /app/run.sh
RUN chmod +x /app/run.sh
COPY ./docker/nginx.conf /etc/nginx/sites-available/web.conf
RUN ln -s /etc/nginx/sites-available/web.conf /etc/nginx/sites-enabled/web.conf
RUN rm /etc/nginx/sites-enabled/default

EXPOSE 80
CMD bash -c "/app/run.sh"