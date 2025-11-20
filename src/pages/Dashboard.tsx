import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Clock, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Task, Priority } from "@/types/task";
import { toast } from "sonner";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Load sample tasks
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Complete project proposal",
        description: "Finalize the Q4 project proposal and send to stakeholders",
        priority: "high",
        status: "pending",
        dueDate: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        category: "Work",
        tags: ["urgent", "deadline"],
      },
      {
        id: "2",
        title: "Team meeting preparation",
        description: "Prepare slides for tomorrow's team standup",
        priority: "medium",
        status: "pending",
        dueDate: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        category: "Work",
      },
      {
        id: "3",
        title: "Review code PRs",
        description: "Review and merge pending pull requests",
        priority: "low",
        status: "completed",
        createdAt: new Date(),
        completedAt: new Date(),
        category: "Development",
      },
    ];
    setTasks(sampleTasks);
  }, []);

  const stats = {
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    upcoming: tasks.filter((t) => t.dueDate && new Date(t.dueDate) > new Date()).length,
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
              completedAt: task.status === "completed" ? undefined : new Date(),
            }
          : task
      )
    );
    toast.success("Task updated!");
  };

  const handleCreateTask = (taskData: {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
    category: string;
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: "pending",
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      createdAt: new Date(),
      category: taskData.category,
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
