// Create 3 canvas elements
const originalCanvas = document.createElement("canvas");
const magnitudeCanvas = document.createElement("canvas");
const phaseCanvas = document.createElement("canvas");
// Append each canvas to the respective container
const originalContainer = document.getElementById("originalImageContainer");
originalContainer.appendChild(originalCanvas);
const magnitudeContainer = document.getElementById("magnitudeImageContainer");
magnitudeContainer.appendChild(magnitudeCanvas);
const phaseContainer = document.getElementById("phaseImageContainer");
phaseContainer.appendChild(phaseCanvas);
// Get the 2D context for each canvas
const originalCtx = originalCanvas.getContext("2d");
const magnitudeCtx = magnitudeCanvas.getContext("2d");
const phaseCtx = phaseCanvas.getContext("2d");

// Load and process the image
// Create and load image
const IMAGES_URLS = [
  "https://images.unsplash.com/photo-1734299421690-13be495151c4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1734485836409-ba4a2f822016?q=80&w=2085&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1734458530824-b6623d8c8b4b?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1731331344306-ad4f902691a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1734366965586-dc4155c0b9b7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1577996947118-d820138a697e?q=80&w=1957&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1734249201319-e7227b1b4f54?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1731340319631-2cc2f07d154a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1732696290916-bef60504fa79?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1734335515230-f9c30d1917c9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1664544228357-06ce9e98080e?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1704791403624-c192488ca4fa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1732740674539-74d1f760acfa?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
const IMAGE_WIDTH = 256;
const IMAGE_HEIGHT = 256;
console.log("Downloading image");
const img = new Image();
// NOTE that if we set crossOrigin to anonymous for some reason the image data cannot be gotten without being "unsafe"
//     but if the image is loaded anonymous then we cannot download the image at all... so what gives? I think we just
//     need to fetch the images from a webserver :/
img.crossOrigin = "anonymous";
img.src = IMAGES_URLS[0];
img.onload = () => {
  console.log("Image onload");
  originalCanvas.width = IMAGE_WIDTH;
  originalCanvas.height = IMAGE_HEIGHT;
  originalCtx.drawImage(img, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

  const size = Math.min(IMAGE_WIDTH, img.width, img.height);
  [magnitudeCanvas, phaseCanvas].forEach((canvas) => {
    canvas.width = size;
    canvas.height = size;
  });

  // Get image data from original canvas
  const imageData = originalCtx.getImageData(0, 0, size, size);
  console.log("imageData", imageData);
  const pixels = imageData.data;
  console.log(
    "pixels size",
    pixels.length,
    "pixels length / (img width * img height) = ",
    pixels.length / (IMAGE_WIDTH * IMAGE_HEIGHT) // 4
  );

  // Convert to grayscale and prepare data for FFT
  const color_weights = [0.299, 0.587, 0.114]; // RGB
  //https://support.ptc.com/help/mathcad/r10.0/en/index.html#page/PTC_Mathcad_Help/example_grayscale_and_color_in_images.html
  const grayData = new Array(size * size);
  for (let i = 0; i < pixels.length; i += 4) {
    // RGBH
    const gray = color_weights.reduce(
      (acc, weight, index) => acc + pixels[i + index] * weight,
      0
    );
    const opacity = pixels[i + 3] / 255; // pre-multiply by opacity (alpha) for less bright parts of the image
    // const opacity = 1;
    grayData[i / 4] = gray * opacity;
  }

  console.log("grayData", grayData);
  // Print array shape
  console.log("Array shape:", {
    rows: size,
    cols: size,
    totalElements: grayData.length,
  });

  // Perform 2D FFT
  console.log("performing 2d fft"); // XXX
  const fft2d = perform2DFFT(grayData, size); // XXX

  // Calculate magnitude and phase
  console.log("calculating magnitude and phase"); // XXX
  const magnitude = new Array(size * size);
  const phase = new Array(size * size);
  for (let i = 0; i < size * size; i++) {
    magnitude[i] = fft2d[i]; //.re; // XXX
    phase[i] = fft2d[i]; //.im;
  }

  // Normalize and display magnitude (using log scale)
  console.log("normalizing and displaying magnitude"); // XXX
  const magnitudeImage = magnitudeCtx.createImageData(size, size);
  //   const maxMagnitude = Math.log(Math.max(...magnitude) + 1); // XXX
  for (let i = 0; i < magnitude.length; i++) {
    // const value = (Math.log(magnitude[i] + 1) / maxMagnitude) * 255; // dB sux 4 img here
    const value = magnitude[i]; // XXX
    const idx = i * 4;
    magnitudeImage.data[idx] = value;
    magnitudeImage.data[idx + 1] = value;
    magnitudeImage.data[idx + 2] = value;
    // magnitudeImage.data[idx + 3] = grayData[i + 3]; // absolutely busted
    magnitudeImage.data[idx + 3] = 255; // XXX
  }
  magnitudeCtx.putImageData(magnitudeImage, 0, 0);
  console.log("done displaying magnitude"); // XXX
  // Display phase
  console.log("displaying phase"); // XXX
  const phaseImage = phaseCtx.createImageData(size, size);
  for (let i = 100; i < phase.length; i++) {
    // const value = (phase[i] + Math.PI) / (2 * Math.PI) * 255;
    const value = phase[i]; // XXX
    const idx = i * 4;
    phaseImage.data[idx] = value;
    phaseImage.data[idx + 1] = value;
    phaseImage.data[idx + 2] = value;
    phaseImage.data[idx + 3] = 255;
  }
  phaseCtx.putImageData(phaseImage, 0, 0);
  console.log("done displaying phase"); // XXX
};

// Function to perform 2D FFT
// NOTE you must include the line `<script src="https://unpkg.com/mathjs@14.2.1/lib/browser/math.js"></script>`
// BEFORE your script tag for this to work
function perform2DFFT(data, size) {
  // Prepare the complex number array
  console.log("mid fft  generation hehe");
  const complex = data.map((x) => math.complex(x, 0));

  // Perform FFT on rows
  for (let i = 0; i < size; i++) {
    const row = complex.slice(i * size, (i + 1) * size);
    const fftRow = math.fft(row);
    for (let j = 0; j < size; j++) {
      complex[i * size + j] = fftRow[j];
    }
  }

  // Perform FFT on columns
  for (let j = 0; j < size; j++) {
    const col = new Array(size);
    for (let i = 0; i < size; i++) {
      col[i] = complex[i * size + j];
    }
    const fftCol = math.fft(col);
    for (let i = 0; i < size; i++) {
      complex[i * size + j] = fftCol[i];
    }
  }

  // Shift zero frequency to center
  return fftShift(complex, size);
}

// Function to shift zero frequency to center ---- lgtm
function fftShift(data, size) {
  const shifted = new Array(size * size);
  const halfSize = Math.floor(size / 2);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const newI = (i + halfSize) % size;
      const newJ = (j + halfSize) % size;
      shifted[newI * size + newJ] = data[i * size + j];
    }
  }

  return shifted;
}
