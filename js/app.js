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
    app.module("libs", function(modules, name) {
        // init FastClickJS
        if ("addEventListener" in document) {
            FastClick.attach(document.body);
        }
    }, "interactive");
    app.module("globals", function(modules, name) {
        // define vars
        /**
         * @description [Array containing project objects.]
         * @type {Array}
         */
        var projects = [{
            title: "devdocs",
            dates: "2018-Present",
            description: "A static website documentation generator.",
            url: "https://github.com/cgabriel5/devdocs",
            langs: ["JavaScript"]
        }, {
            title: "wapplr-webpack-gulp",
            dates: "2018-Present",
            description: "A web development boilerplate and tooling solution that uses webpack and Gulp.",
            url: "https://github.com/cgabriel5/wapplr-webpack-gulp",
            langs: ["JavaScript"]
        }, {
            title: "wapplr-webpack-simple",
            dates: "2018-Present",
            description: "A web development webpack starter.",
            url: "https://github.com/cgabriel5/wapplr-webpack-simple",
            langs: ["JavaScript", "CSS"]
        }, {
            title: "wapplr",
            dates: "2017-Present",
            description: "A web development boilerplate and tooling solution.",
            url: "https://github.com/cgabriel5/wapplr",
            langs: ["JavaScript"]
        }, {
            title: "random-string",
            dates: "2017-Present",
            description: "JavaScript library that creates random strings.",
            url: "https://github.com/cgabriel5/random-string",
            langs: ["JavaScript"]
        }, {
            title: "InteractionJS (events)",
            dates: "2017-Present",
            description: "Small library for event handling.",
            url: "https://github.com/cgabriel5/interactionjs",
            langs: ["JavaScript"]
        }, {
            title: "XHR-Wrapper (httpjs)",
            dates: "2017-Present",
            description: "A lightweight JavaScript XHR wrapper.",
            url: "https://github.com/cgabriel5/httpjs",
            langs: ["JavaScript"]
        }, {
            title: "MonitorJS",
            dates: "2017-Present",
            description: "Small library that monitors an object.",
            url: "https://github.com/cgabriel5/monitorjs",
            langs: ["JavaScript"]
        }, {
            title: "CSS-Syntax-Highlighter",
            dates: "2016-Present",
            description: "A CSS syntax highlighter.",
            url: "https://github.com/cgabriel5/css-syntax-highlighter",
            langs: ["JavaScript"]
        }, {
            title: "CSS-Dupe-Finder",
            dates: "2016-Present",
            description: "Finds duplicate declarations within CSS code blocks.",
            url: "https://github.com/cgabriel5/css-dupe-finder",
            langs: ["JavaScript"]
        }, {
            title: "Password-Generator",
            dates: "2015-Present",
            description: "A simple client-side password generator made in JavaScript.",
            url: "https://github.com/cgabriel5/password-generator",
            langs: ["HTML", "CSS", "JavaScript"]
        }, {
            title: "FunnelJS",
            dates: "2015-Present",
            description: "Simple, standalone, lightweight JavaScript selector engine.",
            url: "https://github.com/cgabriel5/funneljs",
            langs: ["JavaScript"]
        }, {
            title: "URL-Parser",
            dates: "2015-Present",
            description: "A JavaScript URL parser. Parses properly formatted URLs.",
            url: "https://github.com/cgabriel5/url-parser",
            langs: ["JavaScript"]
        }];
        /**
         * @description [Project HTML templates.]
         * @type {Object}
         */
        var templates = {
            project: '<div class="project-item-wrapper"><div class="project-title"><a href="{{url}}" target="_blank" class="project-link">{{title}}</a></div><div class="project-description">{{description}}</div><div class="project-languages-wrapper">{{langs}}</div></div>',
            language: '<div class="lang-wrapper"><div class="lang-color-dot" style="background: {{color}}"></div><span class="lang-color-text">{{lang}}</span></div>'
        };
        /**
         * @description [GitHub language colors.]
         * @type {Object}
         * @source [https://github.com/ozh/github-colors]
         */
        var colors = {
            "1C Enterprise": "#814CCC",
            ABAP: "#E8274B",
            ActionScript: "#882B0F",
            Ada: "#02f88c",
            Agda: "#315665",
            "AGS Script": "#B9D9FF",
            Alloy: "#64C800",
            "Alpine Abuild": null,
            AMPL: "#E6EFBB",
            ANTLR: "#9DC3FF",
            Apex: null,
            "API Blueprint": "#2ACCA8",
            APL: "#5A8164",
            "Apollo Guidance Computer": "#0B3D91",
            AppleScript: "#101F1F",
            Arc: "#aa2afe",
            Arduino: "#bd79d1",
            "ASN.1": "#aeead0",
            ASP: "#6a40fd",
            AspectJ: "#a957b0",
            Assembly: "#6E4C13",
            ATS: "#1ac620",
            Augeas: null,
            AutoHotkey: "#6594b9",
            AutoIt: "#1C3552",
            Awk: null,
            Batchfile: "#C1F12E",
            Befunge: null,
            Bison: "#6A463F",
            BitBake: null,
            BlitzBasic: null,
            BlitzMax: "#cd6400",
            Bluespec: null,
            Boo: "#d4bec1",
            Brainfuck: "#2F2530",
            Brightscript: null,
            Bro: null,
            C: "#555555",
            "C#": "#178600",
            "C++": "#f34b7d",
            "C2hs Haskell": null,
            "Cap'n Proto": null,
            CartoCSS: null,
            Ceylon: null,
            Chapel: "#8dc63f",
            Charity: null,
            ChucK: null,
            Cirru: "#ccccff",
            Clarion: "#db901e",
            Clean: "#3F85AF",
            Click: "#E4E6F3",
            CLIPS: null,
            Clojure: "#db5855",
            CMake: null,
            COBOL: null,
            CoffeeScript: "#244776",
            ColdFusion: "#ed2cd6",
            "ColdFusion CFC": "#ed2cd6",
            "Common Lisp": "#3fb68b",
            "Component Pascal": "#B0CE4E",
            Cool: null,
            Coq: null,
            Crystal: "#776791",
            Csound: null,
            "Csound Document": null,
            "Csound Score": null,
            CSS: "#563d7c",
            Cucumber: "#5B2063",
            Cuda: "#3A4E3A",
            Cycript: null,
            Cython: null,
            D: "#ba595e",
            Dart: "#00B4AB",
            "DIGITAL Command Language": null,
            DM: "#447265",
            Dogescript: "#cca760",
            DTrace: null,
            Dylan: "#6c616e",
            E: "#ccce35",
            Eagle: "#814C05",
            eC: "#913960",
            ECL: "#8a1267",
            ECLiPSe: null,
            Eiffel: "#946d57",
            EJS: "#a91e50",
            Elixir: "#6e4a7e",
            Elm: "#60B5CC",
            "Emacs Lisp": "#c065db",
            EmberScript: "#FFF4F3",
            EQ: "#a78649",
            Erlang: "#B83998",
            "F#": "#b845fc",
            Factor: "#636746",
            Fancy: "#7b9db4",
            Fantom: "#dbded5",
            "Filebench WML": null,
            Filterscript: null,
            fish: null,
            FLUX: "#88ccff",
            Forth: "#341708",
            FORTRAN: "#4d41b1",
            FreeMarker: "#0050b2",
            Frege: "#00cafe",
            "Game Maker Language": "#8fb200",
            GAMS: null,
            GAP: null,
            GAS: null,
            "GCC Machine Description": null,
            GDB: null,
            GDScript: null,
            Genshi: null,
            "Gentoo Ebuild": null,
            "Gentoo Eclass": null,
            GLSL: null,
            Glyph: "#e4cc98",
            Gnuplot: "#f0a9f0",
            Go: "#375eab",
            Golo: "#88562A",
            Gosu: "#82937f",
            Grace: null,
            "Grammatical Framework": "#79aa7a",
            Groff: "#ecdebe",
            Groovy: "#e69f56",
            "Groovy Server Pages": null,
            Hack: "#878787",
            Haml: "#ECE2A9",
            Handlebars: "#01a9d6",
            Harbour: "#0e60e3",
            Haskell: "#29b544",
            Haxe: "#df7900",
            HCL: null,
            HLSL: null,
            HTML: "#e44b23",
            Hy: "#7790B2",
            HyPhy: null,
            IDL: "#a3522f",
            Idris: null,
            "IGOR Pro": null,
            "Inform 7": null,
            "Inno Setup": null,
            Io: "#a9188d",
            Ioke: "#078193",
            Isabelle: "#FEFE00",
            "Isabelle ROOT": null,
            J: "#9EEDFF",
            Jasmin: null,
            Java: "#b07219",
            "Java Server Pages": null,
            JavaScript: "#f1e05a",
            JFlex: "#DBCA00",
            JSONiq: "#40d47e",
            JSX: null,
            Julia: "#a270ba",
            "Jupyter Notebook": "#DA5B0B",
            KiCad: null,
            Kotlin: "#F18E33",
            KRL: "#28431f",
            LabVIEW: null,
            Lasso: "#999999",
            Latte: "#A8FF97",
            Lean: null,
            Less: "#A1D9A1",
            Lex: "#DBCA00",
            LFE: "#004200",
            LilyPond: null,
            Limbo: null,
            "Literate Agda": null,
            "Literate CoffeeScript": null,
            "Literate Haskell": null,
            LiveScript: "#499886",
            LLVM: "#185619",
            Logos: null,
            Logtalk: null,
            LOLCODE: "#cc9900",
            LookML: "#652B81",
            LoomScript: null,
            LSL: "#3d9970",
            Lua: "#000080",
            M: null,
            M4: null,
            M4Sugar: null,
            Makefile: "#427819",
            Mako: null,
            Mask: "#f97732",
            Mathematica: null,
            Matlab: "#bb92ac",
            Max: "#c4a79c",
            MAXScript: "#00a6a6",
            Mercury: "#ff2b2b",
            Metal: "#8f14e9",
            MiniD: null,
            Mirah: "#c7a938",
            Modelica: null,
            "Modula-2": null,
            "Module Management System": null,
            Monkey: null,
            Moocode: null,
            MoonScript: null,
            MTML: "#b7e1f4",
            MUF: null,
            mupad: null,
            Myghty: null,
            NCL: "#28431f",
            Nemerle: "#3d3c6e",
            nesC: "#94B0C7",
            NetLinx: "#0aa0ff",
            "NetLinx+ERB": "#747faa",
            NetLogo: "#ff6375",
            NewLisp: "#87AED7",
            Nginx: "#9469E9",
            Nimrod: "#37775b",
            Nit: "#009917",
            Nix: "#7e7eff",
            NSIS: null,
            Nu: "#c9df40",
            NumPy: "#9C8AF9",
            "Objective-C": "#438eff",
            "Objective-C++": "#6866fb",
            "Objective-J": "#ff0c5a",
            OCaml: "#3be133",
            Omgrofl: "#cabbff",
            ooc: "#b0b77e",
            Opa: null,
            Opal: "#f7ede0",
            OpenCL: null,
            "OpenEdge ABL": null,
            "OpenRC runscript": null,
            OpenSCAD: null,
            Ox: null,
            Oxygene: "#cdd0e3",
            Oz: "#fab738",
            Pan: "#cc0000",
            Papyrus: "#6600cc",
            Parrot: "#f3ca0a",
            "Parrot Assembly": null,
            "Parrot Internal Representation": null,
            Pascal: "#E3F171",
            PAWN: "#dbb284",
            Perl: "#0298c3",
            Perl6: "#0000fb",
            PHP: "#4F5D95",
            PicoLisp: null,
            PigLatin: "#fcd7de",
            Pike: "#005390",
            PLpgSQL: null,
            PLSQL: "#dad8d8",
            PogoScript: "#d80074",
            Pony: null,
            PostScript: "#da291c",
            "POV-Ray SDL": null,
            PowerBuilder: "#8f0f8d",
            PowerShell: null,
            Processing: "#0096D8",
            Prolog: "#74283c",
            "Propeller Spin": "#7fa2a7",
            Puppet: "#302B6D",
            "Pure Data": "#91de79",
            PureBasic: "#5a6986",
            PureScript: "#1D222D",
            Python: "#3572A5",
            QMake: null,
            QML: "#44a51c",
            R: "#198CE7",
            Racket: "#22228f",
            "Ragel in Ruby Host": "#9d5200",
            RAML: "#77d9fb",
            REALbasic: null,
            Rebol: "#358a5b",
            Red: "#f50000",
            Redcode: null,
            "Ren'Py": "#ff7f7f",
            RenderScript: null,
            REXX: null,
            RobotFramework: null,
            Rouge: "#cc0088",
            Ruby: "#701516",
            RUNOFF: "#665a4e",
            Rust: "#dea584",
            Sage: null,
            SaltStack: "#646464",
            SAS: "#B34936",
            Sass: "#CF649A",
            Scala: "#c22d40",
            Scheme: "#1e4aec",
            Scilab: null,
            SCSS: "#CF649A",
            Self: "#0579aa",
            Shell: "#89e051",
            ShellSession: null,
            Shen: "#120F14",
            Slash: "#007eff",
            Slim: "#ff8f77",
            Smali: null,
            Smalltalk: "#596706",
            Smarty: null,
            SMT: null,
            SourcePawn: "#5c7611",
            SQF: "#3F3F3F",
            SQLPL: null,
            Squirrel: "#800000",
            "SRecode Template": "#348a34",
            Stan: "#b2011d",
            "Standard ML": "#dc566d",
            Stata: null,
            SuperCollider: "#46390b",
            Swift: "#ffac45",
            SystemVerilog: "#DAE1C2",
            Tcl: "#e4cc98",
            Tcsh: null,
            Terra: "#00004c",
            TeX: "#3D6117",
            Thrift: null,
            TLA: null,
            Turing: "#cf142b",
            TXL: null,
            TypeScript: "#2b7489",
            "Unified Parallel C": "#4e3617",
            Uno: null,
            UnrealScript: "#a54c4d",
            UrWeb: null,
            Vala: "#fbe5cd",
            VCL: null,
            Verilog: "#b2b7f8",
            VHDL: "#adb2cb",
            VimL: "#199f4b",
            "Visual Basic": "#945db7",
            Volt: "#1F1F1F",
            Vue: "#2c3e50",
            "Web Ontology Language": "#9cc9dd",
            WebIDL: null,
            wisp: "#7582D1",
            X10: "#4B6BEF",
            xBase: "#403a40",
            XC: "#99DA07",
            Xojo: null,
            XPages: null,
            XProc: null,
            XQuery: "#5232e7",
            XS: null,
            XSLT: "#EB8CEB",
            Xtend: null,
            Yacc: "#4B6C4B",
            Zephir: "#118f9e",
            Zimpl: null
        };
        // export to access in other modules
        this[name]["last_open_popup"] = null;
        this[name]["projects"] = projects;
        this[name]["templates"] = templates;
        this[name]["colors"] = colors;
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
            return document.body.scrollHeight > window.innerHeight;
        }
        /**
         * @description [Formats template with provided data object.]
         * @param  {String} template [The template to use.]
         * @param  {Object} data     [The object containing the data to replace placeholders with.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function format(template, data) {
            return template.replace(/\{\{(.*?)\}\}/g, function(match) {
                match = match.replace(/^\{\{|\}\}$/g, "");
                return data[match] ? data[match] : match;
            });
        }
        // export to access in other modules
        this[name].to_real_array = to_real_array;
        this[name].which_animation_event = which_animation_event;
        this[name].create_path = create_path;
        this[name].is_vertical_scrollbar_visible = is_vertical_scrollbar_visible;
        this[name].format = format;
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
        this[name]["shortnames_elements"] = to_real_array($class("emoticon-shortname"));
        this[name]["nav_contact"] = $("nav-contact");
        this[name]["nav_popup_contact"] = $("nav-popup-contact");
        this[name]["footer"] = $class("footer-wrapper")[0];
        this[name]["aboutme_section"] = $("section-aboutme-wrapper");
        this[name]["works_section"] = $("section-works-wrapper");
        this[name]["menu_popup"] = $("popup-menu-wrapper");
        this[name]["projects_wrapper"] = $("projects-wrapper");
        this[name]["emojione-attribution-wrapper"] = $("emojione-attribution-wrapper");
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
            projects_wrapper = $$.projects_wrapper,
            attribution = $$["emojione-attribution-wrapper"],
            is_vertical_scrollbar_visible = utils.is_vertical_scrollbar_visible,
            to_real_array = utils.to_real_array,
            format = utils.format,
            create_path = utils.create_path;
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
            to_real_array(document.getElementsByClassName("nav-item"))
                .forEach(function(nav_item) {
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
         * @description [Show the emoji attribution.]
         * @return {Undefined} [Nothing is returned.]
         */
        function show_attribution() {
            // hide the element.
            attribution.classList.add("hidden");
            // show the element.
            setTimeout(function() {
                attribution.classList.remove("hidden");
            }, 0);
        }
        /**
         * @description [Parse provided delegation data.]
         * @param {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Object}  [Returns an object containing its actions and or bubbling.]
         */
        function parse_delegation_data(target) {
            // get the delegation data
            var delegation_data = target.getAttribute("data-delegation");
            // if no delegation data is provided return default object
            if (!delegation_data) {
                return {
                    actions: [],
                    stop: false,
                    preventDefault: false
                };
            }
            var parts = delegation_data.trim()
                .split(";");
            var actions = parts[0].trim()
                .split(",");
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
            // Quick fix patch: If the provided target does not have the needed
            // attributes check the parents for it.
            if (!target_element.getAttribute("data-syncid")) {
                var element_path = create_path({
                    target: target_element
                });
                var delegate = null;
                // Check the parent elements.
                for (var i = 0, l = element_path.length; i < l; i++) {
                    // Cache current loop item.
                    var parent = element_path[i];
                    if (parent.getAttribute("data-syncid")) {
                        delegate = parent;
                        break;
                    }
                }
                // If the delegate parent exists reset the var.
                if (delegate) target_element = delegate;
            }
            // highlight clicked nav-item
            document.getElementById(target_element.getAttribute("data-syncid"))
                .classList.add("nav-current");
        }
        /**
         * @description [Builds the HTML languages for each project.]
         * @param  {Array} langs [The list of languages used for the project.]
         * @return {String}       [The created HTML string.]
         */
        function build_lang_html(langs) {
            // grab template + colors
            var template = globals.templates.language,
                colors = globals.colors;
            // define vars
            var parts = [],
                lang, color;
            // loop over all the langs
            for (var i = 0, l = langs.length; i < l; i++) {
                // cache the current language
                lang = langs[i];
                // lookup the lang info
                color = colors[lang];
                // create the HTML string + add the HTML string to the parts array
                parts.push(format(template, {
                    color: color,
                    lang: lang
                }));
            }
            return parts.join("");
        }
        /**
         * @description [Builds the projects using the globals.projects array and then injects them into the page.]
         * @return {Undefined}  [Nothing is returned.]
         */
        function build_projects() {
            // get the projects
            var projects = globals.projects,
                template = globals.templates.project;
            var parts = [],
                project, langs, lang_html;
            // loop over each project
            for (var i = 0, l = projects.length; i < l; i++) {
                // cache the current project
                project = projects[i];
                // get the project languages
                langs = project.langs;
                // build the language HTML
                lang_html = build_lang_html(langs);
                // add the HTML to the project object, overriding the langs prop
                project.langs = lang_html;
                // create the HTML string + add the string to the parts array
                parts.push(format(template, project));
            }
            // inject the fragment into the DOM
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
        this[name].show_attribution = show_attribution;
        this[name].parse_delegation_data = parse_delegation_data;
        this[name].highlight_tab = highlight_tab;
        this[name].build_projects = build_projects;
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
        var attribution = $$["emojione-attribution-wrapper"];
        var hide_last_open_popup = core.hide_last_open_popup,
            show_contact_nav = core.show_contact_nav,
            parse_delegation_data = core.parse_delegation_data,
            reset_navigation = core.reset_navigation,
            show_aboutme_section = core.show_aboutme_section,
            show_works_section = core.show_works_section,
            show_resume = core.show_resume,
            show_attribution = core.show_attribution,
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
                // show the emoji attribution.
                show_attribution();
            },
            /**
             * @description [Shows the about me section.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_home: function(target) {
                // Hide the attribution.
                attribution.classList.add("hidden");
                // show the emoji attribution.
                show_aboutme_section();
            },
            /**
             * @description [Shows the works section.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_works: function(target) {
                // Hide the emoji attribution.
                attribution.classList.add("hidden");
                show_works_section();
            },
            /**
             * @description [Shows the works section.]
             * @param  {EventTargetElement} target [Browser provided clicked target element.]
             * @return {Undefined}  [Nothing is returned.]
             */
            nav_resume: function(target) {
                show_resume();
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
                delegation_actions.nav_contact.apply(null, to_real_array(arguments));
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
                // check whether to prevent browser's default action
                if (delegation_data.preventDefault) e.preventDefault();
                // check wether we need to stop bubbling
                if (delegation_data.stop) return;
            }
        });
        // show the contact tab when the BODY's vertical scrollbar is displayed
        window.addEventListener("resize", function(e) {
            show_contact_nav();
        });
        // listen to when the footer transition ends to remove the animation class
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
            show_attribution = core.show_attribution,
            shortnames_2_emoticons = core.shortnames_2_emoticons,
            build_projects = core.build_projects;
        // show the about me section on loaded page
        show_aboutme_section();
        // check if the contact element button should be displayed this is dependant on the presence of the BODY's vertical scrollbar
        show_contact_nav();
        // show emoji attribution.
        setTimeout(function() {
            show_attribution();
        }, 200);
        // convert the emoticon shortnames to images :)
        shortnames_2_emoticons();
        // build the projects
        build_projects();
    });
    // IIFE end
})(window);