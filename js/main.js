/**
 * @name        main.js
 * @description 网站js
 * @author      Jelon
 * @date        2015-03-31
 * @link        http://jelon.in
 *
 */

/*
 * 全局常量
 */
// 后缀为4个下划线
var CAIMEI = 'CAIMEI____';

/*
 * 焦点图轮番
 */
$(function() {
	// $('.img-box').slider({
	// 	img_main: '.img-main',
	// 	img_thumbnail: '.img-thumbnail',
	// 	tick: 2500
	// });
	$('#' + CAIMEI + 'swipe_box').swipeSlide({
	    continuousScroll: true,
	    speed: 3000,
	    transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
	    callback: function(i) {
	        $('.img-thumbnail').find('.item').eq(i).addClass('current')
	        	.siblings().removeClass('current');
	    }
	});
});

/*
 * 选项卡
 */ 
;+function() {
	var $tab_hd        = $('#' + CAIMEI + 'hd'),
		$tab_hd_items  = $tab_hd.find('.item'),
		$tab_con       = $('#' + CAIMEI + 'con'),
		$tab_con_items = $tab_con.find('.item'),
		index    = 0;

	$tab_hd_items.on('click', function() {
		var $this = $(this);
		index     = $tab_hd_items.index($this);

		$this.parent().find('.current').removeClass('current');
		$this.addClass('current');

		$tab_con.find('.current').removeClass('current');
		$tab_con_items.eq(index).addClass('current');
	}).eq(0).trigger('click');
}();

/*
 * 复选框选择效果
 */
;~function() {
	// 全选
	var $select_all = $('#' + CAIMEI + 'select_all'),
		$checkboxes = $('#' + CAIMEI + 'checkboxes');

	// 点击全选
	$select_all.on('click', function() {
		var $this       = $(this),
			$icon_check = $this.find('.icon-check')
		if (!$icon_check.hasClass('checked')) {
			// 全选复选框本身已选状态
			$icon_check.addClass('checked');

			// 处理其他各复选框已选状态
			$checkboxes.find('.icon-check').addClass('checked');
		} else {
			// 全选复选框本身非选状态
			$icon_check.removeClass('checked');

			// 处理其他各复选框非选状态
			$checkboxes.find('.icon-check').removeClass('checked');

		}
	});

	// 各复选框操作
	$checkboxes.find('.checkbox').on('click', function() {
		var $this       = $(this),
			$icon_check = $this.find('.icon-check');
		if (!$icon_check.hasClass('checked')) {
			// 当前复选框取消选择操作
			$icon_check.addClass('checked');
		} else {
			// 当前复选框取消选择操作
			$icon_check.removeClass('checked');
			// 全选复选框取消选择操作
			$select_all.find('.icon-check').removeClass('checked');
		}
	});

}();

/*
 * 阻止冒泡事
 */
$('.nums .plus, .nums .minus').on('click', function(e) {
	e.stopPropagation();
});


