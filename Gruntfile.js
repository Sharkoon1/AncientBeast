module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('assemble-less');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-express-server');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					"src/*.js",
					"src/utility/**/*.js",
					"src/abilities/**/*.js",
					"src/network/**/*.js"
				],
				dest: 'deploy/scripts/<%= pkg.name %>.js'
			}
		},
		express: {
			options: {
				port: 8080,
			},
			server: {
				options: {
					script: 'server.js'
				}
			}
		},
		watch: {
			files: 'src/**/*.js',
			tasks: ['concat'],
			styles: {
				files: ['src/less/**/*.less'], // which files to watch
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}

		},

		copy: {
			// Copies the customized build of Phaser into the game
			// http://phaser.io/tutorials/creating-custom-phaser-builds
			main: {
				files: [{
					expand: true,
					src: ['node_modules/phaser/build/phaser*.js'],
					dest: 'deploy/scripts/libs/',
					filter: 'isFile',
					flatten: true
				}]
			},
			// Copies CSS files into deploy/css, these were previously in deploy/css
			// but were moved to enabled gitignore to work more cleanly on that path.
			css: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['**'],
					dest: 'deploy/css',
				}]
			}
		},

		open: {
			dev: {
				path: 'http://localhost:8080/index.html'
			}
		},

		// Compile less files into deploy/css path.
		less: {
			options: {
				paths: 'src/less',
				// imports: {
				//   reference: ['variables.less', 'mixins.less'],
				// }
			},
			components: {
				files: [{
					expand: true,
					cwd: 'src/less',
					src: '*.less',
					dest: 'deploy/css/',
					ext: '.css'
				}]
			}
		}
	});

	grunt.registerTask('default', ['concat', 'less', 'copy', 'express', 'open', 'watch']);
};
