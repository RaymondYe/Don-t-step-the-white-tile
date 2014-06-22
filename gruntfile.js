// 包装函数
module.exports = function(grunt) {

  // 任务配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'js/ball.min.js': ['js/ball.js']
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css'
      }
    },
    watch: {
      scripts: {
        files: ['**/*.css', '**/*.js'],
        tasks: ['min', 'minjs']
      },
    },
    imagemin: {
      /* 压缩图片大小 */
      dist: {
        options: {
          optimizationLevel: 7
        },
        files: [{
          expand: true,
          cwd: "./img/",
          src: ["**/*.{jpg,png,gif}"],
          dest: "./img/min/"
        }]
      }
    }


  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');


  grunt.registerTask('default', ['watch']);
  grunt.registerTask('minjs', ['uglify']);
  grunt.registerTask('min', ['cssmin']);
  grunt.registerTask('minimg', ['imagemin']);

};