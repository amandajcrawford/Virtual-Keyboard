$(function(){
    var $write = $('#write'),
        shift = false,
        capslock = false;

    function getEventCharacter(e){
        var $this = $(this);
        console.log(e);
        var topTargetNode= e.detail.events["0"].originalEvent.path["0"];

        if(topTargetNode.className === 'letter'){
            character = topTargetNode.innerHTML;
        }
        //character = e.detail.events["0"].originalEvent.path["0"].innerHTML; // If it's a lowercase letter, nothing happens to this variable
        //console.log(e.events["0"].originalEvent.target.nodeType);
        console.log(e.detail.events["0"].originalEvent.path["0"].text);
        // Shift keys
        if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();

            shift = (shift === true) ? false : true;
            capslock = false;
            return false;
        }

        // Caps lock
        if ($this.hasClass('capslock')) {
            $('.letter').toggleClass('uppercase');
            capslock = true;
            return false;
        }

        // Delete
        if ($this.hasClass('delete')) {
            var html = $write.html();

            $write.html(html.substr(0, html.length - 1));
            return false;
        }

        // Special characters
        if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
        if ($this.hasClass('space')) character = ' ';
        if ($this.hasClass('tab')) character = "\t";
        if ($this.hasClass('return')) character = "\n";

        // Uppercase letter
        if ($this.hasClass('uppercase')) character = character.toUpperCase();

        // Remove shift once a key is clicked.
        if (shift === true) {
            $('.symbol span').toggle();
            if (capslock === false) $('.letter').toggleClass('uppercase');

            shift = false;
        }

        // Add the character
        $write.html($write.html() + character);
    }

    // Get Keyboard Region
    var containerElement = document.getElementById('container');
    console.log(containerElement);
    var activeRegion = new ZingTouch.Region(containerElement);
    var keyboardRegion = document.getElementById('keyboard');

    activeRegion.bind(keyboardRegion, 'pan', function(e){
            getEventCharacter(e);
    });

    activeRegion.bind(keyboardRegion, 'tap', function(e){
        getEventCharacter(e);
    });
});
