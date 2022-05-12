import io from "socket.io-client";

class PeerManager {
  constructor(setMembers, selfId, selfName, closeShareCb, setRemoteStream) {
    console.log(`Connecting ${selfName}`);
    this.uid = selfId;
    this.name = selfName;
    this.socket = io("ws://localhost:4000", {
      query: {
        uid: this.uid,
        name: this.name
      }
    });
    this.recvPeer = new window.SimplePeer();
    this.initPeer = {};
    this.isSharing = false;
    this.isRecv = false;
    this.selfId = selfId;
    this.recvPeer.on("signal", data => {
      this.isRecv = true;
      this.socket.emit("answer", { mid: this.selfId, payload: data });
    });
    this.socket.on("offer", ({ mid, payload }) => {
      if (this.isSharing) {
        closeShareCb();
      }
      this.isSharing = false;
      Object.keys(this.initPeer).forEach(mid => {
        this.initPeer[mid].destroy();
        delete this.initPeer[mid];
      });
      this.recvPeer.signal(payload);
    });
    this.recvPeer.on("stream", stream => {
      // got remote video stream, now let's show it in a video tag
      console.log("got stream", stream);
      setRemoteStream(stream);
    });
    this.socket.on("member_update", memberMap => {
      setMembers(memberMap);
    });
    this.socket.on("answer", ({ mid, payload }) => {
      this.initPeer[mid].signal(payload);
    });
  }
  share(members, stream) {
    if (this.isRecv) {
      this.recvPeer.destroy();
    }
    Object.keys(members).forEach(mid => {
      if (mid !== this.selfId) {
        this.initPeer[mid] = new window.SimplePeer({
          initiator: true,
          stream: stream
        });
        this.initPeer[mid].on("signal", data => {
          this.socket.emit("offer", { mid: mid, payload: data });
        });
      }
    });
    this.isRecv = false;
    this.isSharing = true;
  }
  stopSharing() {
    Object.keys(this.initPeer).forEach(mid => {
      this.initPeer[mid].destroy();
      delete this.initPeer[mid];
    });
    this.isSharing = false;
  }
}

export default PeerManager;
