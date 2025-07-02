// This is the smart starter. It waits for the correct moment to run the game.
if (typeof window.cordova !== 'undefined') {
    document.addEventListener('deviceready', main, false);
} else {
    document.addEventListener('DOMContentLoaded', main);
}

// This is the main function that contains the ENTIRE game.
function main() {
    // --- SETUP, DATA & GAME STATE ---
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    const ui = {
        container: document.getElementById('ui-container'),
        score: document.getElementById('score'),
        highscore: document.getElementById('highscore'),
        coins: document.getElementById('coins'),
        combo: document.getElementById('combo-display'),
        specialEffect: document.getElementById('special-effect-display'),
        finalScore: document.getElementById('final-score'),
        shardsEarned: document.getElementById('shards-earned'),
        menu: document.getElementById('menu'),
        modeSelectMenu: document.getElementById('mode-select-menu'),
        pauseMenu: document.getElementById('pause-menu'),
        gameOverMenu: document.getElementById('game-over-menu'),
        shopMenu: document.getElementById('shop-menu'),
        settingsMenu: document.getElementById('settings-menu'),
        playBtn: document.getElementById('play-button'),
        retryBtn: document.getElementById('retry-button'),
        resumeBtn: document.getElementById('resume-button'),
        restartBtn: document.getElementById('restart-button'),
        mainMenuBtn: document.getElementById('main-menu-button'),
        gameOverMainMenuBtn: document.getElementById('gameover-main-menu-button'),
        settingsOpenBtn: document.getElementById('settings-open-button'),
        settingsCloseBtn: document.getElementById('settings-close-button'),
        shopOpenBtn: document.getElementById('shop-open-button'),
        shopCloseBtn: document.getElementById('shop-close-button'),
        modeCloseBtn: document.getElementById('mode-close-button'),
        ingamePauseBtn: document.getElementById('ingame-pause-button'),
        getCoinsBtn: document.getElementById('get-coins-button'),
        themeGrid: document.getElementById('theme-grid'),
        soundToggle: document.getElementById('sound-toggle'),
        particlesToggle: document.getElementById('particles-toggle'),
        shakeToggle: document.getElementById('shake-toggle'),
        modeBtns: document.querySelectorAll('.mode-btn'),
        gameOverOfferContainer: document.getElementById('gameover-offer-container'),
        gameOverStandardContainer: document.getElementById('gameover-standard-container'),
        multiplyShardsBtn: document.getElementById('multiply-shards-button'),
        skipMultiplyBtn: document.getElementById('skip-multiply-button'),
    };

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bgMusic = document.getElementById('bg-music');
    const musicTracks = [ 'https://assets.codepen.io/217233/aether.mp3', 'https://assets.codepen.io/217233/aether2.mp3', 'https://assets.codepen.io/217233/aether3.mp3' ];
    const themes = [{id:'cyber',name:'Cyber Glow',cost:0,rarity:'Common',colors:{'--glow-color':'#0ff','--secondary-glow':'#f0f','--special-glow':'#ff0','--danger-glow':'#f10','--dark-bg':'#0d0d1a','--light-text':'#e0e0ff','--bg-gradient-1':'rgba(100,100,255,.1)','--bg-gradient-2':'rgba(255,100,200,.1)'}},{id:'solar',name:'Solar Flare',cost:150,rarity:'Common',colors:{'--glow-color':'#fc0','--secondary-glow':'#f60','--special-glow':'#fff','--danger-glow':'#f10','--dark-bg':'#1a0d00','--light-text':'#ffe0b3','--bg-gradient-1':'rgba(255,200,0,.1)','--bg-gradient-2':'rgba(255,150,0,.1)'}},{id:'emerald',name:'Emerald Dream',cost:250,rarity:'Common',colors:{'--glow-color':'#50c878','--secondary-glow':'#a0d6b4','--special-glow':'#fff','--danger-glow':'#c70039','--dark-bg':'#08140e','--light-text':'#d0e0d8','--bg-gradient-1':'rgba(80,200,120,.1)','--bg-gradient-2':'rgba(46,139,87,.1)'}},{id:'ruby',name:'Ruby Dust',cost:300,rarity:'Common',colors:{'--glow-color':'#e0115f','--secondary-glow':'#ffb3b3','--special-glow':'#fff','--danger-glow':'#0bf','--dark-bg':'#1a030b','--light-text':'#fce4ec','--bg-gradient-1':'rgba(224,17,95,.1)','--bg-gradient-2':'rgba(200,0,0,.1)'}},{id:'oceanic',name:'Oceanic',cost:750,rarity:'Uncommon',colors:{'--glow-color':'#00a6ed','--secondary-glow':'#6495ed','--special-glow':'#f0f8ff','--danger-glow':'#ff4500','--dark-bg':'#030e1a','--light-text':'#cceeff','--bg-gradient-1':'rgba(0,166,237,.1)','--bg-gradient-2':'rgba(100,149,237,.1)'}},{id:'crimson',name:'Crimson Void',cost:1500,rarity:'Uncommon',colors:{'--glow-color':'#f22','--secondary-glow':'#faa','--special-glow':'#fff','--danger-glow':'#0f0','--dark-bg':'#1a0000','--light-text':'#fcc','--bg-gradient-1':'rgba(255,0,0,.1)','--bg-gradient-2':'rgba(150,0,0,.1)'}},{id:'amethyst',name:'Amethyst',cost:2500,rarity:'Uncommon',colors:{'--glow-color':'#9d00ff','--secondary-glow':'#d28cff','--special-glow':'#fdd5ff','--danger-glow':'#f10','--dark-bg':'#10031a','--light-text':'#eeccee','--bg-gradient-1':'rgba(157,0,255,.1)','--bg-gradient-2':'rgba(100,0,150,.1)'}},{id:'jungle',name:'Jungle Moss',cost:4000,rarity:'Uncommon',colors:{'--glow-color':'#228b22','--secondary-glow':'#556b2f','--special-glow':'#9acd32','--danger-glow':'#dc143c','--dark-bg':'#021002','--light-text':'#d0e8d0','--bg-gradient-1':'rgba(34,139,34,.1)','--bg-gradient-2':'rgba(85,107,47,.1)'}},{id:'gold',name:'Gilded King',cost:1e4,rarity:'Rare',colors:{'--glow-color':'#ffd700','--secondary-glow':'#f0e68c','--special-glow':'#fff','--danger-glow':'#f10','--dark-bg':'#1a1400','--light-text':'#fffacd','--bg-gradient-1':'rgba(255,215,0,.1)','--bg-gradient-2':'rgba(200,160,0,.1)'}},{id:'sakura',name:'Sakura Dream',cost:15e3,rarity:'Rare',colors:{'--glow-color':'#ffb6c1','--secondary-glow':'#fff','--special-glow':'#f08080','--danger-glow':'#1f0','--dark-bg':'#281018','--light-text':'#ffe4e1','--bg-gradient-1':'rgba(255,182,193,.15)','--bg-gradient-2':'rgba(240,128,128,.15)'}},{id:'toxic',name:'Toxic Spill',cost:20000,rarity:'Rare',colors:{'--glow-color':'#7fff00','--secondary-glow':'#adff2f','--special-glow':'#fff','--danger-glow':'#da70d6','--dark-bg':'#0e1a05','--light-text':'#e0ffc1','--bg-gradient-1':'rgba(127,255,0,.1)','--bg-gradient-2':'rgba(173,255,47,.1)'}},{id:'monochrome',name:'Monochrome',cost:25e3,rarity:'Rare',colors:{'--glow-color':'#fff','--secondary-glow':'#aaa','--special-glow':'#888','--danger-glow':'#f10','--dark-bg':'#000','--light-text':'#ccc','--bg-gradient-1':'rgba(200,200,200,.1)','--bg-gradient-2':'rgba(100,100,100,.1)'}},{id:'sunset',name:'Synthwave Sunset',cost:5e4,rarity:'Rare',colors:{'--glow-color':'#ff6a00','--secondary-glow':'#ee0979','--special-glow':'#00f2ff','--danger-glow':'#fff','--dark-bg':'#1b0024','--light-text':'#ffc9a6','--bg-gradient-1':'rgba(255,106,0,.15)','--bg-gradient-2':'rgba(238,9,121,.15)'}},{id:'nebula',name:'Nebula Haze',cost:1e5,rarity:'Epic',colors:{'--glow-color':'#f0f','--secondary-glow':'#0ff','--special-glow':'#fff','--danger-glow':'#ff0','--dark-bg':'#0c0014','--light-text':'#f0e0ff','--bg-gradient-1':'rgba(200,0,255,.15)','--bg-gradient-2':'rgba(0,200,255,.15)'}},{id:'hellfire',name:'Hellfire',cost:25e4,rarity:'Epic',colors:{'--glow-color':'#ff4500','--secondary-glow':'#fd0','--special-glow':'#f00','--danger-glow':'#0ff','--dark-bg':'#1a0500','--light-text':'#ffccaa','--bg-gradient-1':'rgba(255,69,0,.2)','--bg-gradient-2':'rgba(255,0,0,.2)'}},{id:'ice',name:'Glacial Heart',cost:5e5,rarity:'Epic',colors:{'--glow-color':'#afeeee','--secondary-glow':'#fff','--special-glow':'#0ff','--danger-glow':'#f10','--dark-bg':'#0a101a','--light-text':'#e0ffff','--bg-gradient-1':'rgba(175,238,238,.1)','--bg-gradient-2':'rgba(224,255,255,.1)'}},{id:'hacker',name:'Hacker Matrix',cost:75e4,rarity:'Epic',colors:{'--glow-color':'#0f0','--secondary-glow':'#0c0','--special-glow':'#fff','--danger-glow':'#f00','--dark-bg':'#000','--light-text':'#0f0','--bg-gradient-1':'rgba(0,100,0,.2)','--bg-gradient-2':'rgba(0,50,0,.2)'}},{id:'singularity',name:'Singularity',cost:1e7,rarity:'Legendary',colors:{'--glow-color':'#fff','--secondary-glow':'#000','--special-glow':'#fff','--danger-glow':'#f10','--dark-bg':'#000','--light-text':'#fff','--bg-gradient-1':'rgba(255,255,255,.1)','--bg-gradient-2':'rgba(255,255,255,.05)'}},{id:'aurora',name:'Aurora Borealis',cost:25e6,rarity:'Legendary',colors:{'--glow-color':'#7df9ff','--secondary-glow':'#39ff14','--special-glow':'#ff71ce','--danger-glow':'#f10','--dark-bg':'#030f1f','--light-text':'#e0ffff','--bg-gradient-1':'rgba(125,249,255,.2)','--bg-gradient-2':'rgba(57,255,20,.2)'}},{id:'living',name:'Living Constellation',cost:5e7,rarity:'Legendary',colors:{'--glow-color':'#fdfd96','--secondary-glow':'#fffacd','--special-glow':'#fff','--danger-glow':'#ff6347','--dark-bg':'#010413','--light-text':'#f5f5dc','--bg-gradient-1':'rgba(253,253,150,.15)','--bg-gradient-2':'rgba(255,250,205,.15)'}},{id:'molten',name:'Molten Core',cost:8e7,rarity:'Legendary',colors:{'--glow-color':'#ff4800','--secondary-glow':'#ff7400','--special-glow':'#f00','--danger-glow':'#00f6ff','--dark-bg':'#1c0800','--light-text':'#ffdec7','--bg-gradient-1':'rgba(255,72,0,.2)','--bg-gradient-2':'rgba(255,116,0,.2)'}},{id:'first_weave',name:'The First Weave',cost:5e10,rarity:'Mythic',colors:{'--glow-color':'#fff','--secondary-glow':'#ffd700','--special-glow':'#0ff','--danger-glow':'#f00','--dark-bg':'#000','--light-text':'#fff','--bg-gradient-1':'rgba(255,255,255,.2)','--bg-gradient-2':'rgba(255,215,0,.1)'}},{id:'broken_code',name:'Broken Code',cost:25e10,rarity:'Mythic',colors:{'--glow-color':'#0f0','--secondary-glow':'#f00','--special-glow':'#fff','--danger-glow':'#00f','--dark-bg':'#000','--light-text':'#0f0','--bg-gradient-1':'rgba(0,255,0,.1)','--bg-gradient-2':'rgba(255,0,0,.1)'}},{id:'celestial',name:'Celestial Forge',cost:1e12,rarity:'Mythic',colors:{'--glow-color':'#c0c0c0','--secondary-glow':'#ffd700','--special-glow':'#e5e4e2','--danger-glow':'#b22222','--dark-bg':'#191970','--light-text':'#f0f8ff','--bg-gradient-1':'rgba(192,192,192,.2)','--bg-gradient-2':'rgba(255,215,0,.2)'}},{id:'void_eater',name:'Void Eater',cost:5e12,rarity:'Mythic',colors:{'--glow-color':'#4b0082','--secondary-glow':'#8a2be2','--special-glow':'#ff00ff','--danger-glow':'#0f0','--dark-bg':'#01000a','--light-text':'#e6e6fa','--bg-gradient-1':'rgba(75,0,130,.2)','--bg-gradient-2':'rgba(138,43,226,.2)'}}];
    const gameModes = { classic: { name: "Classic", max_timer: 6000, timer_gain_on_hit: 175, score_multiplier: 1, coin_chance: 0.1, has_danger_nodes: false, nodes_shrink: false, }, sudden_death: { name: "Sudden Death", max_timer: 2500, timer_gain_on_hit: 100, score_multiplier: 2, coin_chance: 0.05, has_danger_nodes: false, nodes_shrink: false, }, minefield: { name: "Minefield", max_timer: 7000, timer_gain_on_hit: 175, score_multiplier: 1.5, coin_chance: 0.1, has_danger_nodes: true, danger_node_chance: 0.2, nodes_shrink: false, }, shrinking: { name: "Shrinking Nodes", max_timer: 6000, timer_gain_on_hit: 250, score_multiplier: 1.2, coin_chance: 0.1, has_danger_nodes: false, nodes_shrink: true, shrink_rate: 0.1, } };
    
    const nodeTypes = {
        normal: { score: 1, shards: 1, color: 'secondary', sound: 'connect' },
        coin: { score: 5, shards: 25, color: 'special', sound: 'coin' },
        time: { score: 2, shards: 1, color: '#fff', sound: 'time', effect: 'addTime', text: '+TIME BOOST' },
        shield: { score: 10, shards: 5, color: '#c0c0c0', sound: 'shield', effect: 'addShield', text: 'SHIELD' },
        shrink: { score: -5, shards: 0, color: '#8b4513', sound: 'shrink', effect: 'shrinkNodes', text: 'SHRINK' },
        grow: { score: 5, shards: 1, color: '#ff69b4', sound: 'grow', effect: 'growNodes', text: 'GROW' },
        combo: { score: 10, shards: 2, color: 'rainbow', sound: 'combo', effect: 'addCombo', text: '+5 COMBO' },
        jackpot: { score: 25, shards: 75, color: '#ffd700', sound: 'jackpot', text: 'JACKPOT!' },
        superScore: { score: 100, shards: 10, color: '#00ff7f', sound: 'superScore', text: 'SUPER SCORE!' }
    };
    
    let currentMode = gameModes.classic, gameState = 'menu', score = 0, coins, highscore, ownedThemes, selectedTheme, settings;
    let gameSessionShards = 0, player = { x: 0, y: 0, radius: 15 }, targetNodes = [], particles = [], screenShake = { intensity: 0, duration: 0 }, combo = { count: 0, timer: 0, maxTime: 120 }, isFrozen = false, freezeTimer = 0;
    
    let hasShield = false;
    let nodeEffectTimer = 0;
    let nodeEffectType = null;
    function loadProgress() { highscore = parseInt(localStorage.getItem('aetherWeaveHighscore') || '0'); coins = parseInt(localStorage.getItem('aetherWeaveCoins') || '0'); ownedThemes = JSON.parse(localStorage.getItem('aetherWeaveOwnedThemes') || '["cyber"]'); selectedTheme = localStorage.getItem('aetherWeaveSelectedTheme') || 'cyber'; settings = JSON.parse(localStorage.getItem('aetherWeaveSettings') || '{"sound":true,"particles":true,"shake":true}'); }
    function saveProgress() { localStorage.setItem('aetherWeaveHighscore', highscore); localStorage.setItem('aetherWeaveCoins', coins); localStorage.setItem('aetherWeaveOwnedThemes', JSON.stringify(ownedThemes)); localStorage.setItem('aetherWeaveSelectedTheme', selectedTheme); localStorage.setItem('aetherWeaveSettings', JSON.stringify(settings)); }
    
    const ads = {
        banner: null, rewarded: null,
        initialize: async function() { if (typeof admob === 'undefined') { console.log("AdMob plugin not found. Ads will not run."); return; } await admob.start(); this.banner = new admob.BannerAd({ adUnitId: 'ca-app-pub-6989088248302599/1900301188' }); this.rewarded = new admob.RewardedAd({ adUnitId: 'ca-app-pub-6989088248302599/1842760742' }); },
        showBanner: async function() { if(this.banner) await this.banner.show(); },
        hideBanner: async function() { if(this.banner) await this.banner.hide(); },
        showRewardedVideo: async function() { if (!this.rewarded) return false; try { await this.rewarded.load(); await this.rewarded.show(); return true; } catch (e) { return false; } }
    };
    
    function updateUI() { ui.highscore.textContent = highscore.toLocaleString(); ui.coins.textContent = coins.toLocaleString(); ui.score.textContent = score.toLocaleString(); }
    function renderShop() { ui.themeGrid.innerHTML = ''; const s = [...themes].sort((a, b) => { const r = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'], rA = r.indexOf(a.rarity), rB = r.indexOf(b.rarity); if (rA !== rB) return rA - rB; return a.cost - b.cost; }); s.forEach(t => { const isO = ownedThemes.includes(t.id), isS = selectedTheme === t.id, canA = coins >= t.cost, i = document.createElement('div'); i.className = `theme-item ${isO ? 'owned' : ''} ${isS ? 'selected' : ''}`; let b; if (isS) { b = `<button class="disabled">SELECTED</button>` } else if (isO) { b = `<button class="select-btn" data-id="${t.id}">SELECT</button>` } else { b = `<button class="buy-btn ${canA ? '' : 'disabled'}" data-id="${t.id}" data-cost="${t.cost}">BUY (${t.cost.toLocaleString()})</button>` } const p = `background-color:${t.colors['--dark-bg']};border:2px solid ${t.colors['--glow-color']};color:${t.colors['--light-text']}`; i.innerHTML = `<div class="rarity rarity-${t.rarity}">${t.rarity}</div><h3>${t.name}</h3><div class="theme-preview" style="${p}">PREVIEW</div><div class="price">${isO ? 'Owned' : ''}</div>${b}`; ui.themeGrid.appendChild(i); }); }
    function applyTheme(themeId) { const t = themes.find(t => t.id === themeId); if (!t) return; for (const [k, v] of Object.entries(t.colors)) document.documentElement.style.setProperty(k, v); }
    function applySettings() { ui.soundToggle.checked = settings.sound; ui.particlesToggle.checked = settings.particles; ui.shakeToggle.checked = settings.shake; }
    function playRandomMusic() { if (settings.sound) { bgMusic.src = musicTracks[Math.floor(Math.random() * musicTracks.length)]; bgMusic.play().catch(e => {}); } }
    function toggleMusic() { if (settings.sound && gameState !== 'playing') { playRandomMusic(); } else { bgMusic.pause(); } }
    function playSound(sound) { if (!settings.sound) return; const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); let f=440,v=.3,d=.1,w='sine'; switch(sound){case'connect':f=440+combo.count*10;break;case'coin':f=660;w='triangle';break;case'danger':f=110;d=.4;w='sawtooth';break;case'time':f=1200;v=.2;w='triangle';break;case'shield':f=330;d=.2;w='square';break;case'shrink':f=300;d=.3;w='sawtooth';o.detune.setValueAtTime(100,audioCtx.currentTime+.05);break;case'grow':f=500;d=.3;w='sine';o.detune.setValueAtTime(-100,audioCtx.currentTime+.05);break;case'combo':f=1046;v=.4;d=.05;playSound('jackpot');break;case'jackpot':f=1396;v=.4;d=.1;break;case'superScore':f=784;v=.4;d=.2;w='triangle';break;case'gameOver':f=220;d=.8;w='sawtooth';break;} o.type=w;o.frequency.setValueAtTime(f,audioCtx.currentTime);g.gain.setValueAtTime(v,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d);o.start();o.stop(audioCtx.currentTime+d);}
    function startGame(modeId) { currentMode = gameModes[modeId]; gameState = 'playing'; score = 0; gameSessionShards = 0; timer = currentMode.max_timer; combo.count = 1; targetNodes = []; hasShield = false; updateUI(); ui.menu.classList.add('hidden'); ui.gameOverMenu.classList.add('hidden'); ui.pauseMenu.classList.add('hidden'); ui.modeSelectMenu.classList.add('hidden'); ui.container.style.opacity = 1; ui.ingamePauseBtn.classList.remove('hidden'); ads.hideBanner(); while(targetNodes.length < 5) spawnNode(); if(bgMusic.paused && settings.sound)bgMusic.play(); lastFrameTime = performance.now(); loop();}
    function goToMainMenu() { gameState = 'menu'; score = 0; ui.gameOverMenu.classList.add('hidden'); ui.pauseMenu.classList.add('hidden'); ui.modeSelectMenu.classList.add('hidden'); ui.menu.classList.remove('hidden'); ui.container.style.opacity = 0; ui.ingamePauseBtn.classList.add('hidden'); updateUI(); ads.showBanner(); menuLoop(); }
    function spawnNode() { const r = Math.random(); let type='normal'; if(currentMode.has_danger_nodes&&r<.2)type='danger';else if(r<.25)type='coin';else if(r<.3)type='time';else if(r<.33)type='shield';else if(r<.35)type='shrink';else if(r<.37)type='grow';else if(r<.38)type='combo';else if(r<.385)type='jackpot';else if(r<.39)type='superScore'; const data=nodeTypes[type]; let color; if(data.color==='secondary'){color=getVar('--secondary-glow')}else if(data.color==='special'){color=getVar('--special-glow')}else if(data.color==='rainbow'){color=`hsl(${Math.random()*360},100%,70%)`}else{color=data.color} targetNodes.push({x:Math.random()*(width-100)+50,y:Math.random()*(height-100)+50,radius:25,maxRadius:25,type:type,color:color}); }
    function onConnect(node, index) { const data = nodeTypes[node.type]; if (data.effect) { switch(data.effect){ case 'addTime': timer+=500;break; case 'addShield': hasShield = true; break; case 'shrinkNodes': nodeEffectTimer = 240; nodeEffectType = 'shrink'; break; case 'growNodes': nodeEffectTimer = 240; nodeEffectType = 'grow'; break; case 'addCombo': combo.count += 5; break;} if(data.text){showSpecialEffectText(data.text,node.color)}} score += data.score * combo.count * currentMode.score_multiplier; gameSessionShards += data.shards; timer = Math.min(currentMode.max_timer, timer + currentMode.timer_gain_on_hit); combo.timer = combo.maxTime; combo.count++; showComboText(); playSound(data.sound); if (settings.particles) createParticles(node.x, node.y, 20, node.color); if (settings.shake) triggerScreenShake(5 + combo.count, 10); targetNodes.splice(index, 1); if(targetNodes.length < 5) spawnNode(); updateUI(); }
    function doGameOver() { gameState = 'gameover'; playSound('gameOver'); if (settings.shake) triggerScreenShake(15, 30); if (score > highscore) highscore = score; ui.finalScore.textContent = score.toLocaleString(); ui.shardsEarned.textContent = `+${gameSessionShards.toLocaleString()}`; ui.gameOverMenu.classList.remove('hidden'); ui.container.style.opacity = 0; ui.ingamePauseBtn.classList.add('hidden'); ui.gameOverOfferContainer.classList.remove('hidden'); ui.gameOverStandardContainer.classList.add('hidden'); }
    function finalizeGameOver(wasMultiplied) { let finalShards = gameSessionShards; if (wasMultiplied) { finalShards *= 2; ui.shardsEarned.innerHTML = `+${gameSessionShards.toLocaleString()} x 2 = <strong>+${finalShards.toLocaleString()}</strong>`; } coins += finalShards; saveProgress(); updateUI(); ui.gameOverOfferContainer.classList.add('hidden'); ui.gameOverStandardContainer.classList.remove('hidden'); }
    function pauseGame() { if (gameState !== 'playing') return; gameState = 'paused'; bgMusic.pause(); ui.pauseMenu.classList.remove('hidden'); ui.ingamePauseBtn.classList.add('hidden'); }
    function resumeGame() { if (gameState !== 'paused') return; gameState = 'playing'; if (settings.sound) bgMusic.play(); ui.pauseMenu.classList.add('hidden'); ui.ingamePauseBtn.classList.remove('hidden'); lastFrameTime = performance.now(); loop(); }
    function update(dT) { if (isFrozen) { freezeTimer--; if (freezeTimer <= 0) isFrozen = false; return; } if (gameState !== 'playing') return; timer -= dT; if (timer <= 0) { doGameOver(); return; } nodeEffectTimer=Math.max(0,nodeEffectTimer-1);if(nodeEffectTimer===0)nodeEffectType=null; targetNodes.forEach((node,index)=>{if(nodeEffectType==='shrink'){node.radius=Math.max(10,node.radius-0.5)}else if(nodeEffectType==='grow'){node.radius=Math.min(50,node.radius+0.5)}else{if(node.radius<node.maxRadius)node.radius+=0.5}if(node.type==='rainbow')node.color=`hsl(${Date.now()/10%360},100%,70%)`; const dist=Math.hypot(player.x-node.x,player.y-node.y);if(dist<player.radius+node.radius){if(node.type==='danger'){if(hasShield){hasShield=false;playSound('shield');showSpecialEffectText('SHIELD BROKEN!','#c0c0c0');targetNodes.splice(index,1);if(targetNodes.length<5)spawnNode();return}else{doGameOver();return}}onConnect(node,index);return}}); combo.timer--; if (combo.timer <= 0) combo.count = 1; updateParticles(); updateScreenShake(); }
    function draw() { ctx.clearRect(0, 0, width, height); ctx.save(); if (screenShake.intensity > 0) ctx.translate((Math.random() - .5) * screenShake.intensity, (Math.random() - .5) * screenShake.intensity); if (settings.particles) drawParticles(); let closestNode = null; let min_dist = Infinity; targetNodes.forEach(node => { const dist = Math.hypot(player.x - node.x, player.y - node.y); if (dist < min_dist) { min_dist = dist; closestNode = node; } drawNode(node, node.radius, node.color) }); if (closestNode && gameState === 'playing') { ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(closestNode.x, closestNode.y); ctx.strokeStyle = getVar('--glow-color'); ctx.lineWidth = 4; ctx.shadowColor = getVar('--glow-color'); ctx.shadowBlur = 20; ctx.stroke(); } if (hasShield) { ctx.beginPath(); ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2); ctx.strokeStyle = '#c0c0c0'; ctx.lineWidth = 4; ctx.stroke(); } if (gameState === 'playing' || gameState === 'paused') { const bW = timer / currentMode.max_timer * width / 2; ctx.fillStyle = getVar('--glow-color'); ctx.shadowColor = getVar('--glow-color'); ctx.shadowBlur = 10; ctx.fillRect(width / 2 - bW / 2, 20, bW, 10); } drawPlayerCursor(); ctx.restore(); }
    function loop(cT) { if (gameState === 'menu' || gameState === 'gameover') return; if (gameState === 'paused') { draw(); return; } const dT = cT - lastFrameTime; lastFrameTime = cT; update(isNaN(dT) ? 16 : dT); draw(); requestAnimationFrame(loop); }
    function menuLoop() { ctx.clearRect(0, 0, width, height); drawPlayerCursor(); if (gameState === 'menu') requestAnimationFrame(menuLoop); }
    function drawNode(n, r, c) { const p = Math.sin(Date.now() * .01) * 3 + r; ctx.beginPath(); ctx.arc(n.x, n.y, p, 0, Math.PI * 2); ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 30; ctx.fill(); ctx.shadowBlur = 0; }
    function drawPlayerCursor() { ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2); ctx.fillStyle = getVar('--glow-color') + '80'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.shadowColor = '#fff'; ctx.shadowBlur = 15; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; }
    function triggerScreenShake(i, d) { screenShake = { intensity: i, duration: d }; }
    function updateScreenShake() { if (screenShake.duration > 0) screenShake.duration--; else screenShake.intensity = 0; }
    function getVar(v) { return getComputedStyle(document.documentElement).getPropertyValue(v); }
    function showComboText() { if(combo.count > 1) { ui.combo.textContent = `x${combo.count} COMBO!`; ui.combo.classList.add('show'); setTimeout(() => ui.combo.classList.remove('show'), 400); } }
    function showSpecialEffectText(text, color) { ui.specialEffect.textContent = text; ui.specialEffect.style.color = color; ui.specialEffect.style.textShadow = `0 0 20px ${color}`; ui.specialEffect.classList.add('show'); setTimeout(() => ui.specialEffect.classList.remove('show'), 800); }
    function updateParticles() { for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx; p.y += p.vy; p.life--; if (p.life <= 0) particles.splice(i, 1); } }
    function drawParticles() { particles.forEach(p => { ctx.globalAlpha = p.life / 60; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1; }
    function createParticles(x, y, c, color) { for (let i = 0; i < c; i++) { const a = Math.random() * Math.PI * 2, s = Math.random() * 5 + 2; particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, radius: Math.random() * 3 + 1, life: 60, color: color || getVar('--secondary-glow') }); } }
    function resizeCanvas() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }

    // --- EVENT LISTENERS ---
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', e => { player.x = e.clientX; player.y = e.clientY; });
    canvas.addEventListener('touchmove', e => { e.preventDefault(); if (e.touches[0]) { player.x = e.touches[0].clientX; player.y = e.touches[0].clientY; } }, { passive: false });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') { if (gameState === 'playing') pauseGame(); else if (gameState === 'paused') resumeGame(); } });
    ui.playBtn.addEventListener('click', () => { if (bgMusic.paused) playRandomMusic(); ui.modeSelectMenu.classList.remove('hidden'); });
    ui.modeCloseBtn.addEventListener('click', () => ui.modeSelectMenu.classList.add('hidden'));
    ui.modeBtns.forEach(btn => btn.addEventListener('click', () => startGame(btn.dataset.mode)));
    ui.retryBtn.addEventListener('click', () => { ui.gameOverMenu.classList.add('hidden'); ui.modeSelectMenu.classList.remove('hidden'); });
    ui.ingamePauseBtn.addEventListener('click', pauseGame);
    ui.resumeBtn.addEventListener('click', resumeGame);
    ui.restartBtn.addEventListener('click', () => { ui.gameOverMenu.classList.add('hidden'); startGame(currentMode.name.toLowerCase().replace(' ', '_')); });
    ui.mainMenuBtn.addEventListener('click', goToMainMenu);
    ui.gameOverMainMenuBtn.addEventListener('click', goToMainMenu);
    ui.shopOpenBtn.addEventListener('click', () => { renderShop(); ui.shopMenu.classList.remove('hidden'); });
    ui.shopCloseBtn.addEventListener('click', () => ui.shopMenu.classList.add('hidden'));
    ui.settingsOpenBtn.addEventListener('click', () => ui.settingsMenu.classList.remove('hidden'));
    ui.settingsCloseBtn.addEventListener('click', () => ui.settingsMenu.classList.add('hidden'));
    ui.getCoinsBtn.addEventListener('click', async () => { const success = await ads.showRewardedVideo(); if (success) { coins += 500; saveProgress(); updateUI(); renderShop(); } });
    ui.themeGrid.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const tId = b.dataset.id; if (b.classList.contains('buy-btn') && !b.classList.contains('disabled')) { const c = parseInt(b.dataset.cost); if (coins >= c) { coins -= c; ownedThemes.push(tId); selectedTheme = tId; saveProgress(); applyTheme(tId); updateUI(); renderShop(); } } else if (b.classList.contains('select-btn')) { selectedTheme = tId; saveProgress(); applyTheme(tId); renderShop(); } });
    ui.soundToggle.addEventListener('change', () => { settings.sound = ui.soundToggle.checked; saveProgress(); toggleMusic(); });
    ui.particlesToggle.addEventListener('change', () => { settings.particles = ui.particlesToggle.checked; saveProgress(); });
    ui.shakeToggle.addEventListener('change', () => { settings.shake = ui.shakeToggle.checked; saveProgress(); });
    ui.multiplyShardsBtn.addEventListener('click', async () => { const success = await ads.showRewardedVideo(); finalizeGameOver(success); });
    ui.skipMultiplyBtn.addEventListener('click', () => { finalizeGameOver(false); });

    // --- Start everything ---
    resizeCanvas();
    loadProgress();
    updateUI();
    applyTheme(selectedTheme);
    applySettings();
    ads.initialize();
    goToMainMenu();
                                                                        }  
