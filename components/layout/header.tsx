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
      <header className="h-full px-4 py-3 flex items-center justify-between gap-3 bg-bar border-b border-border text-text-primary">

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.replace('/dashboard')}
            className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold transition hover:bg-primary/25"
          >
            {userData?.name?.slice(0, 2).toUpperCase()}
          </button>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Tooltip label="Settings">
            <button className="p-2 rounded-2xl border border-border bg-surface-soft text-text-primary transition hover:border-primary/40" aria-label="Settings">
              <Settings size={20} />
            </button>
          </Tooltip>
          <button
            onClick={async () => await handleLogOutClick()}
            className="p-2 rounded-2xl border border-border bg-surface-soft text-text-primary transition hover:border-primary/40"
          >
            {loading ? <LoaderButton className="w-4 h-4" /> : <LogOutIcon size={20} />}
          </button>
        </div>
      </header>
    </>
  )
}

export default Header