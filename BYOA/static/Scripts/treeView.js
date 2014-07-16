(function ($) {
    $.fn.treeView = function (options) {

		//var settings = $.extend({
		//}, options);
		$(this).find('li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
		return $(this).find('li.parent_li > span').on('click', function (e) {
			var children = $(this).parent('li.parent_li').find(' > ul > li');
			if (children.is(":visible")) {
				children.hide('fast');
				$(this).attr('title', 'Expand this branch').find(' > i').addClass('fa-plus-circle').removeClass('fa-minus-circle');
			} else {
				children.show('fast');
				$(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa-minus-circle').removeClass('fa-plus-circle');
			}
			e.stopPropagation();
		});
	}
}(jQuery));