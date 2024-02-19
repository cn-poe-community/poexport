var Creator=function(){"use strict";class e{constructor(){this.level=0,this.className="None",this.ascendClassName="None"}toString(){return`<Build level="${this.level}" className="${this.className}" ascendClassName="${this.ascendClassName}" targetVersion="3_0" mainSocketGroup="1" viewMode="ITEMS">\n</Build>`}}
/*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */var t=Object.prototype.toString,n=Array.isArray||function(e){return"[object Array]"===t.call(e)};function s(e){return"function"==typeof e}function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function r(e,t){return null!=e&&"object"==typeof e&&t in e}var o=RegExp.prototype.test;var a=/\S/;function l(e){return!function(e,t){return o.call(e,t)}(a,e)}var c={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};var d=/\s*/,p=/\s+/,u=/\s*=/,h=/\s*\}/,f=/#|\^|\/|>|\{|&|=|!/;function m(e){this.string=e,this.tail=e,this.pos=0}function v(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function g(){this.templateCache={_cache:{},set:function(e,t){this._cache[e]=t},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}m.prototype.eos=function(){return""===this.tail},m.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},m.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},v.prototype.push=function(e){return new v(e,this)},v.prototype.lookup=function(e){var t,n,i,o=this.cache;if(o.hasOwnProperty(e))t=o[e];else{for(var a,l,c,d=this,p=!1;d;){if(e.indexOf(".")>0)for(a=d.view,l=e.split("."),c=0;null!=a&&c<l.length;)c===l.length-1&&(p=r(a,l[c])||(n=a,i=l[c],null!=n&&"object"!=typeof n&&n.hasOwnProperty&&n.hasOwnProperty(i))),a=a[l[c++]];else a=d.view[e],p=r(d.view,e);if(p){t=a;break}d=d.parent}o[e]=t}return s(t)&&(t=t.call(this.view)),t},g.prototype.clearCache=function(){void 0!==this.templateCache&&this.templateCache.clear()},g.prototype.parse=function(e,t){var s=this.templateCache,r=e+":"+(t||y.tags).join(":"),o=void 0!==s,a=o?s.get(r):void 0;return null==a&&(a=function(e,t){if(!e)return[];var s,r,o,a=!1,c=[],v=[],g=[],x=!1,w=!1,I="",S=0;function k(){if(x&&!w)for(;g.length;)delete v[g.pop()];else g=[];x=!1,w=!1}function b(e){if("string"==typeof e&&(e=e.split(p,2)),!n(e)||2!==e.length)throw new Error("Invalid tags: "+e);s=new RegExp(i(e[0])+"\\s*"),r=new RegExp("\\s*"+i(e[1])),o=new RegExp("\\s*"+i("}"+e[1]))}b(t||y.tags);for(var E,C,z,M,J,T,L=new m(e);!L.eos();){if(E=L.pos,z=L.scanUntil(s))for(var N=0,$=z.length;N<$;++N)l(M=z.charAt(N))?(g.push(v.length),I+=M):(w=!0,a=!0,I+=" "),v.push(["text",M,E,E+1]),E+=1,"\n"===M&&(k(),I="",S=0,a=!1);if(!L.scan(s))break;if(x=!0,C=L.scan(f)||"name",L.scan(d),"="===C?(z=L.scanUntil(u),L.scan(u),L.scanUntil(r)):"{"===C?(z=L.scanUntil(o),L.scan(h),L.scanUntil(r),C="&"):z=L.scanUntil(r),!L.scan(r))throw new Error("Unclosed tag at "+L.pos);if(J=">"==C?[C,z,E,L.pos,I,S,a]:[C,z,E,L.pos],S++,v.push(J),"#"===C||"^"===C)c.push(J);else if("/"===C){if(!(T=c.pop()))throw new Error('Unopened section "'+z+'" at '+E);if(T[1]!==z)throw new Error('Unclosed section "'+T[1]+'" at '+E)}else"name"===C||"{"===C||"&"===C?w=!0:"="===C&&b(z)}if(k(),T=c.pop())throw new Error('Unclosed section "'+T[1]+'" at '+L.pos);return function(e){for(var t,n=[],s=n,i=[],r=0,o=e.length;r<o;++r)switch((t=e[r])[0]){case"#":case"^":s.push(t),i.push(t),s=t[4]=[];break;case"/":i.pop()[5]=t[2],s=i.length>0?i[i.length-1][4]:n;break;default:s.push(t)}return n}(function(e){for(var t,n,s=[],i=0,r=e.length;i<r;++i)(t=e[i])&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(s.push(t),n=t));return s}(v))}(e,t),o&&s.set(r,a)),a},g.prototype.render=function(e,t,n,s){var i=this.getConfigTags(s),r=this.parse(e,i),o=t instanceof v?t:new v(t,void 0);return this.renderTokens(r,o,n,e,s)},g.prototype.renderTokens=function(e,t,n,s,i){for(var r,o,a,l="",c=0,d=e.length;c<d;++c)a=void 0,"#"===(o=(r=e[c])[0])?a=this.renderSection(r,t,n,s,i):"^"===o?a=this.renderInverted(r,t,n,s,i):">"===o?a=this.renderPartial(r,t,n,i):"&"===o?a=this.unescapedValue(r,t):"name"===o?a=this.escapedValue(r,t,i):"text"===o&&(a=this.rawValue(r)),void 0!==a&&(l+=a);return l},g.prototype.renderSection=function(e,t,i,r,o){var a=this,l="",c=t.lookup(e[1]);if(c){if(n(c))for(var d=0,p=c.length;d<p;++d)l+=this.renderTokens(e[4],t.push(c[d]),i,r,o);else if("object"==typeof c||"string"==typeof c||"number"==typeof c)l+=this.renderTokens(e[4],t.push(c),i,r,o);else if(s(c)){if("string"!=typeof r)throw new Error("Cannot use higher-order sections without the original template");null!=(c=c.call(t.view,r.slice(e[3],e[5]),(function(e){return a.render(e,t,i,o)})))&&(l+=c)}else l+=this.renderTokens(e[4],t,i,r,o);return l}},g.prototype.renderInverted=function(e,t,s,i,r){var o=t.lookup(e[1]);if(!o||n(o)&&0===o.length)return this.renderTokens(e[4],t,s,i,r)},g.prototype.indentPartial=function(e,t,n){for(var s=t.replace(/[^ \t]/g,""),i=e.split("\n"),r=0;r<i.length;r++)i[r].length&&(r>0||!n)&&(i[r]=s+i[r]);return i.join("\n")},g.prototype.renderPartial=function(e,t,n,i){if(n){var r=this.getConfigTags(i),o=s(n)?n(e[1]):n[e[1]];if(null!=o){var a=e[6],l=e[5],c=e[4],d=o;0==l&&c&&(d=this.indentPartial(o,c,a));var p=this.parse(d,r);return this.renderTokens(p,t,n,d,i)}}},g.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return n},g.prototype.escapedValue=function(e,t,n){var s=this.getConfigEscape(n)||y.escape,i=t.lookup(e[1]);if(null!=i)return"number"==typeof i&&s===y.escape?String(i):s(i)},g.prototype.rawValue=function(e){return e[1]},g.prototype.getConfigTags=function(e){return n(e)?e:e&&"object"==typeof e?e.tags:void 0},g.prototype.getConfigEscape=function(e){return e&&"object"==typeof e&&!n(e)?e.escape:void 0};var y={name:"mustache.js",version:"4.2.0",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(e){x.templateCache=e},get templateCache(){return x.templateCache}},x=new g;y.clearCache=function(){return x.clearCache()},y.parse=function(e,t){return x.parse(e,t)},y.render=function(e,t,s,i){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+((n(r=e)?"array":typeof r)+'" was given as the first argument for mustache#render(template, view, partials)'));var r;return x.render(e,t,s,i)},y.escape=function(e){return String(e).replace(/[&<>"'`=\/]/g,(function(e){return c[e]}))},y.Scanner=m,y.Context=v,y.Writer=g;class w{constructor(){this.useFrenzyCharges=void 0,this.usePowerCharges=void 0,this.useEnduranceCharges=void 0,this.multiplierGaleForce=10,this.buffOnslaught=void 0,this.buffArcaneSurge=void 0,this.buffUnholyMight=void 0,this.buffFortification=void 0,this.buffTailwind=void 0,this.buffAdrenaline=void 0,this.conditionOnConsecratedGround=void 0,this.brandAttachedToEnemy=!0,this.configResonanceCount=50,this.projectileDistance=void 0,this.conditionEnemyBlinded=void 0,this.overrideBuffBlinded=void 0,this.conditionEnemyBurning=void 0,this.conditionEnemyIgnited=void 0,this.conditionEnemyChilled=void 0,this.conditionEnemyChilledEffect=void 0,this.conditionEnemyShocked=void 0,this.conditionShockEffect=void 0,this.conditionEnemyScorched=void 0,this.conditionScorchedEffect=void 0,this.conditionEnemyBrittle=void 0,this.conditionBrittleEffect=void 0,this.conditionEnemySapped=void 0,this.conditionSapEffect=void 0,this.conditionEnemyIntimidated=void 0,this.conditionEnemyCrushed=void 0,this.conditionEnemyUnnerved=void 0,this.conditionEnemyCoveredInFrost=void 0,this.conditionEnemyCoveredInAsh=void 0,this.enemyIsBoss="Pinnacle"}toString(){let e=[];for(const[t,n]of Object.entries(this))if(void 0!==n){let s=new I(t,typeof n,n);e.push(s)}return y.render("<Config>\n{{#inputs}}\n{{.}}\n{{/inputs}}\n</Config>",{inputs:e})}}class I{constructor(e,t,n){this.name=e,this.type=t,this.val=n}toString(){return`<Input name="${this.name}" ${this.type}="${this.val}"/>`}}class S{constructor(e,t,n){this.itemPbURL="",this.name=e,this.itemId=t,this.nodeId=n,this.active=!1}static NewEquipmentSlot(e,t){const n=new S(e,t,void 0);return n.name.startsWith("Flask ")&&(n.active=!0),n}static NewJewelSlot(e,t){return new S(e,void 0,t)}toString(){const e=`<Slot itemPbURL="${this.itemPbURL}" {{#active}}active="{{active}}"{{/active}} name="{{name}}" {{#itemId}}itemId="{{itemId}}"{{/itemId}} {{#nodeId}}nodeId="{{nodeId}}"{{/nodeId}}/>`;return y.render(e,this)}}class k{constructor(){this.useSecondWeaponSet=!1,this.id=1,this.slots=[]}append(e){this.slots.push(e)}toString(){const e=`<ItemSet useSecondWeaponSet="${this.useSecondWeaponSet}" id="${this.id}">\n{{#slots}}\n{{.}}\n{{/slots}}\n</ItemSet>`;return y.render(e,this)}}function b(e){if(e){const t=e.match(/\d+/g);if(t)return Number(t[0])}}function E(e,t){let n=b(e);return n||(n=t),n}const C={0:"NORMAL",1:"MAGIC",2:"RARE",3:"UNIQUE",9:"RELIC",10:"RELIC"};const z={"Doppelgänger Guise":"Doppelganger Guise","Mjölner":"Mjolner"},M={"Maelström Staff":"Maelstrom Staff"};class J{constructor(e,t){this.id=e,this.json=t}viewModel(){var e,t,n,s,i,r,o,a,l,c,d,p,u,h;const f={},m=this.json;var v;if(f.rarity=(v=this.json.frameType,C[v]),f.name=m.name,f.baseType=m.baseType,f.typeLine=m.typeLine,m.name)z[m.name]&&(f.name=z[m.name]),M[m.baseType]&&(f.baseType=M[m.baseType]);else{const e=m.typeLine;for(let t in M)if(e.includes(t)){f.typeLine=e.replace(t,M[t]);break}}const g=new Map;m.properties&&m.properties.forEach((e=>g.set(e.name,e)));const y=null===(e=g.get("Quality"))||void 0===e?void 0:e.values[0][0];f.quality=b(y),f.evasionRating=null===(t=g.get("Evasion Rating"))||void 0===t?void 0:t.values[0][0],f.energyShield=null===(n=g.get("Energy Shield"))||void 0===n?void 0:n.values[0][0],f.armour=null===(s=g.get("Armour"))||void 0===s?void 0:s.values[0][0],f.ward=null===(i=g.get("Ward"))||void 0===i?void 0:i.values[0][0],f.radius=null===(r=g.get("Radius"))||void 0===r?void 0:r.values[0][0],f.limitedTo=null===(o=g.get("Limited to"))||void 0===o?void 0:o.values[0][0];const x=new Map;if(m.requirements&&m.requirements.forEach((e=>x.set(e.name,e))),f.requireClass=null===(a=x.get("Class:"))||void 0===a?void 0:a.values[0][0],f.enchantMods=null===(l=m.enchantMods)||void 0===l?void 0:l.map((e=>e.split("\n"))).flat(),f.implicitMods=null===(c=m.implicitMods)||void 0===c?void 0:c.map((e=>e.split("\n"))).flat(),f.explicitMods=null===(d=m.explicitMods)||void 0===d?void 0:d.map((e=>e.split("\n"))).flat(),f.craftedMods=null===(p=m.craftedMods)||void 0===p?void 0:p.map((e=>e.split("\n"))).flat(),f.fracturedMods=null===(u=m.fracturedMods)||void 0===u?void 0:u.map((e=>e.split("\n"))).flat(),f.crucibleMods=null===(h=m.crucibleMods)||void 0===h?void 0:h.map((e=>e.split("\n"))).flat(),m.sockets){const e=m.sockets,t=[e[0].sColour];for(let n=1;n<e.length;n++)t.push(e[n].group===e[n-1].group?"-":" "),t.push(e[n].sColour);f.sockets=t.join("")}let w=0;return f.enchantMods&&(w+=f.enchantMods.length),f.implicitMods&&(w+=f.implicitMods.length),f.implicitCount=w,m.influences&&Object.assign(f,m.influences),f.id=m.id,f.searing=m.searing,f.tangled=m.tangled,f.ilvl=m.ilvl,f.corrupted=m.corrupted,f}toString(){const e=`<Item id="${this.id}">\nRarity: {{rarity}}\n{{#name}}\n{{name}}\n{{baseType}}\n{{/name}}\n{{^name}}\n{{typeLine}}\n{{/name}}\n{{#evasionRating}}\nEvasion: {{evasionRating}}\n{{/evasionRating}}\n{{#energyShield}}\nEnergy Shield: {{energyShield}}\n{{/energyShield}}\n{{#armour}}\nArmour: {{armour}}\n{{/armour}}\n{{#ward}}\nWard: {{ward}}\n{{/ward}}\nUnique ID: {{id}}\n{{#shaper}}\nShaper Item\n{{/shaper}}\n{{#elder}}\nElder Item\n{{/elder}}\n{{#warlord}}\nWarlord Item\n{{/warlord}}\n{{#hunter}}\nHunter Item\n{{/hunter}}\n{{#crusader}}\nCrusader Item\n{{/crusader}}\n{{#redeemer}}\nRedeemer Item\n{{/redeemer}}\n{{#searing}}\nSearing Exarch Item\n{{/searing}}\n{{#tangled}}\nEater of Worlds Item\n{{/tangled}}\nItem Level: {{ilvl}}\n{{#quality}}\nQuality: {{quality}}\n{{/quality}}\n{{#sockets}}\nSockets: {{sockets}}\n{{/sockets}}\n{{#radius}}\nRadius: {{radius}}\n{{/radius}}\n{{#limitedTo}}\nLimited to: {{limitedTo}}\n{{/limitedTo}}\n{{#requireClass}}\nRequires Class {{requireClass}}\n{{/requireClass}}\nImplicits: {{implicitCount}}\n{{#enchantMods}}\n{crafted}{{.}}\n{{/enchantMods}}\n{{#implicitMods}}\n{{.}}\n{{/implicitMods}}\n{{#explicitMods}}\n{{.}}\n{{/explicitMods}}\n{{#fracturedMods}}\n{fractured}{{.}}\n{{/fracturedMods}}\n{{#craftedMods}}\n{crafted}{{.}}\n{{/craftedMods}}\n{{#crucibleMods}}\n{crucible}{{.}}\n{{/crucibleMods}}\n{{#corrupted}}\nCorrupted\n{{/corrupted}}\n</Item>`;return y.render(e,this.viewModel())}}class T{constructor(){this.itemList=[],this.itemSet=new k}toString(){const e=`<Items>\n{{#itemList}}\n{{.}}\n{{/itemList}}\n${this.itemSet}\n</Items>`;return y.render(e,this)}}class L{constructor(){this.skillSet=new N}toString(){return`<Skills activeSkillSet="1">\n${this.skillSet}\n</Skills>`}}class N{constructor(){this.skills=[]}toString(){return y.render('<SkillSet id="1">\n{{#skills}}\n{{toString}}\n{{/skills}}\n</SkillSet>',this)}}class ${constructor(e,t){this.slot="",this.gems=[],this.slot=e;for(const e of t)this.gems.push(new R(e))}toString(){return y.render('<Skill enabled="true" slot="{{slot}}" mainActiveSkill="nil">\n{{#gems}}\n{{.}}\n{{/gems}}\n</Skill>',this)}}class R{constructor(e){var t,n;this.level=20,this.qualityId="Default",this.quality=0,this.nameSpec="";const s=new Map;e.properties&&e.properties.forEach((e=>s.set(e.name,e))),this.level=E(null===(t=s.get("Level"))||void 0===t?void 0:t.values[0][0],20),this.quality=E(null===(n=s.get("Quality"))||void 0===n?void 0:n.values[0][0],0),this.nameSpec=e.baseType.replace(" Support","")}toString(){return y.render('<Gem level="{{level}}" qualityId="{{qualityId}}" quality="{{quality}}" enabled="true" nameSpec="{{nameSpec}}"/>',this)}}class j{constructor(){this.spec=new A}toString(){return`<Tree activeSpec="1">\n${this.spec}\n</Tree>`}}class A{constructor(){this.treeVersion="3_23",this.ascendClassId=0,this.secondaryAscendClassId=0,this.classId=0,this.masteryEffects=[],this.nodes=[],this.sockets=new q,this.overrides=new B}viewModel(){const e={};return e.masteryEffectsView=this.masteryEffects.map((e=>e.toString())).join(","),e.nodesView=this.nodes.join(","),Object.assign({},this,e)}toString(){return y.render('<Spec treeVersion="{{treeVersion}}" ascendClassId="{{ascendClassId}}" secondaryAscendClassId="{{secondaryAscendClassId}}" classId="{{classId}}" masteryEffects="{{masteryEffectsView}}" nodes="{{nodesView}}">\n{{sockets}}\n{{overrides}}\n</Spec>',this.viewModel())}}class O{constructor(e,t){this.nodeId=e,this.effectId=t}toString(){return`{${this.nodeId},${this.effectId}}`}}class q{constructor(){this.sockets=[]}append(e){this.sockets.push(e)}toString(){return y.render("<Sockets>\n{{#sockets}}\n{{toString}}\n{{/sockets}}\n</Sockets>",this)}}class D{constructor(e,t){this.nodeId=0,this.itemId=0,this.nodeId=e,this.itemId=t}toString(){return`<Socket nodeId="${this.nodeId}" itemId="${this.itemId}"/>`}}class B{constructor(){this.members=[]}parse(e){this.members=[];for(const[t,n]of Object.entries(e))this.members.push(new U(t,n))}toString(){return y.render("<Overrides>\n{{#members}}\n{{.}}\n{{/members}}\n</Overrides>",this)}}class U{constructor(e,t){this.dn=t.name,this.icon=t.icon,this.nodeId=e,this.activeEffectImage=t.activeEffectImage,this.stats=t.stats}toString(){const e=`<Override dn="${this.dn}" icon="${this.icon}" nodeId="${this.nodeId}" activeEffectImage="${this.activeEffectImage}">\n{{#stats}}\n{{.}}\n{{/stats}}\n</Override>`;return y.render(e,this)}}class W{constructor(){this.build=new e,this.skills=new L,this.tree=new j,this.items=new T,this.config=new w}toString(){return`<?xml version="1.0" encoding="UTF-8"?>\n<PathOfBuilding>\n${this.build}\n${this.skills}\n${this.tree}\n${this.items}\n${this.config}\n</PathOfBuilding>`}}const P={Amulet:"Amulet",Belt:"Belt",BodyArmour:"Body Armour",Boots:"Boots",Gloves:"Gloves",Helm:"Helmet",Offhand:"Weapon 2",Offhand2:"Weapon 2 Swap",Ring:"Ring 1",Ring2:"Ring 2",Weapon:"Weapon 1",Weapon2:"Weapon 1 Swap"};function G(e){const t=e.inventoryId;if("Flask"===t)return`Flask ${e.x+1}`;const n=P[t];return n||t}const V={2311:{expansionJewel:{size:0,index:0,proxy:"7956",parent:"9408"}},2491:{expansionJewel:{size:2,index:3,proxy:"28650"}},3109:{expansionJewel:{size:0,index:0,proxy:"37147",parent:"46393"}},6910:{expansionJewel:{size:1,index:0,proxy:"35926",parent:"32763"}},7960:{expansionJewel:{size:2,index:0,proxy:"43989"}},9408:{expansionJewel:{size:1,index:2,proxy:"13201",parent:"7960"}},9797:{expansionJewel:{size:0,index:0,proxy:"63754",parent:"64583"}},10532:{expansionJewel:{size:1,index:0,proxy:"37898",parent:"2491"}},11150:{expansionJewel:{size:0,index:0,proxy:"10643",parent:"49684"}},12161:{expansionJewel:{size:0,index:0,proxy:"44470",parent:"40400"}},12613:{expansionJewel:{size:0,index:0,proxy:"40114",parent:"29712"}},13170:{expansionJewel:{size:1,index:2,proxy:"24452",parent:"21984"}},14993:{expansionJewel:{size:0,index:0,proxy:"22046",parent:"44169"}},16218:{expansionJewel:{size:0,index:0,proxy:"18361",parent:"48679"}},17219:{expansionJewel:{size:1,index:1,proxy:"28018",parent:"55190"}},18436:{expansionJewel:{size:0,index:0,proxy:"36414",parent:"6910"}},21984:{expansionJewel:{size:2,index:5,proxy:"18756"}},22748:{expansionJewel:{size:0,index:0,proxy:"56439",parent:"33753"}},22994:{expansionJewel:{size:1,index:0,proxy:"51233",parent:"46882"}},23756:{expansionJewel:{size:1,index:1,proxy:"64166",parent:"2491"}},23984:{expansionJewel:{size:0,index:0,proxy:"48128",parent:"10532"}},24970:{expansionJewel:{size:0,index:0,proxy:"3854",parent:"49080"}},29712:{expansionJewel:{size:1,index:0,proxy:"55706",parent:"7960"}},32763:{expansionJewel:{size:2,index:4,proxy:"48132"}},33753:{expansionJewel:{size:1,index:2,proxy:"50179",parent:"32763"}},36931:{expansionJewel:{size:0,index:0,proxy:"49951",parent:"17219"}},40400:{expansionJewel:{size:1,index:1,proxy:"57194",parent:"46882"}},41876:{expansionJewel:{size:0,index:0,proxy:"54600",parent:"61288"}},44169:{expansionJewel:{size:1,index:2,proxy:"53203",parent:"55190"}},46393:{expansionJewel:{size:1,index:2,proxy:"35853",parent:"46882"}},46519:{expansionJewel:{size:1,index:2,proxy:"58355",parent:"2491"}},46882:{expansionJewel:{size:2,index:1,proxy:"25134"}},48679:{expansionJewel:{size:1,index:1,proxy:"26661",parent:"7960"}},49080:{expansionJewel:{size:1,index:0,proxy:"25441",parent:"55190"}},49684:{expansionJewel:{size:1,index:1,proxy:"33833",parent:"32763"}},51198:{expansionJewel:{size:0,index:0,proxy:"27475",parent:"23756"}},55190:{expansionJewel:{size:2,index:2,proxy:"30275"}},59585:{expansionJewel:{size:0,index:0,proxy:"27819",parent:"13170"}},61288:{expansionJewel:{size:1,index:1,proxy:"34013",parent:"21984"}},61305:{expansionJewel:{size:0,index:0,proxy:"35313",parent:"22994"}},61666:{expansionJewel:{size:0,index:0,proxy:"35070",parent:"46519"}},64583:{expansionJewel:{size:1,index:0,proxy:"58194",parent:"21984"}}},_={small:{sizeIndex:0,notableIndicies:[4],socketIndicies:[4],smallIndicies:[0,4,2]},medium:{sizeIndex:1,notableIndicies:[6,10,2,0],socketIndicies:[6],smallIndicies:[0,6,8,4,10,2]},large:{sizeIndex:2,notableIndicies:[6,4,8,10,2],socketIndicies:[4,8,6],smallIndicies:[0,4,6,8,10,2,7,5,9,3,11,1]}},F=[26725,36634,33989,41263,60735,61834,31683,28475,6230,48768,34483,7960,46882,55190,61419,2491,54127,32763,26196,33631,21984,29712,48679,9408,12613,16218,2311,22994,40400,46393,61305,12161,3109,49080,17219,44169,24970,36931,14993,10532,23756,46519,23984,51198,61666,6910,49684,33753,18436,11150,22748,64583,61288,13170,9797,41876,59585,43670,29914,18060];function H(e){return F[e]}const Q=[{name:"Scion",ascendancyList:["None","Ascendant"]},{name:"Marauder",ascendancyList:["None","Juggernaut","Berserker","Chieftain"]},{name:"Ranger",ascendancyList:["None","Raider","Deadeye","Pathfinder"]},{name:"Witch",ascendancyList:["None","Occultist","Elementalist","Necromancer"]},{name:"Duelist",ascendancyList:["None","Slayer","Gladiator","Champion"]},{name:"Templar",ascendancyList:["None","Inquisitor","Hierophant","Guardian"]},{name:"Shadow",ascendancyList:["None","Assassin","Trickster","Saboteur"]}];function K(e){for(let t=0;t<Q.length;t++){if(Q[t].name===e)return{classId:t,ascendancyId:0};const n=Q[t].ascendancyList;for(let s=1;s<n.length;s++)if(n[s]===e)return{classId:t,ascendancyId:s}}}function X(e,t){let n=function(e){const t=[];for(const[n,s]of Object.entries(e)){const e=se(s.type);""!==e&&t.push({idx:n,data:s,size:e})}return t.sort(((e,t)=>{const n=e.size,s=t.size;return n===s?0:n>s?1:-1})),t}(t),s=new Set(e),i=new Map,r=[];for(const e of n){const t=e.idx,n=e.data,o=e.size,a=n.subgraph.nodes;let l,c;if(o===te||o===ne){let e=Y(a);const t=i.get(Number(e));void 0!==t&&(l=t.id,c=t.ej)}if(void 0===l){const e=H(Number(t));c=V[e].expansionJewel}r.push(...Z(s,e,c,l,i))}return r}function Y(e){for(const[t,n]of Object.entries(e)){let t;if(n.in.length>0&&(t=n.in[0]),void 0!==t&&!(t in e))return t}}function Z(e,t,n,s,i){let r=[];const o=t.size,a=(l=o)===ee?_.large:l===te?_.medium:_.small;var l;null==s&&(s=65536),2==n.size?s+=n.index<<6:1==n.size&&(s+=n.index<<9);let c=s+(a.sizeIndex<<4);const d=[],p=[],u=[],h=[],f=t.data.subgraph.groups[`expansion_${t.idx}`].nodes,m=t.data.subgraph.nodes;for(const e of f){const t=m[e],n=Number(e);t.isNotable?d.push(n):t.isJewelSocket?(p.push(n),i.set(Number(t.skill),{id:s,ej:t.expansionJewel})):t.isMastery||(t.isKeystone?h.push(n):u.push(n))}const v=d.length+p.length+u.length,g=new Map;if(o===ee&&1===p.length){const e=p[0];g.set(6,e)}else for(let e=0;e<p.length;e++){const t=p[e],n=a.socketIndicies[e];g.set(n,t)}const y=[];for(let e of a.notableIndicies){if(y.length===d.length)break;o===te&&(0===p.length&&2===d.length?6===e?e=4:10===e&&(e=8):4===v&&(10===e?e=9:2===e&&(e=3))),g.has(e)||y.push(e)}y.sort(((e,t)=>e-t));for(let e=0;e<y.length;e++)g.set(y[e],d[e]);const x=[];for(let e of a.smallIndicies){if(x.length===u.length)break;o===te&&(5===v&&4===e?e=3:4==v&&(8===e?e=9:4===e&&(e=3))),g.has(e)||x.push(e)}x.sort(((e,t)=>e-t));for(let e=0;e<x.length;e++)g.set(x[e],u[e]);for(const[t,n]of g.entries())if(e.has(n)){const e=m[n];e.isJewelSocket?r.push(Number(e.skill)):r.push(c+t)}return h.length>0&&e.has(h[0])&&r.push(c),r}const ee="LARGE",te="MEDIUM",ne="SMALL";function se(e){return"JewelPassiveTreeExpansionLarge"===e?ee:"JewelPassiveTreeExpansionMedium"===e?te:"JewelPassiveTreeExpansionSmall"===e?ne:""}class ie{constructor(e,t,n){this.itemIdGenerator=1,this.itemsData=e,this.passiveSkillsData=t,this.options=n}transform(){const e=new W;this.building=e,this.itemIdGenerator=1;const t=e.build,n=this.itemsData.character;t.level=n.level;let s=K(n.class);var i;t.className=(i=s.classId,Q[i].name),t.ascendClassName=function(e,t){return Q[e].ascendancyList[t]}(s.classId,s.ascendancyId),this.parseItems(),this.parseTree()}parseItems(){const e=this.building,t=this.getBuildingItemDataArray();for(const n of t){const t=new J(this.itemIdGenerator++,n),s=e.items.itemList;s.push(t);const i=e.items.itemSet,r=G(n),o=S.NewEquipmentSlot(r,t.id);if(i.append(o),n.socketedItems&&n.socketedItems.length>0){const t=n.sockets,o=n.socketedItems;let a=[],l=0;const c=e.skills.skillSet.skills;let d=0;for(let e=0;e<o.length;e++){const n=o[e];if(n.abyssJewel){d++;const e=new J(this.itemIdGenerator++,n);s.push(e);const t=`${r} Abyssal Socket ${d}`,o=S.NewEquipmentSlot(t,e.id);i.append(o)}else if(0==e)a.push(n),l=t[0].group;else{const s=t[e].group;s!==l?(c.push(new $(r,a)),l=s,a=[n]):a.push(n)}}a.length>0&&c.push(new $(r,a))}}}getBuildingItemDataArray(){const e=this.itemsData.items,t=[];return t.push(...e.filter((e=>{var t;switch(e.inventoryId){case"Weapon2":case"Offhand2":if(null===(t=this.options)||void 0===t?void 0:t.skipWeapon2)return!1;break;case"MainInventory":case"ExpandedMainInventory":return!1}return"THIEFS_TRINKET"!==e.baseType}))),t}parseTree(){const e=this.building,t=this.itemsData.character,n=e.tree.spec,s=e.items.itemList;for(const e of this.passiveSkillsData.items){const t=new J(this.itemIdGenerator++,e);s.push(t);const i=new D(H(e.x),t.id);n.sockets.append(i)}let i=K(t.class);void 0!==i&&(n.ascendClassId=i.ascendancyId,n.classId=i.classId),n.secondaryAscendClassId=this.passiveSkillsData.alternate_ascendancy;for(const[e,t]of Object.entries(this.passiveSkillsData.mastery_effects))n.masteryEffects.push(new O(Number(e),t));n.nodes=this.passiveSkillsData.hashes,n.nodes.push(...X(this.passiveSkillsData.hashes_ex,this.passiveSkillsData.jewel_data)),n.overrides.parse(this.passiveSkillsData.skill_overrides)}getBuilding(){return this.building}}return{create:function(e,t){return function(e,t,n){y.escape=e=>e;const s=new ie(e,t,n);return s.transform(),s.getBuilding()}(e,t).toString()}}}();