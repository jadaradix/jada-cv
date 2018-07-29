module.exports = grunt => {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      generic: {
        command: [
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
