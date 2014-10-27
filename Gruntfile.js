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
          'for i in $(find * -type d -maxdepth 0 | grep -viw "node_modules\\|build\\|sass\\|tiles\\|pages"); do rm -rf build/$i && cp -rf $i build/$i; done'
        ].join("&&")
      },
      pages: {
        command: [
          'cd pages',
          'for i in $(find * -type d -maxdepth 0); do $(npm bin)/jade $i/index.jade && mv $i/index.html ../build/$i.html; done',
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
          'cp $(npm root)/angular/angular.min.js build/js/angular.min.js',
          'cp $(npm root)/angular/angular.min.js.map build/js/angular.min.js.map',
          'cp $(npm root)/jquery/dist/jquery.min.js build/js/jquery.min.js',
          'cp $(npm root)/jquery/dist/jquery.min.map build/js/jquery.min.map',
          'cp $(npm root)/async/lib/async.js build/js/async.js'
        ].join("&&")
      },
      tiles: {
        command: [
          'for i in $(find tiles/* -type d -maxdepth 0); do echo "Tile: $i"; cd $i; $(npm bin)/jade *.jade; cd ../..; done',
          'node tiles.js',
          'rm -rf tiles/*/*.html'
        ].join("&&")
      },
      basehref: {
        command: "echo '- var baseHref = \"http://jada.io/\";' > partials/_base-href.jade"
      }
    }

  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [
    'shell:generic',
    'shell:pages',
    'shell:sass',
    'shell:js'
  ]);

  grunt.registerTask('all', [
    'shell:generic',
    'shell:pages',
    'shell:sass',
    'shell:js',
    'shell:tiles'
  ]);

  grunt.registerTask('pages', [
    'shell:pages'
  ]);

  grunt.registerTask('sass', [
    'shell:sass'
  ]);

  grunt.registerTask('tiles', [
    'shell:tiles'
  ]);

  grunt.registerTask('clean', [
    'shell:clean'
  ]);

  grunt.registerTask('basehref', [
    'shell:basehref'
  ]);

};