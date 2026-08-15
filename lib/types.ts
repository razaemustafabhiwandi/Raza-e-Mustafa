export type EntryType = "durood" | "kalimah" | "para" | "surah";

export const ENTRY_TYPES: { value: EntryType; label: string; labelUrdu: string }[] = [
  { value: "durood", label: "Durood Sharif", labelUrdu: "درود شریف" },
  { value: "kalimah", label: "Kalimah", labelUrdu: "کلمہ" },
  { value: "para", label: "Quran Para", labelUrdu: "قرآن پارہ" },
  { value: "surah", label: "Surah", labelUrdu: "سورہ" },
];

export function entryTypeLabel(type: string): string {
  return ENTRY_TYPES.find((t) => t.value === type)?.label ?? type;
}

export type Profile = {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  created_at: string;
};

export type Entry = {
  id: string;
  profile_id: string;
  type: EntryType;
  count: number;
  note: string | null;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  is_active: boolean;
  created_at: string;
};
