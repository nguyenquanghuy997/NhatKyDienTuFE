const fs = require('fs');

// Lấy thời gian hiện tại
const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');
const hour = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');

// Tạo chuỗi version
const version = `${year}${month}${day}.${hour}${minutes}`;

// Đường dẫn đến file package.json
const packageJsonPath = './package.json';

// Đọc và cập nhật file package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.version = version;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Version set to: ${version}`);