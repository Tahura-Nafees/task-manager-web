import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function TasksPage() {
  const { logout } = useAuth();
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks (coming next)
      </Typography>
      <Button variant="outlined" onClick={logout}>
        Log out
      </Button>
    </Box>
  );
}
