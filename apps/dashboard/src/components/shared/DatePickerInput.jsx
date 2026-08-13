import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(date) {
  if (!date) return "";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePickerInput({ name, value, onChange, className, style }) {
  const today = new Date();
  const parsed = parseDate(value);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState((parsed || today).getFullYear());
  const [viewMonth, setViewMonth] = useState((parsed || today).getMonth());
  const [yearInput, setYearInput] = useState(String((parsed || today).getFullYear()));
  const [showYearInput, setShowYearInput] = useState(false);

  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setShowYearInput(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day) => {
    const selected = new Date(viewYear, viewMonth, day);
    onChange?.({ target: { name, value: toISODate(selected) } });
    setOpen(false);
    setShowYearInput(false);
  };

  const handleYearSubmit = (e) => {
    e.preventDefault();
    const y = parseInt(yearInput, 10);
    if (!isNaN(y) && y > 999 && y < 9999) {
      setViewYear(y);
    }
    setShowYearInput(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells = [...Array(firstDay).fill(null), ...Array(daysInMonth).keys().map(i => i + 1)];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (day) => {
    if (!day || !parsed) return false;
    return parsed.getFullYear() === viewYear &&
      parsed.getMonth() === viewMonth &&
      parsed.getDate() === day;
  };
  const isToday = (day) => {
    if (!day) return false;
    return today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 w-full text-left bg-transparent ${className}`}
        style={{ ...style, backgroundColor: "rgba(79, 76, 76, 0.23)" }}
      >
        <CalendarDays size={16} className="shrink-0 opacity-50" />
        <span className={parsed ? "text-white" : "text-white/40"}>
          {parsed ? formatDisplay(parsed) : "Select date"}
        </span>
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 w-[280px] rounded-2xl shadow-2xl p-4 select-none" style={{ background: "#2c2c2c", border: "1px solid rgba(255,255,255,0.1)" }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              style={{ width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%", background:"transparent", border:"none", color:"rgba(255,255,255,0.8)", cursor:"pointer" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {/* Month */}
              <span style={{ color:"#fff", fontSize:14, fontWeight:600 }}>{MONTHS[viewMonth]}</span>

              {/* Year — click to type */}
              {showYearInput ? (
                <form onSubmit={handleYearSubmit}>
                  <input
                    autoFocus
                    type="number"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    onBlur={handleYearSubmit}
                    style={{ width:56, textAlign:"center", color:"#fff", fontSize:14, fontWeight:600, background:"rgba(255,255,255,0.1)", borderRadius:6, padding:"0 4px", outline:"none", border:"1px solid rgba(255,255,255,0.2)" }}
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => { setYearInput(String(viewYear)); setShowYearInput(true); }}
                  style={{ background:"transparent", border:"none", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", marginLeft:2 }}
                  onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.6)"}
                  onMouseLeave={e => e.currentTarget.style.color="#fff"}
                >
                  {viewYear}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={nextMonth}
              style={{ width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%", background:"transparent", border:"none", color:"rgba(255,255,255,0.8)", cursor:"pointer" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} style={{ textAlign:"center", fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:500, padding:"4px 0" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, idx) => (
              <div key={idx} className="flex items-center justify-center">
                {day ? (
                  <button
                    type="button"
                    onClick={() => selectDay(day)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: isToday(day) && !isSelected(day) ? "1px solid rgba(255,255,255,0.35)" : "none",
                      background: isSelected(day) ? "#ffffff" : "transparent",
                      color: isSelected(day) ? "#000000" : "rgba(255,255,255,0.8)",
                      fontSize: "13px",
                      fontWeight: isSelected(day) ? "600" : "400",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={e => { if (!isSelected(day)) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={e => { if (!isSelected(day)) e.currentTarget.style.background = "transparent"; }}
                  >
                    {day}
                  </button>
                ) : (
                  <div style={{ width: "32px", height: "32px" }} />
                )}
              </div>
            ))}
          </div>

          {/* Quick clear */}
          {parsed && (
            <div style={{ marginTop:12, borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:8 }}>
              <button
                type="button"
                onClick={() => { onChange?.({ target: { name, value: "" } }); setOpen(false); }}
                style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.4)", fontSize:12, cursor:"pointer", width:"100%", textAlign:"center" }}
                onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.7)"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.4)"}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
