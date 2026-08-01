import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('node_modules/@astrojs/vercel/dist/serverless/adapter.js');
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replaceAll("'nodejs18.x'", "'nodejs20.x'");
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully patched @astrojs/vercel to use runtime nodejs20.x');
} else {
  console.log('Skipping patch: @astrojs/vercel not found');
}
