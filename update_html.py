import re

with open('trading_office.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add CSS for new agents
css_addition = """
        .whale { background: linear-gradient(135deg, #00b4db, #0083b0); }
        .hype { background: linear-gradient(135deg, #ff9a9e, #fecfef); }
        .scalper { background: linear-gradient(135deg, #11998e, #38ef7d); }
        .quant { background: linear-gradient(135deg, #8e2de2, #4a00e0); }
        
        .chat-entry.whale .agent { color: #00b4db; }
        .chat-entry.hype .agent { color: #ff9a9e; }
        .chat-entry.scalper .agent { color: #38ef7d; }
        .chat-entry.quant .agent { color: #8e2de2; }
"""
html = html.replace('.ceo {', css_addition + '\n        .ceo {')

# 2. Add Desks and Screens
desks_addition = """
        <div class="desk" style="top: 150px; left: 350px; width: 150px;">
            <div class="desk-label">🐋 Кит-Трекер</div>
            <div class="desk-screen" id="whale-screen">Loading...</div>
        </div>
        <div class="desk" style="top: 150px; right: 350px; width: 150px;">
            <div class="desk-label">🎭 Сентимент</div>
            <div class="desk-screen" id="hype-screen">Loading...</div>
        </div>
        <div class="desk" style="top: 350px; left: 150px; width: 150px;">
            <div class="desk-label">⏱️ Скальпер</div>
            <div class="desk-screen" id="scalper-screen">Loading...</div>
        </div>
        <div class="desk" style="top: 350px; right: 150px; width: 150px;">
            <div class="desk-label">🧮 Квант</div>
            <div class="desk-screen" id="quant-screen">Loading...</div>
        </div>
"""
html = html.replace('<!-- Monitors -->', desks_addition + '\n        <!-- Monitors -->')

# 3. Add Agent Elements
agents_addition = """
        <div class="agent whale" id="agent-whale" style="top: 250px; left: 400px;">
            🐋
            <div class="agent-name">Кит-Трекер</div>
        </div>
        <div class="agent hype" id="agent-hype" style="top: 250px; right: 400px;">
            🎭
            <div class="agent-name">Сентимент</div>
        </div>
        <div class="agent scalper" id="agent-scalper" style="top: 450px; left: 200px;">
            ⏱️
            <div class="agent-name">Скальпер</div>
        </div>
        <div class="agent quant" id="agent-quant" style="top: 450px; right: 200px;">
            🧮
            <div class="agent-name">Квант</div>
        </div>
"""
html = html.replace('<!-- Speech Bubbles -->', agents_addition + '\n        <!-- Speech Bubbles -->')

# 4. Add Speech Bubbles
bubbles_addition = """
        <div class="speech-bubble" id="bubble-whale"></div>
        <div class="speech-bubble" id="bubble-hype"></div>
        <div class="speech-bubble" id="bubble-scalper"></div>
        <div class="speech-bubble" id="bubble-quant"></div>
"""
html = html.replace('<!-- Alert Box -->', bubbles_addition + '\n        <!-- Alert Box -->')

# 5. Update JS Objects
js_agents = """
            whale: { x: 400, y: 250, targetX: 400, targetY: 250, element: document.getElementById('agent-whale') },
            hype: { x: window.innerWidth - 450, y: 250, targetX: window.innerWidth - 450, targetY: 250, element: document.getElementById('agent-hype') },
            scalper: { x: 200, y: 450, targetX: 200, targetY: 450, element: document.getElementById('agent-scalper') },
            quant: { x: window.innerWidth - 250, y: 450, targetX: window.innerWidth - 250, targetY: 450, element: document.getElementById('agent-quant') },
"""
html = html.replace('ceo: {', js_agents + '\n            ceo: {')

# 6. Update Dialogues
js_dialogues = """
            { speaker: 'whale', text: 'Аномальный объем на WIF! 10M USDT за 5 мин!', duration: 4000 },
            { speaker: 'hype', text: 'Маск твитнул собаку! Мемы полетели!', duration: 4000 },
            { speaker: 'ceo', text: 'Отличная наводка. Квант, что по рискам?', duration: 4000 },
            { speaker: 'quant', text: 'Волатильность x3. Ставьте короткие стопы.', duration: 4000 },
            { speaker: 'scalper', text: 'Взял +2% на пробое, жду дальше.', duration: 4000 },
"""
html = html.replace('const dialogues = [', 'const dialogues = [\n' + js_dialogues)

# 7. Update format in addChatEntry
html = html.replace("agent === 'analyst' ? 'Аналитик' : agent === 'risk' ? 'Риск-менеджер' : 'CEO'", 
    "agent === 'analyst' ? 'Аналитик' : agent === 'risk' ? 'Риск-менеджер' : agent === 'whale' ? 'Кит-Трекер' : agent === 'hype' ? 'Сентимент' : agent === 'scalper' ? 'Скальпер' : agent === 'quant' ? 'Квант' : 'CEO'")

# 8. Update screens
js_screens = """
            const whaleScreen = document.getElementById('whale-screen');
            const hypeScreen = document.getElementById('hype-screen');
            const scalperScreen = document.getElementById('scalper-screen');
            const quantScreen = document.getElementById('quant-screen');
            
            if(whaleScreen) whaleScreen.textContent = 'Сканирую...\\nКрупных\\nордеров: 0';
            if(hypeScreen) hypeScreen.textContent = 'Twitter: OK\\nМемы: Тихо\\nТренды: AI';
            if(scalperScreen) scalperScreen.textContent = '1m: Флэт\\n5m: Флэт\\nСделок: 0';
            if(quantScreen) quantScreen.textContent = 'Winrate: 0%\\nМодель: v1.2\\nРиск: Норма';
"""
html = html.replace("analystScreen.textContent = messages[0];", js_screens + "\\n            analystScreen.textContent = messages[0];")

# 9. Resize handler
js_resize = """
            agents.hype.x = window.innerWidth - 450;
            agents.hype.targetX = window.innerWidth - 450;
            agents.quant.x = window.innerWidth - 250;
            agents.quant.targetX = window.innerWidth - 250;
"""
html = html.replace("agents.ceo.targetX = window.innerWidth / 2 - 35;", "agents.ceo.targetX = window.innerWidth / 2 - 35;\\n" + js_resize)

with open('trading_office.html', 'w', encoding='utf-8') as f:
    f.write(html)
