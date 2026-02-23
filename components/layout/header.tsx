import { SignOutButton } from "@clerk/nextjs"
import { LogOutIcon, Settings } from "lucide-react"
import Tooltip from "../ui/tooltip"

const Header = () => {
  return (
    <header className="h-full px-4 flex items-center justify-between shadow bg-surface">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold cursor-pointer hover:scale-105 transition">
          NE
        </div>
        {/* <h1 className="text-lg font-semibold">NFin</h1> */}
      </div>
      <div className="flex items-center justify-center gap-3">
        <Tooltip label="Settings">
          <button className="p-2 rounded-lg transition" aria-label="Settings">
            <Settings size={20} />
          </button>
        </Tooltip>
        <SignOutButton redirectUrl="/">
          <Tooltip label="Logout">
            <LogOutIcon className="cursor-pointer" size={20} />
          </Tooltip>
        </SignOutButton>
      </div>
    </header>
  )
}

export default Header