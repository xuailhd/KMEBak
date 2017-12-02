/// <binding BeforeBuild='html2js' />
module.exports = function (grunt) {

    grunt.initConfig({
        developmentPath: "./",
        releasePath: "G:\\Release\\KMEHosp\\doctor.kmwlyy.com",
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        bower: {
            install: {
                options: {
                    targetDir: '<%=releasePath%>/Framework',
                    layout: 'byComponent',
                    cleanTargetDir: false
                }
            }
        },
        /*删除发布文件夹*/
        clean: {
            release: ["<%=releasePath%>"]
        },
        /*雪碧图样式*/
        sprite: {
            /*图标*/ 
            icons: {
                src: '<%=developmentPath%>/static/images/sprite/icons/*.png',
                dest: '<%=developmentPath%>/static/images/sprite_icons.png',
                destCss: '<%=developmentPath%>/static/Styles/sprite_icons.css'
            },
            /*背景*/
            bgs: {
                src: '<%=developmentPath%>/images/sprite/bgs/*.png',
                dest: '<%=developmentPath%>/images/sprite_bgs.png',
                destCss: '<%=developmentPath%>/static/Styles/sprite_bgs.css'
            },
        },
        /*复制文件*/
        copy: {
            production: {
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>/static/styles',
                    src: '*.css',
                    dest: '<%=releasePath%>/static/styles'
                }, {
                    expand: true,
                    cwd: '<%=developmentPath%>/static/images',
                    src: '*.*',
                    dest: '<%=releasePath%>/static/images'
                }]
            }
        },
        /*文件合并*/
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            script: {
                src: ['<%=developmentPath%>/static/modules/<%= pkg.name %>.js'],
                dest: '<%=releasePath%>/static/modules/<%= pkg.name %>.js'
            }
        },
        /*编译less*/
        less: {
            //开发版（无压缩）
            development: {
                options: {
                    sourceMap: true,
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>/static/styles',
                    src: ['*.less'],
                    dest: '<%=developmentPath%>/static/styles',
                    ext: '.min.css'
                }]
            },
            //生产版（压缩）
            production: {
                options: {
                    compress: true
                },
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>/static/styles',
                    src: ['*.less'],
                    dest: '<%=releasePath%>/static/styles',
                    ext: '.min.css'
                }]
            }
        },
        /*压缩css*/
        cssmin: {
            development: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>/styles/',
                    src: ['*/*.css', '!*.min.css'],
                    dest: '<%=developmentPath%>/styles/',
                    ext: '.min.css'
                }]
            },
            production: {
                options: {
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>/styles/',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%=releasePath%>/styles/',
                    ext: '.min.css'
                }]
            }
        },
        /*压缩js*/
        uglify: {     
            development_Framework: {
                options: {
                    beautify : true,
                    mangle: true, //混淆变量名
                    preserveComments: 'false', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer: '\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */',//添加footer
                    sourceMap: true,
                    report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>/static/framework',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: '<%=developmentPath%>/static/framework',
                    ext: '.min.js'
                }]
            },
            development_Modules: {
                beautify: true,
                options: {
                    mangle: true, //混淆变量名
                    preserveComments: 'false', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer: '\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */',//添加footer
                    sourceMap: true,
                    report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>/static/modules',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: '<%=developmentPath%>/static/modules',
                    ext: '.min.js'
                }]
            },
            production: {
                options: {
                    beautify: true,
                    sourceMap: false,
                    mangle: true, //混淆变量名
                    preserveComments: 'false', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer: '\n/*! <%= pkg.name %> author:<%= pkg.homepage %> 最后修改于： <%= grunt.template.today("yyyy-MM-dd hh:mm:ss") %> */',//添加footer
                    report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>/static/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: '<%=releasePath%>/static/',
                    ext: '.min.js'
                }]
            }
        },
        /*压缩HTML*/
        htmlmin: {
            production: {
                options: {
                    //删除注释
                    removeComments: true,
                    //删除空格行
                    collapseWhitespace: true
                },
                files: []
            },
            development: {
                files: [{
                    expand: true,
                    cwd: '<%=developmentPath%>',
                    src: ['*.*/*.html'],
                    dest: '<%=releasePath%>',
                    ext: '.html'
                }, {
                    expand: true,
                    cwd: '<%=developmentPath%>/Areas',
                    src: ["*.cshtml"],
                    dest: '<%=releasePath%>/Areas',
                    ext: '.cshtml'
                }]
            }
        },
        /*打包HTML模板*/
        html2js: {
            production_common: {
                options: {
                    // custom options, see below
                    useStrict: true,
                    base: ".",
                    amd: true,
                    module: 'templates-directive-common',
                    amdPrefixString: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %> 自动生成\n */\n define(['angular'], function(angular){",
                    rename: function (moduleName) {
                        return "/" + moduleName;//.replace('.html', '');
                    }
                },
                /*公共指令模板*/
                files: [{
                    src: ['static/modules/Common/directives/*.html'],
                    dest: 'static/modules/Common/directives/template.js'
                }]
            },
            production_doctor: {
                options: {
                    // custom options, see below
                    useStrict: true,
                    base: ".",
                    amd: true,
                    module: 'templates-directive-doctor',
                    amdPrefixString: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd HH:ss:mm\") %> 自动生成\n */\ndefine(['angular'], function(angular){",
                    rename: function (moduleName) {
                        return "/" + moduleName;//.replace('.html', '');
                    }
                },
                /*公共指令模板*/
                files: [
                /*医生指令模板*/
                {
                    src: ['static/modules/Doctor/directives/*.html'],
                    dest: 'static/modules/Doctor/directives/template.js'
                }]
            },
        },
        /*打包RequireJs*/
        requirejs: {
            options: {
                baseUrl: "<%=developmentPath%>/static",
                mainConfigFile: "<%=developmentPath%>/static/modules/Common/config.js",
            },
            production: {
                options: {
                    //应用程序的目录（即<root>）。在这个文件夹下的所有文件将会被复制到dir参数标注的文件夹下。
                    appDir: '<%=developmentPath%>/static',
                    //这是一个输出目录，所有的应用程序文件将会被复制到该文件夹下。
                    dir: '<%=releasePath%>/static',
                    //相对于appDir，代表查找文件的锚点（that represents the anchor path for finding files）。
                    baseUrl: './',
                    paths:{                     

                        "module-config": "modules/common/config",
                        "module-Doctor-App": "modules/Doctor/app",
                        "css-builder": "../node_modules/require-css/css-builder",
                        "normalize": "../node_modules/require-css/normalize",
                    },
                    map:
                   {
                       "*": {
                           "css": "require-css",
                           "text": "require-text",
                       }
                   },
                    //配置模块依赖关系
                    shim: {
                      
                    },
                    //一个包含多个对象的数组。每个对象代表一个将被优化的模块（module）。
                    modules: [                    
                        {
                            name: 'module-Doctor-App',
                            exclude: ["plugins-sdk-AgoraRTCSDK", "plugins-pdf"],
                            include: [
                                "module-config",
                                "module-services-api",
                                "module-services-heartbeat",
                                "module-services-eventBus",
                                "module-services-chatroom",
                                "module-directive-bundling-doctor-all",
                                "module-directive-bundling-doctor-im",
                                "module-Doctor-bootstrap"]
                        }],
                        buildCSS: true,
                        //如果为true，优化器（optimizer）将从输出目录中删除已合并的文件。
                        removeCombined: true,
                        optimizeCss: 'standard',
                        optimize: "uglify2",
                        fileExclusionRegExp: /^(r|gruntfile)\.js$/
                }
            },
        },     
        jasmine: {
            /*需要测试的js代码*/
            src: '<%=developmentPath%>/module/**/*.js',
            options: {
                specs: '<%=developmentPath%>/module/test/**/*.js',
                keepRunner: true
            }
        },
        /*监控文件变化*/
        watch: {
            less: {
                files: ['static/styles/*.less'],
                tasks: ['less:development']
            },
            js_framework: {
                files: [
                    "static/modules/framework/**/*.js"],
                tasks: ['uglify:development_Framework']
            },      
            css: {
                files: ["static/styles/*.css"],
                tasks: ['cssmin:development']
            },
            html2js: {
                files: [
                    "static/Modules/Common/Directives/*.html",
                    "static/Modules/Doctor/Directives/*.html"],
                tasks: ['htmlmin:development', "html2js:production_common", "html2js:production_doctor"]
            }
        }
    });

    //定义任务组合
    grunt.registerTask('default', ['bower:install',"watch","less"]);

    //定义任务组合
    grunt.registerTask('DEV', [
    'sprite',
    'uglify:development',
    'html2js',
    'htmlmin:development',
    'less:development',
    'cssmin:development'
    ]);

    //定义任务组合
    grunt.registerTask('Release', [
    'html2js',
    'htmlmin:production',
    'less:production',
    'cssmin:production',
    'requirejs:production'
    ]);

    grunt.loadNpmTasks('grunt-bower-task');/*Bower包管理*/
    grunt.loadNpmTasks('grunt-contrib-concat');/*连接文件*/
    grunt.loadNpmTasks('grunt-contrib-less'); /*编译less*/
    grunt.loadNpmTasks('grunt-contrib-cssmin'); /*压缩css*/
    grunt.loadNpmTasks('grunt-contrib-uglify'); /*压缩js*/
    grunt.loadNpmTasks('grunt-contrib-htmlmin');/*压缩HTML*/
    grunt.loadNpmTasks('grunt-contrib-watch');/*任务监视*/
    grunt.loadNpmTasks('grunt-contrib-clean');/*清理文件*/
    grunt.loadNpmTasks('grunt-contrib-requirejs');/*require打包*/
    grunt.loadNpmTasks("grunt-spritesmith");
    grunt.loadNpmTasks('grunt-copy');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-apidoc');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

};