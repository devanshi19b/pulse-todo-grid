import { CheckCircle2, Circle, Clock, Flame, AlertTriangle, Zap, Briefcase, User } from "lucide-react";
import { Task, Priority } from "@/types/task";
import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onClick: (task: Task) => void;
}

const priorityConfig = {
  low: {
    icon: Circle,
    color: "text-neon-lime",
    glow: "neon-glow-lime",
    border: "border-neon-lime/30",
  },
  medium: {
    icon: Clock,
    color: "text-neon-yellow",
    glow: "neon-glow-yellow",
    border: "border-neon-yellow/30",
  },
  high: {
    icon: Flame,
    color: "text-neon-red",
    glow: "neon-glow-red",
    border: "border-neon-red/30",
  },
  critical: {
    icon: AlertTriangle,
    color: "text-neon-red",
    glow: "neon-glow-red pulse-glow",
    border: "border-neon-red/30",
  },
};

const TaskCard = ({ task, onToggle, onClick }: TaskCardProps) => {
  const config = priorityConfig[task.priority];
  const PriorityIcon = config.icon;
  const isCompleted = task.status === "completed";
  const isOverdue = task.status === "overdue";

  return (
    <div
      onClick={() => onClick(task)}
      className={cn(
        "glass-card rounded-2xl p-5 cursor-pointer hover-scale transition-all duration-300",
        config.border,
        isCompleted && "opacity-60",
        isOverdue && "border-neon-pink/50"
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className="mt-1"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-neon-green animate-fade-in" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3
              className={cn(
                "text-lg font-semibold",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full", config.glow)}>
              <PriorityIcon className={cn("w-4 h-4", config.color)} />
              <span className={cn("text-xs font-medium uppercase", config.color)}>
                {task.priority}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {formatInTimeZone(
                  new Date(task.dueDate),
                  "Asia/Kolkata",
                  "MMM d, yyyy HH:mm"
                )} IST
              </span>
              {isOverdue && (
                <span className="flex items-center gap-1 text-neon-pink">
                  <Zap className="w-3 h-3" />
                  Overdue
                </span>
              )}
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {task.workType && (
            <div className="flex items-center gap-2 mt-3">
              {task.workType === "professional" ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 neon-glow-blue">
                  <Briefcase className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-primary">Professional</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/20 neon-glow-purple">
                  <User className="w-3 h-3 text-neon-purple" />
                  <span className="text-xs font-medium text-neon-purple">Personal</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
