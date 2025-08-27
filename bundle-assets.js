const fs = require('fs');
const UglifyJS = require('uglify-js');

  // List of JS files to combine
  const jsFiles = [
    'public/assets/js/vendor/jquery-3.6.0.min.js',
    'public/assets/js/bootstrap.min.js',
    'public/assets/js/isotope.pkgd.min.js',
    'public/assets/js/imagesloaded.pkgd.min.js',
    'public/assets/js/jquery.magnific-popup.min.js',
    'public/assets/js/jquery.odometer.min.js',
    'public/assets/js/jquery.appear.js',
    'public/assets/js/ajax-form.js',
    'public/assets/js/wow.min.js',
    'public/assets/js/gsap.js',
    'public/assets/js/ScrollTrigger.js',
    'public/assets/js/SplitText.js',
    'public/assets/js/swiper.min.js',
    'public/assets/js/main.js'
  ];

  function bundleJS() {
    let combinedJS = '';
    for (const file of jsFiles) {
      combinedJS += fs.readFileSync(file, 'utf8') + '\n';
    }
    const minified = UglifyJS.minify(combinedJS).code;
    fs.writeFileSync('public/assets/js/bundle.min.js', minified);
    console.log('JS bundled and minified!');
  }

  bundleJS();
