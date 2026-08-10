import {
  BarChart3,
  ClipboardList,
  Home,
  MessageCircle,
  Package,
  Pill,
  Search,
  Settings,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Role = "CLIENT" | "PHARMACY" | "ADMIN";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * `primary` is what fits in the mobile bottom bar — five items is the ceiling
 * before targets drop under 44px on a 360px screen. `secondary` only appears
 * in the desktop sidebar, where there's room for the full map.
 */
interface RoleNav {
  home: string;
  primary: NavItem[];
  secondary: NavItem[];
}

const NAV: Record<Role, RoleNav> = {
  CLIENT: {
    home: "/client-dashboard",
    // Every destination here has to be reachable by a CLIENT — /medications is
    // PHARMACY/ADMIN only, so patients get /search for the catalogue instead.
    primary: [
      { id: "home", label: "Home", href: "/client-dashboard", icon: Home },
      { id: "consult", label: "Consult", href: "/consult", icon: ClipboardList },
      { id: "orders", label: "Orders", href: "/orders", icon: Package },
      { id: "chat", label: "Chat", href: "/chat", icon: MessageCircle },
      { id: "profile", label: "Profile", href: "/settings", icon: Settings },
    ],
    secondary: [
      { id: "search", label: "Find medication", href: "/search", icon: Search },
      { id: "track", label: "Track delivery", href: "/track", icon: Truck },
    ],
  },
  PHARMACY: {
    home: "/pharmacy-dashboard",
    primary: [
      { id: "home", label: "Home", href: "/pharmacy-dashboard", icon: Home },
      { id: "consult", label: "Consults", href: "/consultations", icon: ClipboardList },
      { id: "meds", label: "Meds", href: "/medications", icon: Pill },
      { id: "orders", label: "Orders", href: "/orders", icon: Package },
      { id: "profile", label: "Profile", href: "/settings", icon: Settings },
    ],
    secondary: [
      { id: "chat", label: "Chat", href: "/chat", icon: MessageCircle },
      { id: "staff", label: "Staff", href: "/staff-management", icon: Users },
      { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  ADMIN: {
    home: "/admin",
    primary: [
      { id: "home", label: "Home", href: "/admin", icon: Home },
      { id: "users", label: "Users", href: "/admin/users", icon: Users },
      { id: "consult", label: "Consults", href: "/admin/consultations", icon: ClipboardList },
      { id: "analytics", label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { id: "profile", label: "Settings", href: "/admin/settings", icon: Settings },
    ],
    secondary: [
      { id: "inventory", label: "Inventory", href: "/admin/inventory", icon: Package },
      { id: "delivery", label: "Delivery", href: "/admin/delivery", icon: Truck },
    ],
  },
};

export function navForRole(role: Role | undefined): RoleNav {
  return NAV[role ?? "CLIENT"] ?? NAV.CLIENT;
}
