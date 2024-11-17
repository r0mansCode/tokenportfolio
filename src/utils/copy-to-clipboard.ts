export const copyToClipboard = (text: string) => {
  console.log("text", text);
  navigator.clipboard.writeText(text);
};
