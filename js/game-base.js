import{Save}from'./save.js';
import{DIFFICULTY,MODES}from'./config.js';
import{app,toast,modal,closeModal,bindHeader}from'./ui.js';
export class GameBase{
 constructor(mode,home){this.mode=mode;this.home=home;this.state=null;this.tab='overview';this.autosave=null}
 start(state){this.state=state;this.render();this.autosave=setInterval(()=>this.save(false),15000)}
 stop(){clearInterval(this.autosave)}
 save(show=true){const saved=Save.save(this.mode,this.state);if(show)toast(saved?'保存しました':'保存できませんでした。ブラウザの空き容量を確認してください',saved?'good':'bad');return saved}
 difficulty(){return DIFFICULTY[this.state.difficulty]}
 shell(content,tabs=''){return`${this.header()}<main class="content">${content}</main>${tabs}`}
 header(){const m=MODES[this.mode];return`<header class="topbar"><button class="icon-btn" id="back-home">←</button><div><div class="brand">${m.name}</div><div class="tiny muted">${this.state.turn}${m.unit}目・${this.state.difficulty}</div></div><div class="spacer"></div><button class="btn" id="manual-save">保存</button><button class="icon-btn" id="game-settings">⋯</button></header>`}
 bind(){bindHeader({back:()=>{this.save(false);this.stop();this.home()},save:()=>this.save(),settings:()=>this.settings()});document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{this.tab=b.dataset.tab;this.render()})}
 settings(){modal(`<h2>ゲームデータ</h2><p class="muted">このモードだけに適用されます。</p><div class="modal-actions"><button class="btn" id="close-settings">閉じる</button><button class="btn danger" id="delete-save">データ削除</button></div>`);document.querySelector('#close-settings').onclick=closeModal;document.querySelector('#delete-save').onclick=()=>{if(confirm('このモードのセーブデータを削除しますか？')){Save.remove(this.mode);closeModal();this.stop();this.home()}}}
 spend(amount){if(this.state.cash!==undefined){if(this.state.cash<amount){toast('資金が足りません','bad');return false}this.state.cash-=amount}else if(this.state.funds!==undefined){if(this.state.funds<amount){toast('市の資金が足りません','bad');return false}this.state.funds-=amount}else if(this.state.budget!==undefined){if(this.state.budget<amount){toast('国家予算が足りません','bad');return false}this.state.budget-=amount}return true}
 commit(){this.save(false);this.render()}
}
