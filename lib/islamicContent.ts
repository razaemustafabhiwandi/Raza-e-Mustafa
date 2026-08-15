// Curated from an Ahle Sunnat wal Jamaat (Maslak-e-Ala Hazrat, Fiqh Hanafi) perspective.
// Hadith entries only cite a book when the narration is well-established and widely
// documented; softer "riwayat hai" framing is used where a precise citation is less certain.

export type Quote = { text: string; source?: string };

export const HADITH_LIST: Quote[] = [
  {
    text: "Jo shakhs mujh par ek martaba durood bhejta hai, Allah Ta'ala us par das martaba rahmat nazil farmata hai.",
    source: "Sahih Muslim",
  },
  {
    text: "Qayamat ke din logon mein se mere sabse qareeb wo hoga jo mujh par sabse zyada durood bheje.",
    source: "Jami' at-Tirmidhi",
  },
  {
    text: "Bakhil wo hai jiske saamne mera zikr ho aur wo mujh par durood na bheje.",
    source: "Jami' at-Tirmidhi",
  },
  {
    text: "Tum mein se koi shakhs us waqt tak momin nahi ho sakta jab tak main use uski jaan, uski aulad aur tamam logon se zyada mahboob na ho jaun.",
    source: "Sahih Bukhari",
  },
  {
    text: "Jahan kahin se bhi koi mujh par durood bhejta hai, mujhe uska salaam pahuncha diya jata hai.",
    source: "Riwayat hai",
  },
  {
    text: "Musalman ke liye musalman bhai ke liye wohi pasand karna chahiye jo wo apne liye pasand karta hai.",
    source: "Sahih Bukhari",
  },
];

export const SEERAT_LIST: Quote[] = [
  {
    text: "Huzoor Sallallahu Alaihi Wasallam ki wiladat-e-ba-sa'adat 12 Rabi-ul-Awwal, Aam-ul-Feel mein Makkah Mukarrama mein hui.",
  },
  {
    text: "Bachpan hi se Aapki sacchai aur amanatdari ki wajah se log Aapko 'Al-Amin' (sacha aur amanatdar) kehte the.",
  },
  {
    text: "Allah Ta'ala ne Quran-e-Pak mein Aapko 'Rahmatan lil Aalameen' — saari kaainaat ke liye rahmat — farmaya.",
    source: "Surah Al-Anbiya, 21:107",
  },
  {
    text: "Aapki radaa'at (doodh pilaayi) Hazrat Halima Sa'diya (Radi Allahu Anha) ke ghar hui, jahan Aapki barkat se khushaali aa gayi.",
  },
  {
    text: "Fateh-e-Makkah ke din, poori tarah ghalba hone ke bawajood, Aapne apne sabse bade dushmanon ko bhi maaf farma diya.",
  },
  {
    text: "Shab-e-Meraaj Aapko seedhe Allah Ta'ala ki baargah mein bulaya gaya — yeh sharaf kisi aur Nabi ko naseeb nahi hua.",
  },
  {
    text: "Khutba-e-Hajjatul Wida mein Aapne insaaniyat ki barabari, aurton ke huqooq aur bhaichare ka paigham diya.",
  },
  {
    text: "Aap yateemon, ghareebon aur musafiron ke saath khaas narmi aur shafqat se pesh aate the.",
  },
];

export const FAIZLAT_DUROOD_LIST: Quote[] = [
  {
    text: "Durood Sharif dilon ko sukoon deta hai aur gunahon ki maghfirat ka zariya hai.",
  },
  {
    text: "Har dua se pehle aur baad mein Durood Sharif parhna dua ki qubuliyat ke asbaab mein se hai.",
  },
  {
    text: "Namaz ke Tashahhud ke baad Durood-e-Ibrahim parhna Fiqh Hanafi ke mutabiq sunnat-e-muakkada hai.",
  },
  {
    text: "Ahle Sunnat wal Jamaat (Maslak-e-Ala Hazrat) mein Milad-un-Nabi aur Mehfil-e-Durood ka ehtemaam khushi aur ibadat ka zariya samjha jata hai.",
  },
  {
    text: "Jumu'ah ke din aur raat kasrat se Durood Sharif parhne ki khaas tarai'in aayi hain.",
  },
];

function dailyIndex(length: number, offset = 0): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  return (dayOfYear + offset) % length;
}

export function getDailyHadith(): Quote {
  return HADITH_LIST[dailyIndex(HADITH_LIST.length)];
}

export function getDailySeerat(): Quote {
  return SEERAT_LIST[dailyIndex(SEERAT_LIST.length, 3)];
}

export function getDailyFaizlat(): Quote {
  return FAIZLAT_DUROOD_LIST[dailyIndex(FAIZLAT_DUROOD_LIST.length, 6)];
}
