"use client";
import React, { memo, useCallback, useTransition } from "react";
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
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { useAutoCloseSidebar } from "@/lib/hooks/useAutoCloseSidebar";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    exact: true, // Only active on exact match
  },
  {
    title: "Clients",
    icon: Users,
    path: "/dashboard/clients",
    matchPattern: /^\/dashboard\/clients(?:\/.*)?$/, // Active on /clients and its children
  },
  {
    title: "Invoices",
    icon: FileText,
    path: "/dashboard/invoices",
    matchPattern: /^\/dashboard\/invoices(?:\/.*)?$/, // Active on /invoices and its children
  },
];

const baseLinkClasses =
  "flex items-center p-3 rounded-lg transition-colors hover:bg-gray-800 cursor-pointer text-sm sm:text-base";
const baseIconClasses = "size-5 lg:size-6 text-gray-400 group-hover:text-white";
const activeLinkClasses = "bg-gray-800 text-white";

function MobileMenuButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-50 p-4 sm:px-6 z-30 border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center">
        <button
          onClick={onClick}
          className="p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="size-5" />
        </button>
      </div>
    </div>
  );
}

function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <MobileLogo />
      <button
        onClick={onClose}
        className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 -mr-2"
        aria-label="Close sidebar"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

const SidebarLink = memo(function SidebarLink({
  item,
  isOpen,
  isActive,
}: {
  item: (typeof menuItems)[0];
  isOpen: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.path}
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
});

function SidebarNav({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  const isPathActive = useCallback(
    (item: (typeof menuItems)[0]) => {
      if (item.exact) {
        return pathname === item.path;
      }
      if (item.matchPattern) {
        return item.matchPattern.test(pathname);
      }
      return pathname.startsWith(item.path);
    },
    [pathname]
  );

  return (
    <nav className="flex-1 px-2 py-4 space-y-4">
      {menuItems.map((item) => (
        <SidebarLink
          key={item.title}
          item={item}
          isOpen={isOpen}
          isActive={isPathActive(item)}
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

  const [isPending, startTransition] = useTransition();
  const isHydrated = useSidebarStore((state) => state.hasHydrated);
  const router = useRouter();
  useLockBodyScroll(isMobileOpen);
  useAutoCloseSidebar(close);

  const handleLogout = useCallback(() => {
    startTransition(() => {
      signOut();
      router.push("/login");
    });
  }, [router]);

  if (!isHydrated) return null; // or loader

  return (
    <>
      {/* Mobile Menu Button */}
      {!isMobileOpen && <MobileMenuButton onClick={toggle} isOpen={false} />}

      {/* Sidebar Desktop */}
      <div
        className={`hidden lg:flex h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col flex-1 bg-gray-900 text-white pt-8 space-y-6">
          {/* Logo */}
          <div className=" flex items-center justify-center ">
            <Logo isOpen={isOpen} />
          </div>

          {/* Navigation */}
          <SidebarNav isOpen={isOpen} />

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
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-64 bg-gray-900 z-40 lg:hidden flex flex-col pt-4 sm:pt-6 space-y-4"
            >
              <SidebarHeader onClose={close} />
              <SidebarNav isOpen={true} />

              {/* Mobile Logout */}
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-3 text-sm text-red-400 hover:text-red-300 cursor-pointer rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="size-5" />
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
