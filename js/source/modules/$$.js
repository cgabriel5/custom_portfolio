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
    this[name]["projects_wrapper"] = $("projects-wrapper");
});
