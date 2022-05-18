# Screen Share

A screen sharing app built to test webrtc capabilities. UX is similar to other conferencing apps like Meet/Teams, except only screen sharing is available. Multiple users can join and share screen at any point. Only a single meeting room is available and all users will join the same meeting. 

<img src=https://user-images.githubusercontent.com/28217026/169112806-401825a6-7392-44f9-b0dc-548add37e8a9.png />

## How to run?

### Run server
Clone nodejs [server](https://github.com/amanchauhan11/screen-share-server) and run  
```
node index.js
```

### Launch the app
To serve development version  
```
npm start
```

To create prod build  
```
npm run build
```

## How does it work?

The app creates peer to peer connections between different users using webrtc. The [server]([url](https://github.com/amanchauhan11/screen-share-server)) handles messaging to create webrtc connections using [SocketIO](https://socket.io/docs/v4/). 
If there are N users and a user is presenting, the presenting user has to create N peer to peer connections, one for each other user. Since connections are O(n), scalability might be an issue. 
The raw webrtc api is a bit complicated, so we use this [wrapper](https://github.com/feross/simple-peer) library.

## TODO
1. Video or voice sharing.
2. Meeting rooms.
3. Peer connections scalability
