import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <Image
        src="/jrm-logo.png"
        alt="Jamat Raza-e-Mustafa"
        width={80}
        height={76}
        className="h-16 w-auto opacity-90"
      />
      <p className="bismillah text-xl text-gold">اِنَّا لِلّٰہِ وَاِنَّاۤ اِلَیْہِ رَاجِعُوْن</p>
      <h1 className="font-heading text-3xl font-black text-primary">Yeh Safha Nahi Mila</h1>
      <p className="text-sm text-primary/60">
        Jo panna aap dhoondh rahe hain wo shayad hata diya gaya hai ya link ghalat hai.
      </p>
      <Link
        href="/"
        className="shine-btn mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-primary-dark"
      >
        Home Par Wapas Jayein
      </Link>
    </div>
  );
}
