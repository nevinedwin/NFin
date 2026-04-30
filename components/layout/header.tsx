import { LogOutIcon, ScanQrCode, Settings } from "lucide-react"
import Tooltip from "../ui/tooltip"
import { logOut } from "@/auth/auth.actions"
import LoaderButton from "../ui/loaderButton";
import { useState, useTransition } from "react";
import TopLoader from "../ui/topLoader";
import { useMainShellContext } from "@/app/(main)/context/mainShellContext";
import { useRouter } from "next/navigation";

const Header = ({ loading: pageLoading }: { loading: boolean }) => {

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const { userData, startLoading } = useMainShellContext();

  const [, startTransition] = useTransition();

  const openScanner = () => {
    startLoading();
    startTransition(() => {
      router.push('/scan');
    });
  };

  const handleLogOutClick = async () => {
    setLoading(true);
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopLoader loading={pageLoading} />
      <header className="h-full px-4 flex items-center justify-between bg-bar">

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold cursor-pointer hover:scale-105 transition" onClick={() => router.replace('/dashboard')}>
            {userData?.name?.slice(0, 2).toUpperCase()}
          </div>
          {/* <h1 className="text-lg font-semibold">NFin</h1> */}
        </div>
        <div className="flex items-center justify-center gap-3">
          {/* <button className="p-2 rounded-lg transition" onClick={openScanner} aria-label="Scan Qr">
            <ScanQrCode size={20} />
          </button> */}
          <Tooltip label="Settings">
            <button className="p-2 rounded-lg transition" aria-label="Settings">
              <Settings size={20} />
            </button>
          </Tooltip>
          {/* <Tooltip label="Logout"> */}
          <button onClick={async () => await handleLogOutClick()} >
            {loading ? <LoaderButton className="w-4 f-4" /> : <LogOutIcon className="cursor-pointer" size={20} />}
          </button>
          {/* </Tooltip> */}
        </div>
      </header>
    </>
  )
}

export default Header