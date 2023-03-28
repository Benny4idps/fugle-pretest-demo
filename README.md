# Fugle pretest demo

This is a pretest demo for Fugle.co

## Features

* GET API: Fetch data from /data?user=userId route, if fail throws 500 error

* Rate limiting: Maximum request attempt for the same user & IP within 1 minute (user: 5, IP: 10)

* Websocket API: "subscribe" event for getting the latest trade price of prefixed 10 currencies from [Bitstamp websocket API](https://www.bitstamp.net/websocket/v2/), receive latest trade data by listening "message" event

## Installing

1. clone project

```
git clone https://github.com/Benny4idps/fugle-pretest-demo.git
```

2. enter project file
```
cd fugle-pretest-demo
```

3. install packages
```
yarn
```

4. set up environment variables
```
// .env.example => .env
DATA_ENDPOINT=https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty
REDIS_HOST=localhost
REDIS_PORT=your local redis port
```

5. run server on 3000 port
```
yarn dev
```

