app.module("globals", function(modules, name) {
    // define vars

    /**
     * @description [Array containing project objects.]
     * @type {Array}
     */
    var projects = [
        {
            title: "nodecliac",
            dates: "2019",
            description: "A simple definition based bash tab auto-completion tool.",
            url: "https://github.com/cgabriel5/nodecliac",
            langs: ["JavaScript", "Perl", "Bash"]
        },
        {
            title: "clone-repo",
            dates: "2019",
            description: "Clones a public GitHub, GitLab, or BitBucket repo from the CLI using a simple, unified API.",
            url: "https://github.com/cgabriel5/clone-repo",
            langs: ["JavaScript"]
        },
        {
            title: "devdocs",
            dates: "2018-Present",
            description: "A static website documentation generator.",
            url: "https://github.com/cgabriel5/devdocs",
            langs: ["HTML", "CSS", "JavaScript"]
        },
        {
            title: "wapplr-webpack-gulp",
            dates: "2018-Present",
            description: "A web development boilerplate and tooling solution that uses webpack and Gulp.",
            url: "https://github.com/cgabriel5/wapplr-webpack-gulp",
            langs: ["JavaScript"]
        },
        {
            title: "wapplr-webpack-simple",
            dates: "2018-Present",
            description: "A web development webpack starter.",
            url: "https://github.com/cgabriel5/wapplr-webpack-simple",
            langs: ["JavaScript", "CSS"]
        },
        {
            title: "wapplr",
            dates: "2017-Present",
            description: "A web development boilerplate and tooling solution.",
            url: "https://github.com/cgabriel5/wapplr",
            langs: ["JavaScript"]
        },
        {
            title: "random-string",
            dates: "2017-Present",
            description: "JavaScript library that creates random strings.",
            url: "https://github.com/cgabriel5/random-string",
            langs: ["JavaScript"]
        },
        {
            title: "InteractionJS (events)",
            dates: "2017-Present",
            description: "Small library for event handling.",
            url: "https://github.com/cgabriel5/interactionjs",
            langs: ["JavaScript"]
        },
        {
            title: "XHR-Wrapper (httpjs)",
            dates: "2017-Present",
            description: "A lightweight JavaScript XHR wrapper.",
            url: "https://github.com/cgabriel5/httpjs",
            langs: ["JavaScript"]
        },
        {
            title: "MonitorJS",
            dates: "2017-Present",
            description: "Small library that monitors an object.",
            url: "https://github.com/cgabriel5/monitorjs",
            langs: ["JavaScript"]
        },
        {
            title: "CSS-Syntax-Highlighter",
            dates: "2016-Present",
            description: "A CSS syntax highlighter.",
            url: "https://github.com/cgabriel5/css-syntax-highlighter",
            langs: ["JavaScript"]
        },
        {
            title: "CSS-Dupe-Finder",
            dates: "2016-Present",
            description: "Finds duplicate declarations within CSS code blocks.",
            url: "https://github.com/cgabriel5/css-dupe-finder",
            langs: ["JavaScript"]
        },
        {
            title: "Password-Generator",
            dates: "2015-Present",
            description: "A simple client-side password generator made in JavaScript.",
            url: "https://github.com/cgabriel5/password-generator",
            langs: ["HTML", "CSS", "JavaScript"]
        },
        {
            title: "FunnelJS",
            dates: "2015-Present",
            description: "Simple, standalone, lightweight JavaScript selector engine.",
            url: "https://github.com/cgabriel5/funneljs",
            langs: ["JavaScript"]
        },
        {
            title: "URL-Parser",
            dates: "2015-Present",
            description: "A JavaScript URL parser. Parses properly formatted URLs.",
            url: "https://github.com/cgabriel5/url-parser",
            langs: ["JavaScript"]
        }
    ];

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
        Bash: "#89e051",
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
