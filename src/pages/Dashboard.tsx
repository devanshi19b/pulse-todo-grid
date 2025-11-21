import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Clock, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Task, Priority } from "@/types/task";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    loadTasks();
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

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
    }));

    setTasks(formattedTasks);
  };

  const stats = {
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    upcoming: tasks.filter((t) => t.dueDate && new Date(t.dueDate) > new Date()).length,
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

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus as "pending" | "completed",
              completedAt: completedAt ? new Date(completedAt) : undefined,
            }
          : t
      )
    );
    toast.success("Task updated!");
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
    category: string;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: "pending",
        due_date: taskData.dueDate || null,
        category: taskData.category || null,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create task");
      return;
    }

    const newTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      priority: data.priority as Priority,
      status: data.status as "pending",
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      createdAt: new Date(data.created_at),
      category: data.category || undefined,
    };

    setTasks((prev) => [newTask, ...prev]);
    toast.success("Task created successfully!");
  };

  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pl-20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="gradient-animate rounded-3xl p-8 mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-glow-pulse">
            {greeting}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's what's on your plate today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          <StatsCard title="Pending Tasks" value={stats.pending} icon={Clock} color="blue" />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            color="green"
            trend={12}
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            color="pink"
          />
          <StatsCard title="Upcoming" value={stats.upcoming} icon={Zap} color="purple" />
        </div>

        {/* Recent Tasks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Tasks</h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="neon-glow-blue bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </Button>
          </div>

          <div className="space-y-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Floating Action Button for Mobile */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 md:hidden w-14 h-14 rounded-full neon-glow-purple bg-secondary hover:bg-secondary/90 shadow-2xl animate-glow-pulse z-40"
        >
          <Plus className="w-6 h-6" />
        </Button>

        <TaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateTask}
        />
      </div>
    </div>
  );
};

export default Dashboard;
