import React from "react";

// Íconos de línea con relleno duotone suave, en el lenguaje de PSMob.
export type IconName =
  | "pin"
  | "users"
  | "user"
  | "check"
  | "checklist"
  | "form"
  | "gear"
  | "chart"
  | "dashboard"
  | "clock"
  | "calendar"
  | "chat"
  | "bell"
  | "alert"
  | "home"
  | "store"
  | "route"
  | "camera"
  | "box"
  | "send"
  | "cloud"
  | "offline"
  | "search"
  | "filter"
  | "back"
  | "menu"
  | "plus"
  | "chevron"
  | "tag"
  | "grid"
  | "sparkle"
  | "x"
  | "info"
  | "notes"
  | "dollar";

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; sw?: number; fill?: boolean }> = ({
  name,
  size = 24,
  color = "#1976D2",
  sw = 1.8,
  fill = true,
}) => {
  const s = { stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const f = fill ? { fill: color, opacity: 0.18, stroke: "none" } : { fill: "none" };
  let body: React.ReactNode = null;
  switch (name) {
    case "pin":
      body = (
        <>
          <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" {...f} />
          <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" {...s} />
          <circle cx="12" cy="10" r="2.5" {...s} />
        </>
      );
      break;
    case "users":
      body = (
        <>
          <circle cx="9" cy="8" r="3.5" {...f} />
          <circle cx="9" cy="8" r="3.5" {...s} />
          <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" {...s} />
          <circle cx="17" cy="9" r="2.6" {...s} />
          <path d="M17 14.5c2.4.2 4 1.8 4.5 4.5" {...s} />
        </>
      );
      break;
    case "user":
      body = (
        <>
          <circle cx="12" cy="8" r="4" {...f} />
          <circle cx="12" cy="8" r="4" {...s} />
          <path d="M4.5 21c.8-4 3.7-6 7.5-6s6.7 2 7.5 6" {...s} />
        </>
      );
      break;
    case "check":
      body = (
        <>
          <circle cx="12" cy="12" r="9" {...f} />
          <circle cx="12" cy="12" r="9" {...s} />
          <path d="m8 12.3 2.7 2.7L16.2 9.5" {...s} />
        </>
      );
      break;
    case "checklist":
      body = (
        <>
          <rect x="4" y="3" width="16" height="18" rx="2.5" {...f} />
          <rect x="4" y="3" width="16" height="18" rx="2.5" {...s} />
          <path d="m7.5 8.5 1.4 1.4 2.4-2.6M13.5 9h3.5M7.5 14.5l1.4 1.4 2.4-2.6M13.5 15h3.5" {...s} />
        </>
      );
      break;
    case "form":
      body = (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" {...f} />
          <rect x="5" y="3" width="14" height="18" rx="2" {...s} />
          <path d="M8.5 9h7M8.5 13h7M8.5 17h4" {...s} />
        </>
      );
      break;
    case "gear":
      body = (
        <>
          <circle cx="12" cy="12" r="7.5" {...f} />
          <path
            d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"
            {...s}
          />
          <circle cx="12" cy="12" r="5.2" {...s} />
          <circle cx="12" cy="12" r="2" {...s} />
        </>
      );
      break;
    case "chart":
      body = (
        <>
          <rect x="4" y="12" width="4" height="8" rx="1" {...f} />
          <rect x="10" y="7" width="4" height="13" rx="1" {...f} />
          <path d="M4 20V12h4v8M10 20V7h4v13M16 20v-5h4v5M3 20h18" {...s} />
        </>
      );
      break;
    case "dashboard":
      body = (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2.5" {...f} />
          <rect x="3" y="4" width="18" height="16" rx="2.5" {...s} />
          <path d="M6.5 15.5 10 12l2.5 2 5-5M3 8h18" {...s} />
        </>
      );
      break;
    case "clock":
      body = (
        <>
          <circle cx="12" cy="12" r="9" {...f} />
          <circle cx="12" cy="12" r="9" {...s} />
          <path d="M12 7v5l3 2" {...s} />
        </>
      );
      break;
    case "calendar":
      body = (
        <>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" {...f} />
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" {...s} />
          <path d="M3.5 10h17M8 3v4M16 3v4" {...s} />
        </>
      );
      break;
    case "chat":
      body = (
        <>
          <path d="M4 5h16v11H9l-5 4V5Z" {...f} />
          <path d="M4 5h16v11H9l-5 4V5Z" {...s} />
          <path d="M8 9.5h8M8 12.5h5" {...s} />
        </>
      );
      break;
    case "bell":
      body = (
        <>
          <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" {...f} />
          <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2 2 0 0 0 4 0" {...s} />
        </>
      );
      break;
    case "alert":
      body = (
        <>
          <path d="M12 3.5 21.5 20h-19L12 3.5Z" {...f} />
          <path d="M12 3.5 21.5 20h-19L12 3.5Z" {...s} />
          <path d="M12 10v4.5M12 17.2v.1" {...s} />
        </>
      );
      break;
    case "home":
      body = (
        <>
          <path d="M4 11 12 4l8 7v9H4v-9Z" {...f} />
          <path d="M4 11 12 4l8 7v9H4v-9ZM10 20v-5h4v5" {...s} />
        </>
      );
      break;
    case "store":
      body = (
        <>
          <path d="M4 10h16v10H4z" {...f} />
          <path d="M3 10 5 4h14l2 6M4 10v10h16V10M3 10h18M9.5 20v-5h5v5" {...s} />
        </>
      );
      break;
    case "route":
      body = (
        <>
          <circle cx="6" cy="18" r="2.6" {...s} />
          <circle cx="18" cy="6" r="2.6" {...s} />
          <path d="M8.2 16.2 15.8 7.8" {...s} strokeDasharray="2.4 2.6" />
        </>
      );
      break;
    case "camera":
      body = (
        <>
          <rect x="3" y="7" width="18" height="13" rx="2.5" {...f} />
          <path d="M3 9.5A2.5 2.5 0 0 1 5.5 7H8l1.5-2.5h5L16 7h2.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-8Z" {...s} />
          <circle cx="12" cy="13.5" r="3.5" {...s} />
        </>
      );
      break;
    case "box":
      body = (
        <>
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" {...f} />
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3ZM4 7.5l8 4.5 8-4.5M12 12v9" {...s} />
        </>
      );
      break;
    case "send":
      body = (
        <>
          <path d="M3 11 21 3l-7 18-3-7-8-3Z" {...f} />
          <path d="M3 11 21 3l-7 18-3-7-8-3ZM11 14l10-11" {...s} />
        </>
      );
      break;
    case "cloud":
      body = (
        <>
          <path d="M7 18h10.5a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18Z" {...f} />
          <path d="M7 18h10.5a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18Z" {...s} />
          <path d="m9.5 13.5 2 2 3.5-3.5" {...s} />
        </>
      );
      break;
    case "offline":
      body = (
        <>
          <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 16a5 5 0 0 1 6.4 0" {...s} opacity={0.45} />
          <circle cx="12" cy="19.2" r="1.2" fill={color} />
          <path d="M4 3.5 20 20" {...s} />
        </>
      );
      break;
    case "search":
      body = (
        <>
          <circle cx="11" cy="11" r="6.5" {...s} />
          <path d="m16 16 4.5 4.5" {...s} />
        </>
      );
      break;
    case "filter":
      body = <path d="M4 5h16l-6 7.5V19l-4 1.5v-8L4 5Z" {...s} />;
      break;
    case "back":
      body = <path d="M19 12H5M11 6l-6 6 6 6" {...s} />;
      break;
    case "menu":
      body = <path d="M4 7h16M4 12h16M4 17h16" {...s} />;
      break;
    case "plus":
      body = <path d="M12 5v14M5 12h14" {...s} />;
      break;
    case "chevron":
      body = <path d="m9 6 6 6-6 6" {...s} />;
      break;
    case "tag":
      body = (
        <>
          <path d="M3.5 12.5V4.5h8l9 9-8 8-9-9Z" {...f} />
          <path d="M3.5 12.5V4.5h8l9 9-8 8-9-9Z" {...s} />
          <circle cx="8" cy="9" r="1.6" {...s} />
        </>
      );
      break;
    case "grid":
      body = (
        <>
          <rect x="4" y="4" width="7" height="7" rx="1.5" {...f} />
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" {...s} />
        </>
      );
      break;
    case "sparkle":
      body = (
        <>
          <path d="M12 3c.8 4.6 2.4 6.2 7 7-4.6.8-6.2 2.4-7 7-.8-4.6-2.4-6.2-7-7 4.6-.8 6.2-2.4 7-7Z" {...f} />
          <path d="M12 3c.8 4.6 2.4 6.2 7 7-4.6.8-6.2 2.4-7 7-.8-4.6-2.4-6.2-7-7 4.6-.8 6.2-2.4 7-7ZM19 16.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5Z" {...s} />
        </>
      );
      break;
    case "x":
      body = <path d="M6 6l12 12M18 6 6 18" {...s} />;
      break;
    case "info":
      body = (
        <>
          <circle cx="12" cy="12" r="9" {...s} />
          <path d="M12 11v5.5M12 7.8v.1" {...s} />
        </>
      );
      break;
    case "notes":
      body = (
        <>
          <path d="M5 4h10l4 4v12H5z" {...f} />
          <path d="M5 4h10l4 4v12H5zM15 4v4h4M8.5 12h7M8.5 16h5" {...s} />
        </>
      );
      break;
    case "dollar":
      body = (
        <>
          <circle cx="12" cy="12" r="9" {...f} />
          <circle cx="12" cy="12" r="9" {...s} />
          <path d="M14.8 9.2c-.4-1-1.5-1.7-2.8-1.7-1.6 0-2.8.9-2.8 2.1 0 2.9 5.8 1.6 5.8 4.6 0 1.2-1.3 2.2-3 2.2-1.4 0-2.6-.7-3-1.8M12 6v1.5M12 16.5V18" {...s} />
        </>
      );
      break;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      {body}
    </svg>
  );
};
