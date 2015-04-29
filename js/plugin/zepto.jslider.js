/*
 * @name   zepto.jslider.js
 * @author Jelon
 * @date   2014-04-07
 * @link   http://jelon.in
 *
 * @param  object config               插件设置
 * @param  string config.img_main      轮番大图容器
 * @param  string config.img_thumbnail 轮番缩略图容器
 * @param  number config.max_width     轮番图的最大宽度
 * @param  number config.min_width     轮番图的最小宽度 
 * @param  bumber config.tick          轮番间隔时间默认为2000ms
 *          
 */
;(function($) {
	$.fn.slider = function(config) {

        config = $.extend({}, config);
        if (!config.tick) config.tick = 2000;
        if (config.max_width) $this.css({ 'max-width': config.max_width });
        if (config.min_width) $this.css({ 'min-width': config.min_width });

        var $this      = $(this),   // 轮番特效容器                                                   
        	timer      = null,      // 定时器
	    	$target    = $this.find(config.img_main) || $this.find('.img-main'),                       // 轮番大图容器
	    	$title     = $this.find(config.img_thumbnail) || $this.find('.img-thumbnail'),             // 轮番缩略图容器
	   		m          = { initX: 0, initY: 0, startX: 0, startY: 0, endX: 0, canmove: !1 },           // 状态
	    	box_w      = $this.width(),   
	    	currentTab = 0;

	    // 设置调整图片的宽高
        $target.find('.item').css('width', box_w + 'px');
        $target.find('.item').css({ 'height': $target.find('.item').eq(0).height() });
        $target.find('ul').css('width', $target.find('.item').length * box_w + 'px');
        $(window).resize(function() {
        	box_w = $this.width();   
        	$target.find('.item').css({ 'width': box_w + 'px'});
        	$target.find('.item').eq(0).css({ 'height': 'auto' });
        	$target.find('.item').css({ 'height': $target.find('.item').eq(0).height() + 'px' });
        	$target.find('ul').css('width', $target.find('.item').length * box_w + 'px');
        });

        // 设置大图容器高度，事件委托
        $title.on('click', '.item', function(e) {
            var $self = $(this),
            	index = $title.find('.item').index($self);

            toTab(index);
        });
        $this.on('touchstart', function(e) {
            var et = e.touches[0];
            if ($(et.target).closest(config.img_main).length || $(et.target).closest('.img-main').length) {
                m.canmove = !0; 
                m.initX   = m.startX = et.pageX;
                m.initY   = et.pageY;
                clearTimer();
            }
        }).on('touchmove', function(e) {

            var et = e.touches[0];
            if (m.canmove && Math.abs(et.pageY - m.initY) / Math.abs(et.pageX - m.initX) < 0.6) {
            	m.endX += et.pageX - m.startX;
            	$target.css('-moz-transform', 'translate3d(' + m.endX + 'px, 0, 0)');
                $target.css('-webkit-transform', 'translate3d(' + m.endX + 'px, 0, 0)');
                $target.css('-ms-transform', 'translate3d(' + m.endX + 'px, 0, 0)');
                $target.css('-o-transform', 'translate3d(' + m.endX + 'px, 0, 0)');
                $target.css('transform', 'translate3d(' + m.endX + 'px, 0, 0)');
             	
                m.startX = et.pageX;
                e.preventDefault();
            }
        }).on('touchend', function(e) {
            if (!m.canmove) return;

            //是否超过了边界
            var bl      = !1, 
            	current = Math.abs(m.endX / box_w);

            if (m.endX > 0) {
                current = m.endX = 0;
                bl = !0;
            } else if (m.endX < -box_w * ($target.find('.item').length - 1)) {
                current = $target.find('.item').length - 1;
                bl      = !0;
            }

            if (!bl) {
                if (m.endX % box_w != 0) {

                    var str = parseInt((current + '').split('.')[1][0]);

                    if (e.changedTouches[0].pageX > m.initX) {
                        // 往右
                        current = str <= 9 ? Math.floor(Math.abs(current)) : Math.abs(Math.round(m.endX / box_w));
                    } else {
                        // 往左
                        current = str >= 1 ? Math.floor(Math.abs(current)) + 1 : Math.abs(Math.round(m.endX / box_w));
                    }
                }
            }
            toTab(current);
            setTimer();
            m.canmove = !1;
        });
		
		// 触摸移动效果
        var move = function(x) {
        	m.endX = x;
        	$target.css('-moz-transform', 'translate3d(' + m.endX + 'px, 0, 0)');
            $target.css('-webkit-transform', 'translate3d(' + m.endX + 'px, 0, 0)');
            $target.css('-ms-transform', 'translate3d(' + m.endX + 'px, 0, 0)');
            $target.css('-o-transform', 'translate3d(' + m.endX + 'px, 0, 0)');
            $target.css('transform', 'translate3d(' + m.endX + 'px, 0, 0)');
        }

        var setIndex = function(i) {
            return i < 0 ? 0 : i >= $target.find('.item').length ? $target.find('.item').length - 1 : i;
        }

        var toTab = function(i) {
            i  = setIndex(i);

            move(-box_w * i);
            // 设置缩略图样式
            toTitle(i);

            if (currentTab != i && config.change) {
                config.change(i);
            }
            currentTab = i
        }

        var toTitle = function(i) {
            if ($title.length == 0) return;
            $title.find('.current').removeClass('current');
            $title.find('.item').eq(i).addClass('current');
        }

        // 轮番
        var setTimer = function() {
            if (timer) clearTimer();

            timer = setInterval(function() {
                toTab(currentTab >= $target.find('.item').length - 1 ? 0 : currentTab + 1);
            }, config.tick);
        }
        // 清除定时
        var clearTimer = function() {
            clearInterval(timer);
            timer = null;
        }

        // 触发轮番
        setTimer();
	};
})(Zepto || jQuery);