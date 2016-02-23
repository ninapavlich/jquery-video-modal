module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compass: {
            dist: {
              options: {
                sassDir: "sass",
                cssDir: "compiled/compass/css",
                config: "config.rb"
              }
            },
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'compiled/compass/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'compiled/cssmin/css/',
                ext: '.min.css'
            }
        },

        concat: {   
            dist: {
                src: [
                    'js/videomodal.jqueryplugin.js',
                ],
                dest: "compiled/concat/js/videomodal.jqueryplugin.js"
            }
        },

        uglify: {
            build: {
                files: {
                    'compiled/uglify/js/videomodal.jqueryplugin.min.js': ['compiled/concat/js/videomodal.jqueryplugin.js']
                }
            }
        },
        copy: {
            scripts: {
                files:[{
                    expand: true,
                    cwd: 'compiled/uglify/js/',
                    src: ['**/*'],
                    dest: '../dist/js/'
                },
                {
                    expand: true,
                    cwd: 'compiled/concat/js/',
                    src: ['**/*'],
                    dest: '../dist/js/'
                }]
            },
            styles: {
                files: [{
                    expand: true,
                    cwd: 'compiled/cssmin/css/',
                    src: ['**/*'],
                    dest: '../dist/css/'

                },{
                    expand: true,
                    cwd: 'compiled/compass/css/',
                    src: ['**/*'],
                    dest: '../dist/css/'

                }]
            }
        },  
       
        

        watch: {
            scripts: {
                files: ['js/*.js', 'js/*/*.js'],
                tasks: ['concat', 'uglify', 'copy:scripts'],
                options: {
                    spawn: false
                },
            }, 
            
            css: {
                files: ['**/*.scss'],
                tasks: ['compass:dist', 'cssmin:minify', 'copy:styles'],
                options: {
                    spawn: false
                }
            }            
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'copy:scripts', 'compass:dist', 'cssmin:minify', 'copy:styles', 'watch']);
};