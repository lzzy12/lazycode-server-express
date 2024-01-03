FROM alpine:3.19.0
RUN apk add g++
ARG filename
RUN g++ ${filename} -o ${filename}.out
CMD [ "./${filename}.out" ]