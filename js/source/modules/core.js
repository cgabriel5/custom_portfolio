app.module("core", function(modules, name) {
    // grab module(s)
    var $$ = modules.$$, utils = modules.utils, globals = modules.globals;
    // get needed functions/data
    var nav_contact = $$.nav_contact,
        nav_popup_contact = $$.nav_popup_contact,
        shortnames_elements = $$.shortnames_elements,
        aboutme_section = $$.aboutme_section,
        works_section = $$.works_section,
        projects_wrapper = $$.projects_wrapper,
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
     * @description [Open a new tab linking to the resume page.]
     * @return {Undefined}  [Nothing is returned.]
     */
    function show_resume() {
        // open a new tab to the resume page
        window.open("https://cgabriel5.github.io/resume/");
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
                stop: false,
                preventDefault: false
            };
        }
        var parts = delegation_data.trim().split(";");
        var actions = parts[0].trim().split(",");
        // remove the actions
        parts.shift();
        return {
            actions: actions,
            stop: Boolean(-~parts.indexOf("stop")),
            preventDefault: Boolean(-~parts.indexOf("pd"))
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

    function format(template, data) {
        return template.replace(/\{\{(.*?)\}\}/g, function(match) {
            // console.log(">>>>>", match);
            match = match.replace(/^\{\{|\}\}$/g, "");
            return data[match] ? data[match] : match;
        });
    }

    function build_lang_html(langs) {
        var template =
            '<div class="lang-wrapper"><div class="lang-color-dot" style="background: {{color}}"></div><span class="lang-color-text">{{lang}}</span></div>';
        var parts = [];
        // loop over all the langs
        for (var i = 0, l = langs.length; i < l; i++) {
            var lang = langs[i];
            // lookup the lang info
            var color = globals.colors[lang];
            console.log(">>>>", lang, color);
            var html = format(template, { color: color, lang: lang });
            parts.push(html);
        }
        console.log(">>>>", parts);
        return parts.join("");
    }

    function build_projects() {
        // console.log(">>>>>>>??");
        // get the projects
        var projects = globals.projects;
        var template = globals.templates.project;
        // fragment to store elements
        // var fragment = document.createDocumentFragment();
        var parts = [];
        // loop over each project
        for (var i = 0, l = projects.length; i < l; i++) {
            var project = projects[i];
            // var image = project.image, url = project.url, title = project.title;
            var langs = project.langs;
            // build the language HTML
            var lang_html = build_lang_html(langs);
            // add the html to the project object
            project.langs = lang_html;
            var f = format(template, project);
            // console.log(i, f);
            parts.push(f);
            // fragment.appendChild(f);
        }
        // console.log(parts.join(""), projects_wrapper);
        // inject the fragment into the DOM
        // projects_wrapper.appendChild(fragment);
        projects_wrapper.innerHTML = parts.join("");
    }

    // export to access in other modules
    this[name].show_contact_nav = show_contact_nav;
    this[name].reset_navigation = reset_navigation;
    this[name].shortnames_2_emoticons = shortnames_2_emoticons;
    this[name].hide_last_open_popup = hide_last_open_popup;
    this[name].show_aboutme_section = show_aboutme_section;
    this[name].show_works_section = show_works_section;
    this[name].show_resume = show_resume;
    this[name].parse_delegation_data = parse_delegation_data;
    this[name].highlight_tab = highlight_tab;
    this[name].build_projects = build_projects;
});
