import React from "react";
import { NotificationItem } from "../types";
import { Bell, X, Check, Award, AlertCircle, Info } from "lucide-react";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-full shadow-2xl flex flex-col justify-between border-l border-white/50 dark:border-slate-800/50 animate-slideIn">
        
        {/* Header */}
        <div className="p-4 border-b border-white/50 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Notifications</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Recent Alerts</span>
            <button
              onClick={onMarkAllRead}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-[11px]"
            >
              Mark all as read
            </button>
          </div>

          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                item.unread
                  ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800"
                  : "bg-slate-50 dark:bg-slate-800/40 border-white/50 dark:border-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                  {item.type === "grade" && <Award className="w-3.5 h-3.5 text-emerald-500" />}
                  {item.type === "deadline" && <AlertCircle className="w-3.5 h-3.5 text-pink-500" />}
                  {item.type === "announcement" && <Info className="w-3.5 h-3.5 text-indigo-500" />}
                  <span>{item.title}</span>
                </span>
                <span className="text-[10px] text-slate-400">{item.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                {item.message}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/50 dark:border-slate-800/50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
