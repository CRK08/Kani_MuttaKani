const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'src', 'assets', 'handwriting', 'signature.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Find the path d attribute
const dMatch = svgContent.match(/d="([^"]+)"/);
if (!dMatch) {
  console.log("No d attribute found");
  process.exit(1);
}

const dAttr = dMatch[1];
// Split by M (MoveTo) commands using lookahead to keep the 'M'
const subPaths = dAttr.split(/(?=M)/i).map(s => s.trim()).filter(Boolean);

console.log(`Found ${subPaths.length} sub-paths:`);
subPaths.forEach((sp, idx) => {
  console.log(`Sub-path ${idx}: length=${sp.length}, starts with: ${sp.substring(0, 50)}...`);
});
