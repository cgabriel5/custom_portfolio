app.module("utils", function(modules, name) {
    /**
     * @description [Turns provided array like object into a true array.]
     * @param  {ArrayLikeObject} array_like_object [The objec to work with.]
     * @return {Array}                   [The true array.]
     * @source [http://stackoverflow.com/questions/960866/how-can-i-convert-the-arguments-object-to-an-array-in-javascript]
     */
    function to_real_array(array_like_object) {
        return Array.prototype.slice.call(array_like_object);
    }

    /**
     * @description [Determines which event the users browser supports and returns it.]
     * @return {String} [The browser dependant event to listen to.]
     * @source [https://davidwalsh.name/css-animation-callback, From Modernizr]
     */
    function which_animation_event() {
        var t;
        var el = document.createElement("div");
        var transitions = {
            animation: "animationend",
            OAnimation: "oAnimationEnd",
            MozAnimation: "animationend",
            WebkitAnimation: "webkitAnimationEnd"
        };
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    /**
     * @description [Creates the targets path (target elements parents).]
     * @param  {EventObject} event   [The browsers EventObject]
     * @return {Array}       parents [The created path array containing the target elements parents elements]
     */
    function create_path(event) {
        // cache the target element
        var element = event.target;
        // there must be a target element...else return empty path
        if (!event.target) return [];
        // start building path
        var parents = [element];
        while (element) {
            element = element.parentNode;
            if (element) parents.push(element);
        }
        // remove the document from the array
        parents.pop();
        // finally return the path!
        return parents;
    }

    /**
     * @description [Checks whether the documents vertical scrollbar is visible.]
     * @return {Boolean}
     * @source [http://stackoverflow.com/questions/2146874/detect-if-a-page-has-a-vertical-scrollbar]
     */
    function is_vertical_scrollbar_visible() {
        return document.body.clientHeight > window.innerHeight;
    }

    // export to access in other modules
    this[name].to_real_array = to_real_array;
    this[name].which_animation_event = which_animation_event;
    this[name].create_path = create_path;
    this[name].is_vertical_scrollbar_visible = is_vertical_scrollbar_visible;
});
