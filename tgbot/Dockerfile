# Используем официальный образ Python
FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
  && apt-get install -y --no-install-recommends  && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /tgbot

# Копируем файл зависимостей в контейнер
COPY ./requirements.txt ./requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Копируем весь код бота в контейнер
COPY . .
