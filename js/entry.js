var Omi = require('./omi11.js');
Omi.OmiFinger.init();
    Omi.OmiTouch.init();
    Omi.OmiTransform.init();
    var move = new Omi.Move();

    document.body.addEventListener("touchmove", function(e){
        e.preventDefault();
    });

    // 组件 首页
    class Home extends Omi.Component {
        constructor(data) {
            super(data);
            this.aPhoto = ['./images/photo.jpg', './images/photo1.jpg', './images/photo2.gif', './images/photo3.jpg', './images/photo4.jpg', './images/photo5.jpg'];
            this.targetImg = null;
            this.step = 0.02;
            this.tickId = null;
        }

        install() {
            document.body.setAttribute('style', 'background: url(./images/bg.png) #87b0a5');
        }

        style() {
            return `
					.home {
						width: 100%;
						height: 82%;
						margin-top: 80px;
						/*background: red;*/
						position: absolute;
					}
					.photo {
						width: 100%;
						height: 35%;
						/*background: blue;*/
						text-align: center;
					}
					.photo img {
						margin-top: 10px;
						width: 40%;
						/*height: 90%;*/
						border-radius: 50%;
					}
					.motto {
						width: 100%;
						height: 20%;
						/*background: #f60;*/
					}
					.motto_text {
						text-align: center;
						color: #FFF;
						padding: 28px 12px 20px 12px;
					}
					.motto_box {
						width: 70%;
						height: 1px;
						margin-left: 15%;
						background: #fff;
					}
					.des {
						width: 100%;
						height: 50%;
						/*background: #f12Bf5;*/
						overflow: hidden;
						text-align: center;
						margin-top: 20px;

					}
					.des p {
						padding-bottom: 15px;
						font-size: 14px;
						color: #fff;
					}
				`;
        }

        installed() {
            var dom = this.refs.home;
            var self = this;
            Omi.Transform(dom, true);
            move['easeOut']([0, 1], 500, function(v){
                dom.scaleY = v;
            }, function() {
                self.swingImg();
            });

            this.initPhoto();
        }

        swingImg() {
            var dom = this.targetImg,
                self = this;
            function tick () {
                dom.scaleX < 0.9 && (self.step *= -1);
                dom.scaleX > 1.2 && (self.step *= -1);
                dom.scaleX += self.step * (.5);
                dom.scaleY += self.step * (.5);
                self.tickId = requestAnimationFrame(tick);
            };
            tick();
        }

        initPhoto() {
            var self = this;
            this.targetImg = this.refs.touchdomImg;
            Omi.Transform(this.targetImg);
            var target = this.targetImg;

            new Omi.AlloyTouch({
                touch: target,//反馈触摸的dom
                vertical: false,//不必需，默认是true代表监听竖直方向touch
                target: target, //运动的对象
                property: "rotateY",  //被滚动的属性
                factor: 1,//不必需,默认值是1代表touch区域的1px的对应target.y的1
                inertia: true,
                step: 10,
                touchStart: function() {
                    cancelAnimationFrame(self.tickId);
                },
                animationEnd: function() {
                    var sImg = getRandomItem(self.aPhoto);
                    target.src = sImg;
                    move['easeOut']([target.rotateY, 0], 30, function(v){
                        target.rotateY = v;
                    });
                }
            });
            var getRandomItem = function () {
                var preItem = null;

                return function (arr) {

                    var index = Math.floor(Math.random() * arr.length),
                            item = arr[index],
                            result;

                    arr = arr.sort(function() {
                        return Math.random() > 0.5 ? -1 : 1;
                    });

                    if (preItem != item) {
                        result = preItem = item;

                    } else {
                        result = getRandomItem(arr);
                    };

                    return result;
                };
            }();
        }

        render() {
            return `
				    <div class="home" ref="home">
						<div class="photo">
						    <img ref="touchdomImg" src="./images/photo.jpg" />
						</div>
						<div class="motto">
							<div class="motto_text">懂得不多，只求每天进步一点。</div>
							<div class="motto_box"></div>
						</div>
						<div class="des">
							<p>我叫徐志伟</p>
							<p>一名前端开发及研发工程师</p>
							<p>1356988206@qq.com</p>
						</div>
					</div>
				`;
        }
    };
    Omi.tag('Home', Home);

    // 组件 关于我
    class About extends Omi.Component {
        constructor(data) {
            super(data);
            this.data.desc = [
                '三年web前端开发,业务逻辑编写,包含网站编写,游戏开发,移动端页面编写和交互,地图开发与交互。',
                '传统pc网页开发,熟练使用jquery编写特效和制作网站。目前主要从事移动端开发,自己写了一个jsLibrary.js库,此库主要用来获取dom,操作dom,ajax的封装,任意dom运动,一些手机端的tap,swipe,longtap等常用事件的模拟以及一些常用的工具函数。',
                '使用cocos2d.js写过26个pc端的小游戏,平均1.5天一个,包含测试。主要是给小学生玩的。逻辑并不复杂。',
                '使用纯js+html+css,这里使用了sea.js作为加载器,编写了一套室内导航的sdk,主要用来做室内导航的。',
                '高效的自学能力,具备独立分析解决问题能力决问题能力,看过的书籍有js编程精解,es6标准入门,犀牛书,红皮书,html5权威指南,js编程艺术,effectiveJs,js语言精粹,精通js,js设计模式。',
                '强烈的自我驱动力,每天坚持看书40分钟,目前主要看别人写的框架/库源码,看书相对少了。',
            ];
        }

        install() {
            document.body.setAttribute('style', 'background: url(./images/bg.png) #109085');
        }

        installed() {
            var self = this;
            var dom = this.refs.aboutPage;
            Omi.Transform(dom, true);
            move['easeOut']([-150, 0], 300, function(v){
                dom.style.left = v + '%';
            }, function() {
                self.swing();
            });

            this.img1 = this.refs.icon_img1;
            this.img2 = this.refs.icon_img2;
            this.step2 = 0.02;
            this.img3 = this.refs.icon_img3;
            this.step3 = 0.02;
            this.img4 = this.refs.icon_img4;
            Omi.Transform(this.img1);
            Omi.Transform(this.img2);
            Omi.Transform(this.img3);
            Omi.Transform(this.img4);
        }

        swing() {
            var self = this;
            function tick () {
                // 1
                self.img1.rotateY += 2;

                // 2
                self.img2.scaleX < 0.5 && (self.step2 *= -1);
                self.img2.scaleX > 1.5 && (self.step2 *= -1);
                self.img2.scaleX -= self.step2;
                self.img2.scaleY -= self.step2;

                // 3
                self.img3.scaleX < 0.5 && (self.step3 *= -1);
                self.img3.scaleX > 1.5 && (self.step3 *= -1);
                self.img3.scaleX += self.step3;
                self.img3.scaleY += self.step3;

                // 4
                self.img4.rotateY += -2;

                requestAnimationFrame(tick);
            };
            tick();
        }

        style() {
            return `
					.about {
						width: 100%;
						height: 82%;
						margin-top: 60px;
						/*background: red;*/
						position: absolute;
					}
					.about_icon {
						width: 100%;
						height: 46%;
						/*background: blue;*/
					}
					.about_icon_left {
						width: 50%;
						height: 100%;
						/*background: #C2C2C2;*/
						float: left;
					}
					.about_icon_left_top {
						width: 100%;
						height: 50%;
						/*background: #B23AEE;*/
						text-align: center;
						margin-top: -8%;
					}
					.about_icon_left_top img {
						width: 40px;
						height: 40px;
						padding-top: 18%;
						padding-bottom: 3%;
					}
					.about_icon_left_top span {
						color: #fff;
						font-size: 11px;
					}
					.about_icon_left_down {
						width: 100%;
						height: 50%;
						/*background: #8B814C;*/
						text-align: center;
					}
					.about_icon_left_down img {
						width: 40px;
						height: 40px;
						padding-top: 18%;
						padding-bottom: 3%;
					}
					.about_icon_left_down span {
						color: #fff;
						font-size: 11px;
					}
					.about_icon_right {
						width: 50%;
						height: 100%;
						/*background: #B2DFEE;*/
						float: left;
					}
					.about_desc {
						width: 100%;
						height: 54%;
						/*background: #f60;*/
					}
					.about_desc_cont {
						width: 76%;
						height: 100%;
						/*background: #A9A9A9;*/
						margin-left: 12%;
						overflow: hidden;
						margin-top: 5%;
					}
					.about_desc_cont ul li {
						list-style: none;
						color: #fff;
						font-size: 14px;
						margin-bottom: 5px;
					}
				`;
        }

        touchAboutStart() {
            this.touchAboutDesc.min = this.refs.touchAboutDesc.offsetHeight - this.refs.scrollerAbout.offsetHeight;
        }

        render() {
            return `
					<div class="about" ref="aboutPage" >
						<div class="about_icon">
							<div class="about_icon_left">
								<div class="about_icon_left_top">
								    <img src="./images/i_age.svg" ref="icon_img1" /><br/>
								    <span>年龄/26</span>
								</div>
								<div class="about_icon_left_down">
								<img src="./images/i_site.svg" ref="icon_img2" /><br/>
									<span>坐标/上海</span>
								</div>
							</div>
							<div class="about_icon_right">
								<div class="about_icon_left_top">
								    <img src="./images/i_edu.svg" ref="icon_img3" /><br/>
								    <span>教育/大专</span>
								</div>
								<div class="about_icon_left_down">
								<img src="./images/i_status.svg" ref="icon_img4" /><br/>
									<span>状态/在职</span>
								</div>
							</div>
						</div>
						<div class="about_desc">
							<div class="about_desc_cont" omi-touch ref="touchAboutDesc" touchInstance="touchAboutDesc" motionRef="scrollerAbout" min="-0" max="0" touchStart="touchAboutStart">
								<ul ref="scrollerAbout" perspective="false">
									{{#desc}}
										<li>&nbsp;&nbsp;&nbsp;&nbsp;{{.}}</li>
									{{/desc}}
								</ul>
							</div>
						</div>
					</div>
				`;
        }
    };
    Omi.tag('About', About);

    // 组件 技能
    class Skill extends Omi.Component {
        constructor(data) {
            super(data);
            var defaultWidth = 375;
            defaultWidth = window.innerWidth !== defaultWidth ? window.innerWidth : defaultWidth;
            this.skillObj = {
                num: 9,
                aPos: [],    // div的坐標集合
                iAngle: 0,    // 角度
                iRadius: parseInt(100 * defaultWidth / 375),    // 半徑
                allDiv: [],
                aDivText: ['js', 'html5', 'git', 'es6+', 'sea', 'jq', 'touch', 'finger', 'omi'],
                aAhref: ['http://www.cnblogs.com/sorrowx/category/956081.html',
                         'http://www.cnblogs.com/sorrowx/',
                         'http://www.cnblogs.com/sorrowx/p/6508152.html',
                         'http://www.cnblogs.com/sorrowx/category/956081.html',
                         'http://www.cnblogs.com/sorrowx/category/956081.html',
                         'http://www.cnblogs.com/sorrowx/category/956081.html',
                         'http://www.cnblogs.com/sorrowx/p/6531273.html',
                         'http://www.cnblogs.com/sorrowx/p/6510525.html',
                         'http://www.cnblogs.com/sorrowx/category/968392.html'],
                allDivColor: ['#FF3E96', '#A020F0', '#8E388E', '#8B8B00', '#836FFF', '#76EEC6', '#5D478B', '#4169E1', '#1874CD'],
                bOff: true,
                aCenterXY: []
            };
            this.data.aDes = [
                '没毕业前,作为订单班的实习生,其实我还是一名学后端的开发人员,曾今学过spring3, hibernate3, struts2, java, jsp, c, oracle, sql server, mysql, 说这个,其实就是想说明我作为一名前端开发人员会和后端开发人员配合的很好。',
                '毕业之后选择了前端, 写的项目竟然是小游戏, 使用cocos2d写了20来个小游戏, 但是本人不太喜欢游戏,故放弃了cocos2d。',
                '不写游戏,选择了做移动端,喜欢移动端页面编写, 业务逻辑编写, 和用户交互。前2年,我基本不使用js库或者框架,喜欢原生的js, 看的书多了和看别人的源码多了,就自己封装了jsLibrary.js库,缩小版的jq库。主要用于移动端开发。',
                '竟然没提到vue, react, angular这3个热门的框架,难道不会使用? 关于vue和react还是看过一些文档的,写过一些小demo,也很简单,但是现在所在公司用不到,所以就没深入学习。' +
                '我所谓的深入学习,就是读取源码,取其思想。 相反的学习了,腾讯骨干工程师写的omi框架,因其写法和插件的用法像极了react,源码仅仅3000多行,便学习了此框架。',
                '上面就是想说明, 如果想使用这3大框架中的任意一种框架做项目, 对我来说学习起来比较简单, 这点还是很自信的。'
            ];
        }

        install() {}

        style() {
            return `
					.skill {
						width: 100%;
						height: 82%;
						margin-top: 60px;
						/*background: red;*/
						position: absolute;
					}
					.rotateSkill {
						width: 100%;
						height: 60%;
						/*background: #f60;*/
					}
					.home_skill {
						width: 45px;
						height: 45px;
						background: #912CEE;
						position: relative;
						border-radius: 50%;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						text-align: center;
						line-height: 44px;
						color: #fff;
					}
					.menu_list div {
						width: 45px;
						height: 45px;
						background: #912CEE;
						position: absolute;
						border-radius: 50%;
						text-align: center;
						line-height: 44px;
						overflow: hidden;
						color: #fff;
						left: 0px;
						top: 0px;
					}
					.menu_list div a {
                        text-decoration: none;
                        color: #fff;
					}
					.rotateDesc {
						width: 100%;
						height: 40%;
						/*background: #c4c4c4;*/
					}
					.rotateDesc_cont {
						width: 82%;
						height: 100%;
						margin-left: 9%;
						/*background: #f60;*/
						overflow: hidden;
						test-align: center;
					}
					.rotateDesc_cont ul {
						test-align: center;
					}
					.rotateDesc_cont ul li {
						list-style: none;
						test-align: center;
						color: #fff;
						font-size: 14px;
						margin-bottom: 8px;
					}
				`;
        }

        installed() {
            document.body.setAttribute('style', 'background: url(./images/bg.png) #4d5e8f');
            this.toDo();

            (function(self) {
                var dom = self.refs.skill;
                Omi.Transform(dom, true);
                move['easeOut']([0, 1], 500, function(v){
                    dom.scaleX = v;
                }, function() {
                    self.tapHomeSkill();
                });
            })(this);
        }

        // 创建圆和坐标
        toDo() {
            var oHomeSkill = this.refs.homeSkill;
            this.createCircular(this.skillObj.num);
            this.skillObj.iAngle = 360/this.skillObj.num;
            this.getDivPos(this.skillObj.num);
            this.setDivPos();
        }

        // 生成num个圆
        createCircular(num) {
            var oParent = this.refs.menuList;
            for (var i = 0; i < num; i ++) {
                var oDiv = document.createElement('div');


                var oA = document.createElement('a');
                oA.href = this.skillObj.aAhref[i];
                oDiv.appendChild(oA);
                oA.innerHTML = this.skillObj.aDivText[i];
                oDiv.style.background = this.skillObj.allDivColor[i];
                this.skillObj.allDiv.push(oDiv);
                oParent.appendChild(oDiv);



                /*oDiv.innerHTML = this.skillObj.aDivText[i];
                oDiv.style.background = this.skillObj.allDivColor[i];
                this.skillObj.allDiv.push(oDiv);
                oParent.appendChild(oDiv);*/
            };
        }

        getDivPos(num) {
            var oHomeSkill = this.refs.homeSkill;
            var left = parseInt(oHomeSkill.offsetLeft);
            var top = parseInt(oHomeSkill.offsetTop);
            var centerX = left - (oHomeSkill.offsetWidth/2), centerY = top - (oHomeSkill.offsetHeight/2);
            this.skillObj.aCenterXY.push(centerX, centerY);
            for (var i = 0; i < num; i++) {
                var oLR =  this.getXY(this.skillObj.iAngle*i, this.skillObj.iRadius);
                var x = oLR.x + centerX;
                var y = oLR.y + centerY;
                this.skillObj.aPos.push({x: x, y: y});
            };
        }

        getXY(iDeg, iRadius) {
            return {
                x: Math.round(Math.sin(iDeg*Math.PI/180)*iRadius),
                y: Math.round(Math.cos(iDeg*Math.PI/180)*iRadius)
            };
        }

        // 给div赋值(赋值到中心)
        setDivPos() {
            var allDiv = this.skillObj.allDiv,
                    self = this;
            allDiv.forEach(function(dom, index) {
                dom.style.left = self.skillObj.aCenterXY[0] + 'px';
                dom.style.top = self.skillObj.aCenterXY[1] + 'px';
            });
        }

        tapHomeSkill(evt) {
            var aPos = this.skillObj.aPos;
            var allDiv = this.skillObj.allDiv;
            if (this.skillObj.bOff) {
                for (var i = 0; i < aPos.length; i++) {
                    var x = aPos[i].x;
                    var y = aPos[i].y;
                    this.setCss(allDiv[i], {'$Transition':'0.5s' +' '+(100*i)+ 'ms'});
                    this.setCss(allDiv[i], {'$Transform':'rotate(360deg)'});
                    allDiv[i].style.left = x + 'px';
                    allDiv[i].style.top = y + 'px';
                };
                this.skillObj.bOff = false;
                this.refs.homeSkill.innerHTML = '精通';
            } else {
                for (var i = aPos.length - 1; i >= 0; i--) {
                    this.setCss(allDiv[i], {'$Transition':'0.5s' +' '+(100*i)+ 'ms'});
                    this.setCss(allDiv[i], {'$Transform':'rotate(0deg)'});
                    allDiv[i].style.left = this.skillObj.aCenterXY[0] + 'px';
                    allDiv[i].style.top = this.skillObj.aCenterXY[1] + 'px';
                };
                this.skillObj.bOff = true;
                this.refs.homeSkill.innerHTML = 'Tap';
            };
        }

        setCss(obj, oAttr) {
            var sName="";
            var aName=["Webkit","Moz","O"];
            for(sName in oAttr) {
                if(sName.charAt(0)==="$") {
                    for(var i=0;i<aName.length;i++) {
                        obj.style[aName[i]+sName.substring(1)]=oAttr[sName];
                    };
                    obj.style[sName.substring(1)]=oAttr[sName];
                } else {
                    obj.style[sName]=oAttr[sName];
                };
            };
        }

        touchDescStart() {
            this.touchDesc.min = this.refs.touchDescDom.offsetHeight - this.refs.scroller.offsetHeight;
        }

        render() {
            return `
					<div class="skill" ref="skill">
						<div class="rotateSkill">
							<div class="menu_list" ref="menuList"></div>
							<div omi-finger tap="tapHomeSkill" class="home_skill" ref="homeSkill">Tap</div>
						</div>
						<div class="rotateDesc">
							<div class="rotateDesc_cont" omi-touch ref="touchDescDom" touchInstance="touchDesc" motionRef="scroller" min="-0" max="0" touchStart="touchDescStart">
								<ul ref="scroller" perspective="false">
									{{#aDes}}
										<li>&nbsp;&nbsp;&nbsp;&nbsp;{{.}}</li>
									{{/aDes}}
								</ul>
							</div>
						</div>
					</div>
				`;

        }
    };
    Omi.tag('Skill', Skill);

    // 组件 经历
    class Experience extends Omi.Component {
        constructor(data) {
            super(data);
            this.bannerObj = {
                bannerDom: null,
                bStop: true
            };
            this.arr = [
                {
                    title: '上海雅丰科技有限公司',
                    time: '2015年3月~至今',
                    job: '移动端/微信端开发',
                    tech: 'javascript, html5, css3, seajs等',
                    arrJob: ['1. 室内导航javascript sdk编写',
                        '2. 室内导航逻辑,包含公共设施一键动态静态导航, 反向找车功能, 跨楼层导航逻辑,车牌查找功能, 都是原生js代码编写, 使用了seajs作为加载器。现在已经使用es6+语法来编写了',
                        '3. 移动端页面编写,业务逻辑编写'
                    ]
                },{
                    title: '睿泰集团',
                    time: '2014年12月~2015年3月',
                    job: '小游戏开发',
                    tech: 'javascript, cocos2d',
                    arrJob: ['1. pc端小游戏开发',
                        '2. 数学,美术小游戏编写,逻辑较简单',
                        '3. 金字塔闯关, 企鹅滑冰, 小马过河, 跷跷板计算游戏, 小女孩接花, 打鸟游戏...',
                        '4. 除了能在pc端运行,也可装在安卓小盒子中运行。'
                    ]
                },{
                    title: '南京星网有限公司(实习生)',
                    time: '2014年8月~2014年11月',
                    job: '国家企业信息公示系统',
                    tech: 'java, jsp, oracle, javascript, jquery',
                    arrJob: ['1. 学习extjs搭建页面和js逻辑编写',
                        '2. 负责编写查询功能时,验证码的验证功能的编写',
                        '3. 关于后端就不过多介绍了'
                    ]
                },{
                    title: '常州信息职业技术学院',
                    time: '2012年9月~2015年7月',
                    job: '大专生',
                    tech: 'html, css, javascript, jquery, java, c, spring3, hibernate3, struts2, jsp, oracle, sql server, mysql, xml, maven',
                    arrJob: ['1. 我从不觉得大专生比本科生弱。',
                             '2. 我虽说是大专学历,但是我们学校经常请科大讯飞及其他名企老师给我们授课,一半时间学习知识点一半时间打代码,动手能力绝不比本科生弱。如果只看学历的,请勿扰。',
                             '3. 自学能力超强,看过的书也多。']
                }
            ];
            this.data.obj = this.arr[0];
            this.data.objIndex = 0;

        }

        install() {
            document.body.setAttribute('style', 'background: url(./images/bg.png) #945c4c');
        }

        installed() {
            this.bannerObj.bannerDom = this.refs.bannerDom;
            Omi.Transform(this.bannerObj.bannerDom, true);
            this.aI = this.refs.aList.getElementsByTagName('i');
            this.banner_cont = this.refs.banner_cont;
            Omi.Transform(this.banner_cont, true);
            this.updateData('init');

            // 转场动画
            var dom = this.refs.experiencePage;
            Omi.Transform(dom, true);
            move['easeOut']([-150, 0], 300, function(v){
                dom.style.right = v + '%';
            });
        }

        style() {
            return `
                .experience {
                    width: 100%;
                    height: 82%;
                    margin-top: 80px;
                    /*background: red;*/
                    position: absolute;
                }
                .experience_cont {
                   width: 90%;
                   height: 85%;
                   margin-left: 5%;
                   /*background: blue;*/
                   position: absolute;
                }
                .experience_footer {
                   width: 100%;
                   height: 15%;
                   /*background: #f60;*/
                   position: absolute;
                   bottom: -1.2rem;
                }
                .banner {
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    border-radius: 10px;
                    margin-top: 3%;
                    box-shadow: 0 0 25px rgba(0,0,0,.5);
                    overflow: hidden;
                }
                .banner h4 {
                    text-align: center;
                    color: #945C4C;
                    padding: 5% 0;
                }
                .time {
                    margin-left: 5%;
                    font-size: 12px;
                    color: #945C4C;
                }
                .job {
                    margin-left: 2%;
                    font-size: 14px;
                    color: #945C4C;
                    padding: 3%;
                }
                .tech {
                    margin-left: 5%;
                    margin-bottom: 5%;
                    font-size: 12px;
                    color: #945C4C;
                }
                .banner span {
                    margin-left: 5%;
                    font-size: 14px;
                    color: #945C4C;
                }
                .banner ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    margin: 0% 0 0 4%;
                }
                .banner ul li {
                    font-size: 13px;
                    padding: 1%;
                    color: #945C4C;
                }
                .cut_list {
                    width: 60%;
                    height: 85%;
                    margin-left: 20%;
                    /*background: blue;*/
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    justify-content: space-between;
                }
                .cut_list i {
                    width: 11px;
                    height: 11px;
                    background: #623C32;
                    border-radius: 50%;
                }
                #current_i {
                    background: #AF7164;
                }
            `;
        }

        bannerSwipe(evt) {
            var self = this;
            this.updateData(evt.direction);
            // return;
            if (this.bannerObj.bStop) {
                var rd = move.getRd();
                if (evt.direction == 'Right') {
                    this.bannerObj.bStop = false;
                    move['easeOut']([0, 100], 200, function(v){
                        self.refs.experience_cont.style.left = v + '%';
                    }, function() {
                        move['easeOut']([-100, 0], 200, function(v){
                            self.refs.experience_cont.style.left = v + '%';
                        }, function() {
                            self.bannerObj.bStop = true;
                        });
                    });
                } else if (evt.direction == 'Left') {
                    this.bannerObj.bStop = false;
                    move['easeOut']([0, -100], 200, function(v){
                        self.refs.experience_cont.style.left = v + '%';
                    }, function() {
                        move['easeOut']([100, 0], 200, function(v){
                            self.refs.experience_cont.style.left = v + '%';
                        }, function() {
                            self.bannerObj.bStop = true;
                        });
                    });
                };
            };
        }

        updateData(direction) {
            if (direction == 'Left') {
                this.data.objIndex -= 1;
                if (this.data.objIndex < 0) {
                    this.data.objIndex = this.arr.length - 1;
                };
            } else if (direction == 'Right') {
                this.data.objIndex += 1;
                if (this.data.objIndex == this.arr.length) {
                    this.data.objIndex = 0;
                };
            } else if (direction == 'init') {
                this.data.objIndex = 0;
            };

            this.data.obj = this.arr[this.data.objIndex];
            this.update();

            // 改变底部ui
            for (let i = 0, len = this.arr.length; i < len; i ++) {
                this.aI[i].setAttribute('id', '');
            };
            this.aI[this.data.objIndex].setAttribute('id', 'current_i');

        }



        render() {
            return `
                <div class="experience" ref="experiencePage">
                    <div class="experience_cont" ref="experience_cont">
                        <div class="banner" omi-finger swipe="bannerSwipe" ref="bannerDom">
                            <div ref="banner_cont">
                                <h4>{{obj.title}}</h4>
                                <p class="time">{{obj.time}}</p>
                                <p class="job">{{obj.job}}</p>
                                <p class="tech">{{obj.tech}}</p>
                                <span>职责: </span>
                                <ul>
                                    <!--<li>1. 负责企业站静态页开发</li>
                                    <li>2. 负责网站后台维护</li>
                                    <li>3. 负责百度竞价操作及seo优化</li>
                                    <li>4. 同期工作之余提升自己原生JS的编码能力</li>-->
                                    {{#obj.arrJob}}
                                         <li>{{.}}</li>
                                    {{/obj.arrJob}}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="experience_footer">
                        <div class="cut_list" ref="aList">
                            <!--<i></i>
                            <i id="current_i"></i>
                            <i></i>
                            <i></i>-->
                            ${this.arr.map(item =>
                                 `<i></i>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    };
    Omi.tag('Experience', Experience);

    // 组件 作品集
    class Opus extends Omi.Component {
        constructor(data) {
            super(data);
            this.swipeObj = {
                oWrap: null,
                oBox: null,
                allDiv: null,
                width: 0,
                height: 0,
                tsz: '',
                step: 0
            };
        }

        install () {
            document.body.setAttribute('style', 'background: url(./images/bg.png) #4b85a0');

        }

        installed() {
            this.calculateBox();
        }

        calculateBox() {
            this.swipeObj.oWrap = this.refs.oWrap;
            this.swipeObj.oBox = this.refs.oBox;
            this.swipeObj.allDiv = this.swipeObj.oBox.getElementsByTagName('div');
            this.swipeObj.width = this.swipeObj.oWrap.offsetWidth;
            this.swipeObj.height = this.swipeObj.oWrap.offsetHeight;

            // 设置box div的属性
            this.swipeObj.tsz = 'width:' + this.swipeObj.width + 'px;' + 'height:' + this.swipeObj.height + 'px;' + ' transform: translateZ('+ (-this.swipeObj.width/2) +'px) rotateX(0deg); transition: 1s all';
            this.swipeObj.oBox.setAttribute('style', this.swipeObj.tsz);

            var d1 = '-webkit-transform: translateZ('+ (this.swipeObj.width/2) +'px) rotateY(-90deg)';
            var d2 = '-webkit-transform: translateZ(' + (this.swipeObj.width/2) + 'px)';
            var d3 = '-webkit-transform: translateZ(' + (this.swipeObj.width/2) + 'px) rotateY(90deg)';
            var d4 = '-webkit-transform: translateZ(' + (-this.swipeObj.width/2) + 'px) rotateY(180deg)';
            this.swipeObj.allDiv[0].setAttribute('style', d1);
            this.swipeObj.allDiv[1].setAttribute('style', d2);
            this.swipeObj.allDiv[2].setAttribute('style', d3);
            this.swipeObj.allDiv[3].setAttribute('style', d4);
        }

        style() {
            return `
                .opus {
                    width: 100%;
                    height: 82%;
                    margin-top: 60px;
                    /*background: red;*/
                    position: absolute;
                }
                .work {
                    width: 100%;
                    height: 80%;
                    /*background: #FFE4C4;*/
                    margin-top: 3%;
                    position: relative;
                    perspective: 2000px;
                }
                .wrap {
                    width: 80%;
                    margin-left: 10%;
                    height: 100%;
                    /*border: 1px solid #000;*/
                    /*-webkit-perspective: 800px;*/
                }
                .box {
                    width: 100%;
                    height: 100%;
                    /*-webkit-transform: translateZ(-134px) rotateX(0deg);*/
                    position: relative;
                    margin: 0 auto;
                    -webkit-transform-style: preserve-3d;
                    transition: 2s all;
                }
                .box div {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    text-align: center;
                    overflow: hidden;
                    opacity: 0.95;
                }

                .box div h4 {
                    font-size: 18px;
                    font-weight: blod;
                    color: #4985A0;
                    margin: 5% auto;
                }

                .box div p {
                    text-align: justify;
                    margin: 0 5%;
                    font-size: 14px;
                }

                .box div a {
                    width: 70%;
                    height: 30px;
                    margin-left: 15%;
                    border: 1px solid #E6E6E6;
                    border-radius: 4px;
                    cursor: pointer;
                    opacity: .6;
                    display: block;
                    margin-top: 5%;
                    line-height: 30px;
                }

                .box div img {
                    width: 20px;
                    height: 20px;
                    margin-top: 5px;
                }


                .box div:nth-of-type(1) {    /**左**/
                    background: #fff;
                    top: 0%;
                    left: -100%;
                    -webkit-transform-origin: right;
                    /*-webkit-transform: translateZ(134px) rotateY(-90deg);*/
                }
                .box div:nth-of-type(2) {    /**中间**/
                    background: #fff;
                    top: 0%;
                    left: 0%;
                    /*-webkit-transform: translateZ(134px);*/
                }
                .box div:nth-of-type(3) {    /**右边**/
                    background: #fff;
                    top: 0%;
                    left: 100%;
                    -webkit-transform-origin: left;
                    /*-webkit-transform: translateZ(134px) rotateY(90deg);*/
                }

                .box div:nth-of-type(4) {    /**中间重叠**/
                    background: #fff;
                    top: 0%;
                    left: 0%;
                    /*-webkit-transform: translateZ(-134px) rotateY(180deg);*/
                }
                .work_btn {
                    width: 100%;
                    height: 20%;
                    /*border: 1px solid red;*/
                    margin-top: 5%;
                }
                .work_btn_left {
                    width: 23%;
                    height: 100%;
                    float: left;
                    /*background: blue;*/
                    text-align: center;
                    position: relative;
                }
                .work_btn_left_s {
                    width: 42px;
                    height: 42px;
                    position: absolute;
                    background: #fff;
                    border-radius: 50%;
                    margin-top: 30%;
                    margin-left: -30%;
                    text-align: center;
                    line-height: 42px;
                    opacity: 0.9;
                }
                .work_btn_midd {
                    width: 54%;
                    height: 100%;
                    float: left;
                    /*background: #f60;*/
                    text-align: center;
                    padding-top: 11%;
                    font-size: 16px;
                    color: #fff;
                }
                .work_btn_right {
                    width: 23%;
                    height: 100%;
                    float: left;
                    position: relative;
                    /*background: pink;*/
                }
                .work_btn_right_s {
                    width: 42px;
                    height: 42px;
                    position: absolute;
                    background: #fff;
                    border-radius: 50%;
                    margin-top: 30%;
                    margin-left: 30%;
                    text-align: center;
                    line-height: 42px;
                    opacity: 0.9;
                }
                .work_btn_midd a {
                    color: #fff;
                    text-decoration: none;
                    font-size: 16px;

                }

            `;
        }

        workSwipe(evt) {
            this.swipe(evt.direction);
        }

        swipe(direction) {
            var tsz = '';

            if (direction == 'Left') {
                this.swipeObj.step -= 90;
                tsz = 'width:' + this.swipeObj.width + 'px;' + 'height:' + this.swipeObj.height + 'px;' + ' transform: translateZ('+ (-this.swipeObj.width/2) +'px) rotateY('+ this.swipeObj.step +'deg); transition: 1s all';
            } else if (direction == 'Right') {
                this.swipeObj.step += 90;
                tsz = 'width:' + this.swipeObj.width + 'px;' + 'height:' + this.swipeObj.height + 'px;' + ' transform: translateZ('+ (-this.swipeObj.width/2) +'px) rotateY('+ this.swipeObj.step +'deg); transition: 1s all';
            };
            this.swipeObj.oBox.setAttribute('style', tsz);
        }

        tapRotate(evt) {
            if (evt.target.innerHTML == 'L') {
                this.swipe('Left');
            } else {
                this.swipe('Right');
            };
        }

        render() {
            return `
                <div class="opus">
                    <div class="work" omi-finger swipe="workSwipe">
                        <div class="wrap" ref="oWrap">
                            <div class="box" ref="oBox">
                                <div>
                                    <h4>神仙求签</h4>
                                    <p>&nbsp;&nbsp;&nbsp;&nbsp;一个仿ios端神仙求签的app,下载量60万次。因有个需求,需要写一个类似的,所以就写了这个。耗时一个下午就好了。没有做图片资源预加载,当时时间仓促。使用了touch库,源码已解读,在我的博客,还使用了我的jslibrary库,所以写起来很快的。</p>
                                    <a href="https://sorrowx.github.io/divination_Demo/" target="_blank"><img src="./images/w_link.svg" /></a>
                                </div>
                                <div>
                                    <h4>web前端工程师简历</h4>
                                    <p>&nbsp;&nbsp;&nbsp;&nbsp;web移动端前端工程师简历,使用omi的路由编写。该小项目是下班回家后,每晚一小时左右,页面和逻辑的
                                       编写,一个礼拜就好了。主要是为了学以致用一下路由用法,关于omi的路由和用法看我的omi-router那篇博客。</p>
                                    <a href="http://www.cnblogs.com/sorrowx/p/6690123.html" target="_blank"><img src="./images/w_link.svg" /></a>
                                </div>
                                <div>
                                    <h4>室内导航JavaScript SDK</h4>
                                    <p>&nbsp;&nbsp;&nbsp;&nbsp;地图含有基本功能(地图加载，地图显示，地图放大缩小旋转，楼层切换，车位文字显示)。</p>
                                    <a href="" target="_blank"><img src="./images/w_link.svg" /></a>
                                </div>
                                <div>
                                    <h4>国正中心</h4>
                                    <p>&nbsp;&nbsp;&nbsp;&nbsp; 地图含有基本功能(地图加载，地图显示，地图放大缩小旋转，楼层切换，车位文字显示)。地图的放大缩小。
                                       指北针功能，点击还原地图初始大小，旋转地图，指北针跟着转动。
                                       空位显示功能，如果楼层支持空车位查询功能，则把找到的空车位进行染色。
                                       楼层切换按钮，载入地图时，自动生成的楼层dom ，并且自动绑定事件。</p>
                                    <a target="_blank" href="http://wx.indoorun.com/indoorun/app/guozheng2/index.htm?regionId=14428254382730015&floorId=14428254382890016"><img src="./images/w_link.svg" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="work_btn">
                        <div class="work_btn_left" omi-finger tap="tapRotate">
                            <span class="work_btn_left_s">L</span>
                        </div>
                        <div class="work_btn_midd">
                            <a target="_blank" href="https://github.com/SorrowX">My GitHub</a>
                        </div>
                        <div class="work_btn_right" omi-finger tap="tapRotate">
                            <span class="work_btn_right_s">R</span>
                        </div>
                    </div>
                </div>
            `;
        }


    };
    Omi.tag('Opus', Opus);

    // 组件 联系我
    class ContactMe extends Omi.Component {
        constructor(data) {
            super(data);
        }

        install() {
            document.body.setAttribute('style', 'background: url(./images/bg.png) #a29971;');
        }

        installed() {
            var dom = this.refs.contactMePage;
            Omi.Transform(dom, true);
            move['easeOut']([-100, -13], 300, function(v){
                dom.style.bottom = v + '%';
            });

        }

        style() {
            return `
                .contact {
                    width: 100%;
                    height: 100%;
                    background: url(./images/bg.png) #a29971;
                    margin-top: 60px;
                    /*margin-top: 20%;*/
                    /*background: red;*/
                    position: absolute;
                }
                .contact_cont {
                    width: 100%;
                    height: 72%;
                    /*background: blue;*/
                }
                .contact_cont_header {
                    width: 82%;
                    margin-left: 9%;
                    height: 15%;
                    /*background: pink;*/
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    justify-content: space-between;
                }
                .contact_cont_header span {
                    font-size: 18px;
                }
                .contact_cont_header span:nth-of-type(1) {
                    color: red;#3cf
                }
                .contact_cont_header span:nth-of-type(2) {
                    color: #3cf;
                }
                .contact_cont_header span:nth-of-type(3) {
                    color: #6c0;
                }
                .contact_cont_header span:nth-of-type(4) {
                    color: #f63;
                }
                .contact_cont_midd {
                    width: 82%;
                    margin-left: 9%;
                    height: 70%;
                    /*background: #F5F5DC;*/
                }
                .motto {
                    width: 100%;
                    height: 80%;
                    /*background: #f63;*/
                }
                .motto p {
                    text-align: center;
                    margin-bottom: 5%;
                    color: #fff;
                }
                .motto_logo {
                    width: 82%;
                    margin-left: 9%;
                    height: 30%;
                    /*background: #f63;*/
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    justify-content: space-between;
                }
                .motto_logo img {
                    width: 31px;
                    height: 31px;
                }
                .contact_cont_footer {
                    width: 100%;
                    height: 15%;
                    /*background: #FAEBD7;*/
                }
                .contact_footer {
                    width: 100%;
                    height: 28%;
                    /*background: #f60;*/
                    border-top: 1px solid #756D4D;
                }
                .contact_footer p {
                    color: #756D4D;
                    text-align: center;
                    font-size: 12px;
                    margin: 1.2%;
                }
            `;
        }

        render() {
            return `
                <div class="contact" ref="contactMePage">
                    <div class="contact_cont">
                        <div class="contact_cont_header">
                            <span>执着</span>
                            <span>代码</span>
                            <span>梦想</span>
                            <span>未来</span>
                        </div>
                        <div class="contact_cont_midd">
                            <div class="motto">
                                <p>注重效率，偏爱敏捷开发</p>
                                <p>热爱开源，读源码取思想</p>
                                <p>前端即兴趣，兴趣即未来</p>
                                <p>行路有良友，便是捷径</p>
                                <p>带上我吧，您一定不会失望</p>
                                <div class="motto_logo">
                                    <a><img src="./images/s_github.svg" /></a>
                                    <a><img src="./images/s_sf.svg" /></a>
                                    <a><img src="./images/s_blog.svg" /></a>
                                    <a><img src="./images/s_zh.svg" /></a>
                                    <a><img src="./images/s_wb.svg" /></a>
                                </div>
                            </div>
                        </div>
                        <div class="contact_cont_footer"></div>
                    </div>
                    <div class="contact_footer">
                        <p>这是一份移动端的简历 PC端请按F12</p>
                        <p>All Rights Reserved</p>
                        <p>Sorrow.X Copyright © 2017 - 2017</p>
                    </div>
                </div>
            `;
        }
    };
    Omi.tag('ContactMe', ContactMe);


    class App extends Omi.Component {
        constructor(data) {
            super(data);
            this.data.aGuide = ['首页', '关于我', '技能站', '经历', '作品集', '联系我'];
            this.data.sTitle = 'Home';
            this.data.currentGuideDom = null;
            this.data.aA = null;
            this.state = {
                barTick: true    // 点击Home时防止重复点击
            };
        }

        install() {
            if (this.isPC()) return;
            Omi.OmiRouter.init({
                routes: [
                    { path: '/', component: Home },
                    { path: '/about', component: About },
                    { path: '/skill', component: Skill },
                    { path: '/opus', component: Opus },
                    { path: '/experience', component: Experience },
                    { path: '/contact', component: ContactMe }
                ],
                renderTo: "#view",
                defaultRoute: '/',    // 默认
                root: this
            });
        }

        installed() {
            if (this.isPC()) return;
            var self = this,
                    hash = window.location.hash,
                    aA = this.refs.scroller.getElementsByTagName('a');
            this.data.aA = Array.prototype.slice.call(aA, 0);
            this.data.aA.every(function(dom, index) {
                if (hash.substring(1) == dom.getAttribute('to')) {
                    callback(dom);
                    return false;
                };
                return true;
            });
            function callback(dom) {
                self.data.currentGuideDom = dom;
                self.resetGuideColor();
            };

            this.initGitHubPhoto();
        }

        resetGuideColor() {
            var self = this;
            this.data.aA.forEach(function(dom, index) {
                if (self.data.currentGuideDom == dom) {
                    dom.style.color = 'red';
                } else {
                    dom.style.color = '#2D3332';
                };
            });
        }

        style() {
            return `
					.guide {
						width: 100%;
						height: 60px;
						/*background: #DADADA;*/
						position: absolute;
					}
					.guide_left {
						width: 20%;
						height: 100%;
						/*background: red;*/
						float: left;
						color: #FFF;
						text-align: center;
						line-height: 60px;
					}
					.guide_mid {
						width: 60%;
						height: 100%;
						/*background: #f60;*/
						float: left;
						text-align: center;
						overflow: hidden;
					}
					.guide_mid ul {
						margin-top: 15px;
						width: 310px;
						height: 30px;
						overflow: hidden;
						background: #B5CDC7;
						text-align: center;
						white-space: nowrap;
						/*overflow: hidden;*/
						text-overflow: ellipsis;
						border-radius:4px 4px 4px 4px;
						/*overflow-x: scroll;*/
						/*margin-left: -40px;*/

					}
					.guide_mid ul li {
						display:inline-block;
						margin-right: 2px;
						margin-top: 4px;
						margin-left: 5px;
						margin-right: 5px;
					}
					.guide_mid ul li a {
						text-decoration: none;
						color: #2D3332;
						font-size: 14px;
					}
					.guide_right {
						width: 20%;
						height: 100%;
						/*background: blue;*/
						float: right;
						text-align: center;

					}
					.guide_right img {
						width: 42px;
						height: 42px;
						border-radius: 50%;
						margin-top: 10.5px;

					}
					.slide {
						width: 100%;
						height: 60px;
						/*background: red;*/
						position: absolute;
						bottom: 0rem;
					}
					.-arrow {
					    position: absolute;
					    bottom: 20px;
					    width: 20px;
					    height: 35px;
					    left: 50%;
					    z-index: 100;
					    background: url(./images/arrow.svg) bottom center no-repeat;
					    background-size: contain;
					    pointer-events: none;
					    -webkit-transform: translateX(-50%);
					    transform: translateX(-50%);
					    -webkit-animation: arrowAnimate 1.5s ease-in-out infinite;
					    animation: arrowAnimate 1.5s ease-in-out infinite;
					}
				`;
        }

        touchStartGuideBar() {
            this.touch.min = this.refs.touchdom.offsetWidth - this.refs.scroller.offsetWidth;
        }

        handleTapTitle(evt) {
            var self = this;
            if (this.state.barTick) {
                this.state.barTick = false;
                var oDivMid = this.refs.touchdom;
                if (oDivMid.style.display == 'block'){
                    move['collision']([60, 0], 1000, function(v){
                        oDivMid.style.width = v + '%';
                    }, function(){
                        oDivMid.style.display = 'none';
                        self.state.barTick = true;
                    });
                } else if (oDivMid.style.display == 'none') {
                    oDivMid.style.display = 'block';
                    move['collision']([0, 60], 1000, function(v){
                        oDivMid.style.width = v + '%';
                    }, function() {
                        self.state.barTick = true;
                    });
                };
            };
        }

        tapATag(evt) {
            window.location.hash = evt.target.getAttribute('to');
            this.data.currentGuideDom = evt.target;
            this.refs.homeDom.innerHTML = evt.target.innerHTML;
            this.resetGuideColor();
//            this.handleTapTitle();
        }

        slideSwipe(direction) {
            var direction = typeof direction == 'string' ? direction : direction.direction;
            var liDom = this.data.currentGuideDom.parentNode;
            if (direction == 'Up') {
                // 找到li的上一個dom
                var preA = liDom.previousElementSibling && liDom.previousElementSibling.children[0];
                if (!preA) return;
                window.location.hash = preA.getAttribute('to');
                this.data.currentGuideDom = preA;
                this.resetGuideColor();

            } else if(direction == 'Down') {
                // 找到li的下一個dom
                var nextA = liDom.nextElementSibling && liDom.nextElementSibling.children[0];
                if (!nextA) return;
                window.location.hash = nextA.getAttribute('to');
                this.data.currentGuideDom = nextA;
                this.resetGuideColor();
            };
        }

        initGitHubPhoto() {
            var target = this.refs.touchdomImg;
            Omi.Transform(target);
            var step = 1;
            function tick() {
                requestAnimationFrame(tick);
                target.rotateZ += 2;
            };
            tick();
        }

        isPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                };
            };
            return flag;
        }

        render() {
            console.log(`有缘人, 等你很久啦。 欢迎调试,源码放在github上的。`);
            if(this.isPC()) {
                console.log('');
                return `
                    <div style="width: 200px;
                         height: 200px;
                         border: 1px solid #f63;
                         position: absolute;
                         text-align: center;
                         line-height: 200px;
                         top: 50%;
                         left: 50%;
                         -ms-transform: translate(-50%,-50%);
                         -moz-transform: translate(-50%,-50%);
                         -o-transform: translate(-50%,-50%);
                         transform: translate(-50%,-50%); ">请使用手机浏览本页面!</div>
                `;
            } else {
                return `
					<div>
						<div class="guide">
							<div class="guide_left" omi-finger ref="oTitle" tap="handleTapTitle">
							    <span ref="homeDom">{{sTitle}}</span>
							</div>
							<div style="display: block" class="guide_mid" omi-touch ref="touchdom" touchInstance="touch" motionRef="scroller" min="-0" max="0"  touchStart="touchStartGuideBar" property="translateX" vertical='false' perspective='true'>

								<ul ref="scroller">

									<li>
										<a omi-finger tap="tapATag" omi-router to="/" href="">首页</a>
									</li>
									<li>
										<a omi-finger tap="tapATag" omi-router to="/about" href="">关于我</a>
									</li>
									<li>
										<a omi-finger tap="tapATag" omi-router to="/skill" href="">技能站</a>
									</li>
									<li>
										<a omi-finger tap="tapATag" omi-router to="/experience" href="">经历</a>
									</li>
									<li>
										<a omi-finger tap="tapATag" omi-router to="/opus" href="">作品集</a>
									</li>
									<li>
										<a omi-finger tap="tapATag" omi-router to="/contact" href="">联系我</a>
									</li>

								</ul>
							</div>
							<div class="guide_right" ref="touchdomImg">
								<a target="_blank" href="https://github.com/SorrowX"><img ref="scrollerImg" src="./images/logo1.jpg" /></a>
							</div>
						</div>
						<!--<div class="slide" omi-finger ref="oSlide" swipe="slideSwipe">
							<div class="-arrow"></div>
						</div>-->
					</div>
				`;
            };

        }
    };

    var app = new App();
    Omi.render(app, '#app');