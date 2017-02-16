module.exports = function ( grunt ) {
 grunt.loadNpmTasks('grunt-tslint');
 var taskConfig = {
   tslint: {
     src: ['src/**/*.ts'],
     gruntfile: ['Gruntfile.js'],

    }
  };
 grunt.initConfig(taskConfig);
 grunt.registerTask('default', ['tslint']);
};
