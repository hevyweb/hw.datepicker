Package.describe({
  name: 'hevyweb:datepicker',
  version: '1.0.0',
  summary: 'A jQuery datepicker library',
  git: 'https://github.com/hevyweb/datepicker',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use(['jquery@1.11.3']);
  api.addFiles([
    "dist/js/hw.datepicker.js",
    "dist/css/hw.datepicker.css",
    "dist/i18n/en.js",
    "dist/i18n/ru.js",
    "dist/i18n/ua.js",
  ], 'client');
});