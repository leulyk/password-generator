import { createEffect, createSignal } from "solid-js";

const App = () => {
    const [charCount, setCharCount] = createSignal<number>(10);
    const [strengthText, setStrengthText] = createSignal<string>('WEAK');
    const [uppercase, setUppercase] = createSignal<boolean>(false);
    const [lowercase, setLowercase] = createSignal<boolean>(false);
    const [numbers, setNumbers] = createSignal<boolean>(false);
    const [symbols, setSymbols] = createSignal<boolean>(false);
    const [password, setPassword] = createSignal<string>('');
    const [weak, setWeak] = createSignal<string>('');
    const [mediumLow, setMediumLow] = createSignal<string>('');
    const [mediumHigh, setMediumHigh] = createSignal<string>('');
    const [strong, setStrong] = createSignal<string>('');

    const changeSliderValue = (e: Event) => setCharCount(e.currentTarget.value);

    createEffect(() => {
        let strength: number = 0;
        let optionsCount: number = 0;
        let barColor = "#FCCD63";
        let strengthSetters = [setWeak, setMediumLow, setMediumHigh, setStrong];

        if (uppercase()) optionsCount++;
        if (lowercase()) optionsCount++;
        if (numbers()) optionsCount++;
        if (symbols()) optionsCount++;

        if (charCount() <= 5) {
            strength = 0;
        } else if (charCount() > 5 && charCount() < 10) {
            strength = optionsCount <= 2 ? 0 : optionsCount == 3 ? 1 : 2;
        } else {
            strength = optionsCount ? optionsCount - 1 : 0;
        }

        setStrengthText(strength == 0 ? 'WEAK' : strength == 3 ? 'STRONG' : 'MEDIUM');

        for (let i = 0; i < strengthSetters.length; ++i) {
            if (i <= strength)
                strengthSetters[i](barColor);
            else
                strengthSetters[i]('');
        }
    });

    const changeOptions = (e: Event) => {
        switch (e.target.id) {
            case "uppercase_check":
                setUppercase(e.target.checked);
                break;
            case "lowercase_check":
                setLowercase(e.target.checked);
                break;
            case "numbers_check":
                setNumbers(e.target.checked);
                break;
            case "symbols_check":
                setSymbols(e.target.checked);
                break;
            default:
                break;
        }
    }

    const generate_password = () => {
        let options: string[] = [];
        if (uppercase()) options.push("uppercase");
        if (lowercase()) options.push("lowercase");
        if (numbers()) options.push("number");
        if (symbols()) options.push("symbol");

        let newPassword: string = "";

        if (options.length == 0) return;
        for (let i = 1; i <= charCount(); ++i) {
            let option = Math.floor(Math.random() * options.length);
            let symbols = '!@#$%^&*';
            let char = "";
            switch (options[option]) {
                case "uppercase":
                    char = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
                    break;
                case "lowercase":
                    char = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
                    break;
                case "number":
                    char = Math.floor(Math.random() * 9).toString();
                    break;
                case "symbol":
                    char = symbols[Math.floor(Math.random() * symbols.length)];
                    break;
                default:
                    break;
            }
            newPassword += char;
        }
        setPassword(newPassword);
    }

    const copyText = () => navigator.clipboard.writeText(password());


    return (
        <div class="main">
            <h3>Password Generator</h3>
            <label data-theme="halloween" class="input-group">
                <input type="text" placeholder="password" id="password" class="input input-bordered" value={password()} disabled />
                <span data-theme="aqua" id="copy"><a href="#" onClick={() => copyText()}><img src="images/copy.png" alt="copy icon" /></a></span>
            </label>
            <div data-theme="halloween" class="generator">
                <div>
                    <div class="character-length"><span>Character Length</span><span class="charCount">{charCount()}</span></div>
                    <input type="range" min="0" max="20" value={charCount()} step="1" class="range-success" onInput={(ev) => changeSliderValue(ev)} />
                    <input type="checkbox" id="uppercase_check" class="options" onInput={(e) => changeOptions(e)} />
                    <label for="uppercase_check">Include Uppercase Letters</label>
                    <br />
                    <input type="checkbox" id="lowercase_check" class="options" onInput={(e) => changeOptions(e)} />
                    <label for="lowercase_check">Include Lowercase Letters</label>
                    <br />
                    <input type="checkbox" id="numbers_check" class="options" onInput={(e) => changeOptions(e)} />
                    <label for="numbers_check">Include Numbers</label>
                    <br />
                    <input type="checkbox" id="symbols_check" class="options" onInput={(e) => changeOptions(e)} />
                    <label for="symbols_check">Include Symbols</label>
                    <br />
                    <div id="strength" data-theme="coffee">
                        <span>STRENGTH</span>
                        <span id="strength-value">
                            <div class="strength-text">{strengthText()}</div>
                            <div class="strength-bar" style={{ "background-color": weak() }}></div>
                            <div class="strength-bar" style={{ "background-color": mediumLow() }}></div>
                            <div class="strength-bar" style={{ "background-color": mediumHigh() }}></div>
                            <div class="strength-bar" style={{ "background-color": strong() }}></div>
                        </span>
                    </div >
                </div >
                <button class="btn btn-outline" id="generate-btn" onClick={() => generate_password()}>Generate <i class='fa fa-arrow-right'></i></button>
            </div >
        </div >
    );
};

export default App;
