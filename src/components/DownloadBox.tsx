// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronDown, Download, ExternalLink, FileText, Table } from "lucide-react";
// import type { Prospect } from "@/data/mockData";
// import { downloadCSV } from "@/lib/exportCSV";
// import { downloadJSON } from "@/lib/exportJSON";
// import { downloadPDF } from "@/lib/exportPDF";

// type DownloadBoxProps = {
//   prospects: Prospect[];
//   query?: string;
//   title?: string;
// };

// const menuItem =
//   "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[12px] text-[#334b6b] transition-colors duration-150 hover:bg-[#17345e] hover:text-white";

// export default function DownloadBox({
//   prospects,
//   query = "",
//   title = "prospecting_results",
// }: DownloadBoxProps) {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!open) return;

//     function handleClick(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, [open]);

//   if (!prospects.length) return null;

//   function closeAnd(run: () => void) {
//     run();
//     setOpen(false);
//   }

//   return (
//     <div className="mb-2.5 w-full">
//       <div
//         className="rounded-xl border bg-white px-4 py-3 shadow-sm"
//         style={{ borderColor: "var(--color-border)" }}
//       >
//         <div className="flex items-center justify-between gap-3">
//           <div className="min-w-0">
//             <h3
//               className="truncate text-[13px] font-semibold leading-tight"
//               style={{ color: "var(--color-text-body)" }}
//             >
//               {title}
//             </h3>
//             <p className="mt-0.5 text-[11px] leading-tight" style={{ color: "var(--color-text-muted)" }}>
//               Your list is ready!
//             </p>
//           </div>

//           <span className="shrink-0 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
//             {new Date().toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             })}
//           </span>
//         </div>

//         <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
//           <div className="relative" ref={menuRef}>
//             <div className="flex overflow-hidden rounded-full shadow-sm">
//               <button
//                 type="button"
//                 onClick={() => downloadCSV(prospects)}
//                 className="flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium text-white transition hover:opacity-90"
//                 style={{ background: "var(--color-primary)" }}
//               >
//                 <Download size={13} />
//                 Download {prospects.length} rows
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setOpen((v) => !v)}
//                 className="flex items-center justify-center border-l px-2 text-white transition hover:opacity-90"
//                 style={{
//                   background: "var(--color-primary)",
//                   borderColor: "rgba(255,255,255,0.3)",
//                 }}
//                 aria-label="Download options"
//                 aria-expanded={open}
//               >
//                 <ChevronDown
//                   size={14}
//                   className={["transition-transform duration-150", open ? "rotate-180" : ""].join(" ")}
//                 />
//               </button>
//             </div>

//             {open && (
//               <div
//                 className="absolute bottom-full left-0 z-20 mb-1.5 min-w-[140px] overflow-hidden rounded-lg border bg-white py-1 shadow-[0_8px_32px_rgba(23,52,94,0.14)]"
//                 style={{ borderColor: "var(--color-border)" }}
//               >
//                 <button
//                   type="button"
//                   className={menuItem}
//                   onClick={() => closeAnd(() => downloadPDF(prospects, query))}
//                 >
//                   <FileText size={13} />
//                   PDF
//                 </button>
//                 <button
//                   type="button"
//                   className={menuItem}
//                   onClick={() => closeAnd(() => downloadCSV(prospects))}
//                 >
//                   <Table size={13} />
//                   CSV
//                 </button>
//                 <button
//                   type="button"
//                   className={menuItem}
//                   onClick={() => closeAnd(() => downloadJSON(prospects))}
//                 >
//                   <span className="w-[13px] text-center font-mono text-[10px]">{"{ }"}</span>
//                   JSON
//                 </button>
//               </div>
//             )}
//           </div>

//           <button
//             type="button"
//             className="flex items-center gap-1.5 text-[12px] font-medium transition hover:underline"
//             style={{ color: "var(--color-primary)" }}
//             onClick={() => navigate("/lists")}
//           >
//             <ExternalLink size={13} />
//             Open in Lists
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Table,
} from "lucide-react";

import type { Prospect } from "@/data/mockData";
import { downloadCSV } from "@/lib/exportCSV";
import { downloadJSON } from "@/lib/exportJSON";
import { downloadPDF } from "@/lib/exportPDF";

type DownloadBoxProps = {
  prospects: Prospect[];
  query?: string;
  title?: string;
};

const menuItem =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] text-[#334b6b] transition-all duration-150 hover:bg-[#17345e] hover:text-white";

export default function DownloadBox({
  prospects,
  query = "",
  title = "prospecting_results",
}: DownloadBoxProps) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  if (!prospects.length) return null;

  function closeAnd(run: () => void) {
    run();
    setOpen(false);
  }

  return (
    <div className="mb-3 w-full">
      <div
        className="
          relative
          overflow-visible
          rounded-[30px]
          border
          bg-white/55
          px-5
          py-4
          shadow-[0_4px_18px_rgba(23,52,94,0.06)]
          backdrop-blur-xl
          transition-all
          duration-200
          hover:shadow-[0_6px_24px_rgba(23,52,94,0.08)]
        "
        style={{
          borderColor: "rgba(208,218,234,0.85)",
        }}
      >
        {/* Subtle glass highlight */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-5
            top-0
            h-px
            rounded-full
            bg-white/90
          "
        />

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className="
                  truncate
                  text-[13px]
                  font-semibold
                  leading-tight
                "
                style={{
                  color: "var(--color-text-body)",
                }}
              >
                {title}
              </h3>

              <span
                className="
                  hidden
                  rounded-full
                  border
                  border-[#dce6f2]
                  bg-white/50
                  px-2
                  py-0.5
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-[#8aa0ba]
                  sm:inline-flex
                "
              >
                Ready
              </span>
            </div>

            <p
              className="
                mt-0.5
                text-[11px]
                leading-tight
              "
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              {prospects.length}{" "}
              {prospects.length === 1 ? "record" : "records"} ready
              {query ? " · AI Search" : ""}
            </p>
          </div>

          {/* Date */}
          <span
            className="
              shrink-0
              text-[10px]
              sm:text-[11px]
            "
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Download split button */}
          <div
            className="relative"
            ref={menuRef}
          >
            <div
              className="
                flex
                overflow-hidden
                rounded-full
                shadow-[0_3px_10px_rgba(99,139,224,0.20)]
              "
            >
              {/* Main download */}
              <button
                type="button"
                onClick={() => downloadCSV(prospects)}
                className="
                  flex
                  h-9
                  items-center
                  gap-1.5
                  px-4
                  text-[12px]
                  font-medium
                  text-white
                  transition-all
                  duration-150
                  hover:brightness-105
                  active:scale-[0.98]
                "
                style={{
                  background: "var(--color-primary)",
                }}
              >
                <Download
                  size={14}
                  strokeWidth={2}
                />

                <span>
                  Download {prospects.length}{" "}
                  {prospects.length === 1 ? "row" : "rows"}
                </span>
              </button>

              {/* Dropdown */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  border-l
                  text-white
                  transition-all
                  duration-150
                  hover:bg-white/10
                "
                style={{
                  background: "var(--color-primary)",
                  borderColor: "rgba(255,255,255,0.28)",
                }}
                aria-label="Download options"
                aria-expanded={open}
              >
                <ChevronDown
                  size={14}
                  className={[
                    "transition-transform duration-200",
                    open ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>
            </div>

            {/* Download format menu */}
            {open && (
              <div
                className="
                  absolute
                  bottom-full
                  left-0
                  z-50
                  mb-2
                  min-w-[145px]
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white/90
                  p-1
                  shadow-[0_12px_35px_rgba(23,52,94,0.15)]
                  backdrop-blur-xl
                "
                style={{
                  borderColor: "rgba(208,218,234,0.9)",
                }}
              >
                <button
                  type="button"
                  className={menuItem}
                  onClick={() =>
                    closeAnd(() =>
                      downloadPDF(prospects, query)
                    )
                  }
                >
                  <FileText size={13} />
                  PDF
                </button>

                <button
                  type="button"
                  className={menuItem}
                  onClick={() =>
                    closeAnd(() =>
                      downloadCSV(prospects)
                    )
                  }
                >
                  <Table size={13} />
                  CSV
                </button>

                <button
                  type="button"
                  className={menuItem}
                  onClick={() =>
                    closeAnd(() =>
                      downloadJSON(prospects)
                    )
                  }
                >
                  <span className="w-[13px] text-center font-mono text-[10px]">
                    {"{ }"}
                  </span>
                  JSON
                </button>
              </div>
            )}
          </div>

          {/* Open in Lists */}
          <button
            type="button"
            className="
              flex
              h-9
              items-center
              gap-1.5
              rounded-full
              border
              border-[#d4dfed]
              bg-white/40
              px-4
              text-[12px]
              font-medium
              backdrop-blur-md
              transition-all
              duration-150
              hover:bg-white/75
              hover:shadow-sm
              active:scale-[0.98]
            "
            style={{
              color: "var(--color-primary)",
            }}
            onClick={() => navigate("/lists")}
          >
            <ExternalLink
              size={13}
              strokeWidth={1.9}
            />

            Open in Lists
          </button>
        </div>
      </div>
    </div>
  );
}