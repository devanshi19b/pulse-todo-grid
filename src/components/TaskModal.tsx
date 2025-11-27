import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Flag, Clock, Briefcase, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Priority, WorkType } from "@/types/task";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
    dueTime: string;
    workType: WorkType;
  }) => void;
  editTask?: {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: Date;
    workType?: WorkType;
  } | null;
}

const TaskModal = ({ open, onClose, onSave, editTask }: TaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState<Date>();
  const [dueTime, setDueTime] = useState("");
  const [workType, setWorkType] = useState<WorkType>("personal");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setPriority(editTask.priority);
      setWorkType(editTask.workType || "personal");
      
      if (editTask.dueDate) {
        const taskDate = new Date(editTask.dueDate);
        setDate(taskDate);
        const hours = taskDate.getHours().toString().padStart(2, '0');
        const minutes = taskDate.getMinutes().toString().padStart(2, '0');
        setDueTime(`${hours}:${minutes}`);
      }
    }
  }, [editTask]);

  const handleSave = () => {
    if (!title.trim()) return;
    const dueDate = date ? format(date, "yyyy-MM-dd") : "";
    onSave({ title, description, priority, dueDate, dueTime, workType });
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDate(undefined);
    setDueTime("");
    setWorkType("personal");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card-purple border-neon-purple/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 neon-glow-blue">
              <Flag className="w-5 h-5 text-primary" />
            </div>
            {editTask ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Task Title</label>
            <Input
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-card border-primary/30 focus:border-primary neon-glow-blue"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              placeholder="Add task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-card border-primary/30 focus:border-primary min-h-[100px]"
            />
          </div>

          {/* Work Type Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Work Type
            </label>
            <Tabs value={workType} onValueChange={(value) => setWorkType(value as WorkType)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-card">
                <TabsTrigger value="personal" className="data-[state=active]:neon-glow-purple">
                  <User className="w-4 h-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="professional" className="data-[state=active]:neon-glow-blue">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Professional
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Priority
            </label>
            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <SelectTrigger className="glass-card border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/30">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Due Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal glass-card border-primary/30",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Due Time (24hr)
              </label>
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="glass-card border-primary/30 text-base [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                step="60"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-border hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 neon-glow-blue bg-primary hover:bg-primary/90"
          >
            {editTask ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
