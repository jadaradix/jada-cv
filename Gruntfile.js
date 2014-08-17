module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      clean: {
        command: [
          'rm -rf build'
        ].join("&&")
      },
      main: {
        command: [
          'rm -rf build',
          'mkdir build',
          'for i in $(find * -type d -maxdepth 0 | grep -viw "node_modules\\|build"); do cp -rf $i build/$i ; done',
          'cp index.jade build/index.jade',
          'jade $(find build/* -type f -maxdepth 0 | grep -viw "partials") --pretty',
          'rm -rf build/partials',
          'find build -name *.jade -type f -delete',
          'rm -rf build/css/sass',
          'rm -rf build/css/sass-cache',
        ].join("&&")
      },
      sass: {
        command: 'sass --watch "css/sass":"css" --cache-location "css/sass-cache"'
      }
    }

  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [
    'shell:main',
  ]);

  grunt.registerTask('clean', [
    'shell:clean',
  ]);

  grunt.registerTask('sass', [
    'shell:sass',
  ]);

};