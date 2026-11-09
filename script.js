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
            drawCanvas(true); 
        }
        productImg.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

// Handle Logo Upload (Reads the logo file and redraws canvas immediately)
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

// Core Canvas Drawing Function (1:1 Square + Padding + Logo + Watermark)
function drawCanvas(includeWatermark) {
    if (!productImg) return;

    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // 1. Fill background with clean white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // 2. Center the product image with padding
    const padding = 80; 
    const availableSize = size - (padding * 2);
    
    let imgWidth = productImg.width;
    let imgHeight = productImg.height;
    
    let ratio = Math.min(availableSize / imgWidth, availableSize / imgHeight);
    let newWidth = imgWidth * ratio;
    let newHeight = imgHeight * ratio;
    
    let x = (size - newWidth) / 2;
    let y = (size - newHeight) / 2;

    ctx.drawImage(productImg, x, y, newWidth, newHeight);

    // 3. CHANGE HERE: Draw Custom Store Logo in the bottom-right corner if uploaded
    if (logoImg) {
        const logoSize = 180; // You can change this number if you want the logo bigger or smaller
        const margin = 50;   // Distance from the bottom-right corner edge
        
        ctx.drawImage(logoImg, size - logoSize - margin, size - logoSize - margin, logoSize, logoSize);
    }

    // 4. Handle Watermark overlay
    if (includeWatermark) {
        ctx.save();
        ctx.font = "bold 26px sans-serif";
        ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        
        ctx.fillText("@growth.online.post", size / 2, size - 25);
        ctx.restore();
    }
}

// Download Free Version with Watermark
document.getElementById('downloadWatermarked').addEventListener('click', () => {
    drawCanvas(true);
    triggerDownload("instagram-product-free.png");
});

// Paid Version Simulation
document.getElementById('payAndDownload').addEventListener('click', () => {
    let confirmed = confirm("Pay ₹20 via UPI to remove watermark and download clean HD image?");
    if (confirmed) {
        alert("Payment successful! Downloading clean image...");
        drawCanvas(false); 
        triggerDownload("instagram-product-hd.png");
        drawCanvas(true); 
    }
});

function triggerDownload(filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}