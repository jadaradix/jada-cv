module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      clean: {
        command: 'rm -rf build'
      },
      main: {
        command: [
          'mkdir -p build',
          'for i in $(find * -type d -maxdepth 0 | grep -viw "node_modules\\|build\\|sass\\|tiles"); do cp -rf $i build/$i ; done',
          'for i in $(find *.jade -type f -maxdepth 0); do cp $i build/$i ; done',
          '$(npm bin)/jade $(find build/* -type f -maxdepth 0 | grep -viw "partials") --pretty',
          'rm -rf build/partials',
          'rm -rf build/*.jade',
          'mkdir -p build/css',
          'cd sass',
          'for i in $(find *.scss -maxdepth 0); do sass $i:../build/css/$i.css --cache-location "cache" --style compressed ; done',
          'cd ..'
        ].join("&&")
      },
      tiles: {
        command: [
          // 'for i in $(find tiles/* -type d -maxdepth 0); do echo "Tile: $i"; cd $i; $(npm bin)/jade content.jade --pretty; cd ../..; done',
          'node tiles.js'
          // 'rm -rf tiles/*/*.html'
        ].join("&&")
      },
      basehref: {
        command: "echo '- var baseHref = \"http://jada.io/\";' > partials/_base-href.jade"
      }
    }

  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [
    'shell:main'
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