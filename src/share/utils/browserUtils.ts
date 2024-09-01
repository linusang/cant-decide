function fallbackCopyTextToClipboard(text: string): Promise<void> {
    const textArea = document.createElement("textarea");
    textArea.value = text;
  
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    const promise = new Promise<void>((resolve, reject) => {
      try {
        const successful = document.execCommand("copy");
        const msg = successful ? "successful" : "unsuccessful";
        if (msg === "successful") {
          resolve();
        } else {
          reject(msg);
        }
      } catch (err) {
        reject(err);
      }
    }).finally(() => {
      document.body.removeChild(textArea);
    });
    return promise;
  }
  
  export function copyTextToClipboard(text: string): Promise<void> {
    // check for clipboard API
    if (!navigator.clipboard) {
      return fallbackCopyTextToClipboard(text);
    }
  
    return navigator.clipboard.writeText(text);
  }
  