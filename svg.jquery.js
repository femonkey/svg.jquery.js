(function($) {
	$.extend({
		/*求两点之间的距离*/
		distance: function(p1, p2) {
			var x = p2.x - p1.x,
				y = p2.y - p1.y;
			var res = Math.sqrt((x * x) + (y * y));
			return Math.round(res);
		},
		// 根据线段的起点、终点，求角度
		angle: function(p1, p2) {
			return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
		},
		//求数的平方
		square: function (a){
			return a * a;	
		},
		// 根据线段的起点、终点，求方向
		direction: function(p1, p2) {
			var dirs = {
				'RIGHT': p1.x < p2.x && p1.y === p2.y,
				'BOTTOM': p1.x === p2.x && p1.y < p2.y,
				'LEFT': p1.x > p2.x && p1.y === p2.y,
				'TOP': p1.x === p2.x && p1.y > p2.y,
				'RIGHT_BOTTOM': p1.x < p2.x && p1.y < p2.y,
				'LEFT_BOTTOM': p1.x > p2.x && p1.y < p2.y,
				'LEFT_TOP': p1.x > p2.x && p1.y > p2.y,
				'RIGHT_TOP': p1.x < p2.x && p1.y > p2.y
			};
			for (var name in dirs) {
				if (dirs[name]) {
					return name;
				}
			}
			return null;
		},
		// 根据两点，求连线的垂线方向，即两点连线逆时针转 90 度
		verticalDirection: function(p1, p2) {
			var dirs = {
				'TOP': p1.x < p2.x && p1.y === p2.y,
				'RIGHT': p1.x === p2.x && p1.y < p2.y,
				'BOTTOM': p1.x > p2.x && p1.y === p2.y,
				'LEFT': p1.x === p2.x && p1.y > p2.y,
				'RIGHT_TOP': p1.x < p2.x && p1.y < p2.y,
				'RIGHT_BOTTOM': p1.x > p2.x && p1.y < p2.y,
				'LEFT_BOTTOM': p1.x > p2.x && p1.y > p2.y,
				'LEFT_TOP': p1.x < p2.x && p1.y > p2.y
			};
			for (var name in dirs) {
				if (dirs[name]) {
					return name;
				}
			}
			return null;
		},
		// 根据一个方向的枚举值，求相反方向
		reverseDirection: function(direction) {
			var dirs = {
				'TOP': 'BOTTOM',
				'RIGHT': 'LEFT',
				'BOTTOM': 'TOP',
				'LEFT': 'RIGHT',
				'RIGHT_TOP': 'LEFT_BOTTOM',
				'RIGHT_BOTTOM': 'LEFT_TOP',
				'LEFT_BOTTOM': 'RIGHT_TOP',
				'LEFT_TOP': 'RIGHT_BOTTOM'
			};
			for (var name in dirs) {
				if (name === direction) {
					return dirs[name];
				}
			}
			return null;
		},
		// 根据线段的起点、终点，求正切即斜率
		tank: function(p1, p2) {
			return (p2.y - p1.y) / (p2.x - p1.x);
		},
		// 根据线段的起点、终点，求线段的垂线斜率
		verticalTank: function(p1, p2) {
			return -((p2.x - p1.x) / (p2.y - p1.y));
		},
		// 根据斜率和弦，求勾、股
		pythagoras: function(k, hypotenuse)  {
			var k2 = k * k,
				h2 = hypotenuse * hypotenuse;
			var x = Math.sqrt(h2 / (k2 + 1));
			var y = Math.sqrt(h2 * k2 / (k2 + 1));
			return {
				x: isNaN(x) ? 0 : x,
				y: isNaN(y) ? hypotenuse : y
			};
		},
		// 根据点、偏移方向、偏移量，求偏移后的坐标点
		shiftOut: function(p, direction, offset) {
			var point = {
				x: p.x,
				y: p.y
			};
			switch (direction) {
				case 'RIGHT':
					point.x += offset.x;
					break;
				case 'BOTTOM':
					point.y += offset.y;
					break;
				case 'LEFT':
					point.x -= offset.x;
					break;
				case 'TOP':
					point.y -= offset.y;
					break;
				case 'RIGHT_BOTTOM':
					point.x += offset.x;
					point.y += offset.y;
					break;
				case 'LEFT_BOTTOM':
					point.x -= offset.x;
					point.y += offset.y;
					break;
				case 'LEFT_TOP':
					point.x -= offset.x;
					point.y -= offset.y;
					break;
				case 'RIGHT_TOP':
					point.x += offset.x;
					point.y -= offset.y;
					break;
				default:
					break;
			}
			return point;
		},
		// 根据两点，求线段中点
		midLine: function(p1, p2) {
			return {
				x: (p1.x + p2.x) / 2,
				y: (p1.y + p2.y) / 2
			};
		},
		// 根据线段起点、终点，求线段 n 等分点的 n - 1 个坐标
		divideLine: function(p1, p2, n) {
			n = parseInt(n);
			if (n < 2) {
				throw 'The parameter must be a Integer greater than 2 !';
			}
			var k = n - 1,
				x, y, points = new Array(k);
			while (k > 0) {
				x = p1.x + k * (p2.x - p1.x) / n;
				y = p1.y + k * (p2.y - p1.y) / n;
				points[--k] = {
					x: x,
					y: y
				};
			}
			return points;
		},
		// 根据弦长、拱高，求半径
		radius: function(chord, height) {
			return (chord * chord) / (8 * height) + (height / 2);
		},
		// 根据弧线起点、终点和弧高，求弧线中点
		midArc: function(start, end, height) {
			var m = this.midLine(start, end);
			var vk = this.verticalTank(start, end);
			var offset = this.pythagoras(vk, height);
			var vd = this.verticalDirection(start, end);
			var p = this.shiftOut(m, vd, offset);
			return p;
		},
		eid: +new Date()
	});

	// 扩展 DOM 操作
	$.fn.extend({
		create: function(name) {
			var ele = document.createElementNS('http://www.w3.org/2000/svg', name);
				ele.setAttribute('id', 'svg' + $.eid++);
			return $(ele);
		},
		// 创建一个含有命名空间 svg 元素
		svg: function() {
			var svg = this.create('svg');
			svg.attr({
				'xmlns': 'http://www.w3.org/2000/svg',
				'version': '1.1',
				'xlink': 'http://www.w3.org/1999/xlink'
			});
			this.append(svg);
			return svg;
		},
		// 创建一个分组
		g: function() {
			var g = this.create('g');
			this.append(g)
			return g;
		}
	});

	// 路径命令的参数个数
	var cmdCount = {
			'M': 2,
			'L': 2,
			'H': 1,
			'V': 1,
			'C': 6,
			'S': 4,
			'Q': 4,
			'T': 2,
			'A': 7,
			'Z': 0
		},
		// 匹配多个空格
		cmdWhite = /\s+/g,
		// 匹配起始位置和结束位置的空格
		cmdWhiteLR = /^\s*|\s*$/,
		// 匹配路径命令的名称
		cmdLetters = /[MLHVCSQTAZ]/i,
		// 匹配路径命令的格式
		cmdParts = /[MLHVCSQTAZ](\s*\-*\d+(\.\d+)*\s*)+/gi,
		cmdNumbers = /\-*\d+(\.\d+)*/g,
		// 匹配路径的当前坐标点
		cmdCoordinates = /(\-*\d+(\.\d+)*\s*){2}[zZ]*$/,
		// 格式化路径的 d 属性
		pathDataFormat = function(d) {
			return !d ? '' : d.toString().replace(cmdWhiteLR, '').replace(cmdWhite, ' ');
		},
		// 转化一个路径命令为 d 属性的一部分
		pathDataPart = function() {
			var args = arguments[0];
			var cmd = args[0];
			if (!cmdLetters.test(cmd)) {
				throw 'Command must be a single string !';
			}
			var name = cmd.toUpperCase();
			var count = cmdCount[name];
			if (args.length - 1 !== count) {
				throw 'Command \'' + name + '\' need ' + count + ' parameters, but ' + args.length +
					' given !';
			}
			var part = cmd;
			for (var n = 1; n < args.length; n++) {
				part += args[n] + ' ';
			}
			return part;
		},
		pathDataResolve = function(data) {
			var parts = data.match(cmdParts);
			var dArray = [],
				n = 0,
				part, cmd, data;
			while ((part = parts[n++])) {
				if (part.length > 1) {
					cmd = part.charAt(0);
					part = part.substring(1).replace(cmdWhiteLR, '');
					data = part.match(cmdNumbers);
				} else {
					cmd = part;
					data = null;
				}
				dArray.push({
					cmd: cmd,
					data: data
				});
			}
			return dArray;
		},
		pathCurrentPoint = function(data) {
			try {
				var parts = data.match(cmdCoordinates);
				var coord = parts[0].split(' ');
				return {
					x: coord[0],
					y: coord[1]
				};
			} catch (e) {
				throw 'Unable to get the Current Point !'
			}
		};

	// 扩展绘制相关
	$.fn.extend({
		// 获取当前目标元素的样式
		style: function() {
			return this.currentStyle ? this.currentStyle : window.getComputedStyle(this, null);
		},
		// 绘制线段并作为当前目标元素
		line: function(start, end) {
			var line = this.create('line');
			line.attr({
				x1: start.x,
				y1: start.y,
				x2: end.x,
				y2: end.y
			});
			this.append(line);
			return line;
		},
		//绘制圆形 cx:圆的中心横坐标 cy:圆的中心纵坐标, r: 圆的半径
		circle: function(cx, cy, r){
			var circle = this.create('circle');
			circle.attr({
				cx: cx,
				cy: cy,
				r : r
			});
			this.append(circle);
			return circle;
		},
		// 创建路径并作为当前目标元素
		path: function() {
			var path = this.create('path');
			this.append(path);
			return path;
		},
		// 执行路径命令
		cmd: function() {
			var part = pathDataPart(arguments);
			var d = pathDataFormat(this.attr('d')) + ' ' + part;
			return this.attr('d', d);
		},
		// 解析路径命令
		resolve: function(cmdName) {
			var result = [];
			var d = pathDataFormat(this.attr('d'));
			var dObject = pathDataResolve(d);
			if (cmdLetters.test(cmdName)) {
				for (var n = 0; n < dObject.length; n++) {
					var obj = dObject[n];
					if (obj.cmd === cmdName) {
						result.push(obj.data);
					}
				}
			} else {
				result = dObject;
			}
			return result;
		},
		currentPoint: function() {
			var data = pathDataFormat(this.attr('d'));
			return pathCurrentPoint(data);
		},
		// 指定路径起点
		M: function(p) {
			return this.cmd('M', p.x, p.y);
		},
		// 绘制路径直线
		L: function(p) {
			return this.cmd('L', p.x, p.y);
		},
		// 绘制圆或椭圆上的一段弧，参数：弧的 x 轴半径、弧的 y 轴半径、x 轴旋转角度、是否为优弧、是否顺时针、终点 x 坐标、终点 y 坐标
		A: function(radiusX, radiusY, angle, largeArc, clockwise, endX, endY) {
			return this.cmd('A', radiusX, radiusY, angle, largeArc, clockwise, endX, endY);
		},
		// 绘制圆上一段弧，参数：终点、圆的半径、是否为优弧、[是否顺时针画弧，默认顺时针]
		AR: function(end, radius,largeArc, clockwise) {
			var start = this.currentPoint();
			var angle = $.angle(start, end);
			clockwise = clockwise === undefined ? 1 : (!!clockwise ? 1 : 0);
			return this.A(radius, radius, angle, largeArc, clockwise, end.x, end.y);
		},
		// 绘制圆上一段弧，参数：终点、弧高、是否为优弧、[是否顺时针画弧，默认顺时针]
		AH: function(end, chordHeight,largeArc, clockwise) {
			var start = this.currentPoint();
			var chordWidth = $.distance(start, end);
			var radius = $.radius(chordWidth, chordHeight);
			var angle = $.angle(start, end);
			clockwise = clockwise === undefined ? 1 : (!!clockwise ? 1 : 0);
			return this.A(radius, radius, angle, largeArc, clockwise, end.x, end.y);
		}
		// 闭合路径
		Z: function() {
			return this.cmd('Z');
		}
	});
	
})(jQuery);