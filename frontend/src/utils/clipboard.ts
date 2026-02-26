/**
 * Clipboard utility with fallback for mobile browsers
 * where navigator.clipboard may be unavailable or restricted.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Primary: modern Clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand fallback
    }
  }

  // Fallback: document.execCommand('copy') via temporary textarea
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Position off-screen so it doesn't flash
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    // For iOS Safari
    textarea.setSelectionRange(0, textarea.value.length);
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}
