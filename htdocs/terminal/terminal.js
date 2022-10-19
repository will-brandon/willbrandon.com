const elements = {
    container: document.getElementById("terminal-container"),
    wrapper: document.getElementById("terminal-wrapper"),
    currentLine: document.getElementById("current-line"),
    promptSpan: document.getElementById("prompt"),
    shellInput: document.getElementById("shell-input")
};

const USER = "guest";
const PROMPT_HTML = "<span class=\"ansi-aqua\">" + USER + "</span>@<span class=\"ansi-blue\">willbrandon.com</span>$ ";

const RESUME_URL = "https://drive.google.com/file/d/1x-i1_DwD_A3AJ54ItALXxGCLJHtY5mfU/preview";
const LINKEDIN_URL = "https://www.linkedin.com/in/will-brandon/";
const GITHUB_URL = "https://www.github.com/will-brandon/";
const EMAIL = "brandon.w@northeastern.edu";
const PHONE_NUMBER = "+1 (339) 223-7612";
const MAILING_ADDRESS = "#138036-RUB 7 Speare Pl Boston, MA 02115";

class TerminalUI {

    static init() {

        this.workingLine = '';

        window.onresize = event => this.resizeShellInput();
        elements.container.onmousedown = function (event) {
            event.preventDefault();
            elements.shellInput.focus();
        };
        elements.promptSpan.innerHTML = PROMPT_HTML;
        elements.shellInput.addEventListener("keypress", this.shellInputKeyDown);

        this.finish(); // Inits TerminalUI.currentLine

        this.resizeShellInput();

        Terminal.execute("welcome");

        this.scrollToBottom();
        elements.shellInput.focus();

        return this;
    }

    static resizeShellInput() {
        const newWidth = elements.container.offsetWidth - elements.promptSpan.offsetWidth - 50;
        elements.shellInput.style.width = newWidth + "px";
    }

    static shellInputKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            TerminalUI.submit();
        }
    }

    static clear() {
        elements.wrapper.innerHTML = "";
        elements.wrapper.append(elements.currentLine);
        elements.shellInput.focus();

        return this;
    }

    static push(text = "", color = "default", href= null, newTab=false, action = null) {
        this.workingLine += '<span class="ansi-' + color + '"\>';
        if (href != null) {
            this.workingLine += '<a href="' + href;

            if (newTab) {
                this.workingLine += '" target="_blank"';
            }

            if (action != null) {
                this.workingLine += '" onclick="' + action;
            }

            this.workingLine += '">' + text + "</a>";
        } else {
            this.workingLine += text;
        }
        this.workingLine += '</span>';

        return this;
    }

    static finish() {
        // If nothing was added, don't append.
        if (this.workingLine !== '<div class="line"><pre>' && this.workingLine != null) {

            if (this.imageDetailElement != null) {
                this.imageDetailElement.innerHTML += this.workingLine + '</span></div>';
            } else {
                elements.currentLine.remove();
                elements.wrapper.innerHTML += this.workingLine + '</span></div>';
                elements.wrapper.append(elements.currentLine);
            }
        }

        this.workingLine = '<div class="line"><pre>';

        return this;
    }

    static pushLine(line = "", color = "default", href = null, newTab=false, action = null) {
        this.push(line, color, href, newTab, action);
        this.finish();

        return this;
    }

    static pushCommandLink(text, command=text) {
        // The text is the command by default
        const action = "TerminalUI.executeAutomaticDecorated('" + command + "');";
        this.push(text, "default", "#", false, action);

        return this;
    }

    static pushLink(text, url) {
        this.push(text, "blue", url, true);

        return this;
    }

    static submit() {
        this.pushLine(PROMPT_HTML + elements.shellInput.value);
        Terminal.execute(elements.shellInput.value);
        elements.shellInput.value = "";

        this.scrollToBottom();
        elements.shellInput.focus();

        return this;
    }

    static close() {
        elements.currentLine.remove();

        return this;
    }

    static enterImageMode(url) {
        elements.currentLine.remove();

        const imgElement = document.createElement("img");
        imgElement.setAttribute("src", url);
        elements.wrapper.append(imgElement);

        this.imageDetailElement = document.createElement("div");
        this.imageDetailElement.classList.add("image-detail");
        elements.wrapper.append(this.imageDetailElement);

        elements.wrapper.append(elements.currentLine);
        this.scrollToBottom();

        return this;
    }

    static exitImageMode() {
        this.imageDetailElement = null;

        return this;
    }

    static scrollToBottom() {
        if (elements.wrapper.offsetHeight > elements.container.offsetHeight) {
            elements.container.scrollTo({top: elements.wrapper.offsetHeight - elements.container.offsetHeight});
        }

        return this;
    }

    static executeAutomaticDecorated(line) {
        elements.shellInput.value = line;
        this.submit();

        return this;
    }

}

class Terminal {

    static init() {
        TerminalUI.init();
    }

    static execute(line) {
        if (line !== "") {
            const tokens = line.split(" ").filter(token => token != "");
            const command = tokens[0];

            if (commands[command]) {
                commands[command].action(tokens.slice(1));
            } else {
                TerminalUI.pushLine("willshell: command not found: " + command + ". Try 'help'.", "red");
            }
        }
    }

}

const commands = {
    "about": {
        paramDesc: "\t ",
        desc: "Gives a brief summary of myself and my experience.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'about' program takes 0 arguments.", "red");
                return;
            }

            TerminalUI.enterImageMode("../resources/will.jpg");

            TerminalUI.pushLine("Will Brandon", "light-blue").pushLine();

            TerminalUI.pushLine("I am studying Computer Science at Northeastern").pushLine("University.");
            TerminalUI.pushLine();

            TerminalUI.pushLine("I have a lot of experience with web development,");
            TerminalUI.pushLine("mainly through personal projects. This site is");
            TerminalUI.push("hosted on a ").pushLink("Linux Apache server", "https://httpd.apache.org/");
            TerminalUI.push(" that I maintain.").finish().pushLine();

            TerminalUI.pushLine("I also develop iOS applications in Swift, and ");
            TerminalUI.pushLine("desktop applications in Java and C++.").pushLine();

            TerminalUI.pushLine("For more skills and projects, please see ");
            TerminalUI.push("my resume and GitHub. (type '").pushCommandLink("resume");
            TerminalUI.push("' or '").pushCommandLink("github").push("')").finish();

            TerminalUI.exitImageMode();
        }
    },
    "projects": {
        paramDesc: "\t ",
        desc: "Shows a list of my projects as well as relevant links.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'projects' program takes 0 arguments.", "red");
                return;
            }

            TerminalUI.pushLine().pushLine().pushLine("- PROJECTS -", "blue").pushLine().pushLine();

            Object.keys(projects).forEach(projectName => {
                const project = projects[projectName];
                const descriptionLines = project.descriptionLines;
                const skills = project.skills;

                TerminalUI.push("  " + project.displayName, "soft-blue").push(descriptionLines[0]).finish();

                for (let i = 1; i < descriptionLines.length; i++) {
                    TerminalUI.pushLine("\t\t" + descriptionLines[i]);
                }

                TerminalUI.pushLine();

                TerminalUI.push("\t\tSkills: ");

                for (let i = 0; i < skills.length; i++) {
                    TerminalUI.push(skills[i], "aqua");

                    if (i < skills.length - 1) {
                        TerminalUI.push(", ");
                    }
                }

                TerminalUI.finish();

                TerminalUI.pushLine();
                TerminalUI.push("\t\tType '", "light-blue").pushCommandLink("project " + projectName);
                TerminalUI.push("' to view the project", "light-blue").finish();

                TerminalUI.pushLine().pushLine().pushLine();
            });
        }
    },
    "project": {
        paramDesc: "[name] ",
        desc: "Opens the given project in a new tab.",
        action: function(args) {
            if (args.length < 1) {
                TerminalUI.pushLine("The 'project' program requires a project name argument.", "red");
                return;
            } else if (args.length > 1) {
                TerminalUI.pushLine("The 'project' program only takes 1 argument.", "red");
                return;
            }

            const projectName = args[0].toLowerCase();

            if (projects.hasOwnProperty(projectName)) {
                window.open(projects[projectName].link, "__blank");
            } else {
                TerminalUI.pushLine();
                TerminalUI.pushLine("I don't have a project called '" + projectName + "'. Sorry.", "red");
                TerminalUI.pushLine().pushLine("Try one of these:", "light-blue").pushLine();

                Object.keys(projects).forEach(projectName => {
                    TerminalUI.push("  " + projects[projectName].displayName, "soft-blue");
                    TerminalUI.push(" type ").pushCommandLink("project " + projectName).finish();
                });

                TerminalUI.pushLine();
            }
        }
    },
    "resume": {
        paramDesc: "\t ",
        desc: "Opens my resume in a new tab.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'resume' program takes 0 arguments.", "red");
                return;
            }

            window.open(RESUME_URL, "__blank");
        }
    },
    "linkedin": {
        paramDesc: "\t ",
        desc: "Opens my LinkedIn profile in a new tab.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'linkedin' program takes 0 arguments.", "red");
                return;
            }

            window.open(LINKEDIN_URL, "__blank");
        }
    },
    "github": {
        paramDesc: "\t ",
        desc: "Opens my GitHub in a new tab.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'github' program takes 0 arguments.", "red");
                return;
            }

            window.open(GITHUB_URL, "__blank");
        }
    },
    "contact": {
        paramDesc: "\t ",
        desc: "Displays my contact information.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'contact' program takes 0 arguments.", "red");
                return;
            }

            TerminalUI.pushLine();

            TerminalUI.push("Phone\t");
            TerminalUI.push(PHONE_NUMBER);
            TerminalUI.finish();

            TerminalUI.push("Email\t");
            TerminalUI.push(EMAIL);
            TerminalUI.finish();

            TerminalUI.push("Mail\t");
            TerminalUI.push(MAILING_ADDRESS);
            TerminalUI.finish();

            TerminalUI.pushLine();
        }
    },
    "email": {
        paramDesc: "\t ",
        desc: "Begins a draft addressed to my primary email.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'email' program takes 0 arguments.", "red");
                return;
            }

            window.open("mailto: " + EMAIL, "__blank");
        }
    },
    "help": {
        paramDesc: "\t\t ",
        desc: "Displays available commands.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'help' program takes 0 arguments.", "red");
                return;
            }

            TerminalUI.pushLine();
            TerminalUI.pushLine("Type or click some of these commands:", "light-blue");
            TerminalUI.pushLine();

            TerminalUI.pushCommandLink("about").push("    ")
            TerminalUI.pushCommandLink("projects").push("    ");
            TerminalUI.pushCommandLink("linkedin").push("    ");
            TerminalUI.pushCommandLink("github").push("    ");
            TerminalUI.pushCommandLink("resume").finish();

            TerminalUI.pushLine();
            TerminalUI.push("Or type '").pushCommandLink("man");
            TerminalUI.push("' for a brief manual of more commands.").finish();
            TerminalUI.pushLine();
        }
    },
    "man": {
        paramDesc: "[commands] ",
        desc: "Displays available commands and descriptions.",
        action: function(args) {

            TerminalUI.pushLine();

            if (args.length === 0) {
                TerminalUI.pushLine("  Manual", "light-blue").pushLine();

                args = Object.keys(commands);
            }

            args.forEach(arg => {
                if (commands.hasOwnProperty(arg)) {
                    TerminalUI.push("  " + arg).push(" " + commands[arg].paramDesc).push(commands[arg].desc);
                    TerminalUI.finish();
                } else {
                    TerminalUI.pushLine("Cannot get description of nonexistent command '" + arg + "'.", "red");
                }
            });

            TerminalUI.pushLine();
        }
    },
    "clear": {
        paramDesc: "\t ",
        desc: "Clears the console.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'clear' program takes 0 arguments.", "red");
                return;
            }

            TerminalUI.clear();
        }
    },
    "whoami": {
        paramDesc: "\t ",
        desc: "Displays the active user.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'whoami' program takes 0 arguments.", "red");
                return;
            }

            TerminalUI.pushLine(USER);
        }
    },
    "echo": {
        paramDesc: "[strings] ",
        desc: "Prints the given strings to the console.",
        action: function(args) {
            if (args.length > 0) {
                args.forEach(arg => TerminalUI.push(arg + " "));
                TerminalUI.finish();
            } else {
                TerminalUI.pushLine();
            }
        }
    },
    "welcome": {
        paramDesc: "\t ",
        desc: "Displays the welcome message.",
        action: function(args) {
            if (args.length > 0) {
                TerminalUI.pushLine("The 'welcome' program takes 0 arguments.", "red");
                return;
            }

            TerminalUI.pushLine("===============================================================================");
            TerminalUI.pushLine();

            TerminalUI.push(" [[    [[ [[ [[     [[    ", "light-blue");
            TerminalUI.push(" [[[[[\\ [[[[[\\   //\\\\  [[\\  [[ [[[[\\  /[[[[\\ [[\\  [[", "sage");
            TerminalUI.finish();

            TerminalUI.push(" [[ /\\ [[ [[ [[     [[    ", "light-blue");
            TerminalUI.push(" [[__// [[__//  //__\\\\ [[\\\\ [[ [[  [[ [[  [[ [[\\\\ [[", "sage");
            TerminalUI.finish();

            TerminalUI.push(" [[//\\\\[[ [[ [[     [[    ", "light-blue");
            TerminalUI.push(" [[  \\\\ [[  \\\\  [[  [[ [[ \\\\[[ [[  [[ [[  [[ [[ \\\\[[", "sage");
            TerminalUI.finish();

            TerminalUI.push(" [[/  \\[[ [[ [[[[[[ [[[[[[", "light-blue");
            TerminalUI.push(" [[[[[/ [[   \\[ [[  [[ [[  \\[[ [[[[/  \\[[[[/ [[  \\[[", "sage");
            TerminalUI.finish().pushLine();

            TerminalUI.pushLine("===============================================================================");
            TerminalUI.pushLine();

            TerminalUI.pushLine("Will Brandon", "blue");
            TerminalUI.pushLine("Northeastern University, Khoury College of Computer Sciences", "sage");

            TerminalUI.pushLine().pushLine();

            Terminal.execute("help");

            TerminalUI.pushLine();
        }
    },
    "exit": {
        paramDesc: "[code]\t ",
        desc: "Ends your shell session on my website. :(",
        action: function(args) {
            if (args.length > 1) {
                TerminalUI.pushLine("The 'exit' program only takes 1 argument.", "red");
                return;
            }

            const exitCode = args.length == 1 ? parseInt(args[0]) : 0;

            if (isNaN(exitCode)) {
                TerminalUI.pushLine("Exit code must be an integer.", "red");
                return;
            }

            TerminalUI.pushLine("Exiting with code: " + exitCode).pushLine();

            TerminalUI.pushLine("Goodbye. :(").pushLine("So sad to see you leaving already.");
            TerminalUI.pushLine("Please consider reaching out!");

            Terminal.execute("contact");

            TerminalUI.push("Click ").push("this", "blue", "");
            TerminalUI.push(" to use the site again.").finish().pushLine();

            TerminalUI.pushLine("[Process completed]");

            TerminalUI.close();
        }
    }
}

projects = {
    "dayplans": {
        link: "https://github.com/will-brandon/ios-dayplans",
        displayName: "DayPlans\t",
        skills: ["Swift Programming", "Xcode", "iOS development"],
        descriptionLines: [
            "An iOS application designed to for elaborate daily",
            "schedules with notifications. It is a Google Calendar",
            "alternative with support for more detailed automatic",
            "scheduling options."
        ]
    },
    "imgprocessor": {
        link: "https://github.com/will-brandon/image-processor",
        displayName: "ImgProcessor\t",
        skills: ["Java", "JUnit Testing", "Object Oriented Design"],
        descriptionLines: [
            "An image processing application that supports both a",
            "GUI mode and command line mode. Images can be imported,",
            "filtered, and exported. (Think Photoshop but a bit",
            "simpler.)"
        ]
    },
    "arraydemo": {
        link: "https://projects.wbrandon.com/arraydemo/",
        displayName: "ArrayDemo\t",
        skills: ["PHP", "HTML", "CSS", "JavaScript", "Apache Server", "Linux"],
        descriptionLines: [
            "A web tool I designed to be used by beginner programmers",
            "to understand the concept of multidimensional arrays. My",
            "high school computer science teacher still uses the tool",
            "in her lectures every year."
        ]
    }
};

window.onload = Terminal.init;
