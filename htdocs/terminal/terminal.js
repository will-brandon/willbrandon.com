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
        elements.shellInput.focus();

        this.finish(); // Inits TerminalUI.currentLine

        this.resizeShellInput();

        Terminal.execute("welcome");
        this.scrollToBottom();
    }

    static resizeShellInput() {
        const newWidth = elements.container.offsetWidth - elements.promptSpan.offsetWidth - 30;
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
    }

    static push(text = "", color = "default", href= null, action = null) {
        this.workingLine += '<span class="ansi-' + color + '"\>';
        if (href != null) {
            this.workingLine += '<a href="' + href;

            if (action != null) {
                this.workingLine += '" onclick="' + action;
            }

            this.workingLine += '">' + text + "</a>";
        } else {
            this.workingLine += text;
        }
        this.workingLine += '</span>';
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
                elements.shellInput.focus();
            }
        }

        this.workingLine = '<div class="line"><pre>';
    }

    static pushLine(line = "", color = "default", href = null, action = null) {
        this.push(line, color, href, action);
        this.finish();
    }

    static submit() {
        this.pushLine(PROMPT_HTML + elements.shellInput.value);
        Terminal.execute(elements.shellInput.value);
        elements.shellInput.value = "";

        this.scrollToBottom();
    }

    static close() {
        elements.currentLine.remove();
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
    }

    static exitImageMode() {
        this.imageDetailElement = null;
    }

    static scrollToBottom() {
        if (elements.wrapper.offsetHeight > elements.container.offsetHeight) {
            elements.container.scrollTo({top: elements.wrapper.offsetHeight - elements.container.offsetHeight});
        }
    }

    static executeAutomaticDecorated(line) {
        elements.shellInput.value = line;
        this.submit();
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
        paramDesc: "\t",
        desc: "Gives a brief summary of myself and my experience.",
        action: function(args) {
            TerminalUI.enterImageMode("../resources/will.jpg");
            TerminalUI.pushLine("Will Brandon", "light-blue");

            TerminalUI.pushLine();

            TerminalUI.pushLine("I am studying Computer Science at Northeastern");
            TerminalUI.pushLine("University.");

            TerminalUI.pushLine();

            TerminalUI.pushLine("I have a lot of experience with web development,");
            TerminalUI.pushLine("mainly through personal projects. This site is");

            TerminalUI.push("hosted on a ");
            TerminalUI.push("Linux Apache server", "blue", "https://httpd.apache.org/");
            TerminalUI.push(" that I maintain.");
            TerminalUI.finish();
            TerminalUI.pushLine();

            TerminalUI.pushLine("I also develop iOS applications in Swift, and ");
            TerminalUI.pushLine("desktop applications in Java and C++.");

            TerminalUI.pushLine();

            TerminalUI.pushLine("For more skills and projects, please see ");
            TerminalUI.push("my resume and GitHub. (type '");
            TerminalUI.push("resume", "default", "#", "TerminalUI.executeAutomaticDecorated('resume');");
            TerminalUI.push("' or '");
            TerminalUI.push("github", "default", "#", "TerminalUI.executeAutomaticDecorated('github');");
            TerminalUI.push("')");
            TerminalUI.finish();

            TerminalUI.exitImageMode();
        }
    },
    "resume": {
        paramDesc: "\t",
        desc: "Opens my resume in a new tab.",
        action: function(args) {
            window.open(RESUME_URL, "__blank");
        }
    },
    "linkedin": {
        paramDesc: "\t",
        desc: "Opens my LinkedIn profile in a new tab.",
        action: function(args) {
            window.open(LINKEDIN_URL, "__blank");
        }
    },
    "github": {
        paramDesc: "\t",
        desc: "Opens my GitHub in a new tab.",
        action: function(args) {
            window.open(GITHUB_URL, "__blank");
        }
    },
    "contact": {
        paramDesc: "\t",
        desc: "Displays my contact information.",
        action: function(args) {
            TerminalUI.pushLine();

            TerminalUI.push("Phone\t", "soft-blue");
            TerminalUI.push(PHONE_NUMBER);
            TerminalUI.finish();

            TerminalUI.push("Email\t", "soft-blue");
            TerminalUI.push(EMAIL);
            TerminalUI.finish();

            TerminalUI.push("Mail\t", "soft-blue");
            TerminalUI.push(MAILING_ADDRESS);
            TerminalUI.finish();

            TerminalUI.pushLine();
        }
    },
    "email": {
        paramDesc: "\t\t",
        desc: "Begins a draft addressed to my primary email.",
        action: function(args) {
            window.open("mailto: " + EMAIL, "__blank");
        }
    },
    "help": {
        paramDesc: "\t\t",
        desc: "Displays available commands.",
        action: function(args) {

            TerminalUI.pushLine();
            TerminalUI.pushLine("  Try typing (or clicking) some of these commands:", "blue");
            TerminalUI.pushLine();

            TerminalUI.push("  ");
            TerminalUI.push("about", "default", "#", 'TerminalUI.executeAutomaticDecorated(\'about\');');
            TerminalUI.finish();

            TerminalUI.push("  ");
            TerminalUI.push("linkedin", "default", "#", 'TerminalUI.executeAutomaticDecorated(\'linkedin\');');
            TerminalUI.finish();

            TerminalUI.push("  ");
            TerminalUI.push("github", "default", "#", 'TerminalUI.executeAutomaticDecorated(\'github\');');
            TerminalUI.finish();

            TerminalUI.push("  ");
            TerminalUI.push("resume", "default", "#", 'TerminalUI.executeAutomaticDecorated(\'resume\');');
            TerminalUI.finish();

            TerminalUI.pushLine();
            TerminalUI.pushLine("  Or type 'man' for a brief manual of more commands.");
            TerminalUI.pushLine();
        }
    },
    "man": {
        paramDesc: "[command]\t",
        desc: "Displays available commands and descriptions.",
        action: function(args) {

            TerminalUI.pushLine();

            if (args.length === 0) {
                TerminalUI.pushLine("  Manual", "blue");
                TerminalUI.pushLine();

                args = Object.keys(commands);
            }

            args.forEach(arg => {
                if (commands.hasOwnProperty(arg)) {
                    TerminalUI.push("  " + arg);
                    TerminalUI.push(" " + commands[arg].paramDesc);
                    TerminalUI.push(commands[arg].desc);
                    TerminalUI.finish();
                } else {
                    TerminalUI.pushLine("Cannot get description of nonexistent command '" + arg + "'.", "red");
                }
            });

            TerminalUI.pushLine();
        }
    },
    "clear": {
        paramDesc: "\t",
        desc: "Clears the console.",
        action: function(args) {
            TerminalUI.clear();
        }
    },
    "whoami": {
        paramDesc: "\t",
        desc: "Displays the active user.",
        action: function(args) {
            TerminalUI.pushLine(USER);
        }
    },
    "echo": {
        paramDesc: "[...]\t",
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
        paramDesc: "\t",
        desc: "Displays the welcome message.",
        action: function(args) {
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
            TerminalUI.finish();

            TerminalUI.pushLine();
            TerminalUI.pushLine("===============================================================================");
            TerminalUI.pushLine();
            TerminalUI.pushLine("Will Brandon", "blue");
            TerminalUI.pushLine("Northeastern University, Khoury College of Computer Sciences", "sage");
            Terminal.execute("contact");
            TerminalUI.pushLine("Welcome to my website, I'm so glad you're here!");
            Terminal.execute("help");
        }
    },
    "exit": {
        paramDesc: "\t\t",
        desc: "Ends your shell session on my website. :(",
        action: function(args) {
            TerminalUI.pushLine();
            TerminalUI.pushLine("Goodbye. :(");
            TerminalUI.pushLine("So sad to see you leaving already.");
            TerminalUI.pushLine("Please consider reaching out!");
            Terminal.execute("contact");
            TerminalUI.finish();
            TerminalUI.pushLine("[Process completed]");
            TerminalUI.close();
        }
    }
}

window.onload = Terminal.init;
