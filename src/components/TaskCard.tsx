import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { STATUS_LABELS, type Task, type TaskStatus } from "../types/task";

const STATUS_COLORS: Record<TaskStatus, "default" | "info" | "success"> = {
  todo: "default",
  "in-progress": "info",
  done: "success",
};

interface Props {
  task: Task;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({
  task,
  onToggleDone,
  onEdit,
  onDelete,
}: Props) {
  const isDone = task.status === "done";

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack sx={{ direction: "row", spacing: 1, alignItems: "flex-start" }}>
          <Tooltip title={isDone ? "Mark as to do" : "Mark as done"}>
            <IconButton
              onClick={() => onToggleDone(task)}
              color={isDone ? "success" : "default"}
            >
              {isDone ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
            </IconButton>
          </Tooltip>

          <Stack sx={{ flex: 1, spacing: 0.5, minWidth: 0 }}>
            <Typography
              sx={{
                variant: "subtitle1",
                fontWeight: 600,
                textDecoration: isDone ? "line-through" : "none",
                wordBreak: "break-word",
              }}
            >
              {task.title}
            </Typography>
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ wordBreak: "break-word" }}
              >
                {task.description}
              </Typography>
            )}
            <Stack
              sx={{
                direction: "row",
                spacing: 1,
                alignItems: "center",
                pt: 0.5,
              }}
            >
              <Chip
                size="small"
                label={STATUS_LABELS[task.status]}
                color={STATUS_COLORS[task.status]}
              />
              {task.dueDate && (
                <Typography variant="caption" color="text.secondary">
                  Due{" "}
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    timeZone: "UTC",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              )}
            </Stack>
          </Stack>

          <IconButton aria-label="Edit task" onClick={() => onEdit(task)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Delete task" onClick={() => onDelete(task)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
