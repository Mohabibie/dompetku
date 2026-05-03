import { useNavigate, useLocation } from "react-router-dom";
import { Home, History, BarChart2, User } from "lucide-react";

const menus = [
  { label: "Beranda", icon: Home, path: "/beranda" },
  { label: "Histori", icon: History, path: "/histori" },
  { label: "Stat", icon: BarChart2, path: "/statistik" },
  { label: "Profil", icon: User, path: "/profil" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4 pb-4">
      <div className="bg-hijau rounded-full flex justify-around items-center py-3 px-2 shadow-lg">
        {menus.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full transition-all ${
                active ? "bg-white/20" : ""
              }`}
            >
              <Icon size={22} color={active ? "#fff" : "#1A1A1A"} />
              <span
                className={`text-xs font-medium ${
                  active ? "text-white" : "text-gelap"
                }`}
              >
                {label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
