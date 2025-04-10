// ==UserScript==
// @name         Intersteno Typing Better Visual
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Anthoo21
// @description  Visual interface for intersteno
// @match        *://*/contest/app/pages/typing.php*
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const refTextarea = document.getElementById('orig_text');
        const inputTextarea = document.getElementById('typed_text');

        if (!refTextarea || !inputTextarea) return;

        // Hide textarea
        refTextarea.style.display = 'none';

        // Create visual container
        const scrollWrapper = document.createElement('div');
        scrollWrapper.id = 'scroll-wrapper';
        scrollWrapper.style.height = '200px';
        scrollWrapper.style.overflowY = 'auto';
        scrollWrapper.style.border = '1px solid #ccc';
        scrollWrapper.style.marginBottom = '10px';
        scrollWrapper.style.padding = '20px';
        scrollWrapper.style.fontFamily = 'monospace';
        scrollWrapper.style.backgroundColor = '#fff';

        const visualDisplay = document.createElement('div');
        visualDisplay.id = 'visual-display';
        visualDisplay.style.fontSize = '20px';
        visualDisplay.style.lineHeight = '1.6';
        visualDisplay.style.whiteSpace = 'pre-wrap';

        scrollWrapper.appendChild(visualDisplay);
        inputTextarea.parentNode.insertBefore(scrollWrapper, inputTextarea);

        // Inject text in container
        const targetText = refTextarea.value;
        const spans = [];

        for (let i = 0; i < targetText.length; i++) {
            const span = document.createElement('span');
            span.textContent = targetText[i];
            span.dataset.index = i;
            spans.push(span);
            visualDisplay.appendChild(span);
        }

        // Berk (thats work)
        inputTextarea.style.opacity = '0';
        inputTextarea.style.position = 'absolute';
        inputTextarea.style.left = '-9999px';

        scrollWrapper.addEventListener('click', () => inputTextarea.focus());
        window.addEventListener('keydown', () => inputTextarea.focus());
        inputTextarea.focus();

        inputTextarea.addEventListener('input', () => {
            const typed = inputTextarea.value;

            for (let i = 0; i < spans.length; i++) {
                spans[i].className = '';
            }

            for (let i = 0; i < typed.length; i++) {
                if (!spans[i]) break;
                if (typed[i] === targetText[i]) {
                    spans[i].classList.add('correct');
                } else {
                    spans[i].classList.add('incorrect', 'error');
                }
            }

            // Cursor
            if (spans[typed.length]) {
                spans[typed.length].classList.add('cursor');

                // Scroll to cursor
                const cursorElement = spans[typed.length];
                const cursorOffset = cursorElement.offsetTop;
                scrollWrapper.scrollTop = cursorOffset - 50;
            }
        });

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            .correct {
                background-color: #d4fcd4;
                color: black;
            }
            .incorrect {
                background-color: #ffe6e6;
            }
            .error {
                color: red;
                font-weight: bold;
            }
            .cursor {
                border-left: 2px solid black;
                animation: blink 1s step-start 0s infinite;
            }

            @keyframes blink {
                50% { border-color: transparent; }
            }
        `;
        document.head.appendChild(style);
    });
})();
