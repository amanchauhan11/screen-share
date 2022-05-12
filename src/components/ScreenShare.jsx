import { useEffect, useState, useRef } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import { styled, createTheme, ThemeProvider } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const ScreenShareControl = styled(IconButton)(() => ({
  position: "absolute",
  bottom: "20px",
  left: "50%"
}));

const ScreenShare = ({ members, remoteStream, sharing, setSharing }) => {
  const [videoStream, setVideoStream] = useState(null);
  const videoElement = useRef();
  useEffect(() => {
    if (remoteStream) {
      setVideoStream(remoteStream);
      setSharing(true);
    }
  }, [remoteStream]);
  const toggleScreenShare = () => {
    if (!sharing) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then(stream => {
          setVideoStream(stream);
          setSharing(stream);
          // stream.getVideoTracks()[0].addEventListener("ended", () => {
          //   setVideoStream(null);
          //   setSharing(false);
          // });
        })
        .catch(error => {
          window.alert(error);
        });
    } else {
      let tracks = videoStream.getTracks();
      tracks.forEach(track => track.stop());
      setVideoStream(null);
      setSharing(null);
    }
  };
  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.srcObject = videoStream;
    }
  }, [sharing]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        padding: "0 20px"
      }}
    >
      <Grid container spacing={1}>
        <Grid item md={9}>
          <Paper sx={{ height: "80vh", position: "relative" }}>
            <video
              style={{ width: "100%", height: "100%" }}
              ref={videoElement}
              autoPlay
              playsInline
            ></video>
            <ScreenShareControl
              color="primary"
              aria-label="Share screen"
              onClick={toggleScreenShare}
            >
              {sharing ? (
                <StopScreenShareIcon fontSize="large" />
              ) : (
                <ScreenShareIcon fontSize="large" />
              )}
            </ScreenShareControl>
          </Paper>
        </Grid>
        <Grid item md={3} sx={{ width: "100%" }}>
          <Paper sx={{ height: "100%" }}>
            <List>
              {Object.keys(members).map(mid => (
                <ListItem disablePadding key={mid}>
                  <ListItemText primary={members[mid]} key={mid} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScreenShare;
