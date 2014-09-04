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
          'for i in $(find * -type d -maxdepth 0 | grep -viw "node_modules\\|build\\|sass"); do cp -rf $i build/$i ; done',
          'for i in $(find *.jade -type f -maxdepth 0); do cp $i build/$i ; done',
          'cp index.js build/index.js',
          '$(npm bin)/jade $(find build/* -type f -maxdepth 0 | grep -viw "partials") --pretty',
          'rm -rf build/partials',
          'rm -rf build/*.jade',
          'mkdir build/css',
          'cd sass',
          'for i in $(find *.scss -maxdepth 0); do sass $i:../build/css/$i.css --cache-location "cache" --style compressed ; done',
          'cd ..'
        ].join("&&")
      },
      server: {
        command: [
          'sudo node index.js'
        ].join("&&"),
        options: {
          execOptions: {
            cwd: 'build'
          }
        }
      },
      basehref: {
        command: "echo '- var baseHref = \"http://localhost/\";' > partials/_base-href.jade"
      }
    }

  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [
    'shell:main'
  ]);

  grunt.registerTask('server', [
    'shell:server'
  ]);

  grunt.registerTask('all', [
    'shell:main',
    'shell:server',
  ]);

  grunt.registerTask('clean', [
    'shell:clean'
  ]);

  grunt.registerTask('basehref', [
    'shell:basehref'
  ]);

};