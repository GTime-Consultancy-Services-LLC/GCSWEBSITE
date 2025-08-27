const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// List of CSS files in original order
const cssFiles = [
  'public/assets/css/bootstrap.min.css',
  'public/assets/css/animate.min.css',
  'public/assets/css/custom-animate.css',
  'public/assets/css/magnific-popup.css',
  'public/assets/css/all.min.css',
  'public/assets/css/odometer.css',
  'public/assets/css/swiper.min.css',
  'public/assets/css/icomoon.css',
  'public/assets/css/style.css',
  'public/assets/css/responsive.css'
];

// Module CSS files referenced in style.css
const moduleCssDir = 'public/assets/css/module-css';
const moduleCssFiles = [
  'header.css',
  'footer.css',
  'services.css',
  'about.css',
  'banner.css',
  'blog.css',
  'contact.css',
  'fact-counter.css',
  'testimonial.css',
  'team.css',
  'pricing.css',
  'subscriber-form.css'
];

function inlineModuleCss(styleCss) {
  // Inline each @import url("module-css/xxx.css") with the file content
  for (const file of moduleCssFiles) {
    const importStatement = `@import url("module-css/${file}");`;
    const moduleCssPath = path.join(moduleCssDir, file);
    let moduleContent = '';
    if (fs.existsSync(moduleCssPath)) {
      moduleContent = fs.readFileSync(moduleCssPath, 'utf8');
    }
    styleCss = styleCss.replace(importStatement, moduleContent);
  }
  return styleCss;
}

function extractGoogleFonts(css) {
  // Extract all @import url(...) for Google Fonts
  const fontImports = css.match(/@import url\([^"]*fonts.googleapis.com[^"]*\);/g) || [];
  return fontImports.join('\n');
}

function removeGoogleFonts(css) {
  return css.replace(/@import url\([^"]*fonts.googleapis.com[^"]*\);/g, '');
}

function bundleCss() {
  let bundled = '';
  // Add all CSS files except style.css
  for (const file of cssFiles) {
    if (file.endsWith('style.css')) continue;
    bundled += fs.readFileSync(file, 'utf8') + '\n';
  }
  // Process style.css: inline module CSS and preserve Google Fonts
  let styleCss = fs.readFileSync('public/assets/css/style.css', 'utf8');
  const googleFonts = extractGoogleFonts(styleCss);
  styleCss = removeGoogleFonts(styleCss);
  styleCss = inlineModuleCss(styleCss);
  bundled = googleFonts + '\n' + bundled + styleCss;
  // Add responsive.css last
  bundled += fs.readFileSync('public/assets/css/responsive.css', 'utf8') + '\n';
  // Minify
  const minified = new CleanCSS().minify(bundled).styles;
  fs.writeFileSync('public/assets/css/bundle-inline.min.css', minified);
  console.log('bundle-inline.min.css created!');
}

bundleCss();
