"use client";
import React, { useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useMobileSidebar } from "@/lib/hooks/useMobileSidebar";
import { Logo } from "../shared/Logo";
import { MobileLogo } from "../shared/MobileLogo";
import { LogoutButton } from "../auth/LogoutButton";
import { signOut } from "next-auth/react";
import NavigationProgress from "../ui/NavigationProgress";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Clients", icon: Users, path: "/dashboard/clients" },
  { title: "Invoices", icon: FileText, path: "/dashboard/invoices" },
];

const baseLinkClasses =
  "flex items-center px-3 py-3 rounded-lg transition-colors hover:bg-gray-800 cursor-pointer";
const baseIconClasses = "w-6 h-6 text-gray-400 group-hover:text-white";
const activeLinkClasses = "bg-gray-800 text-white";

function MenuButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
}

function SidebarLink({
  item,
  isOpen,
  isActive,
  onClick,
}: {
  item: (typeof menuItems)[0];
  isOpen: boolean;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.path}
      onClick={onClick}
      className={`${baseLinkClasses} ${
        isOpen ? "" : "justify-center"
      } ${isActive ? activeLinkClasses : "text-gray-300"}`}
    >
      <item.icon
        className={`${baseIconClasses} ${isActive ? "text-white" : ""}`}
      />
      {isOpen && <span className="ml-3">{item.title}</span>}
    </Link>
  );
}

function SidebarNav({
  isOpen,
  isPathActive,
  onLinkClick,
}: {
  isOpen: boolean;
  isPathActive: (path: string) => boolean;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 px-2 py-4 space-y-4">
      {menuItems.map((item) => (
        <SidebarLink
          key={item.title}
          item={item}
          isOpen={isOpen}
          isActive={isPathActive(item.path)}
          onClick={onLinkClick}
        />
      ))}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  const { isMobileOpen, close, toggle } = useMobileSidebar();
  const isPathActive = useCallback(
    (path: string) => pathname === path,
    [pathname]
  );
  const [isPending, startTransition] = useTransition();
  const isHydrated = useSidebarStore((state) => state.hasHydrated);
  const router = useRouter();

  const handleLogout = useCallback(() => {
    startTransition(() => {
      signOut();
      router.push("/login");
    });
  }, []);

  if (!isHydrated) return null; // or loader

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MenuButton onClick={toggle} isOpen={isMobileOpen} />
      </div>

      {/* Sidebar Desktop */}
      <div
        className={`hidden lg:flex h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col flex-1 bg-gray-900 text-white">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center">
            <Logo isOpen={isOpen} />
          </div>

          {/* Navigation */}
          <SidebarNav isOpen={isOpen} isPathActive={isPathActive} />

          {/* Bottom Section */}
          <div className="py-4 px-2 space-y-2">
            <button
              onClick={toggleSidebar}
              className={`hidden lg:flex items-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${
                isOpen ? "" : "justify-center"
              }`}
            >
              <Menu className="w-5 h-5 text-gray-400" />
              {isOpen && <span className="ml-3 text-gray-300">Collapse</span>}
            </button>
            <LogoutButton isOpen={isOpen} onClick={handleLogout} />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black z-30 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="fixed inset-y-0 left-0 w-64 bg-gray-900 z-40 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center px-6">
                <MobileLogo />
              </div>

              <SidebarNav
                isOpen={true}
                isPathActive={isPathActive}
                onLinkClick={close}
              />

              {/* Mobile Logout */}
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-3 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <LoadingSpinner isPending={isPending} />
    </>
  );
}
