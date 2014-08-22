var Adventure;
(function ($, Adventure) {
    'use strict';
    
    var Story = function (story) {
        var self = this;
        self.variables = ko.mapping.fromJS(story.variables);
		
        self.title = ko.observable(story.title);
        self.titleSubtext = ko.observable(story.titleSubtext);
        self.author = ko.observable(story.author);
        self.canStepBack = ko.observable(story.canStepBack);

        self._id = story._id || undefined;
        self._rev = story._rev || undefined;

        self.last_edited = story.last_edited || undefined;
		
        self.labelGroups = ko.observableArray([]);
        self.pages = ko.observableArray([]);

		$.each(story.pages, function(i, page) {
			self.pages.push(new Adventure.Page(page, self.variables));
		});
		$.each(story.labelGroups, function (i, labelGroup) {
		    self.labelGroups.push(new Adventure.LabelGroup(labelGroup));
		});
		
		self.getPage = function(pageId) {
			return $.grep(self.pages(), function(page) {
				return page.id() == pageId;
			})[0];
		};
		
		self.createNewPage = function(pageText) {
			var newId = self.pages().length;
		    var newPage = new Adventure.Page({id: newId, pageText: pageText}, self.variables);
			self.pages.push(newPage);
			return newId;
		};		
		
		self.deletePage = function(pageId) {
			self.pages.remove(function(page) { return ko.utils.unwrapObservable(page.id) === ko.utils.unwrapObservable(pageId) });
		};
		
		self.getVariableValue = function(variableName) {
			return variableName ? self.variables[variableName]() : '';
		};
    };

    var Page = function (page, variables) {
        var self = this;
        self.id = ko.observable(page.id);
        self.name = ko.observable('Page ' + (page.id + 1));
		self.pageText = ko.observable(page.pageText);
        self.choices = ko.observableArray([]);

    	self.hasTextInput = ko.computed(function() {
    		return $.grep(self.choices(), function(choice) {
				return choice.input();
    		}).length > 0; 
    	});
		self.parsedPageText = ko.computed(function() {
			return self.pageText().replace(/\[\[([^\]]+)\]\]/gi, function(match) {
				//we have no knowledge of the variables here so this shouldnt be here but in EngineModel or Story
				var variableName = match.replace('[[', '').replace(']]', '');
				if(variables[variableName]) {
					return '<span class="var is-parsed">'+variables[variableName]()+'</span>';
				}
				else {
					return match;
				}
			});
		});
		
        if (page.choices && page.choices.length > 0) {
            $.each(page.choices, function (i, choice) {
                self.choices.push(new Adventure.Choice(choice));
            });
        }
		
		self.createNewChoice = function(pageId, caption) {
		    self.choices.push(new Adventure.Choice({nextPage: pageId, caption: caption}));
		};
		
		//deleteChoice is built on the assumption that no two choices will have the same caption. This will need to be enforced. 
		self.deleteChoice = function(caption) {
			self.choices.remove(function(choice){ 
				return choice.caption() === caption 
			});
		}
		
		self.toJSON = function() {
			var copy = ko.toJS(this);
			delete copy.hasTextInput;
			delete copy.parsedPageText;
			return copy;
		};
    };

    var Choice = function (choice) {
        var self = this;
        self.caption = ko.observable(choice.caption); //text that is displayed in the choice button
        self.nextPage = ko.observable(choice.nextPage); //id of linked page
        self.isSecret = ko.observable(choice.isSecret); //whether or not the choice is visible if requirements are not met (if false, the player can see the requirements that they did not meet).
		self.input = ko.observable(choice.input || false);
		self.inputAliases = ko.observable('');
        self.requirements = ko.observableArray([]); //all of these must be true for the choice to be activated
		self.commands = ko.observableArray([]); //commands to be performed if the user clicked on this choice. This is the only way the story variables can be changed.
		
		if (choice.commands && choice.commands.length > 0) {
			$.each(choice.commands, function (i, cmd) {
				self.commands.push(new Adventure.Command(cmd));
			});
		}
		if (choice.requirements && choice.requirements.length > 0) {
			$.each(choice.requirements, function (i, req) {
				self.requirements.push(new Adventure.Requirement(req));
			});
		}  
		/*
		self.addRequirement = function() {
			self.requirements.push(new Adventure.Requirement({variableName: 'var1', condition: '=', value:'value'}));
		};
		self.addCommand = function() {
			self.commands.push(new Adventure.Command({variableName: 'var1', operation: '=', value:'value'}));
		};*/
    };

    var Command = function (command) {
        var self = this;
        self.variableName = ko.observable(command.variableName);
        self.operation = ko.observable(command.operation); // possible operations: + (add), - (subtract), = (assign), ! (toggle, for booleans only)
        self.value = ko.observable(command.value);
    };

    var Requirement = function (requirement) {
        var self = this;
        self.variableName = ko.observable(requirement.variableName);
        self.condition = ko.observable(requirement.condition); // possible conditional operators:  >, <, = (equal), ! (not equal)
        self.value = ko.observable(requirement.value);
    };

    var LabelGroup = function (labelGroup) {
        var self = this;
        self.color = ko.observable(labelGroup.color);//#ec971f
        self.name = ko.observable(labelGroup.name);
        self.seq = ko.observable(labelGroup.seq);
        self.labels = ko.observableArray([]); //collection of labels.
		
		$.each(labelGroup.labels, function (i, label) {
			self.labels.push(new Adventure.Label(label));
		});
    };

    var Label = function (label) {
        var self = this;
        self.name = ko.observable(label.name || label.variableName);
		self.variableName = ko.observable(label.variableName);
        self.icon = ko.observable(label.icon);
        self.requirements = ko.observableArray([]);//List of requirements. If they're all true then display the variable.
		
		$.each(label.requirements, function (i, req) {
			self.requirements.push(new Adventure.Requirement(req));
		});
    };

    Adventure.Requirement = Requirement;
    Adventure.Story = Story;
    Adventure.Page = Page;
    Adventure.Choice = Choice;
    Adventure.Command = Command;
    Adventure.LabelGroup = LabelGroup;
    Adventure.Label = Label;
})(jQuery, Adventure || (Adventure = {}));