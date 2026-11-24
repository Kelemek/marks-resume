export type CertImageBox = {
  width: number;
  height: number;
};

/** Fit natural image dimensions inside a max box (object-contain math). */
export function computeCertImageBox(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number,
): CertImageBox {
  if (naturalWidth <= 0 || naturalHeight <= 0 || maxWidth <= 0 || maxHeight <= 0) {
    return { width: 0, height: 0 };
  }
  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);
  return {
    width: Math.round(naturalWidth * scale),
    height: Math.round(naturalHeight * scale),
  };
}

export function clearCertImageLayout(img: HTMLImageElement) {
  img.style.width = '';
  img.style.height = '';
  img.style.maxWidth = '';
  img.style.maxHeight = '';
}

export function layoutCertImage(img: HTMLImageElement) {
  const body = img.parentElement;
  if (!body) return;

  const styles = getComputedStyle(body);
  const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const padY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const maxW = Math.max(0, body.clientWidth - padX);
  const maxH = Math.max(0, body.clientHeight - padY);
  const box = computeCertImageBox(img.naturalWidth, img.naturalHeight, maxW, maxH);
  if (box.width <= 0 || box.height <= 0) return;

  const w = `${box.width}px`;
  const h = `${box.height}px`;
  img.style.width = w;
  img.style.height = h;
  img.style.maxWidth = w;
  img.style.maxHeight = h;
}

export function waitForCertImage(img: HTMLImageElement): Promise<void> {
  const decode = () => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve());

  if (img.complete && img.naturalWidth > 0) {
    return decode().then(() => undefined);
  }

  return new Promise((resolve, reject) => {
    const onLoad = () => {
      cleanup();
      void decode().then(() => resolve());
    };
    const onError = () => {
      cleanup();
      reject(new Error('certificate image failed to load'));
    };
    const cleanup = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
  });
}