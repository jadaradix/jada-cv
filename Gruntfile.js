module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      generic: {
        command: [
          'mkdir -p build',
          'for i in $(find * -type d -maxdepth 0 | grep -viw "node_modules\\|build\\|sass\\|pages"); do rm -rf build/$i && cp -rf $i build/$i; done',
          'cp index.js build/index.js'
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
      }
    }

  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [
    'shell:generic',
    'shell:pages',
    'shell:sass',
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

};