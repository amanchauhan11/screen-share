class PeerManager {
  constructor(
    socket,
    setMembers,
    selfId,
    setRemoteStream,
    setAppStatus,
    setPresId,
    appStatusRef
  ) {
    console.log(`Connecting ${selfId}`);
    this.socket = socket;
    this.selfId = selfId;
    this.initPeer = {};
    this.recvPeer = null;
    this.memberMap = {};
    this.lastSharedStream = null;
    this.setAppStatus = setAppStatus;
    this.setPresId = setPresId;
    this.appStatusRef = appStatusRef;
    const createRecvPeer = () => {
      const recvPeer = new window.SimplePeer({ trickle: false });
      recvPeer.on("signal", data => {
        this.setAppStatus({ sharing: false, recv: true });
        this.socket.emit("answer", { mid: this.selfId, payload: data });
        console.log("Sent answer:", data);
      });
      recvPeer.on("stream", stream => {
        // got remote video stream, now let's show it in a video tag
        console.log("Received stream:", stream);
        setRemoteStream(stream);
      });
      recvPeer.on("close", () => {
        this.setAppStatus(status => {
          return { ...status, recv: false };
        });
      });
      return recvPeer;
    };
    this.socket.on("offer", ({ mid, payload, presenterId }) => {
      if (mid === this.selfId) {
        this.recvPeer = createRecvPeer();
        console.log("Received offer:", payload);
        Object.keys(this.initPeer).forEach(mid => {
          this.initPeer[mid].destroy();
          delete this.initPeer[mid];
        });
        this.recvPeer.signal(payload);
        this.setPresId(presenterId);
      }
    });
    this.socket.on("member_update", memberMap => {
      console.log("Received member update:", memberMap);
      setMembers(memberMap);
      const oldMemberMap = this.memberMap;
      this.memberMap = memberMap;
      if (this.appStatusRef.current.sharing) {
        for (let id in oldMemberMap) {
          if (!(id in this.memberMap) && id !== this.selfId) {
            this.initPeer[id].destroy();
            delete this.initPeer[id];
          }
        }
        for (let id in this.memberMap) {
          if (!(id in oldMemberMap) && id !== this.selfId) {
            this.addPeer(id, this.lastSharedStream);
          }
        }
      }
    });
    this.socket.on("answer", ({ mid, payload }) => {
      if (this.appStatusRef.current.sharing) {
        console.log("Received answer from mid:", mid, "payload:", payload);
        this.initPeer[mid].signal(payload);
      }
    });
  }
  addPeer(mid, stream) {
    this.initPeer[mid] = new window.SimplePeer({
      initiator: true,
      stream: stream,
      trickle: false
    });
    this.initPeer[mid].on("signal", data => {
      console.log("Sending offer to mid:", mid, "payload:", data);
      this.socket.emit("offer", {
        mid: mid,
        payload: data,
        presenterId: this.selfId
      });
    });
  }
  share(members, stream) {
    Object.keys(members).forEach(mid => {
      if (mid !== this.selfId) {
        this.addPeer(mid, stream);
      }
    });
    this.lastSharedStream = stream;
    this.setAppStatus({ sharing: true, recv: false });
    this.setPresId(this.selfId);
  }
  stopSharing() {
    Object.keys(this.initPeer).forEach(mid => {
      this.initPeer[mid].destroy();
      delete this.initPeer[mid];
    });
    this.setAppStatus(status => {
      return { ...status, sharing: false };
    });
  }
}

export default PeerManager;
