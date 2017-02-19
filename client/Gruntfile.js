module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['dist/*.js','dist/!uglify.js'],
        dest: 'dist/conCatAndUglify/concat.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        force: true,
        fix: true
      },
      dist: {
        files: {
          'dist/conCatAndUglify/uglify.js': ['dist/*.js']
        }
      }
    },
    tslint: {
      src: ['src/**/*.ts'],
      gruntfile: ['Gruntfile.js'],
      options: {
        configuration: "tslint.json",
        force: true,
        fix: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('test', ['tslint']);
  grunt.registerTask('default', ['tslint']);
};
