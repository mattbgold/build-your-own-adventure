var Adventure;
(function ($, Adventure) {
    'use strict';

    var EngineModel = function (story) {
        var self = this;
		
		//------------------------------------------------------------------------------------
		//------------- Observables ------------------------------------------------------------
		//------------------------------------------------------------------------------------
		
        self.story = ko.observable(new Adventure.Story(story)); // holds a Story
        self.currentPage = ko.observable(new Adventure.Page(story.pages[0])); //holds Page
		self.currentChoice = ko.observable();
		self.stagePage = ko.observable(0);
		
		//make observableArray
		self.history = ko.observableArray([]); //a stack of our prior locations
		self.canStepBack = ko.observable(false); 
		
		//set any observables that need to change when the page is hidden here. 
		self.currentPage.subscribe(function() {
			self.canStepBack(self.story().canStepBack() && self.history().length > 0);
		});
		
		self.canEdit = ko.observable(false);
		self.editAdvanced = ko.observable(false);
		self.showPageTree = ko.observable(false); //use this to control visibility of pageTree

		self.mapLinkToExistingPage = ko.observable(false);
		self.mapLinkToExistingPage.subscribe(function(val) {
			if(val){
				$('#advMap').modal('show');
			}
			else {
				$('#advMap').modal('hide');
			}
		});
		
		self.pageFilter = ko.observable('');
		self.filteredPages = ko.computed(function() {
			if(self.pageFilter().trim() === '') {
				$('.mapelement-pagetext p').css('margin-left', 0)
				$('.tree').unhighlight({className: 'is-highlighted'});
				return self.story().pages();
			}
			else {
				setTimeout(function() {
					$('.tree').unhighlight({className: 'is-highlighted'}).highlight(self.pageFilter(), {className: 'is-highlighted'});
					//loop through mapelement paragraphs, only consider the first highlight match for each paragraph
					$.each($('.mapelement-pagetext p'), function(i, p) {
						var firstOccurence = $(p).find('.is-highlighted').first();
						if (firstOccurence.length === 1) { //TODO: && firstOccurence.position().left > gradient position.left
							$(p).css('margin-left', 0).css('margin-left', '-' + (Math.max($(firstOccurence).position().left - 100,0)).toString() + 'px'); //TODO: make sure we do not move text over too far if there is empty space before the gradient
						}
					});
				}, 0);
				return $.grep(self.story().pages(), function(page) {
					return page.pageText().toLowerCase().indexOf(self.pageFilter().toLowerCase()) > -1 || page.name().toLowerCase().indexOf(self.pageFilter().toLowerCase()) > -1;
				});
			}
		});
		
		//------------------------------------------------------------------------------------
		//------------- Functions ------------------------------------------------------------
		//------------------------------------------------------------------------------------
		
        self.setPage = function (id) {
            self.currentPage(self.story().getPage(id));
        };
		self.stepBack = function() {
			if (self.history().length>0) {
				self.stagePage(self.history.pop());
			}
		};
        self.story.subscribe(function (newStory) {
            self.currentPage(newStory.pages()[0]);
        });
		
		self.loadStory = function(story) {
			$('.story').transition({ opacity: 0 }, function () {
				self.story(new Adventure.Story(story));
				$('.story').transition({ opacity: 1 });
			});
			
		}
		self.exportStory = function() {
			window.open('data:text/json,' + ko.toJSON(ko.mapping.toJS(self.story)), '_blank');
		}
		
		self.importStory = function() {
			var story = prompt("Paste your adventure json here.", "");
			if(story) {
				try {
					self.loadStory(ko.utils.parseJson(story));
				}
				catch(err) {
					alert('There was an error while parsing your story.\n\n' + err);
				}
			}
		}
		
		self.runCommands = function(cmds) {
			if (cmds && cmds.length > 0) {
				$.each(cmds, function(i, cmd) {
					var currentValue = self.story().variables[cmd.variableName()]();
					if (!currentValue && currentValue !== 0) {
						currentValue = 0;
					}

					if (cmd.operation() === "=") {
						self.story().variables[cmd.variableName()](cmd.value());
					}
					else if (cmd.operation() === "+") {
						self.story().variables[cmd.variableName()](currentValue + cmd.value());
					}
					else if (cmd.operation() === "-") {
						self.story().variables[cmd.variableName()](currentValue - cmd.value());
					}
					else if (cmd.operation() === "!") {
						self.story().variables[cmd.variableName()](!currentValue);
					}
				});
			}
		};
	
		self.meetsRequirements = function(reqs) {
			if (reqs && reqs.length > 0) {
				for(var i=0; i < reqs.length; i++) {
					var value = model.story().variables[reqs[i].variableName()];
					if(value === undefined) {
						alert('Error: attempted to access variable "' + reqs[i].variableName() + '" but it did not exist');
					}
					else {
						value = value();
					}
					if (reqs[i].condition() === "=") {
					
						if(!(value === reqs[i].value())) {
							return false;
						}
					}
					else if (reqs[i].condition() === ">") {
						if(!(value > reqs[i].value())) {
							return false;
						}
					}
					else if (reqs[i].condition() === "<") {
						if(!(value < reqs[i].value())) {
							return false;
						}
					}
					else if (reqs[i].condition() === "!") {
						if(!(value !== reqs[i].value())) {
							return false;
						}
					}
				}
			}
			return true;
		};
		
		self.choose = function (data) {
		    if (self.canEdit()) { 
		        self.currentChoice(data);	
		    }
            else if (self.meetsRequirements(data.requirements())) { 
				self.runCommands(data.commands()); 
				model.history.push(model.currentPage().id())
				self.stagePage(data.nextPage());
			} else {
				//TODO:? alert('show requirements'); maybe show the label + target value if there is a label, otherwise do not show anything
			}
		};
		
		self.newChoice = function() {
			self.currentPage().createNewChoice(self.story().createNewPage('(Edit Me)'), 'Edit Me');
			$('.choicetext:last').click(); //focus on the newly created choice, which is added to the end. 
		};
    };

    Adventure.EngineModel = EngineModel;
})(jQuery, Adventure || (Adventure = {}));