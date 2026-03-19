# ./backend/Dockerfile
FROM python:3.11-slim-bookworm

WORKDIR /app

# Instala dependencias (incluyendo netcat) en un solo RUN para reducir capas
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libmariadb-dev \
    libmariadb-dev-compat \
    default-libmysqlclient-dev \
    pkg-config \
    netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*  # Esta línea DEBE estar en el mismo RUN

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .