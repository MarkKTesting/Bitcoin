module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            componentsJsFiles: [
                'app/bitcoinutils/*.js',
                'app/viewBlock/*.js',
                'app/viewMaster/*.js',
                'app/txtree/*.js'
            ],
            basePath: '/',
            srcPath: 'app/',
            deployPath: 'app/deploy/'
        },

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

        // Task configuration.
        concat: {
            options: {
                sourceMap: false,
                stripBanners: true
            },
            dist: {
                src: ['app/app.js', 'app/apiservice.js', 'app/searchbox.js', '<%= meta.componentsJsFiles %>'],
                dest: '<%= meta.deployPath %>app.js'
            }
        },


        uglify: {
            options: {
                sourceMap: true,
                mangle: true
            },
            my_target: {
                files: {
                    '<%= meta.deployPath %>app.min.js': ['<%= meta.deployPath %>app.js']
                }
            }
          }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task
    grunt.registerTask('default', ['concat', 'uglify']);

};