const productInput = document.getElementById('productImage');
const logoInput = document.getElementById('logoImage');
const previewArea = document.getElementById('previewArea');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let productImg = null;
let logoImg = null;

// Handle Product Image Upload
productInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        productImg = new Image();
        productImg.onload = function() {
            previewArea.style.display = 'block';
            drawCanvas(true); // Draw with watermark initially
        }
        productImg.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

// Handle Logo Upload
logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        logoImg = new Image();
        logoImg.onload = function() {
            if (productImg) drawCanvas(true);
        }
        logoImg.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

// Core Canvas Drawing Function (1:1 Square + Padding + Watermark)
function drawCanvas(includeWatermark) {
    if (!productImg) return;

    // Set canvas dimensions to a clean 1080x1080 square (Standard Instagram size)
    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // 1. Fill background with clean white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // 2. Calculate dimensions to center the product image perfectly without cutting it
    const padding = 80; // Margin around the image
    const availableSize = size - (padding * 2);
    
    let imgWidth = productImg.width;
    let imgHeight = productImg.height;
    
    let ratio = Math.min(availableSize / imgWidth, availableSize / imgHeight);
    let newWidth = imgWidth * ratio;
    let newHeight = imgHeight * ratio;
    
    let x = (size - newWidth) / 2;
    let y = (size - newHeight) / 2;

    // Draw the product image onto the square canvas
    ctx.drawImage(productImg, x, y, newWidth, newHeight);

    // 3. Draw Custom Store Logo if uploaded
    if (logoImg) {
        const logoSize = 150;
        ctx.drawImage(logoImg, size - logoSize - 40, size - logoSize - 40, logoSize, logoSize);
    }

    // 4. Handle Watermark overlay
    if (includeWatermark) {
        ctx.save();
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        
        // Draw agency branding across the bottom or center
        ctx.fillText("@growth.online.post", size / 2, size - 30);
        ctx.restore();
    }
}

// Download Free Version with Watermark
document.getElementById('downloadWatermarked').addEventListener('click', () => {
    drawCanvas(true);
    triggerDownload("instagram-product-free.png");
});

// Paid Version (Simulates UPI Payment flow for ₹20)
document.getElementById('payAndDownload').addEventListener('click', () => {
    let confirmed = confirm("Pay ₹20 via UPI to remove watermark and download clean HD image?");
    if (confirmed) {
        alert("Payment successful! Downloading clean image...");
        drawCanvas(false); // Draw without watermark
        triggerDownload("instagram-product-hd.png");
        drawCanvas(true); // Restore preview watermark
    }
});

// Helper function to trigger browser download
function triggerDownload(filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}