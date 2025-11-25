import { useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Task, Priority, WorkType } from "@/types/task";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadTasks();
  }, [user, filterTab]);

  const loadTasks = async () => {
    if (!user) return;

    let query = supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterTab === "pending") {
      query = query.eq("status", "pending");
    } else if (filterTab === "completed") {
      query = query.eq("status", "completed");
    } else if (filterTab === "overdue") {
      query = query.eq("status", "overdue");
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load tasks");
      return;
    }

    const formattedTasks: Task[] = data.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      priority: task.priority as Priority,
      status: task.status as "pending" | "completed" | "overdue",
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      createdAt: new Date(task.created_at),
      completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
      category: task.category || undefined,
      tags: task.tags || undefined,
      workType: (task.work_type as WorkType) || undefined,
    }));

    setTasks(formattedTasks);
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === "completed" ? "pending" : "completed";
    const completedAt = newStatus === "completed" ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
        completed_at: completedAt,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update task");
      return;
    }

    loadTasks();
    toast.success("Task updated!");
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
    dueTime: string;
    workType: WorkType;
  }) => {
    if (!user) return;

    // Combine date and time if both provided
    let dueDateTimeString = null;
    if (taskData.dueDate) {
      if (taskData.dueTime) {
        dueDateTimeString = `${taskData.dueDate}T${taskData.dueTime}:00`;
      } else {
        dueDateTimeString = `${taskData.dueDate}T00:00:00`;
      }
    }

    const { error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: "pending",
        due_date: dueDateTimeString,
        work_type: taskData.workType,
      });

    if (error) {
      toast.error("Failed to create task");
      return;
    }

    loadTasks();
    toast.success("Task created successfully!");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "pending" && task.status === "pending") ||
      (filterTab === "completed" && task.status === "completed") ||
      (filterTab === "overdue" && task.status === "overdue");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pl-20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 neon-glow-blue">
          <h1 className="text-4xl font-bold mb-2">All Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 glass-card border-primary/30 neon-glow-blue h-12"
            />
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="neon-glow-blue bg-primary hover:bg-primary/90 h-12 gap-2 px-6"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">New Task</span>
          </Button>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filterTab} onValueChange={setFilterTab} className="w-full">
          <TabsList className="glass-card w-full md:w-auto">
            <TabsTrigger value="all" className="data-[state=active]:neon-glow-blue">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:neon-glow-blue">
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:neon-glow-green">
              Completed
            </TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:neon-glow-pink">
              Overdue
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-muted-foreground text-lg">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onClick={() => {}}
              />
            ))
          )}
        </div>

        <TaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateTask}
        />
      </div>
    </div>
  );
};

export default Tasks;
