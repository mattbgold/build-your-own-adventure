(function ($) {
    'use strict';
	
	ko.bindingHandlers.popover = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var selectorForBoundContent = ko.utils.unwrapObservable(valueAccessor());
			var popOverTemplate = "<div class='current-popover'></div>";
			$(element).popover({ 
				content: popOverTemplate, 
				html: true, 
				trigger: 'manual', 
				placement: 'bottom', 
				template: '<div class="popover popover-choice"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>', 
				title: 'Choice Options '	//<a href="javascript://" style="float:right;" onclick="confirmDelete(\'Are you sure you want to delete this choice? This cannot be undone.\', \'Delete Choice\', function(result){if(result){model.currentPage().deleteChoice(model.currentChoice().caption());}});"><i class="fa fa-trash-o fa-fw"></i><span class="icontext">Delete Choice</span></a>		
			});

			$(element).click(function () {
				if (model.canEdit()) { 
					$('.choice').not(this).popover('hide');
					var popoverOn = $(this).next('div.popover:visible').length === 0;
					if(popoverOn) {
						$(this).popover('show');
					}
					var po = $('.popover.fade.in .current-popover'); //select the popover that is fading in. There are more thna one current-popover at a time due to transitions
					po.html($(selectorForBoundContent).html());
					
					if(popoverOn) {
						ko.applyBindings(viewModel, po[0]);
						$('.tt').tooltip();
					}
				}
			});
		},
	};

	ko.bindingHandlers.fadepage = {
		update: function (element, valueAccessor) {
		    var currentHeight = $('#dvHeightMatch').outerHeight(true);//+22
			$(element).height(currentHeight);
			var newHeight;
			ko.utils.unwrapObservable(valueAccessor());
			$(element).transition({ opacity: 0 }, function () {
				model.setPage(model.stagePage());
				newHeight = $('#dvHeightMatch').outerHeight(true);//+22
				$(element).transition({ height: newHeight }).transition({ opacity: 1 }, function () {
					$(element).height('auto');
				});
			});
		}
	};

	ko.bindingHandlers.fadeToggle = {
		update: function(element, valueAccessor, allBindings) {
			var fixed = allBindings.get('retainWidth');
			if(ko.utils.unwrapObservable(valueAccessor())) {
				if (fixed) 
					$(element).transition({opacity: 1});
				else 
					$(element).fadeIn();
			}
			else {
				if (fixed)
					$(element).transition({opacity: 0});
				else
					$(element).fadeOut();
			}
		}
	}

  ko.bindingHandlers.toggleClick = {
      init: function (element, valueAccessor) {
          var value = valueAccessor();

          ko.utils.registerEventHandler(element, "click", function () {
              value(!value());
          });
      }
  };

	ko.bindingHandlers.contentEditable = {
		update: function (element, valueAccessor, allBindingsAccessor) {
			var value = ko.unwrap(valueAccessor());
			element.contentEditable = value;
			
			var $element = $(element);
			
			$element.off("blur");
			
			if (value) {
				var allBindings = allBindingsAccessor();
				var htmlBinding = allBindings.html;
				var textBinding = allBindings.text;
				
				if (ko.isWriteableObservable(htmlBinding)) {
					$element.blur(function (event) {
						htmlBinding($element.html());
					});
				}
				if (ko.isWriteableObservable(textBinding)) {
					$element.blur(function (event) {
						textBinding($element.text());
					});
				}
				$element.addClass('is-editable');
			} else {
				$element.off("input");
				$element.removeClass('is-editable');
			}
		}
	};
	
	ko.bindingHandlers.bootstrapSwitchOn = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
			$(element).bootstrapSwitch({ 
				onText: 'Edit', 
				offText: 'Play', 
				size: 'large', 
				state: ko.utils.unwrapObservable(valueAccessor()), 
				onSwitchChange: function(e, state) {
					valueAccessor()(state);
				}
			});
		},
		update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
			var state = $(element).bootstrapSwitch('state');
			var canEdit = ko.utils.unwrapObservable(valueAccessor());
			if (state != canEdit) {
				$(element).bootstrapSwitch('state', canEdit);
			}
		}
	};

})(jQuery);
