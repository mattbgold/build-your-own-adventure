//TODO: wrap this properly in our ns

function selectElementContents(el) {
	var range = document.createRange();
	range.selectNodeContents(el);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

var Node = function(id, nodes) {
	var self = this;
   self.id = ko.observable(id);
   self.nodes = ko.observableArray();    
   $.each(nodes, function(i,val) {
	self.nodes.push(new Node(val.id, val.nodes));
   });
};

var confirmDelete = function(message, title, callback) {
	bootbox.dialog({
	  message: message,
	  title: title,
	  buttons: {
		danger: {
		  label: "Delete",
		  className: "btn-danger",
		  callback: callback
		},
		cancel: {
		  label: "Cancel",
		  className: "btn-default"
		}
	  }
  });
};