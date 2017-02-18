// module.exports = function(grunt) {
//   grunt.initConfig({
//     pkg: grunt.file.readJSON('package.json'),
//     tslint: {
//       src: ['src/**/*.ts'],
//       gruntfile: ['Gruntfile.js'],
//       options: {
//         configuration: "tslint.json",
//         force: true,
//         fix: false
//       }
//     },
//     concat: {
//       options: {
//         separator: ';'
//       },
//       dist: {
//         src: ['dist/*.js'],
//         dest: 'dist/concat.js'
//       }
//     },
//     uglify: {
//       dist: {
//           files: {
//               'dist/concat.js': 'src/uglify.js',
//           }
//       }
//     }
// });
//
//   grunt.loadNpmTasks('grunt-contrib-uglify');
//   grunt.loadNpmTasks('grunt-tslint');
//   grunt.loadNpmTasks('grunt-contrib-concat');
//   grunt.registerTask('default', ['tslint', 'concat', 'uglify']);
//
// };
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['dist/*.js','dist/!uglify.js'],
        dest: 'dist/concat.js'
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
          'dist/uglify.js': ['dist/*.js']
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
  grunt.registerTask('default', ['tslint', 'uglify','concat']);
};
