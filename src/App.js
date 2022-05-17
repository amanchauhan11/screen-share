import "./App.css";
import ScreenShare from "./components/ScreenShare";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef, useMemo } from "react";
import PeerManager from "./peer/PeerManager";
import io from "socket.io-client";

let name = localStorage.getItem("name");
if (!name) {
  name = prompt("Set user name:");
  localStorage.setItem("name", name);
  localStorage.setItem("uid", uuidv4());
}
const userInfo = {
  name: localStorage.getItem("name"),
  uid: localStorage.getItem("uid")
};
const socket = io("ws://localhost:4000", {
  query: {
    uid: userInfo.uid,
    name: userInfo.name
  }
});

function App() {
  const [members, setMembers] = useState({});
  const [appStatus, setAppStatus] = useState({ sharing: false, recv: false });
  const [remoteStream, setRemoteStream] = useState(null);
  const appStatusRef = useRef();
  appStatusRef.current = appStatus;
  const peerManager = useMemo(
    () =>
      new PeerManager(
        socket,
        setMembers,
        userInfo.uid,
        setRemoteStream,
        setAppStatus,
        appStatusRef
      ),
    []
  );
  return (
    <ScreenShare
      members={members}
      remoteStream={remoteStream}
      appStatus={appStatus}
      peerManager={peerManager}
    />
  );
}

export default App;
