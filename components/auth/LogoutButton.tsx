import { LogOut } from "lucide-react";

export function LogoutButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors text-red-400 hover:text-red-300 cursor-pointer ${
        isOpen ? "" : "justify-center"
      }`}
    >
      <LogOut className="w-5 h-5" />
      {isOpen && <span className="ml-3">Logout</span>}
    </button>
  );
}
