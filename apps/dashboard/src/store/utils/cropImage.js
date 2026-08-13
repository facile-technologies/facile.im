export default function getCroppedImg(imageSrc, pixelCrop, shape) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // for cross-origin images
    img.src = imageSrc;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas width and height based on shape
      if (shape === "oval") {
        canvas.width = pixelCrop.width * 2;
        canvas.height = pixelCrop.height;
      } else {
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
      }

      // Clip the image according to the shape (circle/oval/rectangle)
      if (shape === "circle" || shape === "oval") {
        ctx.beginPath();
        ctx.ellipse(
          canvas.width / 2,  // x-axis
          canvas.height / 2, // y-axis
          canvas.width / 2,  // horizontal radius
          canvas.height / 2, // vertical radius
          0, 0, 2 * Math.PI   // full ellipse
        );
        ctx.clip();
      }

      // Draw the image into the canvas
      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      try {
        // Convert canvas to Blob (file object)
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], "cropped-image.jpg", {
              type: "image/jpeg",
            });
            resolve(file);  // Return the file object
          },
          "image/jpeg",  // or image/png
          1
        );
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = (err) => reject(err);
  });
}
