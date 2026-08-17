// Normalizes an Indian mobile number to a bare 10-digit string (e.g. "9876543210").
// Strips spaces/dashes/parens and a leading country code (+91 / 91 / 0), then
// validates it's a real 10-digit mobile number starting with 6-9.
// Returns null if the input isn't a valid Indian mobile number.
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/[^\d]/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return digits;
}
