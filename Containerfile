FROM alpine

RUN apk add thttpd

WORKDIR /webserver
# mount user data in /webserver/userdata
COPY . .

ENTRYPOINT ["thttpd", "-D", "-h", "0.0.0.0", "-p", "3000", "-d", ".", "-M", "60"]
