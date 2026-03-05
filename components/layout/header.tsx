import { LogOutIcon, Settings } from "lucide-react"
import Tooltip from "../ui/tooltip"
import { logOut } from "@/auth/auth.actions"
import LoaderButton from "../ui/loaderButton";

type HeaderProp = {
  startLoading: () => void;
  stopLoading: () => void;
  loading: boolean;
}

const Header = ({ startLoading, stopLoading, loading }: HeaderProp) => {

  const handleLogOutClick = async () => {
    startLoading();
    try {
      logOut();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  }

  return (
    <header className="h-full px-4 flex items-center justify-between bg-bar">
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
        <Tooltip label="Logout">
          {loading ? <LoaderButton className="w-4 f-4" /> : <LogOutIcon className="cursor-pointer" size={20} onClick={handleLogOutClick} />}
        </Tooltip>
      </div>
    </header>
  )
}

export default Header