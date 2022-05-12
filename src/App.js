import "./App.css";
import ScreenShare from "./components/ScreenShare";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef, useMemo } from "react";
import PeerManager from "./peer/PeerManager";

var Peer = require("simple-peer");

function App() {
  const [members, setMembers] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [sharing, setSharing] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  let peerManager = null;
  useEffect(() => {
    let name = localStorage.getItem("name");
    if (!name) {
      name = prompt("Set user name:");
      localStorage.setItem("name", name);
      localStorage.setItem("uid", uuidv4());
    }
    let userInfo = {
      name: localStorage.getItem("name"),
      uid: localStorage.getItem("uid")
    };
    // setUserInfo(userInfo);
    peerManager = new PeerManager(
      setMembers,
      userInfo.uid,
      userInfo.name,
      () => setSharing(false),
      setRemoteStream
    );
  }, []);
  // const peerManager = useMemo(() => {
  //   return new PeerManager(
  //     setMembers,
  //     userInfo.uid,
  //     userInfo.name,
  //     () => setSharing(false),
  //     setRemoteStream
  //   );
  // }, []);

  // const members = [];
  // useEffect(() => {
  //   let name = localStorage.getItem("name");
  //   if (!name) {
  //     name = prompt("Set user name:");
  //     localStorage.setItem("name", name);
  //     localStorage.setItem("uid", uuidv4());
  //   }
  //   if (name === "Pranjal") {
  //     var peer2 = new window.SimplePeer();
  //     peer2.on("signal", data => {
  //       socket.send(data);
  //     });
  //     socket.on("message", data => {
  //       peer2.signal(data);
  //     });
  //     peer2.on("stream", stream => {
  //       // got remote video stream, now let's show it in a video tag
  //       console.log("pranjal got stream", stream);
  //       setRemoteStream(stream);
  //     });
  //   }
  // }, []);
  // const gotMedia = useCallback(stream => {
  //   let name = localStorage.getItem("name");
  //   if (name === "Aman") {
  //     console.log("Aman got call to gotMedia");
  //     var peer1 = new window.SimplePeer({ initiator: true, stream: stream });
  //     peer1.on("signal", data => {
  //       socket.send(data);
  //     });
  //     socket.on("message", data => {
  //       peer1.signal(data);
  //     });
  //   }
  // }, []);
  // let userInfo = { name: name, uid: localStorage.getItem("uid") };
  return (
    <ScreenShare
      members={members}
      remoteStream={remoteStream}
      sharing={sharing}
      setSharing={stream => {
        if (stream) {
          setSharing(true);
          peerManager.share(members, stream);
        } else {
          setSharing(false);
          peerManager.shopSharing();
        }
      }}
      peerManager={peerManager}
    />
  );
}

export default App;
