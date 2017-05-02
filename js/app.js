// IIFE start
(function(window) {
    "use strict";

    (function() {
        // add to global scope for ease of use
        // use global app var or create it if not present
        var app = window.app || (window.app = {}),
            counter = {
                complete: 0,
                interactive: 0
            },
            queue = {
                complete: [],
                interactive: []
            };

        // add a module to load
        app.module = function(module_name, fn, mode) {
            // determine what array the module needs to be added to
            var type = !mode || mode === "complete" ? "complete" : "interactive";
            // add the module to the queue
            queue[type].push([module_name, fn]);
        };

        // app module invoker
        var invoke = function(mode) {
            // get the queued array
            var modules = queue[mode];
            // if no modules, return
            if (!modules.length) return;
            // run the modules one after another
            // get the first module
            load(modules, counter[mode], mode);
        };

        var load = function(modules, count, mode) {
            // get the current module + its information
            var module = modules[count];
            // if no module exists all modules have loaded
            if (!module) return;
            // get the module information
            var module_name = module[0],
                fn = module[1];
            // run the module and the load() function
            (function() {
                // add the module name to the app
                app[module_name] = app[module_name] || {};
                // call the module and run it
                fn.call(app, app, module_name);
                // increase the counter
                counter[mode]++;
                // run the load function again
                load(modules, counter[mode], mode);
            })();
        };

        // cleanup the app variable
        var cleanup = function() {
            // remove unneeded properties once
            // the app has loaded
            delete app.module;
            delete app.invoke;
        };

        // https://developer.mozilla.org/en-US/docs/Web/Events/readystatechange
        // the readystatechange event is fired when the readyState attribute of a
        // document has changed
        document.onreadystatechange = function() {
            // https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
            // loading === document still loading
            // complete === document and all sub-resources have finished loading.
            // same as the window.onload event
            // interactive === document has finished loading & parsed but but
            // sub-resources such as images, stylesheets and frames are still loading
            // **Note: interactive === document.addEventListener("DOMContentLoaded",...
            // **Note: complete    === window.addEventListener("load", function() {...
            // [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)
            // [load](https://developer.mozilla.org/en-US/docs/Web/Events/load)

            // document loaded and parsed. however, still loading subresources
            // user is able to interact with page.
            if (document.readyState === "interactive") {
                // invoke the modules set to mode interactive
                invoke("interactive");
            }

            // all resources have loaded (document + subresources)
            if (document.readyState === "complete") {
                // invoke the modules set to mode complete
                invoke("complete");

                // cleanup app var once everything is loaded
                cleanup();
            }

            // good explanation with images:
            // https://varvy.com/performance/document-ready-state.html
        };
    })();

    app.module(
        "libs",
        function(modules, name) {
            // init FastClickJS
            if ("addEventListener" in document) {
                FastClick.attach(document.body);
            }
        },
        "interactive"
    );

    app.module("globals", function(modules, name) {
        // export to access in other modules
        this[name]["last_open_popup"] = null;
    });

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

    app.module("$$", function(modules, name) {
        // grab module(s)
        var utils = modules.utils;
        // get needed functions/data
        var to_real_array = utils.to_real_array;

        // local module vars
        var d = document,
            $ = function(id) {
                return d.getElementById(id);
            },
            $class = function(class_name) {
                return d.getElementsByClassName(class_name);
            };

        // export to access in other modules
        this[name]["portfolio_wrapper"] = $("portfolio-wrapper");
        this[name]["shortnames_elements"] = to_real_array(
            $class("emoticon-shortname")
        );
        this[name]["nav_contact"] = $("nav-contact");
        this[name]["nav_popup_contact"] = $("nav-popup-contact");
        this[name]["footer"] = $class("footer-wrapper")[0];
        this[name]["aboutme_section"] = $("section-aboutme-wrapper");
        this[name]["works_section"] = $("section-works-wrapper");
        this[name]["menu_popup"] = $("popup-menu-wrapper");
    });

    app.module("core", function(modules, name) {
        // grab module(s)
        var $$ = modules.$$,
            utils = modules.utils,
            globals = modules.globals;
        // get needed functions/data
        var nav_contact = $$.nav_contact,
            nav_popup_contact = $$.nav_popup_contact,
            shortnames_elements = $$.shortnames_elements,
            aboutme_section = $$.aboutme_section,
            works_section = $$.works_section,
            is_vertical_scrollbar_visible = utils.is_vertical_scrollbar_visible,
            to_real_array = utils.to_real_array;

        /**
         * @description [Shows the contact tab. Depends on the is_vertical_scrollbar_visible() function.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function show_contact_nav() {
            if (is_vertical_scrollbar_visible()) {
                nav_contact.classList.remove("hidden");
                nav_popup_contact.classList.remove("hidden");
            } else {
                nav_contact.classList.add("hidden");
                nav_popup_contact.classList.add("hidden");
            }
        }

        /**
         * @description [Resets the main navigation tabs. It removes the nav-current class.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function reset_navigation() {
            // reset active nav-item
            to_real_array(
                document.getElementsByClassName("nav-item")
            ).forEach(function(nav_item) {
                nav_item.classList.remove("nav-current");
            });
        }

        /**
         * @description [Turns emoticons strings into emoticon image elements.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function shortnames_2_emoticons() {
            // loop through each shortname_element...
            shortnames_elements.forEach(function(element) {
                // get the shortname, this is the elements text
                var shortname = element.textContent;
                // convert the shortname to an image
                var emoticon = emojione.shortnameToImage(shortname);
                // embed the image back into the element
                element.innerHTML = emoticon.replace("//cdn", "https://cdn");
            });
        }

        /**
         * @description [Hides the currently/last opened popup.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function hide_last_open_popup() {
            var last_open_popup = modules.globals.last_open_popup;
            if (last_open_popup) last_open_popup.classList.add("hidden");
        }

        /**
         * @description [Shows the about me section wile hides the works section.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function show_aboutme_section() {
            // hide the about me section
            aboutme_section.classList.remove("hidden");
            // show the projects section
            works_section.classList.add("hidden");
        }

        /**
         * @description [Shows the works wile hides the about me section.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function show_works_section() {
            // hide the about me section
            aboutme_section.classList.add("hidden");
            // show the projects section
            works_section.classList.remove("hidden");
        }

        /**
         * @description [Parse provided delegation data.]
         * @param {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Object}  [Returns an object containing its actions and or bubbling.]
         */
        function parse_delegation_data(target) {
            // get the delegatiob data
            var delegation_data = target.getAttribute("data-delegation");
            // if no delegation data is provided return default object
            if (!delegation_data) {
                return {
                    actions: [],
                    stop: false
                };
            }
            var parts = delegation_data.trim().split(";");
            var actions = parts[0].trim().split(",");
            var bubble = parts[1].trim();
            return {
                actions: actions,
                stop: bubble ? true : false
            };
        }

        /**
         * @description [Adds the nav-current class to the clicked element tab.]
         * @param  {HTMLElement} target_element [The target element that was clicked on.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function highlight_tab(target_element) {
            // highlight clicked nav-item
            document
                .getElementById(target_element.getAttribute("data-syncid"))
                .classList.add("nav-current");
        }

        // export to access in other modules
        this[name].show_contact_nav = show_contact_nav;
        this[name].reset_navigation = reset_navigation;
        this[name].shortnames_2_emoticons = shortnames_2_emoticons;
        this[name].hide_last_open_popup = hide_last_open_popup;
        this[name].show_aboutme_section = show_aboutme_section;
        this[name].show_works_section = show_works_section;
        this[name].parse_delegation_data = parse_delegation_data;
        this[name].highlight_tab = highlight_tab;
    });

    app.module("events", function(modules, name) {
        // grab module(s)
        var $$ = modules.$$,
            core = modules.core,
            utils = modules.utils,
            globals = modules.globals;
        // get needed functions/data
        var last_open_popup = globals.last_open_popup;
        var which_animation_event = utils.which_animation_event,
            to_real_array = utils.to_real_array,
            create_path = utils.create_path;
        var footer = $$.footer,
            menu_popup = $$.menu_popup;
        var hide_last_open_popup = core.hide_last_open_popup,
            show_contact_nav = core.show_contact_nav,
            parse_delegation_data = core.parse_delegation_data,
            reset_navigation = core.reset_navigation,
            show_aboutme_section = core.show_aboutme_section,
            show_works_section = core.show_works_section,
            highlight_tab = core.highlight_tab;

        // local module vars
        var delegation_actions = {
            /**
             * @description [Resets the navigation tabs.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_tab_reset: function(target) {
                // reset the navigation
                reset_navigation();
                // highlight clicked nav-item
                target.classList.add("nav-current");
                // show the contact element tab if need be
                show_contact_nav();
            },
            /**
             * @description [Shows the about me section.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_home: function(target) {
                show_aboutme_section();
            },
            /**
             * @description [Shows the works section.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_works: function(target) {
                show_works_section();
            },
            /**
             * @description [Scrolls down to the footer and highlights it.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_contact: function(target) {
                //remove the footer animated class
                footer.classList.remove("footer-animate");
                // [source::credit](http://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page)
                // [source::api](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
                footer.scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                });
                footer.classList.add("footer-animate");
            },
            /**
             * @description [Shows hamburger menu popup menu.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            hamburger_menu: function(target) {
                // cancel action if the original target is a popup-item
                // "this" refers to the original_target element
                if (this.classList.contains("popup-item")) return;
                // show the menu
                menu_popup.classList.remove("hidden");
            },
            /**
             * @description [Stores the currently opened popup.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            cache_popup: function(target) {
                // set the menu popup as the last popup
                modules["globals"]["last_open_popup"] = menu_popup;
            },
            /**
             * @description [Shows the about me section when the home nav-item is clicked. Hides the works section.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_popup_home: function(target) {
                show_aboutme_section();
                // reset the navigation
                reset_navigation();
                // highlight the current tab
                highlight_tab(this);
                // show the contact element tab if need be
                show_contact_nav();
                hide_last_open_popup();
            },
            /**
             * @description [Shows the works when the home nav-item is clicked. Hides the about me section.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_popup_works: function(target) {
                show_works_section();
                // reset the navigation
                reset_navigation();
                // highlight the current tab
                highlight_tab(this);
                // show the contact element tab if need be
                show_contact_nav();
                hide_last_open_popup();
            },
            /**
             * @description [Scrolls down to the footer and highlights it. Invoking the "nav_contact" delegation action function.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_popup_contact: function(target) {
                delegation_actions.nav_contact.apply(
                    null,
                    to_real_array(arguments)
                );
            }
        };

        // Single app click event handler. (Uses delegation.)
        document.addEventListener("click", function(e) {
            // hide the last open popup
            hide_last_open_popup();
            // get the original target
            var original_target = e.target;
            // get the target path
            var element_path = create_path(e);
            // **NOTE: use raw loops to break out if needed
            // loop through the element path (target element parents)...
            for (var i = 0, l = element_path.length; i < l; i++) {
                // cache the current target element
                var target = element_path[i];
                // get the delegation data
                var delegation_data = parse_delegation_data(target),
                    actions = delegation_data.actions;
                // loop through + runs actions if povided
                for (var j = 0, ll = actions.length; j < ll; j++) {
                    // cache the current action call
                    var action = delegation_actions[actions[j].trim()];
                    // if the action call exists invoke it
                    if (action) action.call(original_target, target);
                }
                // check wether we need to stop bubbling
                if (delegation_data.stop) return;
            }
        });

        // when window loses focus hide any open popups
        window.addEventListener("blur", function(e) {
            // hide the last open popup
            hide_last_open_popup();
        });

        // show the contact tab when the BODY's vertical...
        // ...scrollbar is displayed
        window.addEventListener("resize", function(e) {
            show_contact_nav();
        });

        // listen to when the footer transition ends...
        // ...to remove the animation class
        document.addEventListener(which_animation_event(), function() {
            // remove the animation class
            footer.classList.remove("footer-animate");
        });
    });

    app.module("main", function(modules, name) {
        // grab modules
        var core = modules.core,
            utils = modules.utils,
            globals = modules.globals;
        // get needed functions/data
        var show_aboutme_section = core.show_aboutme_section,
            show_contact_nav = core.show_contact_nav,
            shortnames_2_emoticons = core.shortnames_2_emoticons;

        // show the about me section on loaded page
        show_aboutme_section();

        // check if the contact element button should be displayed this is dependant on the presence of the BODY's vertical scrollbar
        show_contact_nav();

        // convert the emoticon shortnames to images :)
        shortnames_2_emoticons();
    });

    // IIFE end
})(window);