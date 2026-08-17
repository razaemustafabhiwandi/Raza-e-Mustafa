import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="pattern-bg-dark mt-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-10 text-center text-sm text-cream/80">
        <Image src="/jrm-logo.png" alt="Jamat Raza-e-Mustafa" width={64} height={61} className="h-16 w-auto" />
        <p className="bismillah text-lg text-gold">
          اَللّٰهُمَّ صَلِّ عَلٰی مُحَمَّدٍ وَّ عَلٰی اٰلِ مُحَمَّدٍ
        </p>
        <p className="font-heading font-semibold text-cream">Raza-e-Mustafa Bhiwandi</p>
        <p>&copy; {new Date().getFullYear()} Jamat Raza-e-Mustafa Bhiwandi</p>
        <Link href="/admin/login" className="text-xs text-cream/50 hover:text-gold">
          Admin
        </Link>
      </div>
    </footer>
  );
}
