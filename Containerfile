FROM alpine

RUN apk add thttpd
COPY . .

ENTRYPOINT ["thttpd", "-D", "-h", "0.0.0.0", "-p", "3000", "-d", ".", "-M", "60"]
