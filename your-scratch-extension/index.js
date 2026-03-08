const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');

// Extension that sends a prompt to a local Llama-compatible API and
// reports back the model's text response. Designed for Scratch 3 VM.
class Scratch3ArvuExtension {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'ministralai',
            name: 'Ask‑Arvu',
            color1: '#006600',
            color2: '#004400',
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            blocks: [
                {
                    opcode: 'getans',
                    blockType: BlockType.REPORTER,
                    text: 'ask Arvu [PROMPT]',
                    arguments: {
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello!'
                        }
                    }
                }
            ]
        };
    }

    getans ({PROMPT}) {
        return fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'ministral-3:3b',
                prompt: PROMPT,
                stream: false
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            return data.response || data.text || '';
        })
        .catch((e) => {
            return 'Connection error – check the server URL/port.';
        });
    }
}

module.exports = Scratch3ArvuExtension;
