module.exports = function ( grunt ) {
 grunt.loadNpmTasks('grunt-tslint');
 var taskConfig = {
   tslint: {
     src: ['src/**/*ts'],
     gruntfile: ['Gruntfile.js'],
     options: {
        'esversion': 6,
        curly:  true,
        immed:  true,
        newcap: true,
        noarg:  true,
        sub:    true,
        boss:   true,
        eqnull: true,
        node:   true,
        undef:  true,
        'globals': {
          _:       false,
          jQuery:  false,
          angular: false,
          moment:  false,
          console: false,
          $:       false,
          io:      false
        },
     }
   }
 };
 grunt.initConfig(taskConfig);
 grunt.registerTask('default', ['tslint']);
};
