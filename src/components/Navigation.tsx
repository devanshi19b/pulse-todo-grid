import { LayoutDashboard, ListTodo, Calendar, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Navigation = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:left-0 md:bottom-auto md:w-20 md:h-screen">
      <div className="glass-card border-t md:border-r md:border-t-0 md:h-full">
        <div className="flex md:flex-col items-center justify-around md:justify-start md:py-8 md:gap-8 h-16 md:h-full px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 hover:bg-primary/10 group"
              activeClassName="bg-primary/20 neon-glow-blue"
            >
              <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors hidden md:block">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
