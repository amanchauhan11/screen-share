import { useEffect, useState, useRef } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import { styled, createTheme, ThemeProvider } from "@mui/system";
import List from "@mui/material/List";
import MemberBox from "./MemberBox";

const ScreenShareControl = styled(IconButton)(() => ({
  position: "absolute",
  bottom: "20px",
  left: "50%"
}));

const ScreenShare = ({
  members,
  remoteStream,
  appStatus,
  peerManager,
  presenterId
}) => {
  const [videoStream, setVideoStream] = useState(null);
  const videoElement = useRef();
  useEffect(() => {
    if (remoteStream && appStatus.recv) {
      if (videoStream) {
        videoStream.getVideoTracks()[0].stop();
      }
      setVideoStream(remoteStream);
    }
    if (!appStatus.sharing && !appStatus.recv) {
      setVideoStream(null);
    }
  }, [appStatus.recv, appStatus.sharing]);
  const toggleScreenShare = () => {
    if (!appStatus.sharing) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then(stream => {
          peerManager.share(members, stream);
          setVideoStream(stream);
          stream.getVideoTracks()[0].addEventListener("ended", () => {
            // in case user ends stream through browser's inbuilt stop sharing
            peerManager.stopSharing();
          });
        })
        .catch(error => {
          window.alert(error);
        });
    } else {
      videoStream.getVideoTracks()[0].stop();
      peerManager.stopSharing();
    }
  };
  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.srcObject = videoStream;
    }
  }, [videoStream]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        padding: "0 20px",
        bgcolor: "grey.300"
      }}
    >
      <Grid container spacing={1}>
        <Grid item md={9}>
          <Paper sx={{ height: "90vh", position: "relative" }}>
            <video
              style={{ width: "100%", height: "100%" }}
              ref={videoElement}
              autoPlay
              playsInline
              muted
            ></video>
            <ScreenShareControl
              color="primary"
              aria-label="Share screen"
              onClick={toggleScreenShare}
            >
              {appStatus.sharing ? (
                <StopScreenShareIcon fontSize="large" />
              ) : (
                <ScreenShareIcon fontSize="large" />
              )}
            </ScreenShareControl>
          </Paper>
        </Grid>
        <Grid item md={3} sx={{ width: "100%" }}>
          <Paper sx={{ height: "100%" }}>
            <List sx={{ padding: "0px" }}>
              <MemberBox mid="default" name="Participants"></MemberBox>
              {Object.keys(members).map(mid => (
                <MemberBox
                  key={mid}
                  name={members[mid]}
                  presenting={
                    (appStatus.sharing || appStatus.recv) && mid === presenterId
                  }
                ></MemberBox>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScreenShare;
