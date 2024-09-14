// Converts a base 10 number string in hexadecimal
export default function convertToHex(base10String: string): string {
  const number = parseInt(base10String, 10);
  if (isNaN(number)) {
    throw new Error('Invalid number input');
  }
  return `0x${number.toString(16)}`;
}
