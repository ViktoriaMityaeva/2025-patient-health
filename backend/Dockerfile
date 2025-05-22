FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /backend

RUN apt-get update \
  && apt-get install -y --no-install-recommends  && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt ./requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./backend ./backend

RUN python backend/manage.py collectstatic --noinput
