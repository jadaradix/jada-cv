module.exports = grunt => {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      generic: {
        command: [
          'rm -rf build',
          'mkdir -p build',
          'cp -r static build/static'
        ].join("&&")
      },
      content: {
        command: [
          'mkdir -p build',
          'cd content',
          '$(npm bin)/pug index.jade && mv index.html ../build/index.html',
          'cd ..'
        ].join("&&")
      },
      sass: {
        command: [
          'mkdir -p build/css',
          'for i in $(find sass/*.scss -maxdepth 0); do ./node_modules/.bin/node-sass $i --output build/css --output-style compressed ; done',
        ].join("&&")
      }
    }

  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [
    'shell:generic',
    'shell:content',
    'shell:sass',
  ]);

  grunt.registerTask('content', [
    'shell:content'
  ]);

  grunt.registerTask('sass', [
    'shell:sass'
  ]);

};
