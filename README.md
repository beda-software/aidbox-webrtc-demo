# Voice and video chat

## Web

Execute:

```
docker-compose build
docker-compose up
```

## Mobile app

### Prepare app

```
cd mobile
yarn
make update
```

Note that

If your React Native environment is ready, execute commands below, otherwise follow
[instructions](https://facebook.github.io/react-native/docs/getting-started.html)
before that.

### Android
```
react-native run-android
```

### iOS
```
react-native run-ios
```
