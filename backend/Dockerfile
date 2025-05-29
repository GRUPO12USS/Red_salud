FROM python:3.9-slim-buster

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential libmariadb-dev libmariadb-dev-compat default-libmysqlclient-dev pkg-config

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .