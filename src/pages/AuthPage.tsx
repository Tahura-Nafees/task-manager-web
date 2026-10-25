import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { loginRequest, registerRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const request = isLogin ? loginRequest : registerRequest;
      const { accessToken } = await request({ email, password });
      login(accessToken);
      navigate("/tasks", { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <Typography sx={{ variant: "h5", fontWeight: 600 }}>
              {isLogin ? "Welcome back" : "Create account"}
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              helperText={isLogin ? undefined : "At least 6 characters"}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
            </Button>
            <Typography sx={{ variant: "body2", textAlign: "center" }}>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                component={RouterLink}
                to={isLogin ? "/register" : "/login"}
              >
                {isLogin ? "Sign up" : "Log in"}
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
