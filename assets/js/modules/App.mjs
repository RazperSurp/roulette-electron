import config from '../../../src/config.json' with { type: 'json' }
import Toolbox from './Toolbox.mjs'; 

export default class App {
    rootEl;
    panelEl;

    _page;
    set page(value) {
        if (Object.keys(config.pages).find(page => page === value)) {
            this._page = value;

            this.render(this._page);
        } else console.error('Unknown page');
    }

    _selectedElement;
    get selectedElement() { return this._selectedElement; }
    set selectedElement(value) {
        if (value instanceof HTMLElement && value.parentNode == this.panelEl) {
            if (this._selectedElement instanceof HTMLElement) 
                this.selectedElement.classList.remove('selected');
            
            this._selectedElement = value;

            this.selectedElement.classList.add('selected');
        }
    };

    constructor(rootEl, panelEl) {
        this.rootEl = rootEl;
        this.panelEl = panelEl;

        this.page = 'index';
    }

    render(page) {
        if (config.pages[page] !== undefined) {
            this._renderRoot(config.pages[page].root);
            this._renderPanel(config.pages[page].panel);
        }
    }

    static randomizeSymbol(symbol, doUseCorrect = false) {
        return new Promise((resolve, reject) => {
            let randomSymbol = String.fromCharCode(Toolbox.randomIntBetween(1000, 10000));
            setTimeout(() => {
                resolve(doUseCorrect ? symbol : randomSymbol); 
            }, config.symbolAppearIterationInterval)
        }) 
    }

    static async fillText(el, text) {
        const symbols = text.replaceAll(' ', '_').split('');
        let i = 0, result = '';

        el.innerText = result;
        for (const symbol of symbols) {
            while (i < config.symbolAppearIterations) { i++; el.innerHTML = result + await App.randomizeSymbol(symbol, i == config.symbolAppearIterations); }
            i = 0; result = el.innerText;
        }
    }

    static async createElement(struct, root) {
        let el = document.createElement(struct.tag);
        root.appendChild(el);
        
        await App.fillText(el, struct.text);

        if (struct.children !== undefined && struct.children.length > 0) struct.children.forEach(child => {
            el.appendChild(App.createElement(child));
        })

        return el;
    }

    _renderRoot(struct) {
        this.rootEl.innerHTML = '';
        
        struct.forEach(elStruct => {
            App.createElement(elStruct, this.rootEl);
        })
    }

    async _renderPanel(struct) {
        this.panelEl.innerHTML = '';
        this.selectedElement = null;
        
        for (const elStruct of struct) {
            let li = await App.createElement(Object.assign(elStruct, { tag: 'li' }), this.panelEl);

            this.selectedElement = this._selectedElement ?? li;
        }
    }
}