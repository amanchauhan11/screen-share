import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";

const StyledListItem = styled(ListItem)(() => ({
  borderTop: "1px solid #e0e0e0",
  borderBottom: "1px solid #e0e0e0"
}));

const MemberBox = ({ mid, name, presenting }) => {
  let boxStyle = { margin: "-1px 0 0 0px" };
  if (mid == "default") {
    boxStyle = {
      ...boxStyle,
      bgcolor: "#1976d2",
      color: "#ffffff",
      borderRadius: "4px 4px 0 0"
    };
  }
  if (presenting) {
    boxStyle = { ...boxStyle, bgcolor: "#03a9f4", color: "#ffffff" };
  }
  return (
    <StyledListItem key={mid} sx={boxStyle}>
      <ListItemText primary={name} key={mid} />
      {presenting ? (
        <Typography variant="caption">Presenting...</Typography>
      ) : (
        ""
      )}
    </StyledListItem>
  );
};

export default MemberBox;
