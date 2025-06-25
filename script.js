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

    const ui = { container: document.getElementById('ui-container'), score: document.getElementById('score'), highscore: document.getElementById('highscore'), coins: document.getElementById('coins'), combo: document.getElementById('combo-display'), finalScore: document.getElementById('final-score'), shardsEarned: document.getElementById('shards-earned'), menu: document.getElementById('menu'), modeSelectMenu: document.getElementById('mode-select-menu'), pauseMenu: document.getElementById('pause-menu'), gameOverMenu: document.getElementById('game-over-menu'), shopMenu: document.getElementById('shop-menu'), settingsMenu: document.getElementById('settings-menu'), playBtn: document.getElementById('play-button'), retryBtn: document.getElementById('retry-button'), resumeBtn: document.getElementById('resume-button'), restartBtn: document.getElementById('restart-button'), mainMenuBtn: document.getElementById('main-menu-button'), gameOverMainMenuBtn: document.getElementById('gameover-main-menu-button'), settingsOpenBtn: document.getElementById('settings-open-button'), settingsCloseBtn: document.getElementById('settings-close-button'), shopOpenBtn: document.getElementById('shop-open-button'), shopCloseBtn: document.getElementById('shop-close-button'), modeCloseBtn: document.getElementById('mode-close-button'), ingamePauseBtn: document.getElementById('ingame-pause-button'), getCoinsBtn: document.getElementById('get-coins-button'), themeGrid: document.getElementById('theme-grid'), soundToggle: document.getElementById('sound-toggle'), particlesToggle: document.getElementById('particles-toggle'), shakeToggle: document.getElementById('shake-toggle'), modeBtns: document.querySelectorAll('.mode-btn')};

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const bgMusic = document.getElementById('bg-music');

    const musicTracks = [ 'https://assets.codepen.io/217233/aether.mp3', 'https://assets.codepen.io/217233/aether2.mp3', 'https://assets.codepen.io/217233/aether3.mp3' ];

    const themes = [{id:'cyber',name:'Cyber Glow',cost:0,rarity:'Common',colors:{'--glow-color':'#0ff','--secondary-glow':'#f0f','--special-glow':'#ff0','--danger-glow':'#f10','--dark-bg':'#0d0d1a','--light-text':'#e0e0ff','--bg-gradient-1':'rgba(100,100,255,.1)','--bg-gradient-2':'rgba(255,100,200,.1)'}},{id:'solar',name:'Solar Flare',cost:150,rarity:'Common',colors:{'--glow-color':'#fc0','--secondary-glow':'#f60','--special-glow':'#fff','--danger-glow':'#f10','--dark-bg':'#1a0d00','--light-text':'#ffe0b3','--bg-gradient-1':'rgba(255,200,0,.1)','--bg-gradient-2':'rgba(255,150,0,.1)'}},{id:'emerald',name:'Emerald Dream',cost:250,rarity:'Common',colors:{'--glow-color':'#50c878','--secondary-glow':'#a0d6b4','--special-glow':'#fff','--danger-glow':'#c70039','--dark-bg':'#08140e','--light-text':'#d0e0d8','--bg-gradient-1':'rgba(80,200,120,.1)','--bg-gradient-2':'rgba(46,139,87,.1)'}},{id:'oceanic',name:'Oceanic',cost:750,rarity:'Uncommon',colors:{'--glow-color':'#00a6ed','--secondary-glow':'#6495ed','--special-glow':'#f0f8ff','--danger-glow':'#ff4500','--dark-bg':'#030e1a','--light-text':'#cceeff','--bg-gradient-1':'rgba(0,166,237,.1)','--bg-gradient-2':'rgba(100,149,237,.1)'}},{id:'crimson',name:'Crimson Void',cost:1500,rarity:'Uncommon',colors:{'--glow-color':'#f22','--secondary-glow':'#faa','--special-glow':'#fff','--danger-glow':'#0f0','--dark-bg':'#1a0000','--light-text':'#fcc','--bg-gradient-1':'rgba(255,0,0,.1)','--bg-gradient-2':'rgba(150,0,0,.1)'}},{id:'amethyst',name:'Amethyst',cost:2500,rarity:'Uncommon',colors:{'--glow-color':'#9d00ff','--secondary-glow':'#d28cff','--special-glow':'#fdd5ff','--danger-glow':'#f10','--dark-bg':'#10031a','--light-text':'#eeccee','--bg-gradient-1':'rgba(157,0,255,.1)','--bg-gradient-2':'rgba(100,0,150,.1)'}},{id:'gold',name:'Gilded King',cost:1e4,rarity:'Rare',colors:{'--glow-color':'#ffd700','--secondary-glow':'#f0e68c','--special-glow':'#fff','--danger-glow':'#f10','--dark-bg':'#1a1400','--light-text':'#fffacd','--bg-gradient-1':'rgba(255,215,0,.1)','--bg-gradient-2':'rgba(200,160,0,.1)'}},{id:'sakura',name:'Sakura Dream',cost:15e3,rarity:'Rare',colors:{'--glow-color':'#ffb6c1','--secondary-glow':'#fff','--special-glow':'#f08080','--danger-glow':'#1f0','--dark-bg':'#281018','--light-text':'#ffe4e1','--bg-gradient-1':'rgba(255,182,193,.15)','--bg-gradient-2':'rgba(240,128,128,.15)'}},{id:'toxic',name:'Toxic Spill',cost:20000,rarity:'Rare',colors:{'--glow-color':'#7fff00','--secondary-glow':'#adff2f','--special-glow':'#fff','--danger-glow':'#da70d6','--dark-bg':'#0e1a05','--light-text':'#e0ffc1','--bg-gradient-1':'rgba(127,255,0,.1)','--bg-gradient-2':'rgba(173,255,47,.1)'}},{id:'monochrome',name:'Monochrome',cost:25e3,rarity:'Rare',colors:{'--glow-color':'#fff','--secondary-glow':'#aaa','--special-glow':'#888','--danger-glow':'#f10','--dark-bg':'#000','--light-text':'#ccc','--bg-gradient-1':'rgba(200,200,200,.1)','--bg-gradient-2':'rgba(100,100,100,.1)'}},{id:'nebula',name:'Nebula Haze',cost:1e5,rarity:'Epic',colors:{'--glow-color':'#f0f','--secondary-glow':'#0ff','--special-glow':'#fff','--danger-glow':'#ff0','--dark-bg':'#0c0014','--light-text':'#f0e0ff','--bg-gradient-1':'rgba(200,0,255,.15)','--bg-gradient-2':'rgba(0,200,255,.15)'}},{id:'hellfire',name:'Hellfire',cost:25e4,rarity:'Epic',colors:{'--glow-color':'#ff4500','--secondary-glow':'#fd0','--special-glow':'#f00','--danger-glow':'#0ff','--dark-bg':'#1a0500','--light-text':'#ffccaa','--bg-gradient-1':'rgba(255,69,0,.2)','--bg-gradient-2':'rgba(255,0,0,.2)'}},{id:'ice',name:'Glacial Heart',cost:5e5,rarity:'Epic',colors:{'--glow-color':'#afeeee','--secondary-glow':'#fff','--special-glow':'#0ff','--danger-glow':'#f10','--dark-bg':'#0a101a','--light-text':'#e0ffff','--bg-gradient-1':'rgba(175,238,238,.1)','--bg-gradient-2':'rgba(224,255,255,.1)'}},{id:'singularity',name:'Singularity',cost:1e7,rarity:'Legendary',colors:{'--glow-color':'#fff','--secondary-glow':'#000','--special-glow':'#fff','--danger-glow':'#f10','--dark-bg':'#000','--light-text':'#fff','--bg-gradient-1':'rgba(255,255,255,.1)','--bg-gradient-2':'rgba(255,255,255,.05)'}},{id:'aurora',name:'Aurora Borealis',cost:25e6,rarity:'Legendary',colors:{'--glow-color':'#7df9ff','--secondary-glow':'#39ff14','--special-glow':'#ff71ce','--danger-glow':'#f10','--dark-bg':'#030f1f','--light-text':'#e0ffff','--bg-gradient-1':'rgba(125,249,255,.2)','--bg-gradient-2':'rgba(57,255,20,.2)'}},{id:'living',name:'Living Constellation',cost:5e7,rarity:'Legendary',colors:{'--glow-color':'#fdfd96','--secondary-glow':'#fffacd','--special-glow':'#fff','--danger-glow':'#ff6347','--dark-bg':'#010413','--light-text':'#f5f5dc','--bg-gradient-1':'rgba(253,253,150,.15)','--bg-gradient-2':'rgba(255,250,205,.15)'}},{id:'first_weave',name:'The First Weave',cost:5e10,rarity:'Mythic',colors:{'--glow-color':'#fff','--secondary-glow':'#ffd700','--special-glow':'#0ff','--danger-glow':'#f00','--dark-bg':'#000','--light-text':'#fff','--bg-gradient-1':'rgba(255,255,255,.2)','--bg-gradient-2':'rgba(255,215,0,.1)'}},{id:'broken_code',name:'Broken Code',cost:25e10,rarity:'Mythic',colors:{'--glow-color':'#0f0','--secondary-glow':'#f00','--special-glow':'#fff','--danger-glow':'#00f','--dark-bg':'#000','--light-text':'#0f0','--bg-gradient-1':'rgba(0,255,0,.1)','--bg-gradient-2':'rgba(255,0,0,.1)'}},{id:'celestial',name:'Celestial Forge',cost:1e12,rarity:'Mythic',colors:{'--glow-color':'#c0c0c0','--secondary-glow':'#ffd700','--special-glow':'#e5e4e2','--danger-glow':'#b22222','--dark-bg':'#191970','--light-text':'#f0f8ff','--bg-gradient-1':'rgba(192,192,192,.2)','--bg-gradient-2':'rgba(255,215,0,.2)'}}];

    const gameModes = { classic: { name: "Classic", max_timer: 6000, timer_gain_on_hit: 400, score_multiplier: 1, coin_chance: 0.1, has_danger_nodes: false, nodes_shrink: false, }, sudden_death: { name: "Sudden Death", max_timer: 2500, timer_gain_on_hit: 200, score_multiplier: 2, coin_chance: 0.05, has_danger_nodes: false, nodes_shrink: false, }, minefield: { name: "Minefield", max_timer: 7000, timer_gain_on_hit: 450, score_multiplier: 1.5, coin_chance: 0.1, has_danger_nodes: true, danger_node_chance: 0.2, nodes_shrink: false, }, shrinking: { name: "Shrinking Nodes", max_timer: 6000, timer_gain_on_hit: 500, score_multiplier: 1.2, coin_chance: 0.1, has_danger_nodes: false, nodes_shrink: true, shrink_rate: 0.1, } };

    let currentMode = gameModes.classic, gameState = 'menu', score = 0, coins, highscore, ownedThemes, selectedTheme, settings;

    let gameSessionShards = 0, player = { x: 0, y: 0, radius: 15 }, anchorNode, targetNode, timer, lastFrameTime = 0, particles = [], screenShake = { intensity: 0, duration: 0 }, combo = { count: 0, timer: 0, maxTime: 120 }, isFrozen = false, freezeTimer = 0;
    function loadProgress() { highscore = parseInt(localStorage.getItem('aetherWeaveHighscore') || '0'); coins = parseInt(localStorage.getItem('aetherWeaveCoins') || '0'); ownedThemes = JSON.parse(localStorage.getItem('aetherWeaveOwnedThemes') || '["cyber"]'); selectedTheme = localStorage.getItem('aetherWeaveSelectedTheme') || 'cyber'; settings = JSON.parse(localStorage.getItem('aetherWeaveSettings') || '{"sound":true,"particles":true,"shake":true}'); }

    function saveProgress() { localStorage.setItem('aetherWeaveHighscore', highscore); localStorage.setItem('aetherWeaveCoins', coins); localStorage.setItem('aetherWeaveOwnedThemes', JSON.stringify(ownedThemes)); localStorage.setItem('aetherWeaveSelectedTheme', selectedTheme); localStorage.setItem('aetherWeaveSettings', JSON.stringify(settings)); }

    

    // UPDATED ADS LOGIC for admob-plus

    const ads = {

        banner: null,

        rewarded: null,

        initialize: async function() {

            if (typeof admob === 'undefined') { console.log("AdMob plugin not found. Ads will not run."); return; }

            await admob.start();

            this.banner = new admob.BannerAd({ adUnitId: 'ca-app-pub-6989088248302599/1900301188' });

            this.rewarded = new admob.RewardedAd({ adUnitId: 'ca-app-pub-6989088248302599/1842760742' });

        },

        showBanner: async function() { if(this.banner) await this.banner.show(); },

        hideBanner: async function() { if(this.banner) await this.banner.hide(); },

        showRewardedVideo: async function() {

            if (!this.rewarded) { console.log("Ads not ready."); return false; }

            try {

                await this.rewarded.load();

                await this.rewarded.show();

                return true; // Assume success if show() doesn't throw

            } catch (e) {

                console.error("Rewarded ad error:", e);

                return false;

            }

        }

    };

    

    function updateUI() { ui.highscore.textContent = highscore.toLocaleString(); ui.coins.textContent = coins.toLocaleString(); ui.score.textContent = score.toLocaleString(); }

    function renderShop() { ui.themeGrid.innerHTML = ''; const s = [...themes].sort((a, b) => { const r = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'], rA = r.indexOf(a.rarity), rB = r.indexOf(b.rarity); if (rA !== rB) return rA - rB; return a.cost - b.cost; }); s.forEach(t => { const isO = ownedThemes.includes(t.id), isS = selectedTheme === t.id, canA = coins >= t.cost, i = document.createElement('div'); i.className = `theme-item ${isO ? 'owned' : ''} ${isS ? 'selected' : ''}`; let b; if (isS) { b = `<button class="disabled">SELECTED</button>` } else if (isO) { b = `<button class="select-btn" data-id="${t.id}">SELECT</button>` } else { b = `<button class="buy-btn ${canA ? '' : 'disabled'}" data-id="${t.id}" data-cost="${t.cost}">BUY (${t.cost.toLocaleString()})</button>` } const p = `background-color:${t.colors['--dark-bg']};border:2px solid ${t.colors['--glow-color']};color:${t.colors['--light-text']}`; i.innerHTML = `<div class="rarity rarity-${t.rarity}">${t.rarity}</div><h3>${t.name}</h3><div class="theme-preview" style="${p}">PREVIEW</div><div class="price">${isO ? 'Owned' : ''}</div>${b}`; ui.themeGrid.appendChild(i); }); }

    function applyTheme(themeId) { const t = themes.find(t => t.id === themeId); if (!t) return; for (const [k, v] of Object.entries(t.colors)) document.documentElement.style.setProperty(k, v); }

    function applySettings() { ui.soundToggle.checked = settings.sound; ui.particlesToggle.checked = settings.particles; ui.shakeToggle.checked = settings.shake; }

    function playRandomMusic() { if (settings.sound) { bgMusic.src = musicTracks[Math.floor(Math.random() * musicTracks.length)]; bgMusic.play().catch(e => {}); } }

    function toggleMusic() { if (settings.sound && gameState !== 'playing') { playRandomMusic(); } else { bgMusic.pause(); } }

    function playSound(type) { if (!settings.sound) return; const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); let f = 440, v = .3, d = .1, w = 'sine'; if (type === 'connect') { f = 440 + combo.count * 10; } else if (type === 'gameOver') { f = 220; d = .8; w = 'sawtooth'; } else if (type === 'coin') { f = 880; v = .4; w = 'triangle'; } o.type = w; o.frequency.setValueAtTime(f, audioCtx.currentTime); g.gain.setValueAtTime(v, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + d); o.start(); o.stop(audioCtx.currentTime + d); }

    function startGame(modeId) { currentMode = gameModes[modeId]; gameState = 'playing'; score = 0; gameSessionShards = 0; timer = currentMode.max_timer; combo.count = 1; updateUI(); ui.menu.classList.add('hidden'); ui.gameOverMenu.classList.add('hidden'); ui.pauseMenu.classList.add('hidden'); ui.modeSelectMenu.classList.add('hidden'); ui.container.style.opacity = 1; ui.ingamePauseBtn.classList.remove('hidden'); ads.hideBanner(); anchorNode = { x: width / 2, y: height / 2 }; spawnTargetNode(); if (bgMusic.paused && settings.sound) bgMusic.play(); loop(); }

    function goToMainMenu() { gameState = 'menu'; score = 0; ui.gameOverMenu.classList.add('hidden'); ui.pauseMenu.classList.add('hidden'); ui.modeSelectMenu.classList.add('hidden'); ui.menu.classList.remove('hidden'); ui.container.style.opacity = 0; ui.ingamePauseBtn.classList.add('hidden'); updateUI(); ads.showBanner(); menuLoop(); }

    function spawnTargetNode() { const m = 100, isC = Math.random() < currentMode.coin_chance, isD = currentMode.has_danger_nodes && Math.random() < currentMode.danger_node_chance; let t = 'normal'; if (isD) t = 'danger'; else if (isC) t = 'coin'; targetNode = { x: Math.random() * (width - m * 2) + m, y: Math.random() * (height - m * 2) + m, radius: t === 'coin' ? 30 : 25, maxRadius: t === 'coin' ? 30 : 25, type: t }; }

    function onConnect() { if (targetNode.type === 'danger') { playSound('gameOver'); triggerScreenShake(30, 30); doGameOver(); return; } isFrozen = true; freezeTimer = 2; const sG = (1 * combo.count) * currentMode.score_multiplier; score += sG; let shG = 1; if (targetNode.type === 'coin') { shG = 25; playSound('coin'); } else { playSound('connect'); } gameSessionShards += shG; timer = Math.min(currentMode.max_timer, timer + currentMode.timer_gain_on_hit - (score * .1)); combo.timer = combo.maxTime; combo.count++; showComboText(); if (settings.particles) createParticles(targetNode.x, targetNode.y, 20); if (settings.shake) triggerScreenShake(5 + combo.count, 10); anchorNode = { x: targetNode.x, y: targetNode.y }; spawnTargetNode(); updateUI(); }

    function doGameOver() { gameState = 'gameover'; playSound('gameOver'); if (settings.shake) triggerScreenShake(15, 30); coins += gameSessionShards; if (score > highscore) highscore = score; saveProgress(); ui.finalScore.textContent = score.toLocaleString(); ui.shardsEarned.textContent = `+${gameSessionShards.toLocaleString()}`; updateUI(); ui.gameOverMenu.classList.remove('hidden'); ui.container.style.opacity = 0; ui.ingamePauseBtn.classList.add('hidden'); }

    function pauseGame() { if (gameState !== 'playing') return; gameState = 'paused'; bgMusic.pause(); ui.pauseMenu.classList.remove('hidden'); ui.ingamePauseBtn.classList.add('hidden'); }

    function resumeGame() { if (gameState !== 'paused') return; gameState = 'playing'; if (settings.sound) bgMusic.play(); ui.pauseMenu.classList.add('hidden'); ui.ingamePauseBtn.classList.remove('hidden'); lastFrameTime = performance.now(); loop(); }

    function update(dT) { if (isFrozen) { freezeTimer--; if (freezeTimer <= 0) isFrozen = false; return; } if (gameState !== 'playing') return; timer -= dT; if (timer <= 0) { doGameOver(); return; } combo.timer--; if (combo.timer <= 0) combo.count = 1; if (currentMode.nodes_shrink && targetNode.radius > 5) { targetNode.radius -= currentMode.shrink_rate; if (targetNode.radius <= 5) { combo.count = 1; spawnTargetNode(); } } const dX = player.x - targetNode.x, dY = player.y - targetNode.y; if (Math.sqrt(dX * dX + dY * dY) < player.radius + targetNode.radius) onConnect(); updateParticles(); updateScreenShake(); }

    function draw() { ctx.clearRect(0, 0, width, height); ctx.save(); if (screenShake.intensity > 0) ctx.translate((Math.random() - .5) * screenShake.intensity, (Math.random() - .5) * screenShake.intensity); if (settings.particles) drawParticles(); if (gameState === 'playing' || gameState === 'paused') { ctx.beginPath(); ctx.moveTo(anchorNode.x, anchorNode.y); ctx.lineTo(player.x, player.y); ctx.strokeStyle = getVar('--glow-color'); ctx.lineWidth = 4; ctx.shadowColor = getVar('--glow-color'); ctx.shadowBlur = 20; ctx.stroke(); drawNode(anchorNode, 8, getVar('--glow-color')); let tC; switch (targetNode.type) { case 'coin': tC = getVar('--special-glow'); break; case 'danger': tC = getVar('--danger-glow'); break; default: tC = getVar('--secondary-glow'); } drawNode(targetNode, targetNode.radius, tC); const bW = timer / currentMode.max_timer * width / 2; ctx.fillStyle = getVar('--glow-color'); ctx.shadowColor = getVar('--glow-color'); ctx.shadowBlur = 10; ctx.fillRect(width / 2 - bW / 2, 20, bW, 10); } drawPlayerCursor(); ctx.restore(); }

    function loop(cT) { if (gameState === 'menu' || gameState === 'gameover') return; if (gameState === 'paused') { draw(); return; } const dT = cT - lastFrameTime; lastFrameTime = cT; update(isNaN(dT) ? 16 : dT); draw(); requestAnimationFrame(loop); }

    function menuLoop() { ctx.clearRect(0, 0, width, height); drawPlayerCursor(); if (gameState === 'menu') requestAnimationFrame(menuLoop); }

    function drawNode(n, r, c) { const p = Math.sin(Date.now() * .01) * 5 + r; ctx.beginPath(); ctx.arc(n.x, n.y, p, 0, Math.PI * 2); ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 30; ctx.fill(); ctx.shadowBlur = 0; }

    function drawPlayerCursor() { ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2); ctx.fillStyle = getVar('--glow-color') + '80'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.shadowColor = '#fff'; ctx.shadowBlur = 15; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; }

    function triggerScreenShake(i, d) { screenShake = { intensity: i, duration: d }; }

    function updateScreenShake() { if (screenShake.duration > 0) screenShake.duration--; else screenShake.intensity = 0; }

    function getVar(v) { return getComputedStyle(document.documentElement).getPropertyValue(v); }

    function showComboText() { ui.combo.textContent = `x${combo.count} COMBO!`; ui.combo.classList.add('show'); setTimeout(() => ui.combo.classList.remove('show'), 400); }

    function updateParticles() { for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx; p.y += p.vy; p.life--; if (p.life <= 0) particles.splice(i, 1); } }

    function drawParticles() { particles.forEach(p => { ctx.globalAlpha = p.life / 60; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1; }

    function createParticles(x, y, c) { for (let i = 0; i < c; i++) { const a = Math.random() * Math.PI * 2, s = Math.random() * 5 + 2; particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, radius: Math.random() * 3 + 1, life: 60, color: Math.random() > .3 ? getVar('--glow-color') : getVar('--secondary-glow') }); } }

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

    ui.restartBtn.addEventListener('click', () => startGame(currentMode.name.toLowerCase().replace(' ', '_')));

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

    // --- Start everything ---

    resizeCanvas();

    loadProgress();

    updateUI();

    applyTheme(selectedTheme);

    applySettings();

    ads.initialize();

    goToMainMenu();

}