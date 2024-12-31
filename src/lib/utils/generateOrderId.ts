export function generateOrderId(): string {
  // Generiere eine eindeutige ID mit mindestens 20 Zeichen
  const timestamp = Date.now().toString(36); // Zeitstempel in Base36
  const randomStr = Math.random().toString(36).substring(2, 15); // Zufällige Zeichenkette
  const additionalRandom = Math.random().toString(36).substring(2, 15); // Weitere Zufallszeichen
  
  return `GT-${timestamp}-${randomStr}-${additionalRandom}`.toUpperCase();
}
