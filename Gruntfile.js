module.exports = function( grunt ){
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> by <%= pkg.author %> */\n',
        report: 'gzip'
      },
      build: {
        files: {
          'build/angularresponsive.min.js': [
            'src/module.js',
            'src/service.js',
            'src/directive.js'
          ]
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
