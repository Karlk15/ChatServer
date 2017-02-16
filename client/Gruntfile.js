module.exports = function ( grunt ) {
 grunt.loadNpmTasks('grunt-tslint');
 var taskConfig = {
   tslint: {
     src: ['src/**/*.ts'],
     gruntfile: ['Gruntfile.js'],
     options: {
       configuration: "tslint.json",
       force: true,
       fix: false
     },

    }
  };
 grunt.initConfig(taskConfig);
 grunt.registerTask('default', ['tslint']);
};
