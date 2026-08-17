// import { Link, useLocation } from "react-router-dom";
// import {
//   ChevronDown,
//   ChevronRight,
//   ClipboardList,
//   Database,
//   LayoutList,
//   Link2,
//   MessageSquare,
//   PanelLeftClose,
//   PanelLeftOpen,
//   Plus,
//   Sparkles,
//   X,
// } from "lucide-react";

// type Chat = { id: string; title: string };

// type SidebarProps = {
//   chats: Chat[];
//   activeChatId: string;
//   collapsed: boolean;
//   onToggle: () => void;
//   onNewChat: () => void;
//   onSelectChat: (id: string) => void;
//   isOpen: boolean;
//   onClose: () => void;
// };

// const NAV = [
//   { label: "Chats",          href: "/chat-history", icon: MessageSquare },
//   { label: "Lists",          href: "/lists",         icon: LayoutList     },
//   { label: "Extensions",     href: "/extensions",    icon: Link2          },
//   { label: "Prompt Library", href: "/prompts",       icon: ClipboardList  },
// ];

// export default function Sidebar({
//   chats,
//   activeChatId,
//   collapsed,
//   onToggle,
//   onNewChat,
//   onSelectChat,
//   isOpen,
//   onClose,
// }: SidebarProps) {
//   const { pathname } = useLocation();

//   return (
//     <>
//       {/* Mobile backdrop */}
//       {isOpen && (
//         <button
//           type="button"
//           aria-label="Close sidebar"
//           onClick={onClose}
//           className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
//         />
//       )}

//       <aside
//         style={{ backgroundColor: "var(--color-sidebar-bg)" }}
//         className={[
//           "fixed inset-y-0 left-0 z-50 flex flex-col text-white",
//           "border-r border-white/10 shadow-2xl",
//           "transition-[width,transform] duration-300 ease-in-out",
//           "md:relative md:z-20 md:translate-x-0 md:shadow-none",
//           collapsed ? "md:w-[76px]" : "md:w-[300px]",
//           isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
//           "w-[300px]",
//         ].join(" ")}
//       >
//         {/* ── Header ── */}
//         <div
//           className={[
//             "relative flex h-[72px] shrink-0 items-center border-b border-white/[0.08]",
//             collapsed ? "justify-center px-3" : "justify-between px-4",
//           ].join(" ")}
//         >
//           {collapsed ? (
//             /* Collapsed — icon badge only */
//             <button
//               type="button"
//               onClick={onNewChat}
//               aria-label="New chat"
//               className="flex h-10 w-10 items-center justify-center rounded-2xl transition hover:brightness-110"
//               style={{
//                 background: "linear-gradient(135deg, #3a5fa0 0%, #1e3d72 100%)",
//                 boxShadow: "0 2px 12px rgba(66,110,190,.45)",
//               }}
//             >
//               <Sparkles size={18} className="text-white" />
//             </button>
//           ) : (
//             <>
//               {/* Logo group */}
//               <button
//                 type="button"
//                 onClick={onNewChat}
//                 aria-label="New chat"
//                 className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-white/[0.05]"
//               >
//                 {/* Icon badge */}
//                 <div
//                   className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
//                   style={{
//                     background: "linear-gradient(135deg, #3a5fa0 0%, #1e3d72 100%)",
//                     boxShadow: "0 2px 10px rgba(66,110,190,.50)",
//                   }}
//                 >
//                   <Sparkles size={16} className="text-white" />
//                 </div>

//                 {/* Wordmark */}
//                 <div className="flex items-baseline gap-[1px] leading-none">
//                   <span
//                     className="text-[19px] font-bold tracking-[-0.6px] text-white"
//                     style={{ textShadow: "0 1px 8px rgba(255,255,255,.15)" }}
//                   >
//                     Prospect
//                   </span>
//                   <span
//                     className="text-[19px] font-bold tracking-[-0.6px]"
//                     style={{
//                       background: "linear-gradient(135deg, #7eb3ff 0%, #a8ccff 100%)",
//                       WebkitBackgroundClip: "text",
//                       WebkitTextFillColor: "transparent",
//                     }}
//                   >
//                     AI
//                   </span>
//                   <span
//                     className="text-[22px] font-bold leading-none"
//                     style={{
//                       background: "linear-gradient(135deg, #7eb3ff 0%, #60d4ff 100%)",
//                       WebkitBackgroundClip: "text",
//                       WebkitTextFillColor: "transparent",
//                     }}
//                   >
//                     .
//                   </span>
//                 </div>
//               </button>

//               {/* Right controls */}
//               <div className="flex items-center">
//                 <button
//                   type="button"
//                   onClick={onToggle}
//                   aria-label="Collapse sidebar"
//                   className="hidden rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white md:flex"
//                 >
//                   <PanelLeftClose size={18} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   aria-label="Close sidebar"
//                   className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white md:hidden"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             </>
//           )}

//           {/* Expand button when collapsed — sits below icon */}
//           {collapsed && (
//             <button
//               type="button"
//               onClick={onToggle}
//               aria-label="Expand sidebar"
//               className="absolute -right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0e2440] p-1 text-white/60 shadow-lg transition hover:bg-[#1a3454] hover:text-white md:flex"
//             >
//               <PanelLeftOpen size={13} />
//             </button>
//           )}
//         </div>

//         {/* ── New Chat ── */}
//         <div className={["px-4 pt-4", collapsed ? "flex justify-center" : ""].join(" ")}>
//           <button
//             type="button"
//             onClick={onNewChat}
//             title={collapsed ? "New Chat" : undefined}
//             style={{
//               backgroundColor: "var(--color-sidebar-btn)",
//             }}
//             className={[
//               "flex items-center rounded-xl text-white transition",
//               "hover:brightness-110 active:scale-[0.98]",
//               collapsed ? "h-11 w-11 justify-center" : "h-[48px] w-full gap-3 px-4",
//             ].join(" ")}
//           >
//             <Plus size={20} strokeWidth={2} />
//             {!collapsed && <span className="text-[15px] font-medium">New Chat</span>}
//           </button>
//         </div>

//         {/* ── Nav ── */}
//         <nav className="px-4 pt-4">
//           <div className="space-y-1">
//             {NAV.map(({ label, href, icon: Icon }) => {
//               const active = pathname === href || pathname.startsWith(`${href}/`);
//               return (
//                 <Link
//                   key={label}
//                   to={href}
//                   onClick={onClose}
//                   title={collapsed ? label : undefined}
//                   className={[
//                     "flex h-[48px] w-full items-center rounded-xl transition",
//                     active
//                       ? "bg-white/[0.13] text-white shadow-sm hover:bg-white/[0.18]"
//                       : "text-white/65 hover:bg-white/[0.07] hover:text-white",
//                     collapsed ? "justify-center" : "gap-3 px-3",
//                   ].join(" ")}
//                 >
//                   <Icon
//                     size={20}
//                     strokeWidth={1.8}
//                     className={active ? "text-blue-300" : "text-white/70"}
//                   />
//                   {!collapsed && (
//                     <span className={["flex-1 text-left text-[15px]", active ? "font-medium" : "font-normal"].join(" ")}>
//                       {label}
//                     </span>
//                   )}
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>

//         {/* ── Data API (disabled) ── */}
//         <div className="px-4 pt-1">
//           <div
//             title={collapsed ? "Data API — Coming Soon" : undefined}
//             className={[
//               "flex h-[48px] cursor-not-allowed items-center rounded-xl text-white/35",
//               collapsed ? "justify-center" : "gap-3 px-3",
//             ].join(" ")}
//           >
//             <Database size={20} strokeWidth={1.8} />
//             {!collapsed && (
//               <>
//                 <span className="flex-1 text-left text-[15px]">Data API</span>
//                 <span className="rounded-full bg-white/[0.07] px-2 py-1 text-[9px] font-medium uppercase tracking-wide text-white/40">
//                   Soon
//                 </span>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ── Divider ── */}
//         {!collapsed && <div className="mx-5 mt-4 border-t border-white/10" />}

//         {/* ── Recent Chats ── */}
//         <div className="min-h-0 flex-1 overflow-y-auto">
//           {!collapsed ? (
//             <div className="px-5 pt-6">
//               <div className="flex items-center justify-between">
//                 <span className="text-[13px] font-medium text-white/70">Recent Chats</span>
//                 <ChevronDown size={16} className="text-white/40" />
//               </div>
//               <div className="mt-3">
//                 {chats.length === 0 ? (
//                   <p className="px-3 py-2 text-xs text-white/35">No recent conversations</p>
//                 ) : (
//                   <div className="space-y-1">
//                     {chats.map((chat) => (
//                       <button
//                         key={chat.id}
//                         type="button"
//                         onClick={() => { onSelectChat(chat.id); onClose(); }}
//                         className={[
//                           "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
//                           chat.id === activeChatId
//                             ? "bg-white/10 text-white hover:bg-white/[0.16]"
//                             : "text-white/55 hover:bg-white/5 hover:text-white",
//                         ].join(" ")}
//                       >
//                         <MessageSquare size={14} className="shrink-0" />
//                         <span className="truncate">{chat.title}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="mt-6 flex justify-center">
//               <ChevronRight size={17} className="text-white/30" />
//             </div>
//           )}
//         </div>

//         {/* ── Credits ── */}
//         {!collapsed && (
//           <div className="border-t border-white/10 px-5 py-4">
//             <div className="flex items-center gap-2 text-xs">
//               <span className="text-blue-300">Credits</span>
//               <span className="text-white/30">/</span>
//               <button type="button" className="font-medium text-blue-300 transition hover:text-blue-200">
//                 Upgrade
//               </button>
//             </div>
//             <div className="mt-2 text-[24px] font-semibold tracking-tight">
//               200<span className="text-sm font-normal text-white/35"> / 200</span>
//             </div>
//             <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
//               <div className="h-full w-full rounded-full bg-[#638eff]" />
//             </div>
//             <p className="mt-2 text-xs text-white/35">Credits expire in 30 days</p>
//           </div>
//         )}

//         {/* ── Account ── */}
//         <div
//           className={[
//             "border-t border-white/10",
//             collapsed ? "flex justify-center p-4" : "px-5 py-4",
//           ].join(" ")}
//         >
//           <button
//             type="button"
//             title={collapsed ? "Account" : undefined}
//             className={["flex items-center", collapsed ? "justify-center" : "gap-3"].join(" ")}
//           >
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-500 text-sm font-bold text-zinc-900">
//               P
//             </div>
//             {!collapsed && (
//               <div className="min-w-0 text-left">
//                 <p className="truncate text-sm font-medium text-white">Prospect User</p>
//                 <p className="truncate text-xs text-white/40">demo@example.com</p>
//               </div>
//             )}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }


import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Database,
  LayoutList,
  Link2,
  MessageSquare,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

type Chat = {
  id: string;
  title: string;
};

type SidebarProps = {
  chats: Chat[];
  activeChatId: string;
  collapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

const NAV = [
  { label: "Chats", href: "/chat-history", icon: MessageSquare },
  { label: "Lists", href: "/lists", icon: LayoutList },
  { label: "Extensions", href: "/extensions", icon: Link2 },
  { label: "Prompt Library", href: "/prompts", icon: ClipboardList },
];

export default function Sidebar({
  chats,
  activeChatId,
  collapsed,
  onToggle,
  onNewChat,
  onSelectChat,
  isOpen,
  onClose,
}: SidebarProps) {
  const { pathname } = useLocation();

  // Desktop hover state
  const [isHovered, setIsHovered] = useState(false);

  /*
   * Desktop:
   *   mouse outside -> collapsed
   *   mouse inside  -> expanded
   *
   * Mobile:
   *   existing isOpen behavior is preserved.
   */
  const desktopCollapsed = !isHovered;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: "var(--color-sidebar-bg)",
        }}
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col text-white",
          "border-r border-white/10 shadow-2xl",
          "transition-[width,transform] duration-300 ease-in-out",
          "md:relative md:z-20 md:translate-x-0 md:shadow-none",

          // Desktop hover width
          desktopCollapsed ? "md:w-[76px]" : "md:w-[300px]",

          // Mobile
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0",

          "w-[300px]",
        ].join(" ")}
      >
        {/* ── Header ── */}
        <div
          className={[
            "relative flex h-[72px] shrink-0 items-center",
            "border-b border-white/[0.08]",
            desktopCollapsed
              ? "justify-center px-3"
              : "justify-between px-4",
          ].join(" ")}
        >
          {desktopCollapsed ? (
            /* Collapsed logo */
            <button
              type="button"
              onClick={onNewChat}
              aria-label="New chat"
              className="flex h-10 w-10 items-center justify-center rounded-2xl transition hover:brightness-110"
              style={{
                background:
                  "linear-gradient(135deg, #3a5fa0 0%, #1e3d72 100%)",
                boxShadow: "0 2px 12px rgba(66,110,190,.45)",
              }}
            >
              <Sparkles size={18} className="text-white" />
            </button>
          ) : (
            <>
              {/* Logo */}
              <button
                type="button"
                onClick={onNewChat}
                aria-label="New chat"
                className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-white/[0.05]"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #3a5fa0 0%, #1e3d72 100%)",
                    boxShadow: "0 2px 10px rgba(66,110,190,.50)",
                  }}
                >
                  <Sparkles size={16} className="text-white" />
                </div>

                <div className="flex items-baseline gap-[1px] leading-none">
                  <span
                    className="text-[19px] font-bold tracking-[-0.6px] text-white"
                    style={{
                      textShadow:
                        "0 1px 8px rgba(255,255,255,.15)",
                    }}
                  >
                    Prospect
                  </span>

                  <span
                    className="text-[19px] font-bold tracking-[-0.6px]"
                    style={{
                      background:
                        "linear-gradient(135deg, #7eb3ff 0%, #a8ccff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    AI
                  </span>

                  <span
                    className="text-[22px] font-bold leading-none"
                    style={{
                      background:
                        "linear-gradient(135deg, #7eb3ff 0%, #60d4ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    .
                  </span>
                </div>
              </button>

              {/* Mobile close */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white md:hidden"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>

        {/* ── New Chat ── */}
        <div
          className={[
            "px-4 pt-4",
            desktopCollapsed ? "flex justify-center" : "",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={onNewChat}
            title={desktopCollapsed ? "New Chat" : undefined}
            style={{
              backgroundColor: "var(--color-sidebar-btn)",
            }}
            className={[
              "flex items-center rounded-xl text-white transition",
              "hover:brightness-110 active:scale-[0.98]",
              desktopCollapsed
                ? "h-11 w-11 justify-center"
                : "h-[48px] w-full gap-3 px-4",
            ].join(" ")}
          >
            <Plus size={20} strokeWidth={2} />

            {!desktopCollapsed && (
              <span className="text-[15px] font-medium">
                New Chat
              </span>
            )}
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="px-4 pt-4">
          <div className="space-y-1">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href ||
                pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={label}
                  to={href}
                  onClick={onClose}
                  title={desktopCollapsed ? label : undefined}
                  className={[
                    "flex h-[48px] w-full items-center rounded-xl transition",
                    active
                      ? "bg-white/[0.13] text-white shadow-sm hover:bg-white/[0.18]"
                      : "text-white/65 hover:bg-white/[0.07] hover:text-white",
                    desktopCollapsed
                      ? "justify-center"
                      : "gap-3 px-3",
                  ].join(" ")}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                    className={
                      active
                        ? "text-blue-300"
                        : "text-white/70"
                    }
                  />

                  {!desktopCollapsed && (
                    <span
                      className={[
                        "flex-1 text-left text-[15px]",
                        active
                          ? "font-medium"
                          : "font-normal",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Data API ── */}
        <div className="px-4 pt-1">
          <div
            title={
              desktopCollapsed
                ? "Data API — Coming Soon"
                : undefined
            }
            className={[
              "flex h-[48px] cursor-not-allowed items-center rounded-xl text-white/35",
              desktopCollapsed
                ? "justify-center"
                : "gap-3 px-3",
            ].join(" ")}
          >
            <Database size={20} strokeWidth={1.8} />

            {!desktopCollapsed && (
              <>
                <span className="flex-1 text-left text-[15px]">
                  Data API
                </span>

                <span className="rounded-full bg-white/[0.07] px-2 py-1 text-[9px] font-medium uppercase tracking-wide text-white/40">
                  Soon
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        {!desktopCollapsed && (
          <div className="mx-5 mt-4 border-t border-white/10" />
        )}

        {/* ── Recent Chats ── */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {!desktopCollapsed ? (
            <div className="px-5 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-white/70">
                  Recent Chats
                </span>

                <ChevronDown
                  size={16}
                  className="text-white/40"
                />
              </div>

              <div className="mt-3">
                {chats.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-white/35">
                    No recent conversations
                  </p>
                ) : (
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        type="button"
                        onClick={() => {
                          onSelectChat(chat.id);
                          onClose();
                        }}
                        className={[
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                          chat.id === activeChatId
                            ? "bg-white/10 text-white hover:bg-white/[0.16]"
                            : "text-white/55 hover:bg-white/5 hover:text-white",
                        ].join(" ")}
                      >
                        <MessageSquare
                          size={14}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {chat.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 flex justify-center">
              <ChevronRight
                size={17}
                className="text-white/30"
              />
            </div>
          )}
        </div>

        {/* ── Credits ── */}
        {!desktopCollapsed && (
          <div className="border-t border-white/10 px-5 py-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-blue-300">Credits</span>

              <span className="text-white/30">/</span>

              <button
                type="button"
                className="font-medium text-blue-300 transition hover:text-blue-200"
              >
                Upgrade
              </button>
            </div>

            <div className="mt-2 text-[24px] font-semibold tracking-tight">
              200
              <span className="text-sm font-normal text-white/35">
                {" "}
                / 200
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full rounded-full bg-[#638eff]" />
            </div>

            <p className="mt-2 text-xs text-white/35">
              Credits expire in 30 days
            </p>
          </div>
        )}

        {/* ── Account ── */}
        <div
          className={[
            "border-t border-white/10",
            desktopCollapsed
              ? "flex justify-center p-4"
              : "px-5 py-4",
          ].join(" ")}
        >
          <button
            type="button"
            title={desktopCollapsed ? "Account" : undefined}
            className={[
              "flex items-center",
              desktopCollapsed
                ? "justify-center"
                : "gap-3",
            ].join(" ")}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-500 text-sm font-bold text-zinc-900">
              P
            </div>

            {!desktopCollapsed && (
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium text-white">
                  Prospect User
                </p>

                <p className="truncate text-xs text-white/40">
                  demo@example.com
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}