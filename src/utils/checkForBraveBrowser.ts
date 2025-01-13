export function isBrave() {
  // Check for Brave-specific properties and behaviors
  return (
    (navigator?.brave && navigator?.brave.isBrave) ||
    navigator.userAgent.includes("Brave")
  );
}
