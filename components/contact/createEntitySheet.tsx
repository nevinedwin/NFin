"use client";

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useTransition,
    useMemo,
} from "react";
import { X, Loader2 } from "lucide-react";
import { createContact, createGroup, getContacts } from "@/actions/contacts";
import Input from "../ui/input";
import AccountLogo from "../wallet/accountLogo";
import HorizontalLine from "../ui/horizontalLine";
import useDebounceValue from "@/hooks/useDebounceValue";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import SearchInput from "../ui/searchInput";

type Props = {
    open: boolean;
    type: "contact" | "group";
    onClose: () => void;
};

type Contact = {
    id: string;
    name: string;
    phone: string;
};

type Cursor = { name: string; id: string } | null;


const PAGE_SIZE = 10;

const CreateEntitySheet = ({ open, type, onClose }: Props) => {

    const [isPending, startTransition] = useTransition();

    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<Contact[]>([]);
    const [groupName, setGroupName] = useState("");
    const [query, setQuery] = useState("");
    const debouncedSearch = useDebounceValue(query, 400);
    const [contactForm, setContactForm] = useState({
        name: "",
        phone: "",
        email: "",
    });


    const {
        loading,
        data: contacts,
        scrollElementRef
    } = useInfiniteScroll<Cursor, Contact>({
        query: debouncedSearch,
        action: getContacts,
        size: PAGE_SIZE,
        format: (prev, incoming) => {
            const ids = new Set(prev.map(c => c.id));
            return [...prev, ...incoming.filter(c => !ids.has(c.id))]
        }
    });



    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const loaderRef = useRef<HTMLDivElement | null>(null);


    const reset = () => {
        setSelected([]);
    }

    /* ---------------- VISIBILITY ---------------- */

    useEffect(() => {
        if (open) setVisible(true);
        else {
            const t = setTimeout(() => setVisible(false), 250);
            reset();
            return () => clearTimeout(t);
        }
    }, [open]);

    /* ---------------- HELPERS ---------------- */

    const selectedIds = useMemo(
        () => new Set(selected.map(c => c.id)),
        [selected]
    );

    const toggle = (contact: Contact) => {
        setSelected((prev) =>
            prev.some(c => c.id === contact.id)
                ? prev.filter(c => c.id !== contact.id)
                : [...prev, contact]
        );
    };

    const contactMap = useMemo(() => {
        return new Map(contacts.map((c) => [c.id, c]));
    }, [contacts]);

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = () => {
        startTransition(async () => {
            if (type === "contact") {
                if (!contactForm.name || !contactForm.phone) return;

                await createContact(contactForm);
                setContactForm({ name: "", phone: "", email: "" });
            }

            if (type === "group") {
                if (!groupName || selected.length === 0) return;

                await createGroup({
                    name: groupName,
                    memberIds: selected.map(c => c.id),
                });

                setGroupName("");
                setSelected([]);
            }

            onClose();
        });
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-end transition ${open ? "bg-black/50 backdrop-blur-sm" : "pointer-events-none"
                }`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className={`w-full bg-black rounded-t-3xl flex flex-col transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"
                    }`}
                style={{ height: "85vh"}}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-4 pb-8">
                    <h2 className="text-lg font-semibold text-white">
                        {type === "contact" ? "Create Contact" : "Create Group"}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-surface">
                        <X size={18} />
                    </button>
                </div>

                {/* CONTACT FORM */}
                {type === "contact" && (
                    <div className="flex flex-col gap-3 px-4">
                        <Input
                            placeholder="Name"
                            value={contactForm.name}
                            onChange={(e) =>
                                setContactForm({ ...contactForm, name: e.target.value })
                            }
                            className='!bg-transparent !text-white placeholder:!text-slate-400'
                        />
                        <Input
                            placeholder="Phone"
                            inputMode="numeric"
                            value={contactForm.phone}
                            onChange={(e) =>
                                setContactForm({ ...contactForm, phone: e.target.value })
                            }
                            className='!bg-transparent !text-white placeholder:!text-slate-400'
                        />
                        <Input
                            placeholder="Email"
                            value={contactForm.email}
                            onChange={(e) =>
                                setContactForm({ ...contactForm, email: e.target.value })
                            }
                            className='!bg-transparent !text-white placeholder:!text-slate-400'
                        />
                    </div>
                )}

                {/* GROUP */}
                {type === "group" && (
                    <div className="py-3 flex flex-col min-h-0 flex-1">

                        <SearchInput
                            name="contact-search"
                            placeholder="Search Contacts"
                            value={query}
                            onChange={setQuery}
                            className='!bg-transparent !text-white placeholder:!text-slate-400 border-none focus:!ring-0'
                        />

                        {/* SELECTED */}
                        {selected.length > 0 && (
                            <div className="flex-shrink-0 flex flex-wrap gap-2 px-4 pb-2 max-h-[100px] overflow-y-auto">
                                {selected.map((contact) => {
                                    return (
                                        <span key={contact.id} className="h-[30px] bg-surface px-3 py-1 rounded-lg flex gap-2">
                                            {contact.name}
                                            <X size={16} onClick={() => toggle(contact)} />
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        <HorizontalLine />

                        {/* LIST */}
                        <div className="flex-1 overflow-y-auto py-2 space-y-2 min-h-0 pb-16">
                            {contacts.map((c, index) => {

                                if (contacts.length - 3 === index + 1) {
                                    return (
                                        <button
                                            key={c.id}
                                            ref={scrollElementRef}
                                            onClick={() => toggle(c)}
                                            className="w-full flex items-center gap-3 px-4 py-3 active:bg-surface"
                                        >
                                            <AccountLogo name={c.name.slice(0, 2)} className="w-10 h-10" />
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm text-white">{c.name}</span>
                                                <span className="text-xs text-slate-400">{c.phone}</span>
                                            </div>
                                        </button>
                                    )
                                } else {
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => toggle(c)}
                                            className="w-full flex items-center gap-3 px-4 py-3 active:bg-surface"
                                        >
                                            <AccountLogo name={c.name.slice(0, 2)} className="w-10 h-10" />
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm text-white">{c.name}</span>
                                                <span className="text-xs text-slate-400">{c.phone}</span>
                                            </div>
                                        </button>
                                    )
                                }
                            }
                            )}

                            {loading && (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="animate-spin" />
                                </div>
                            )}

                            <div ref={loaderRef} />

                            {!loading && contacts.length === 0 && (
                                <div className="text-center text-slate-500 py-10">
                                    No contacts found
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* FOOTER */}
                <div className="p-4 pt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full py-3 rounded-xl font-semibold bg-white text-black"
                    >
                        {isPending
                            ? "Processing..."
                            : type === "contact"
                                ? "Create Contact"
                                : "Create Group"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEntitySheet;