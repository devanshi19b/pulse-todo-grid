import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Task, Priority } from "@/types/task";
import { toast } from "sonner";

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all");

  // Sample tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finalize the Q4 project proposal",
      priority: "high",
      status: "pending",
      dueDate: new Date(Date.now() + 86400000),
      createdAt: new Date(),
      tags: ["urgent", "work"],
    },
    {
      id: "2",
      title: "Update documentation",
      priority: "medium",
      status: "pending",
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Code review",
      priority: "low",
      status: "completed",
      createdAt: new Date(),
      completedAt: new Date(),
    },
  ]);

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
