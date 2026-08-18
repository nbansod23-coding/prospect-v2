// import { useEffect, useMemo, useRef, useState } from "react";
// import type { MouseEvent } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   Bot,
//   CheckCircle2,
//   Download,
//   Eye,
//   FileText,
//   Grid2X2,
//   List as ListIcon,
//   MoreHorizontal,
//   Play,
//   Search,
//   Trash2,
//   Upload,
//   X,
// } from "lucide-react";

// import { SelectedDetail } from "@/components/SelectedDetail";
// import Sidebar from "@/components/Sidebar";
// import type { MockList } from "@/data/mockList";
// import { useListStore } from "@/store/listStore";
// import { useUIStore } from "@/store/uiStore";
// import { mockContacts } from "@/data/mockContacts";
// import type { Contact } from "@/types/contact";
// import CallingCampaignModal from "@/components/calling/CallingCampaignModal";


// /* ─────────────────────────────────────────────
//     HELPERS
// ───────────────────────────────────────────── */

// /**
//  * Convert prospects stored inside a MockList into
//  * the Contact shape used by the existing UI.
//  */
// function prospectsToContacts(list: MockList | null | undefined): Contact[] {
//   if (!list?.prospects?.length) {
//     return [];
//   }

//   return list.prospects.map((prospect) => ({
//     id: prospect.id,
//     listId: list.id,
//     name: prospect.contactName,
//     company: prospect.company,
//     phone: prospect.contactPhone ?? "",
//     status: "not_called",
//   }));
// }

// /**
//  * Get contacts for a list.
//  *
//  * Priority:
//  * 1. Contacts attached directly to the list through prospects
//  * 2. Existing mock contacts belonging to the list
//  */
// function getContactsForList(list: MockList, contacts: Contact[]): Contact[] {
//   // 1. Prefer actual prospects stored inside the list
//   if (list.prospects && list.prospects.length > 0) {
//     return list.prospects.map((prospect, index) => ({
//       id: prospect.id ?? list.id * 1000 + index + 1,
//       listId: list.id,
//       name: prospect.contactName || `Contact ${index + 1}`,
//       company: prospect.company || list.name,
//       phone: prospect.contactPhone || "",
//       status: "not_called",
//     }));
//   }

//   // 2. Use contacts already associated with this list
//   const existingContacts = contacts.filter(
//     (contact) => contact.listId === list.id,
//   );

//   if (existingContacts.length > 0) {
//     return existingContacts;
//   }

//   // 3. Demo/fallback contacts when the list has a row count
//   return Array.from({ length: list.rows }, (_, index) => ({
//     id: list.id * 1000 + index + 1,
//     listId: list.id,
//     name: `Contact ${index + 1}`,
//     company: list.name,
//     phone: `+91 90000 ${String(index + 1).padStart(5, "0")}`,
//     status: "not_called",
//   }));
// }

// function prospectToContact(prospect: Prospect, listId: number): Contact {
//   return {
//     id: prospect.id,
//     listId,
//     name: prospect.contactName,
//     company: prospect.company,
//     phone: prospect.contactPhone ?? "",
//     status: "not_called",
//   };
// }

// /* ─────────────────────────────────────────────
//    CALL OUTCOME TYPES
// ───────────────────────────────────────────── */

// type CallOutcomeSummary = {
//   interested: number;
//   notInterested: number;
//   callBack: number;
//   noAnswer: number;
//   called: number;
// };

// /* ─────────────────────────────────────────────
//    PAGE
// ───────────────────────────────────────────── */

// export default function ListsPage() {
//   const navigate = useNavigate();

//   const { sidebarCollapsed, toggleSidebar } = useUIStore();

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const lists = useListStore((state) => state.lists);
//   const addList = useListStore((state) => state.addList);
//   const removeList = useListStore((state) => state.removeList);
//   const updateList = useListStore((state) => state.updateList);
//   const [contacts] = useState<Contact[]>(mockContacts);

//   const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

//   const [search, setSearch] = useState("");

//   const [view, setView] = useState<"grid" | "list">("list");

//   const [menuId, setMenuId] = useState<number | null>(null);

//   const [selected, setSelected] = useState<MockList | null>(null);

//   const [agentMenuId, setAgentMenuId] = useState<number | null>(null);

//   const [showAgent, setShowAgent] = useState(false);

//   const [showUpload, setShowUpload] = useState(false);

//   const [showCallSuccess, setShowCallSuccess] = useState(false);

//   /* ─────────────────────────────────────────────
//       FILTER LISTS
//   ───────────────────────────────────────────── */

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();

//     if (!q) {
//       return lists;
//     }

//     return lists.filter((list) => list.name.toLowerCase().includes(q));
//   }, [lists, search]);

//   /* ─────────────────────────────────────────────
//      OPEN CAMPAIGN
//   ───────────────────────────────────────────── */

//   function openCallingAgent(id: number) {
//     const list = lists.find((item) => item.id === id);

//     if (!list) {
//       return;
//     }

//     setSelected(list);
//     setShowAgent(true);
//   }

//   /* ─────────────────────────────────────────────
//      UPDATE LIST AFTER CALL CAMPAIGN
//      ───────────────────────────────────────────── */

//   // function handleCallComplete(outcomes: CallOutcomeSummary) {
//   //   if (!selected) return;

//   //   const currentList = lists.find((list) => list.id === selected.id);

//   //   if (!currentList) return;

//   //   const campaignCalled = Math.max(
//   //     0,
//   //     outcomes.called ??
//   //       outcomes.interested +
//   //         outcomes.notInterested +
//   //         outcomes.callBack +
//   //         outcomes.noAnswer,
//   //   );

//   //   updateList(selected.id, {
//   //     interested: currentList.interested + outcomes.interested,
//   //     notInterested: currentList.notInterested + outcomes.notInterested,
//   //     callBack: currentList.callBack + outcomes.callBack,
//   //     noAnswer: currentList.noAnswer + outcomes.noAnswer,
//   //     called: currentList.called + campaignCalled,
//   //     notCalled: Math.max(0, currentList.notCalled - campaignCalled),
//   //     status: "ready",
//   //   });

//   //   setShowAgent(false);
//   //   setSelected(null);
//   //   setSelectedContacts([]);
//   //   setShowCallSuccess(true);
//   // }

//   const handleCallComplete = (
//   listId: number,
//   summary: CallOutcomeSummary
// ) => {
//   const list = lists.find((item) => item.id === listId);

//   if (!list) return;

//   updateList(listId, {
//     interested: summary.interested,
//     notInterested: summary.notInterested,
//     callBack: summary.callBack,
//     noAnswer: summary.noAnswer,
//     called: summary.called,
//     notCalled: Math.max(
//       0,
//       list.contacts.length - summary.called
//     ),
//     isCalled: true,
//     status: "ready",
//   });

//   setCallingCampaign(null);
// };


//   /* ─────────────────────────────────────────────
//       CALL COMPLETION MESSAGE
//   ───────────────────────────────────────────── */

//   useEffect(() => {
//     if (!showCallSuccess) return;

//     const dismiss = () => setShowCallSuccess(false);

//     const timer = window.setTimeout(() => {
//       document.addEventListener("click", dismiss, { once: true });
//     }, 120);

//     return () => {
//       window.clearTimeout(timer);
//       document.removeEventListener("click", dismiss);
//     };
//   }, [showCallSuccess]);

//   /* ─────────────────────────────────────────────
//       DOWNLOAD CSV
//   ───────────────────────────────────────────── */

//   function downloadCSV(list: MockList) {
//     const rows = [
//       [
//         "Name",
//         "Source",
//         "Created At",
//         "Total Contacts",
//         "Interested",
//         "Not Interested",
//         "Call Back",
//         "No Answer",
//         "Not Called",
//         "Status",
//       ],
//       [
//         list.name,
//         list.source,
//         list.createdAt,
//         list.rows,
//         list.interested,
//         list.notInterested,
//         list.callBack,
//         list.noAnswer,
//         list.notCalled,
//         list.status,
//       ],
//     ];

//     const csv = rows
//       .map((row) =>
//         row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
//       )
//       .join("\n");

//     const blob = new Blob([csv], {
//       type: "text/csv",
//     });

//     const url = URL.createObjectURL(blob);

//     const anchor = document.createElement("a");

//     anchor.href = url;
//     anchor.download = `${list.name.replace(/\s+/g, "_")}.csv`;

//     document.body.appendChild(anchor);
//     anchor.click();
//     anchor.remove();

//     URL.revokeObjectURL(url);
//   }

//   /* ─────────────────────────────────────────────
//       RENDER
//   ───────────────────────────────────────────── */

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar
//         chats={[]}
//         activeChatId=""
//         collapsed={sidebarCollapsed}
//         onToggle={toggleSidebar}
//         onNewChat={() => navigate("/chat")}
//         onSelectChat={() => {}}
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <main
//         className="flex min-w-0 flex-1 flex-col overflow-y-auto"
//         onClick={() => {
//           setMenuId(null);
//           setAgentMenuId(null);
//         }}
//       >
//         <div className="mx-auto w-full max-w-6xl px-6 py-8">
//           {/* HEADER */}

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1
//                 className="text-3xl font-semibold"
//                 style={{
//                   color: "var(--color-text-heading)",
//                 }}
//               >
//                 Lists
//               </h1>

//               <p
//                 className="mt-1 text-sm"
//                 style={{
//                   color: "var(--color-text-muted)",
//                 }}
//               >
//                 Upload PDF or CSV files to manage your contact lists.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => setShowUpload(true)}
//               className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:scale-[.98]"
//               style={{
//                 background: "var(--color-primary)",
//               }}
//             >
//               <Upload size={16} />
//               Upload List
//             </button>
//           </div>

//           {/* STATS */}

//           <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
//             {[
//               {
//                 label: "Total Lists",
//                 value: lists.length,
//                 color: "var(--color-primary)",
//               },
//               {
//                 label: "Total Contacts",
//                 value: lists.reduce((total, list) => total + list.rows, 0),
//                 color: "#22c55e",
//               },
//               {
//                 label: "Interested",
//                 value: lists.reduce(
//                   (total, list) => total + list.interested,
//                   0,
//                 ),
//                 color: "#22c55e",
//               },
//               {
//                 label: "Not Called",
//                 value: lists.reduce((total, list) => total + list.notCalled, 0),
//                 color: "var(--color-text-faint)",
//               },
//             ].map(({ label, value, color }) => (
//               <div
//                 key={label}
//                 className="rounded-2xl p-4 shadow-sm"
//                 style={{
//                   border: "1px solid var(--color-border)",
//                   background: "var(--color-surface)",
//                 }}
//               >
//                 <p
//                   className="text-xs"
//                   style={{
//                     color: "var(--color-text-faint)",
//                   }}
//                 >
//                   {label}
//                 </p>

//                 <p className="mt-1 text-2xl font-semibold" style={{ color }}>
//                   {value}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* TOOLBAR */}

//           <div className="mt-6 flex items-center gap-3">
//             <div className="relative max-w-sm flex-1">
//               <Search
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2"
//                 style={{
//                   color: "var(--color-text-faint)",
//                 }}
//               />

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search lists…"
//                 className="h-10 w-full rounded-xl pl-9 pr-4 text-sm outline-none transition"
//                 style={{
//                   border: "1px solid var(--color-border)",
//                   background: "var(--color-surface)",
//                   color: "var(--color-text-body)",
//                 }}
//               />
//             </div>

//             <div
//               className="flex items-center gap-1 rounded-xl p-1"
//               style={{
//                 border: "1px solid var(--color-border)",
//                 background: "var(--color-surface)",
//               }}
//             >
//               {[
//                 {
//                   value: "grid",
//                   Icon: Grid2X2,
//                 },
//                 {
//                   value: "list",
//                   Icon: ListIcon,
//                 },
//               ].map(({ value, Icon }) => (
//                 <button
//                   key={value}
//                   type="button"
//                   onClick={() => setView(value as "grid" | "list")}
//                   className="flex h-8 w-8 items-center justify-center rounded-lg transition"
//                   style={{
//                     background:
//                       view === value ? "var(--color-accent-bg)" : "transparent",

//                     color:
//                       view === value
//                         ? "var(--color-primary)"
//                         : "var(--color-text-faint)",
//                   }}
//                 >
//                   <Icon size={15} />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* LISTS */}

//           {filtered.length === 0 ? (
//             <div
//               className="mt-8 flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed"
//               style={{
//                 borderColor: "var(--color-border)",
//               }}
//             >
//               <div className="text-center">
//                 <FileText
//                   size={32}
//                   className="mx-auto mb-3"
//                   style={{
//                     color: "var(--color-text-faint)",
//                   }}
//                 />

//                 <p
//                   className="text-sm font-medium"
//                   style={{
//                     color: "var(--color-text-body)",
//                   }}
//                 >
//                   No lists found
//                 </p>

//                 <p
//                   className="mt-1 text-xs"
//                   style={{
//                     color: "var(--color-text-muted)",
//                   }}
//                 >
//                   Upload a CSV or PDF to get started
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div
//               className={[
//                 "mt-6",
//                 view === "grid"
//                   ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
//                   : "space-y-3",
//               ].join(" ")}
//             >
//               {filtered.map((list) => {
//                 const isSelected = selected?.id === list.id;

//                 const listContacts = contacts.filter(
//                   (contact) => contact.listId === list.id,
//                 );
//                 // const listContacts =
//                 //   list.prospects && list.prospects.length > 0
//                 //     ? list.prospects.map((prospect) =>
//                 //         prospectToContact(prospect, list.id),
//                 //       )
//                 //     : contacts.filter((contact) => contact.listId === list.id);
//                 console.log(
//                   "LIST PAGE",
//                   contacts.filter((contact) => contact.listId === list.id),
//                 );
//                 return (
//                   <div key={list.id}>
//                     {/* LIST CARD */}
//                     <ListCard
//                       list={list}
//                       view={view}
//                       menuOpen={menuId === list.id}
//                       agentMenuOpen={agentMenuId === list.id}
//                       onMenuToggle={(e) => {
//                         e.stopPropagation();

//                         setMenuId(menuId === list.id ? null : list.id);

//                         setAgentMenuId(null);
//                       }}
//                       onAgentMenuToggle={(e) => {
//                         e.stopPropagation();

//                         setAgentMenuId(
//                           agentMenuId === list.id ? null : list.id,
//                         );
//                       }}
//                       onView={() => {
//                         if (isSelected) {
//                           // Close the currently opened list
//                           setSelected(null);
//                           setSelectedContacts([]);
//                         } else {
//                           // Open this list
//                           setSelected(list);

//                           setSelectedContacts(
//                             listContacts.map((contact) => contact.id),
//                           );
//                         }

//                         setMenuId(null);
//                         setAgentMenuId(null);
//                       }}
//                       onStartCampaign={() => {
//                         setMenuId(null);
//                         setAgentMenuId(null);

//                         openCallingAgent(list.id);
//                       }}
//                       onDownload={() => {
//                         setMenuId(null);
//                         setAgentMenuId(null);

//                         downloadCSV(list);
//                       }}
//                       onDelete={() => {
//                         setMenuId(null);
//                         setAgentMenuId(null);

//                         removeList(list.id);
//                       }}
//                     />

//                     {/* OPEN SELECTED LIST HERE */}
//                     {isSelected && (
//                       <SelectedDetail
//                         list={list}
//                         contacts={listContacts}
//                         selectedContacts={selectedContacts}
//                         onSelectContact={(contactId) => {
//                           setSelectedContacts((current) =>
//                             current.includes(contactId)
//                               ? current.filter((id) => id !== contactId)
//                               : [...current, contactId],
//                           );
//                         }}
//                         onStartCampaign={() => {
//                           openCallingAgent(list.id);
//                         }}
//                         onClose={() => {
//                           setSelected(null);
//                           setSelectedContacts([]);
//                         }}
//                       />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* UPLOAD */}

//       {showUpload && (
//         <UploadModal onClose={() => setShowUpload(false)} onAddList={addList} />
//       )}

//       {/* CALLING CAMPAIGN */}

//       {showAgent && selected && (
//         <CallingCampaignModal
//           listId={selected.id}
//           listName={selected.name}
//           contacts={getContactsForList(selected, contacts)}
//           onClose={() => setShowAgent(false)}
//           onComplete= {(summary) => handleCallComplete
//             (CallingCampaignModal.listId, summary)
//           }
//             // setShowAgent(false);
//             // setShowCallSuccess(true);

          
//         />
//       )}

//       {/* CALL COMPLETED MESSAGE */}

//       {showCallSuccess && (
//         <div
//           className="fixed inset-0 z-[70]"
//           onClick={() => setShowCallSuccess(false)}
//         >
//           <div className="flex justify-center px-4 pt-8">
//             <div
//               className="flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-2xl"
//               style={{ borderColor: "#bbf7d0" }}
//             >
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
//                 <CheckCircle2 size={21} />
//               </div>

//               <div>
//                 <p className="text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
//                   Calling process successfully completed
//                 </p>
//                 <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
//                   All selected contacts have been processed.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    LIST CARD
// ───────────────────────────────────────────── */

// function ListCard({
//   list,
//   view,
//   menuOpen,
//   agentMenuOpen,
//   onMenuToggle,
//   onAgentMenuToggle,
//   onView,
//   onStartCampaign,
//   onDownload,
//   onDelete,
// }: {
//   list: MockList;
//   view: "grid" | "list";
//   menuOpen: boolean;
//   agentMenuOpen: boolean;
//   onMenuToggle: (event: MouseEvent) => void;
//   onAgentMenuToggle: (e: React.MouseEvent) => void;
//   onView: () => void;
//   onStartCampaign: () => void;
//   onDownload: () => void;
//   onDelete: () => void;
// }) {
//   const statusColor: Record<string, string> = {
//     ready: "#22c55e",
//     processing: "#f59e0b",
//     failed: "#ef4444",
//   };

//   if (view === "list") {
//     return (
//       <div
//         className="flex cursor-pointer items-center gap-4 rounded-2xl p-4 shadow-sm transition hover:shadow-md"
//         style={{
//           border: "1px solid var(--color-border)",
//           background: "var(--color-surface)",
//         }}
//         onClick={onView}
//       >
//         <div
//           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
//           style={{
//             background: "var(--color-accent-bg)",
//             color: "var(--color-primary)",
//           }}
//         >
//           <FileText size={18} />
//         </div>

//         <div className="min-w-0 flex-1">
//           <p
//             className="truncate text-sm font-semibold"
//             style={{
//               color: "var(--color-text-heading)",
//             }}
//           >
//             {list.name}
//           </p>

//           <p
//             className="text-xs"
//             style={{
//               color: "var(--color-text-muted)",
//             }}
//           >
//             {list.rows} contacts · {list.source}
//           </p>
//         </div>

//         <span
//           className="text-xs font-medium"
//           style={{
//             color: statusColor[list.status],
//           }}
//         >
//           {list.status}
//         </span>

//         <div className="relative" onClick={(event) => event.stopPropagation()}>
//           <button
//             type="button"
//             onClick={onMenuToggle}
//             className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f0f4ff]"
//             style={{
//               color: "var(--color-text-faint)",
//             }}
//           >
//             <MoreHorizontal size={16} />
//           </button>

//           {menuOpen && (
//             <CardMenu
//               onView={onView}
//               onStartCampaign={onStartCampaign}
//               onDownload={onDownload}
//               onDelete={onDelete}
//               agentMenuOpen={agentMenuOpen}
//               onAgentMenuToggle={onAgentMenuToggle}
//             />
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="relative flex cursor-pointer flex-col rounded-2xl p-5 shadow-sm transition hover:shadow-md"
//       style={{
//         border: "1px solid var(--color-border)",
//         background: "var(--color-surface)",
//       }}
//       onClick={onView}
//     >
//       <div className="flex items-start justify-between">
//         <div
//           className="flex h-11 w-11 items-center justify-center rounded-xl"
//           style={{
//             background: "var(--color-accent-bg)",
//             color: "var(--color-primary)",
//           }}
//         >
//           <FileText size={20} />
//         </div>

//         <div className="relative" onClick={(event) => event.stopPropagation()}>
//           <button
//             type="button"
//             onClick={onMenuToggle}
//             className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f0f4ff]"
//             style={{
//               color: "var(--color-text-faint)",
//             }}
//           >
//             <MoreHorizontal size={16} />
//           </button>

//           {menuOpen && (
//             <CardMenu
//               onView={onView}
//               onStartCampaign={onStartCampaign}
//               onDownload={onDownload}
//               onDelete={onDelete}
//               agentMenuOpen={false}
//               onAgentMenuToggle={function (e: React.MouseEvent): void {
//                 throw new Error("Function not implemented.");
//               }}
//             />
//           )}
//         </div>
//       </div>

//       <h3
//         className="mt-3 text-sm font-semibold"
//         style={{
//           color: "var(--color-text-heading)",
//         }}
//       >
//         {list.name}
//       </h3>

//       <p
//         className="mt-1 text-xs"
//         style={{
//           color: "var(--color-text-muted)",
//         }}
//       >
//         {list.source} · {list.createdAt}
//       </p>

//       <div className="mt-4 grid grid-cols-3 gap-2 text-center">
//         {[
//           {
//             label: "Contacts",
//             value: list.rows,
//           },
//           {
//             label: "Interested",
//             value: list.interested,
//           },
//           {
//             label: "Not Called",
//             value: list.notCalled,
//           },
//         ].map(({ label, value }) => (
//           <div
//             key={label}
//             className="rounded-lg p-2"
//             style={{
//               background: "var(--color-bg)",
//             }}
//           >
//             <p
//               className="text-base font-bold"
//               style={{
//                 color: "var(--color-text-heading)",
//               }}
//             >
//               {value}
//             </p>

//             <p
//               className="text-[10px]"
//               style={{
//                 color: "var(--color-text-faint)",
//               }}
//             >
//               {label}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="mt-4 flex items-center justify-between">
//         <span
//           className="flex items-center gap-1.5 text-xs font-medium"
//           style={{
//             color: statusColor[list.status],
//           }}
//         >
//           <span
//             className="h-1.5 w-1.5 rounded-full"
//             style={{
//               background: statusColor[list.status],
//             }}
//           />

//           {list.status}
//         </span>

//         <button
//           type="button"
//           onClick={(event) => {
//             event.stopPropagation();
//             onStartCampaign();
//           }}
//           className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
//           style={{
//             background: "var(--color-primary)",
//           }}
//         >
//           <Play size={11} />
//           Start Campaign
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    CARD MENU
// ───────────────────────────────────────────── */

// function CardMenu({
//   onView,
//   onStartCampaign,
//   onDownload,
//   onDelete,
//   agentMenuOpen,
//   onAgentMenuToggle,
// }: {
//   onView: () => void;
//   onStartCampaign: () => void;
//   onDownload: () => void;
//   onDelete: () => void;
//   agentMenuOpen: boolean;
//   onAgentMenuToggle: (e: React.MouseEvent) => void;
// }) {
//   return (
//     <div
//       className="absolute right-0 top-9 z-40 w-64 overflow-visible rounded-xl p-1.5"
//       style={{
//         border: `1px solid var(--color-border)`,
//         background: "var(--color-surface)",
//         boxShadow: "var(--shadow-dropdown)",
//       }}
//     >
//       {/* View List */}
//       <button
//         type="button"
//         onClick={onView}
//         className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#f5f8fc]"
//         style={{ color: "var(--color-text-body)" }}
//       >
//         <Eye size={17} style={{ color: "var(--color-primary)" }} />

//         <span>View List</span>
//       </button>

//       {/* Start Campaign
//       <button
//         type="button"
//         onClick={onStartCampaign}
//         className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#f5f8fc]"
//         style={{ color: "var(--color-text-body)" }}
//       >
//         <Sparkles
//           size={17}
//           style={{ color: "var(--color-primary)" }}
//         />

//         <span>Start Campaign</span>
//       </button> */}

//       {/* Add Agent */}
//       <div className="relative">
//         <button
//           type="button"
//           onClick={onStartCampaign}
//           className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#f0f5ff]"
//           style={{
//             background: agentMenuOpen
//               ? "var(--color-accent-bg)"
//               : "transparent",
//             color: "var(--color-text-body)",
//           }}
//         >
//           <Bot size={17} style={{ color: "var(--color-primary)" }} />

//           <div className="min-w-0 flex-1 text-left">
//             <p className="font-medium">Add Agent</p>

//             <p
//               className="mt-0.5 text-[10px]"
//               style={{
//                 color: "var(--color-text-faint)",
//               }}
//             >
//               Choose an AI calling agent
//             </p>
//           </div>

//           <span
//             className="text-base"
//             style={{
//               color: "var(--color-text-faint)",
//             }}
//           >
//             ›
//           </span>
//         </button>

//         {/* Agent submenu */}
      
//       </div>

//       {/* Divider */}
//       <div
//         className="my-1 h-px"
//         style={{
//           background: "var(--color-border-light)",
//         }}
//       />

//       {/* Download */}
//       <button
//         type="button"
//         onClick={onDownload}
//         className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#f5f8fc]"
//         style={{
//           color: "var(--color-text-body)",
//         }}
//       >
//         <Download
//           size={17}
//           style={{
//             color: "var(--color-primary)",
//           }}
//         />

//         <span>Download CSV</span>
//       </button>

//       {/* Divider */}
//       <div
//         className="my-1 h-px"
//         style={{
//           background: "var(--color-border-light)",
//         }}
//       />

//       {/* Delete */}
//       <button
//         type="button"
//         onClick={onDelete}
//         className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
//       >
//         <Trash2 size={17} />

//         <span>Delete</span>
//       </button>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    UPLOAD MODAL
// ───────────────────────────────────────────── */

// function UploadModal({
//   onClose,
//   onAddList,
// }: {
//   onClose: () => void;
//   onAddList: (list: MockList) => void;
// }) {
//   const fileRef = useRef<HTMLInputElement>(null);

//   const [dragging, setDragging] = useState(false);
//   const [file, setFile] = useState<File | null>(null);

//   function handleFile(f: File) {
//     const ext = f.name.split(".").pop()?.toLowerCase();

//     if (ext !== "csv" && ext !== "pdf") {
//       alert("Only CSV or PDF files are supported.");
//       return;
//     }

//     if (f.size > 10 * 1024 * 1024) {
//       alert("File size must be less than 10 MB.");
//       return;
//     }

//     setFile(f);
//   }

//   function handleUpload() {
//     if (!file) return;

//     const fileName = file.name.replace(/\.[^/.]+$/, "");

//     const newId = Date.now();

//     const newList: MockList = {
//       id: newId,
//       name: fileName || "New Contact List",
//       rows: 0,
//       createdAt: new Date().toISOString().split("T")[0],
//       status: "processing",
//       source: file.name.toLowerCase().endsWith(".csv")
//         ? "CSV Upload"
//         : "PDF Extract",
//       interested: 0,
//       notInterested: 0,
//       callBack: 0,
//       noAnswer: 0,
//       notCalled: 0,
//       prospects: [],
//       called: 10,
//     };

//     onAddList(newList);

//     onClose();
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
//         {/* Header */}
//         <div
//           className="flex items-center justify-between border-b p-5"
//           style={{
//             borderColor: "var(--color-border-light)",
//           }}
//         >
//           <h2
//             className="text-base font-semibold"
//             style={{
//               color: "var(--color-text-heading)",
//             }}
//           >
//             Upload List
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f5f8fc]"
//             style={{
//               color: "var(--color-text-faint)",
//             }}
//           >
//             <X size={17} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6">
//           <div
//             onDragOver={(e) => {
//               e.preventDefault();
//               setDragging(true);
//             }}
//             onDragLeave={() => setDragging(false)}
//             onDrop={(e) => {
//               e.preventDefault();
//               setDragging(false);

//               const droppedFile = e.dataTransfer.files[0];

//               if (droppedFile) {
//                 handleFile(droppedFile);
//               }
//             }}
//             onClick={() => fileRef.current?.click()}
//             className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition"
//             style={{
//               borderColor: dragging
//                 ? "var(--color-primary)"
//                 : "var(--color-border)",

//               background: dragging
//                 ? "var(--color-accent-bg)"
//                 : "var(--color-bg)",
//             }}
//           >
//             <div
//               className="flex h-14 w-14 items-center justify-center rounded-2xl"
//               style={{
//                 background: "var(--color-accent-bg)",
//                 color: "var(--color-primary)",
//               }}
//             >
//               <Upload size={26} />
//             </div>

//             {file ? (
//               <>
//                 <p
//                   className="mt-4 max-w-full truncate px-4 text-sm font-medium"
//                   style={{
//                     color: "var(--color-text-heading)",
//                   }}
//                 >
//                   {file.name}
//                 </p>

//                 <p
//                   className="mt-1 text-xs"
//                   style={{
//                     color: "var(--color-text-muted)",
//                   }}
//                 >
//                   Ready to upload
//                 </p>
//               </>
//             ) : (
//               <>
//                 <p
//                   className="mt-4 text-sm font-medium"
//                   style={{
//                     color: "var(--color-text-body)",
//                   }}
//                 >
//                   Drop your file here
//                 </p>

//                 <p
//                   className="mt-1 text-xs"
//                   style={{
//                     color: "var(--color-text-muted)",
//                   }}
//                 >
//                   PDF or CSV · max 10 MB
//                 </p>
//               </>
//             )}

//             <input
//               ref={fileRef}
//               type="file"
//               accept=".pdf,.csv"
//               className="hidden"
//               onChange={(e) => {
//                 const selectedFile = e.target.files?.[0];

//                 if (selectedFile) {
//                   handleFile(selectedFile);
//                 }
//               }}
//             />
//           </div>

//           {/* Buttons */}
//           <div className="mt-5 flex gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 rounded-xl border py-3 text-sm font-medium transition hover:bg-[#f5f8fc]"
//               style={{
//                 borderColor: "var(--color-border)",
//                 color: "var(--color-text-body)",
//               }}
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               disabled={!file}
//               onClick={handleUpload}
//               className="flex-1 rounded-xl py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
//               style={{
//                 background: "var(--color-primary)",
//               }}
//             >
//               Upload
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bot,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Grid2X2,
  List as ListIcon,
  MoreHorizontal,
  Play,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { SelectedDetail } from "@/components/SelectedDetail";
import Sidebar from "@/components/Sidebar";
import type { MockList } from "@/data/mockList";
import { mockContacts } from "@/data/mockContacts";
import { deriveListTotals } from "@/lib/listMetrics";
import { useCampaignStore } from "@/store/campaignStore";
import { useListStore } from "@/store/listStore";
import { useUIStore } from "@/store/uiStore";
import type { Contact } from "@/types/contact";
import CallingCampaignModal from "@/components/calling/CallingCampaignModal";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

/**
 * Get all contacts belonging to a list.
 *
 * Priority:
 * 1. Prospects stored directly on the list
 * 2. Existing mock contacts belonging to the list
 * 3. Generate fallback contacts using list.rows
 */
function getContactsForList(
  list: MockList,
  contacts: Contact[],
): Contact[] {
  // 1. Use prospects attached to the list
  if (list.prospects && list.prospects.length > 0) {
    return list.prospects.map((prospect, index) => ({
      id: prospect.id ?? list.id * 1000 + index + 1,
      listId: list.id,
      name: prospect.contactName || `Contact ${index + 1}`,
      company: prospect.company || list.name,
      designation: prospect.contactTitle || "",
      phone: prospect.contactPhone || "",
      email: prospect.contactEmail || "",
      callFeedback: "Not Answered",
      status: "not_called",
    }));
  }

  // 2. Use existing contacts
  const existingContacts = contacts.filter(
    (contact) => contact.listId === list.id,
  );

  if (existingContacts.length > 0) {
    return existingContacts;
  }

  // 3. Fallback contacts
  return Array.from({ length: list.rows }, (_, index) => ({
    id: list.id * 1000 + index + 1,
    listId: list.id,
    name: `Contact ${index + 1}`,
    company: list.name,
    designation: "",
    phone: `+91 90000 ${String(index + 1).padStart(5, "0")}`,
    email: "",
    callFeedback: "Not Answered",
    status: "not_called",
  }));
}

function resultToContactStatus(
  result: string | undefined,
): Contact["status"] {
  switch (result) {
    case "interested":
      return "interested";
    case "not_interested":
      return "not_interested";
    case "call_back":
      return "call_back";
    case "no_answer":
      return "no_answer";
    default:
      return "not_called";
  }
}

function resultToCallFeedback(
  result: string | undefined,
): Contact["callFeedback"] {
  switch (result) {
    case "interested":
      return "Interested";
    case "not_interested":
      return "Not Interested";
    case "call_back":
      return "Call Back";
    case "no_answer":
    default:
      return "Not Answered";
  }
}

/* ─────────────────────────────────────────────
   CALL OUTCOME TYPES
───────────────────────────────────────────── */

type CallOutcomeSummary = {
  interested: number;
  notInterested: number;
  callBack: number;
  noAnswer: number;
  called: number;
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function ListsPage() {
  const navigate = useNavigate();

  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const lists = useListStore((state) => state.lists);
  const addList = useListStore((state) => state.addList);
  const removeList = useListStore((state) => state.removeList);
  const updateList = useListStore((state) => state.updateList);
  const activeCampaign = useCampaignStore(
    (state) => state.activeCampaign,
  );

  const [contacts] = useState<Contact[]>(mockContacts);

  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  const [search, setSearch] = useState("");

  // List view is the default
  const [view, setView] = useState<"grid" | "list">("list");

  const [menuId, setMenuId] = useState<number | null>(null);

  const [selected, setSelected] = useState<MockList | null>(null);

  const [showAgent, setShowAgent] = useState(false);

  const [showUpload, setShowUpload] = useState(false);

  const [showCallSuccess, setShowCallSuccess] = useState(false);

  /* ─────────────────────────────────────────────
     FILTER LISTS
  ───────────────────────────────────────────── */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      return lists;
    }

    return lists.filter((list) =>
      list.name.toLowerCase().includes(q),
    );
  }, [lists, search]);

  const totals = useMemo(() => deriveListTotals(lists), [lists]);

  const selectedCampaignResults =
    activeCampaign?.listId === selected?.id
      ? activeCampaign?.results
      : null;

  const selectedListContacts = useMemo(() => {
    if (!selected) {
      return [];
    }

    const baseContacts = getContactsForList(selected, contacts);

    return baseContacts.map((contact) => {
      const result =
        selectedCampaignResults?.[contact.id];

      return {
        ...contact,
        status: resultToContactStatus(result),
        callFeedback: resultToCallFeedback(result),
      };
    });
  }, [contacts, selected, selectedCampaignResults]);

  /* ─────────────────────────────────────────────
     OPEN CAMPAIGN
  ───────────────────────────────────────────── */

  function openCallingAgent(id: number) {
    const list = lists.find((item) => item.id === id);

    if (!list) {
      return;
    }

    const listContacts = getContactsForList(list, contacts);

    setSelected(list);
    setSelectedContacts(
      listContacts.map((contact) => contact.id),
    );
    setShowAgent(true);
  }

  /* ─────────────────────────────────────────────
     UPDATE LIST AFTER CALL CAMPAIGN
  ───────────────────────────────────────────── */

  function handleCallComplete(
    listId: number,
    summary: CallOutcomeSummary,
  ) {
    const currentList = lists.find(
      (list) => list.id === listId,
    );

    if (!currentList) {
      return;
    }

    const totalContacts = getContactsForList(
      currentList,
      contacts,
    ).length;

    const campaignCalled = Math.min(
      totalContacts,
      Math.max(
        0,
        summary.called ??
          summary.interested +
            summary.notInterested +
            summary.callBack +
            summary.noAnswer,
      ),
    );

    /*
     * Update the complete list statistics.
     *
     * These values automatically update:
     * - Interested card
     * - Not Called card
     * - Grid card statistics
     * - List status
     */
    updateList(listId, {
      interested: summary.interested,
      notInterested: summary.notInterested,
      callBack: summary.callBack,
      noAnswer: summary.noAnswer,
      called: campaignCalled,

      notCalled: Math.max(
        0,
        totalContacts - campaignCalled,
      ),

      status: "ready",
    });

    // Close campaign popup
    setShowAgent(false);
    setSelected(null);
    setSelectedContacts([]);

    // Show completion message
    setShowCallSuccess(true);
  }

  /* ─────────────────────────────────────────────
     CALL COMPLETION MESSAGE
  ───────────────────────────────────────────── */

  useEffect(() => {
    if (!showCallSuccess) {
      return;
    }

    const dismiss = () => {
      setShowCallSuccess(false);
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("click", dismiss, {
        once: true,
      });
    }, 120);

    return () => {
      window.clearTimeout(timer);

      document.removeEventListener(
        "click",
        dismiss,
      );
    };
  }, [showCallSuccess]);

  /* ─────────────────────────────────────────────
     DOWNLOAD CSV
  ───────────────────────────────────────────── */

  function downloadCSV(list: MockList) {
    const rows = [
      [
        "Name",
        "Source",
        "Created At",
        "Total Contacts",
        "Interested",
        "Not Interested",
        "Call Back",
        "No Answer",
        "Called",
        "Not Called",
        "Status",
      ],
      [
        list.name,
        list.source,
        list.createdAt,
        list.rows,
        list.interested,
        list.notInterested,
        list.callBack,
        list.noAnswer,
        list.called,
        list.notCalled,
        list.status,
      ],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${list.name.replace(
      /\s+/g,
      "_",
    )}.csv`;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);
  }

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={[]}
        activeChatId=""
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onNewChat={() => navigate("/chat")}
        onSelectChat={() => {}}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main
        className="flex min-w-0 flex-1 flex-col overflow-y-auto"
        onClick={() => {
          setMenuId(null);
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          {/* HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className="text-3xl font-semibold"
                style={{
                  color:
                    "var(--color-text-heading)",
                }}
              >
                Lists
              </h1>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--color-text-muted)",
                }}
              >
                Upload PDF or CSV files to manage your
                contact lists.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:scale-[.98]"
              style={{
                background:
                  "var(--color-primary)",
              }}
            >
              <Upload size={16} />
              Upload List
            </button>
          </div>

          {/* STATS */}

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total Lists",
                value: totals.totalLists,
                color:
                  "var(--color-primary)",
              },
              {
                label: "Total Contacts",
                value: totals.totalContacts,
                color: "#22c55e",
              },
              {
                label: "Interested",
                value: totals.interested,
                color: "#22c55e",
              },
              {
                label: "Not Called",
                value: totals.notCalled,
                color:
                  "var(--color-text-faint)",
              },
            ].map(
              ({
                label,
                value,
                color,
              }) => (
                <div
                  key={label}
                  className="rounded-2xl p-4 shadow-sm"
                  style={{
                    border:
                      "1px solid var(--color-border)",
                    background:
                      "var(--color-surface)",
                  }}
                >
                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--color-text-faint)",
                    }}
                  >
                    {label}
                  </p>

                  <p
                    className="mt-1 text-2xl font-semibold"
                    style={{ color }}
                  >
                    {value}
                  </p>
                </div>
              ),
            )}
          </div>

          {/* TOOLBAR */}

          <div className="mt-6 flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{
                  color:
                    "var(--color-text-faint)",
                }}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search lists…"
                className="h-10 w-full rounded-xl pl-9 pr-4 text-sm outline-none transition"
                style={{
                  border:
                    "1px solid var(--color-border)",
                  background:
                    "var(--color-surface)",
                  color:
                    "var(--color-text-body)",
                }}
              />
            </div>

            <div
              className="flex items-center gap-1 rounded-xl p-1"
              style={{
                border:
                  "1px solid var(--color-border)",
                background:
                  "var(--color-surface)",
              }}
            >
              {[
                {
                  value: "grid",
                  Icon: Grid2X2,
                },
                {
                  value: "list",
                  Icon: ListIcon,
                },
              ].map(
                ({ value, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setView(
                        value as
                          | "grid"
                          | "list",
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition"
                    style={{
                      background:
                        view === value
                          ? "var(--color-accent-bg)"
                          : "transparent",

                      color:
                        view === value
                          ? "var(--color-primary)"
                          : "var(--color-text-faint)",
                    }}
                  >
                    <Icon size={15} />
                  </button>
                ),
              )}
            </div>
          </div>

          {/* LISTS */}

          {filtered.length === 0 ? (
            <div
              className="mt-8 flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed"
              style={{
                borderColor:
                  "var(--color-border)",
              }}
            >
              <div className="text-center">
                <FileText
                  size={32}
                  className="mx-auto mb-3"
                  style={{
                    color:
                      "var(--color-text-faint)",
                  }}
                />

                <p
                  className="text-sm font-medium"
                  style={{
                    color:
                      "var(--color-text-body)",
                  }}
                >
                  No lists found
                </p>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  Upload a CSV or PDF to get started
                </p>
              </div>
            </div>
          ) : (
            <div
              className={[
                "mt-6",
                view === "grid"
                  ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "space-y-3",
              ].join(" ")}
            >
              {filtered.map((list) => {
                const isSelected =
                  selected?.id === list.id;

                /*
                 * IMPORTANT:
                 * Use getContactsForList instead of only
                 * mockContacts so uploaded/generated lists
                 * also get all their contacts.
                 */
                const listContacts =
                  getContactsForList(
                    list,
                    contacts,
                  );

                return (
                  <div key={list.id}>
                    <ListCard
                      list={list}
                      view={view}
                      menuOpen={
                        menuId === list.id
                      }
                      onMenuToggle={(event) => {
                        event.stopPropagation();

                        setMenuId(
                          menuId === list.id
                            ? null
                            : list.id,
                        );
                      }}
                      onView={() => {
                        if (isSelected) {
                          setSelected(null);
                          setSelectedContacts(
                            [],
                          );
                        } else {
                          setSelected(list);

                          setSelectedContacts(
                            listContacts.map(
                              (contact) =>
                                contact.id,
                            ),
                          );
                        }

                        setMenuId(null);
                      }}
                      onStartCampaign={() => {
                        setMenuId(null);

                        openCallingAgent(
                          list.id,
                        );
                      }}
                      onDownload={() => {
                        setMenuId(null);

                        downloadCSV(list);
                      }}
                      onDelete={() => {
                        setMenuId(null);

                        removeList(list.id);
                      }}
                    />

                    {/* SELECTED LIST */}

                    {isSelected && (
                      <SelectedDetail
                        list={list}
                        contacts={
                          list.id === selected?.id
                            ? selectedListContacts
                            : listContacts
                        }
                        selectedContacts={
                          selectedContacts
                        }
                        onSelectContact={(
                          contactId,
                        ) => {
                          setSelectedContacts(
                            (current) =>
                              current.includes(
                                contactId,
                              )
                                ? current.filter(
                                    (id) =>
                                      id !==
                                      contactId,
                                  )
                                : [
                                    ...current,
                                    contactId,
                                  ],
                          );
                        }}
                        onStartCampaign={() => {
                          openCallingAgent(
                            list.id,
                          );
                        }}
                        onClose={() => {
                          setSelected(null);
                          setSelectedContacts(
                            [],
                          );
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* UPLOAD */}

      {showUpload && (
        <UploadModal
          onClose={() =>
            setShowUpload(false)
          }
          onAddList={addList}
        />
      )}

      {/* CALLING CAMPAIGN */}

      {showAgent && selected && (
        <CallingCampaignModal
          listId={selected.id}
          listName={selected.name}
          contacts={
            selected.id === selected?.id
              ? selectedListContacts
              : getContactsForList(
                  selected,
                  contacts,
                )
          }
          onClose={() => {
            setShowAgent(false);
            setSelected(null);
            setSelectedContacts([]);
          }}
          onComplete={(summary) => {
            /*
             * FIX:
             * Do NOT use:
             *
             * CallingCampaignModal.listId
             *
             * Use selected.id because selected is
             * the actual list being called.
             */
            handleCallComplete(
              selected.id,
              summary,
            );
          }}
        />
      )}

      {/* CALL COMPLETED MESSAGE */}

      {showCallSuccess && (
        <div
          className="fixed inset-0 z-[70]"
          onClick={() =>
            setShowCallSuccess(false)
          }
        >
          <div className="flex justify-center px-4 pt-8">
            <div
              className="flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-2xl"
              style={{
                borderColor: "#bbf7d0",
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <p
                  className="text-sm font-semibold"
                  style={{
                    color:
                      "var(--color-text-heading)",
                  }}
                >
                  Calling process successfully completed
                </p>

                <p
                  className="mt-0.5 text-xs"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  All contacts in this list have
                  been processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LIST CARD
───────────────────────────────────────────── */

function ListCard({
  list,
  view,
  menuOpen,
  onMenuToggle,
  onView,
  onStartCampaign,
  onDownload,
  onDelete,
}: {
  list: MockList;
  view: "grid" | "list";
  menuOpen: boolean;
  onMenuToggle: (
    event: MouseEvent,
  ) => void;
  onView: () => void;
  onStartCampaign: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const statusColor: Record<
    string,
    string
  > = {
    ready: "#22c55e",
    processing: "#f59e0b",
    failed: "#ef4444",
  };

  const isCalled = (list.called || 0) > 0;

  /* ─────────────────────────────────────────
     LIST VIEW
  ───────────────────────────────────────── */

  if (view === "list") {
    return (
      <div
        className="cursor-pointer rounded-2xl p-4 shadow-sm transition hover:shadow-md"
        style={{
          border:
            "1px solid var(--color-border)",
          background:
            "var(--color-surface)",
        }}
        onClick={onView}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}

          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background:
                "var(--color-accent-bg)",
              color:
                "var(--color-primary)",
            }}
          >
            <FileText size={18} />
          </div>

          {/* Name */}

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-semibold"
              style={{
                color:
                  "var(--color-text-heading)",
              }}
            >
              {list.name}
            </p>

            <p
              className="text-xs"
              style={{
                color:
                  "var(--color-text-muted)",
              }}
            >
              {list.rows} contacts ·{" "}
              {list.source}
            </p>
          </div>

          {/* Status */}

          <span
            className="text-xs font-medium"
            style={{
              color:
                statusColor[
                  list.status
                ] || "var(--color-text-faint)",
            }}
          >
            {isCalled
              ? "called"
              : list.status}
          </span>

          {/* Call Again / Start Campaign */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onStartCampaign();
            }}
            className="hidden rounded-lg px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 sm:flex sm:items-center sm:gap-1.5"
            style={{
              background:
                "var(--color-primary)",
            }}
          >
            <Play size={11} />

            {isCalled
              ? "Call Again"
              : "Start Campaign"}
          </button>

          {/* Menu */}

          <div
            className="relative"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={onMenuToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f0f4ff]"
              style={{
                color:
                  "var(--color-text-faint)",
              }}
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <CardMenu
                onView={onView}
                onStartCampaign={
                  onStartCampaign
                }
                onDownload={onDownload}
                onDelete={onDelete}
                isCalled={isCalled}
              />
            )}
          </div>
        </div>

        {/* Mobile already-called state is conveyed by the status chip and button label */}
      </div>
    );
  }

  /* ─────────────────────────────────────────
     GRID VIEW
  ───────────────────────────────────────── */

  return (
    <div
      className="relative flex cursor-pointer flex-col rounded-2xl p-5 shadow-sm transition hover:shadow-md"
      style={{
        border:
          "1px solid var(--color-border)",
        background:
          "var(--color-surface)",
      }}
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            background:
              "var(--color-accent-bg)",
            color:
              "var(--color-primary)",
          }}
        >
          <FileText size={20} />
        </div>

        <div
          className="relative"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f0f4ff]"
            style={{
              color:
                "var(--color-text-faint)",
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <CardMenu
              onView={onView}
              onStartCampaign={
                onStartCampaign
              }
              onDownload={onDownload}
              onDelete={onDelete}
              isCalled={isCalled}
            />
          )}
        </div>
      </div>

      <h3
        className="mt-3 text-sm font-semibold"
        style={{
          color:
            "var(--color-text-heading)",
        }}
      >
        {list.name}
      </h3>

      <p
        className="mt-1 text-xs"
        style={{
          color:
            "var(--color-text-muted)",
        }}
      >
        {list.source} · {list.createdAt}
      </p>

      {/* Already Called Message */}

      {isCalled && (
        <div className="mt-3 rounded-xl bg-green-50 px-3 py-2">
          <p className="text-[11px] font-semibold text-green-700">
            This List is Already called
          </p>

          <p className="mt-0.5 text-[10px] text-green-600">
            All {list.called} contacts have been
            processed.
          </p>
        </div>
      )}

      {/* Statistics */}

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          {
            label: "Contacts",
            value: list.rows,
          },
          {
            label: "Interested",
            value:
              list.interested || 0,
          },
          {
            label: "Not Called",
            value:
              list.notCalled || 0,
          },
        ].map(
          ({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-2"
              style={{
                background:
                  "var(--color-bg)",
              }}
            >
              <p
                className="text-base font-bold"
                style={{
                  color:
                    "var(--color-text-heading)",
                }}
              >
                {value}
              </p>

              <p
                className="text-[10px]"
                style={{
                  color:
                    "var(--color-text-faint)",
                }}
              >
                {label}
              </p>
            </div>
          ),
        )}
      </div>

      {/* Status + Call Button */}

      <div className="mt-4 flex items-center justify-between">
        <span
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{
            color:
              statusColor[
                list.status
              ] ||
              "var(--color-text-faint)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background:
                statusColor[
                  list.status
                ] ||
                "var(--color-text-faint)",
            }}
          />

          {isCalled
            ? "called"
            : list.status}
        </span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onStartCampaign();
          }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
          style={{
            background:
              "var(--color-primary)",
          }}
        >
          <Play size={11} />

          {isCalled
            ? "Call Again"
            : "Start Campaign"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CARD MENU
───────────────────────────────────────────── */

function CardMenu({
  onView,
  onStartCampaign,
  onDownload,
  onDelete,
  isCalled,
}: {
  onView: () => void;
  onStartCampaign: () => void;
  onDownload: () => void;
  onDelete: () => void;
  isCalled: boolean;
}) {
  return (
    <div
      className="absolute right-0 top-9 z-40 w-64 overflow-visible rounded-xl p-1.5"
      style={{
        border:
          "1px solid var(--color-border)",
        background:
          "var(--color-surface)",
        boxShadow:
          "var(--shadow-dropdown)",
      }}
    >
      {/* View List */}

      <button
        type="button"
        onClick={onView}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#f5f8fc]"
        style={{
          color:
            "var(--color-text-body)",
        }}
      >
        <Eye
          size={17}
          style={{
            color:
              "var(--color-primary)",
          }}
        />

        <span>View List</span>
      </button>

      {/* Add Agent / Call Again */}

      <button
        type="button"
        onClick={onStartCampaign}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#f0f5ff]"
        style={{
          color:
            "var(--color-text-body)",
        }}
      >
        <Bot
          size={17}
          style={{
            color:
              "var(--color-primary)",
          }}
        />

        <div className="min-w-0 flex-1 text-left">
          <p className="font-medium">
            {isCalled
              ? "Call Again"
              : "Add Agent"}
          </p>

          <p
            className="mt-0.5 text-[10px]"
            style={{
              color:
                "var(--color-text-faint)",
            }}
          >
            {isCalled
              ? "Run the calling agent again"
              : "Choose an AI calling agent"}
          </p>
        </div>

        <span
          className="text-base"
          style={{
            color:
              "var(--color-text-faint)",
          }}
        >
          ›
        </span>
      </button>

      {/* Divider */}

      <div
        className="my-1 h-px"
        style={{
          background:
            "var(--color-border-light)",
        }}
      />

      {/* Download */}

      <button
        type="button"
        onClick={onDownload}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#f5f8fc]"
        style={{
          color:
            "var(--color-text-body)",
        }}
      >
        <Download
          size={17}
          style={{
            color:
              "var(--color-primary)",
          }}
        />

        <span>Download CSV</span>
      </button>

      {/* Divider */}

      <div
        className="my-1 h-px"
        style={{
          background:
            "var(--color-border-light)",
        }}
      />

      {/* Delete */}

      <button
        type="button"
        onClick={onDelete}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
      >
        <Trash2 size={17} />

        <span>Delete</span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   UPLOAD MODAL
───────────────────────────────────────────── */

function UploadModal({
  onClose,
  onAddList,
}: {
  onClose: () => void;
  onAddList: (list: MockList) => void;
}) {
  const fileRef =
    useRef<HTMLInputElement>(null);

  const [dragging, setDragging] =
    useState(false);

  const [file, setFile] =
    useState<File | null>(null);

  function handleFile(f: File) {
    const ext = f.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (
      ext !== "csv" &&
      ext !== "pdf"
    ) {
      alert(
        "Only CSV or PDF files are supported.",
      );
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      alert(
        "File size must be less than 10 MB.",
      );
      return;
    }

    setFile(f);
  }

  function handleUpload() {
    if (!file) {
      return;
    }

    const fileName =
      file.name.replace(
        /\.[^/.]+$/,
        "",
      );

    const newId = Date.now();

    const newList: MockList = {
      id: newId,
      name:
        fileName ||
        "New Contact List",
      rows: 0,
      createdAt:
        new Date()
          .toISOString()
          .split("T")[0],
      status: "processing",
      source:
        file.name
          .toLowerCase()
          .endsWith(".csv")
          ? "CSV Upload"
          : "PDF Extract",

      interested: 0,
      notInterested: 0,
      callBack: 0,
      noAnswer: 0,
      notCalled: 0,
      prospects: [],

      called: 0,
    };

    onAddList(newList);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}

        <div
          className="flex items-center justify-between border-b p-5"
          style={{
            borderColor:
              "var(--color-border-light)",
          }}
        >
          <h2
            className="text-base font-semibold"
            style={{
              color:
                "var(--color-text-heading)",
            }}
          >
            Upload List
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f5f8fc]"
            style={{
              color:
                "var(--color-text-faint)",
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            onDrop={(event) => {
              event.preventDefault();

              setDragging(false);

              const droppedFile =
                event.dataTransfer.files[0];

              if (droppedFile) {
                handleFile(droppedFile);
              }
            }}
            onClick={() =>
              fileRef.current?.click()
            }
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition"
            style={{
              borderColor: dragging
                ? "var(--color-primary)"
                : "var(--color-border)",

              background: dragging
                ? "var(--color-accent-bg)"
                : "var(--color-bg)",
            }}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background:
                  "var(--color-accent-bg)",
                color:
                  "var(--color-primary)",
              }}
            >
              <Upload size={26} />
            </div>

            {file ? (
              <>
                <p
                  className="mt-4 max-w-full truncate px-4 text-sm font-medium"
                  style={{
                    color:
                      "var(--color-text-heading)",
                  }}
                >
                  {file.name}
                </p>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  Ready to upload
                </p>
              </>
            ) : (
              <>
                <p
                  className="mt-4 text-sm font-medium"
                  style={{
                    color:
                      "var(--color-text-body)",
                  }}
                >
                  Drop your file here
                </p>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  PDF or CSV · max 10 MB
                </p>
              </>
            )}

            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.csv"
              className="hidden"
              onChange={(event) => {
                const selectedFile =
                  event.target.files?.[0];

                if (selectedFile) {
                  handleFile(
                    selectedFile,
                  );
                }
              }}
            />
          </div>

          {/* Buttons */}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border py-3 text-sm font-medium transition hover:bg-[#f5f8fc]"
              style={{
                borderColor:
                  "var(--color-border)",
                color:
                  "var(--color-text-body)",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!file}
              onClick={handleUpload}
              className="flex-1 rounded-xl py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background:
                  "var(--color-primary)",
              }}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
