// Each click draws again. Nothing is stored on the visitor's browser.
export function pickWhatsapp(numbers: readonly string[]) {
  if (numbers.length === 0) return "";
  return numbers[Math.floor(Math.random() * numbers.length)] ?? "";
}

export function whatsappUrl(number: string, text: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
