import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { deleteTask, getTasks, updateTask } from "../api/tasks";
import TaskCard from "../components/TaskCard";
import TaskDialog from "../components/TaskDialog";
import { useAuth } from "../context/AuthContext";
import { STATUS_LABELS, type Task, type TaskStatus } from "../types/task";
import { getErrorMessage } from "../utils/errors";

type Filter = "all" | TaskStatus;

export default function TaskPage() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [toast, setToast] = useState("");

  const refresh = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTasks(filter === "all" ? undefined : filter)
      .then((data) => {
        if (cancelled) return;
        setTasks(data);
        setError("");
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filter, reloadKey]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setDialogOpen(true);
  };

  const handleSaved = (message: string) => {
    setDialogOpen(false);
    setToast(message);
    refresh();
  };

  const handleToggleDone = async (task: Task) => {
    try {
      await updateTask(task.id, {
        status: task.status === "done" ? "todo" : "done",
      });
      refresh();
    } catch (err) {
      setToast(getErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteTask(deleting.id);
      setToast("Task deleted");
      refresh();
    } catch (err) {
      setToast(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar>
          <Typography sx={{ variant: "h6", fontWeight: 700, flex: 1 }}>
            Task Manager
          </Typography>
          <Button onClick={logout}>Log out</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack
          sx={{
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ variant: "h5", fontWeight: 600 }}>
            My tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            New task
          </Button>
        </Stack>

        <Tabs
          value={filter}
          onChange={(_, value: Filter) => setFilter(value)}
          variant="scrollable"
          sx={{ mb: 2 }}
        >
          <Tab label="All" value="all" />
          {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
            <Tab key={s} label={STATUS_LABELS[s]} value={s} />
          ))}
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary">
              {filter === "all"
                ? "No tasks yet. Create your first one!"
                : "No tasks in this status."}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleDone={handleToggleDone}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </Stack>
        )}
      </Container>

      {dialogOpen && (
        <TaskDialog
          task={editing}
          onClose={() => setDialogOpen(false)}
          onSaved={handleSaved}
        />
      )}

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{deleting?.title}" will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        message={toast}
      />
    </Box>
  );
}
