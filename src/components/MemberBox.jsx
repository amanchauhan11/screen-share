import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/system";

const StyledListItem = styled(ListItem)(() => ({
  borderTop: "1px solid #e0e0e0",
  borderBottom: "1px solid #e0e0e0"
}));

const MemberBox = ({ mid, name }) => {
  const boxStyle =
    mid == "default"
      ? { bgcolor: "#1976d2", color: "#ffffff", margin: "-1px 0 0 0px" }
      : { margin: "-1px 0 0 0px" };
  return (
    <StyledListItem key={mid} sx={boxStyle}>
      <ListItemText primary={name} key={mid} />
    </StyledListItem>
  );
};

export default MemberBox;
