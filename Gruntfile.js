module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      clean: {
        command: [
          'rm -rf build',
          'mkdir -p build'
        ].join("&&"),
      },
      generic: {
        command: [
          'mkdir -p build',
          'for i in $(find * -type d -maxdepth 0 | grep -viw "node_modules\\|build\\|sass\\|pages\\|js"); do rm -rf build/$i && cp -rf $i build/$i; done'
        ].join("&&")
      },
      pages: {
        command: [
          'mkdir -p build/pages',
          'cd pages',
          'for i in $(find * -type d -maxdepth 0); do $(npm bin)/jade $i/index.jade && mv $i/index.html ../build/pages/$i.html; done',
          'cd ..'
        ].join("&&")
      },
      sass: {
        command: [
          'mkdir -p build/css',
          'cd sass',
          'for i in $(find *.scss -maxdepth 0); do sass $i:../build/css/$i.css --cache-location "cache" --style compressed ; done',
          'cd ..'
        ].join("&&")
      },
      js: {
        command: [
          'rm -rf build/js && mkdir -p build/js/ext && cp -rf js build',
          'cp index.js build',
          'mkdir -p build/node_modules && cp -rf node_modules/yans build/node_modules',
          'cp $(npm root)/jquery/dist/jquery.min.js build/js/ext/jquery.min.js',
          'cp $(npm root)/jquery/dist/jquery.min.map build/js/ext/jquery.min.map',
          'cp $(npm root)/async/dist/async.min.js build/js/ext/async.js',
        ].join("&&")
      }
    }

  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [
    'shell:generic',
    'shell:pages',
    'shell:sass',
    'shell:js',
  ]);

  grunt.registerTask('clean', [
    'shell:clean'
  ]);

  grunt.registerTask('generic', [
    'shell:generic'
  ]);

  grunt.registerTask('pages', [
    'shell:pages'
  ]);

  grunt.registerTask('sass', [
    'shell:sass'
  ]);

  grunt.registerTask('js', [
    'shell:js'
  ]);

};