import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Clock, AlertTriangle, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Task, Priority, WorkType } from "@/types/task";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Chatbot } from "@/components/Chatbot";

const motivationalMessages = [
  "Every task completed is a step closer to your goals! 💪",
  "Your productivity today shapes your success tomorrow! ⚡",
  "Small progress is still progress. Keep going! 🌟",
  "You're doing amazing! One task at a time! 🚀",
  "Focus on progress, not perfection! ✨",
  "Believe in yourself and crush those tasks! 🎯",
  "You've got this! Make today count! 🔥",
];

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Set random motivational message
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setMotivationalMessage(randomMessage);

    loadUserProfile();
    loadTasks();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      setUserName(user.email?.split("@")[0] || "User");
      return;
    }

    setUserName(data?.username || user.email?.split("@")[0] || "User");
  };

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
      workType: (task.work_type as WorkType) || undefined,
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
    dueTime: string;
    category: string;
    workType: WorkType;
  }) => {
    if (!user) return;

    // If editing, update existing task
    if (editingTask) {
    // Combine date and time if both provided
    let dueDateTimeString = null;
    if (taskData.dueDate) {
      if (taskData.dueTime) {
        // Create date in local timezone
        const localDate = new Date(`${taskData.dueDate}T${taskData.dueTime}`);
        dueDateTimeString = localDate.toISOString();
      } else {
        const localDate = new Date(`${taskData.dueDate}T00:00`);
        dueDateTimeString = localDate.toISOString();
      }
    }

      const { error } = await supabase
        .from("tasks")
        .update({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: dueDateTimeString,
          work_type: taskData.workType,
        })
        .eq("id", editingTask.id);

      if (error) {
        toast.error("Failed to update task");
        return;
      }

      loadTasks();
      setEditingTask(null);
      toast.success("Task updated successfully!");
      return;
    }

    // Combine date and time if both provided
    let dueDateTimeString = null;
    if (taskData.dueDate) {
      if (taskData.dueTime) {
        // Create date in local timezone
        const localDate = new Date(`${taskData.dueDate}T${taskData.dueTime}`);
        dueDateTimeString = localDate.toISOString();
      } else {
        const localDate = new Date(`${taskData.dueDate}T00:00`);
        dueDateTimeString = localDate.toISOString();
      }
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: "pending",
        due_date: dueDateTimeString,
        category: taskData.category || null,
        work_type: taskData.workType,
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
      workType: data.work_type as WorkType,
    };

    setTasks((prev) => [newTask, ...prev]);
    toast.success("Task created successfully!");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pl-20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="gradient-animate rounded-3xl p-8 mb-8 animate-fade-in relative overflow-hidden">
          <div className="absolute top-4 right-4 animate-glow-pulse">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Here&apos;s what&apos;s on your plate today
          </p>
          <p className="text-base text-primary font-medium italic mt-4">
            {motivationalMessage}
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
                onEdit={handleEditTask}
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
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleCreateTask}
          editTask={editingTask}
        />
        <Chatbot />
      </div>
    </div>
  );
};

export default Dashboard;
