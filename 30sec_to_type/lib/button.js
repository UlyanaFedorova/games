var addButton = function(text, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clicked = false;
    this.hovered = false;
    this.text = text;
}
 
Button.prototype = _.extend(Button.prototype, UIObject);