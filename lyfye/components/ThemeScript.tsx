/**
 * Script to prevent theme flash on page load
 * This should be placed in the <head> of the document
 */
export const ThemeScript = () => {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('theme') ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.classList.add(theme);
      } catch (e) {
        console.error('Theme initialization failed:', e);
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
};
