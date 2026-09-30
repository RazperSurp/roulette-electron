import config from '../../../src/config.json' with { type: 'json' }
import Toolbox from './Toolbox.mjs'; 

export default class App {
    rootEl;
    panelEl;

    isLocked = false;

    indicators = {};

    rotation = 0; 

    _bullets = 1;
    set bullets(value) {
        this._bullets = value;
        // this.indicators.bullets.innerText = this._bullets;
    }
    _left = 8;
    set left(value) {
        this._left = value;
        this.chance = Toolbox.roundPrecision((this._bullets / this._left) * 100, 3);
        this.indicators.left.innerText = this._left;
    }
    _chance = 0.125;
    set chance(value) {
        this._chance = value;
        this.indicators.chance.innerText = this._chance + '%';
    }

    _mode;
    get mode() { return this._mode == 'solo' ? 'САМОЛИКВИДАЦИЯ' : 'ПРОТИВ_БОТА' }
    set mode(value) { 
        this._mode = value;
        this._bullets = 1;
        this._left = 8;
        this._chance = 0.125;
    }

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

    async render(page) {
        if (config.pages[page] !== undefined) {
            await this._renderRoot(config.pages[page].root);
            await this._renderPanel(config.pages[page].panel);
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

        if (struct.id) el.setAttribute('id', struct.id);
        if (struct.src) el.setAttribute('src', struct.src);
        if (struct.class) el.classList.add(struct.class);
        if (struct.value) el.dataset.value = struct.value;
        if (struct.text) await App.fillText(el, struct.text);

        if (struct.children !== undefined && struct.children.length > 0) 
            for (const child of struct.children)
                await App.createElement(child, el);

        return el;
    }

    async _renderRoot(struct) {
        this.rootEl.innerHTML = '';
        
        for (const elStruct of struct) {
            await App.createElement(elStruct, this.rootEl);
        }

        this.indicators = {
            left: document.getElementById('camora-left'),
            chance: document.getElementById('shoot-chance')
        };
    }

    async _renderPanel(struct) {
        this.panelEl.innerHTML = '';
        this._selectedElement = null;
        
        for (const elStruct of struct) {
            let li = await App.createElement(Object.assign(elStruct, { tag: 'li' }), this.panelEl);

            this.selectedElement = this._selectedElement ?? li;
        }
    }

    shot() {
        this.isLocked = true;
        this.rotation++; 
        this.rootEl.querySelector('img').style.transform = `rotate(${this.rotation * 45}deg)`;
        setTimeout(() => {
            const rand = Math.floor(Math.random() * this._left);
            if (rand < this._bullets) {
                this.selectedElement.innerText = 'ЗАСТРЕЛИЛСЯ';
                this.selectedElement.dataset.value = 'back';
            } else this.left = this._left - 1;    

            this.isLocked = false;
        }, 500);

        
    }

    confirm() {
        if (!this.isLocked) {
            const value = this.selectedElement.dataset.value;
            if (!this._mode) {
                this.page = this.mode = value;
                this.rootEl.querySelector('img').style.transform = 'rotate(0deg)';
                this.rotation = 8;
            } else {
                switch (value) {
                    case 'shot': this.shot(); break;
                    case 'back': 
                        this._mode = null;
                        this.page = 'index';
                        break;
                }
            }
        }
    }
}