(function () {
    "use strict";

    if (document.getElementById('jc-chat-bubble')) return;

    /* ── Styles (matches justcompany site palette) ── */
    const style = document.createElement('style');
    style.id = 'jc-chat-style';
    style.textContent = `
    :root{--jc-ink:#243447;--jc-paper:#fff;--jc-soft:#f4f1ec;--jc-muted:#586875;--jc-line:#d8dee2}
    #jc-chat-bubble{position:fixed;bottom:26px;right:26px;z-index:9999;width:60px;height:60px;border-radius:20px;background:var(--jc-ink);box-shadow:0 12px 32px rgba(36,52,71,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}
    #jc-chat-bubble:hover{transform:scale(1.06)}
    #jc-chat-bubble.open{transform:scale(.92)}
    #jc-chat-bubble .jc-x{display:none;color:#fff;font-size:22px;font-weight:300}
    #jc-chat-bubble.open .jc-x{display:block}
    #jc-chat-bubble.open .jc-icon{display:none}
    #jc-chat-window{position:fixed;bottom:98px;right:26px;z-index:9998;width:380px;max-width:calc(100vw - 32px);background:var(--jc-soft);border:1px solid var(--jc-line);border-radius:22px;box-shadow:0 30px 80px rgba(36,52,71,.22);display:flex;flex-direction:column;opacity:0;pointer-events:none;transform:translateY(24px) scale(.96);transition:all .3s cubic-bezier(.165,.84,.44,1);max-height:min(620px,calc(100vh - 150px));overflow:hidden;font-family:'Nunito Sans',ui-sans-serif,system-ui,sans-serif}
    #jc-chat-window.open{opacity:1;pointer-events:all;transform:translateY(0) scale(1)}
    .jc-hdr{background:var(--jc-ink);padding:18px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}
    .jc-avatar{width:40px;height:40px;border-radius:14px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
    .jc-avatar img{width:100%;height:100%;object-fit:cover}
    .jc-hdr-name{font-family:'Oleo Script',cursive;font-size:1.25rem;font-weight:400;color:#fff;line-height:1}
    .jc-hdr-status{font-size:.72rem;color:rgba(255,255,255,.78);margin-top:4px;display:flex;align-items:center;gap:6px}
    .jc-dot{width:7px;height:7px;border-radius:50%;background:#4ade80}
    .jc-msgs{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;min-height:80px;max-height:420px}
    .jc-msg{max-width:86%;font-size:.9rem;line-height:1.55;padding:12px 16px;border-radius:16px}
    .jc-msg.bot{background:#fff;border:1px solid var(--jc-line);color:var(--jc-ink);align-self:flex-start;border-bottom-left-radius:4px}
    .jc-msg.usr{background:var(--jc-ink);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;font-weight:500}
    .jc-msg a{color:inherit;text-decoration:underline;font-weight:700}
    .jc-msg.typing{background:#fff;border:1px solid var(--jc-line);align-self:flex-start;padding:14px 18px}
    .jc-dots{display:flex;gap:5px}
    .jc-dots span{width:6px;height:6px;border-radius:50%;background:var(--jc-ink);opacity:.35;animation:jcdot 1.3s infinite}
    .jc-dots span:nth-child(2){animation-delay:.18s}
    .jc-dots span:nth-child(3){animation-delay:.36s}
    @keyframes jcdot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-5px);opacity:1}}
    .jc-qr{padding:0 20px 14px;display:flex;flex-wrap:wrap;gap:8px;flex-shrink:0}
    .jc-qrb{font-size:.72rem;font-weight:700;padding:8px 12px;border:1px solid var(--jc-line);background:#fff;cursor:pointer;color:var(--jc-ink);border-radius:12px;transition:all .2s;font-family:'Nunito Sans',sans-serif}
    .jc-qrb:hover{background:var(--jc-ink);color:#fff;border-color:var(--jc-ink)}
    .jc-inp-row{display:flex;border-top:1px solid var(--jc-line);padding:10px;background:#fff;gap:8px;flex-shrink:0}
    #jc-inp{flex:1;min-width:0;border:none;background:var(--jc-soft);padding:10px 14px;font-size:.86rem;border-radius:12px;outline:none;font-family:inherit;color:var(--jc-ink)}
    #jc-inp:focus{box-shadow:inset 0 0 0 2px rgba(36,52,71,.18)}
    #jc-snd{width:38px;height:38px;flex-shrink:0;border:none;border-radius:12px;background:var(--jc-ink);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}
    #jc-snd:hover{background:#1a2635}
    @media(max-width:520px){#jc-chat-window{right:16px;bottom:92px}}
    `;
    document.head.appendChild(style);

    /* ── Structure ── */
    const wrap = document.createElement('div');
    wrap.innerHTML = `
    <div id="jc-chat-bubble">
        <svg class="jc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" style="width:26px;height:26px;color:#fff"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2z"></path></svg>
        <span class="jc-x">✕</span>
    </div>
    <div id="jc-chat-window">
        <div class="jc-hdr">
            <div class="jc-avatar"><img src="/assets/just-company-symbol.jpg" alt="Just Company"></div>
            <div>
                <div class="jc-hdr-name">Just Company</div>
                <div class="jc-hdr-status"><div class="jc-dot"></div> Here to help</div>
            </div>
        </div>
        <div class="jc-msgs" id="jc-msgs"></div>
        <div class="jc-qr" id="jc-qr">
            <button class="jc-qrb" data-q="What is Just Company?">What is this?</button>
            <button class="jc-qrb" data-q="How much does companionship cost?">Pricing</button>
            <button class="jc-qrb" data-q="Is this a dating service?">Is this dating?</button>
            <button class="jc-qrb" data-q="How do I become a companion?">Become a companion</button>
            <button class="jc-qrb" data-q="How do I contact Just Company?">Contact us</button>
        </div>
        <div class="jc-inp-row">
            <input type="text" id="jc-inp" placeholder="Ask a question..." />
            <button id="jc-snd" title="Send">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
        </div>
    </div>`;
    document.body.appendChild(wrap);

    const bubble = document.getElementById('jc-chat-bubble');
    const win = document.getElementById('jc-chat-window');
    const msgsEl = document.getElementById('jc-msgs');
    const inp = document.getElementById('jc-inp');

    let opened = false;
    bubble.addEventListener('click', () => {
        opened = !opened;
        bubble.classList.toggle('open', opened);
        win.classList.toggle('open', opened);
        if (opened && !msgsEl.childElementCount) {
            addMsg('bot', "Hi, I'm the Just Company assistant. Ask me how companionship works, what it costs, or how to apply as a companion.");
        }
    });

    document.getElementById('jc-snd').addEventListener('click', send);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    document.getElementById('jc-qr').addEventListener('click', e => {
        const q = e.target.getAttribute('data-q');
        if (q) send(q);
    });

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>'"]/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[x]));
    }

    function linkify(s) {
        return escapeHtml(s).replace(/\n/g, '<br>').replace(/(https?:\/\/\S+|\/justcompany\/\S+|justcompany@priscion\.com)/g, m => {
            if (m.includes('@')) return `<a href="mailto:${m}">${m}</a>`;
            return `<a href="${m}" target="_blank" rel="noopener noreferrer">${m}</a>`;
        });
    }

    function addMsg(role, text) {
        const d = document.createElement('div');
        d.className = 'jc-msg ' + (role === 'user' ? 'usr' : 'bot');
        d.innerHTML = linkify(text);
        msgsEl.appendChild(d);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        return d;
    }

    function addTyping() {
        const d = document.createElement('div');
        d.className = 'jc-msg bot typing';
        d.innerHTML = '<div class="jc-dots"><span></span><span></span><span></span></div>';
        msgsEl.appendChild(d);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        return d;
    }

    const SB_URL = "https://sazhdnqzaqpqcralmthh.supabase.co";

    const SYSTEM_PROMPT = "You are the Just Company assistant, embedded on the Just Company website. Just Company is a managed, non-medical companionship service based in Trinidad and Tobago for adults of different ages and life stages, including people living alone, introverted adults, families and anyone seeking meaningful real-world connection. It arranges thoughtful company for conversation, shared activities, reading, games, walks, cafe visits and similar activities, always in approved public or facility locations.\n\nWhat it is NOT, and you must be clear about this whenever relevant: it is not nursing, medical care, mental-health treatment, emergency response, residential care or a transportation service, and it is not dating, romance or sexual services. It is not an open public marketplace or a public companion directory — there is no browsable list of companions; matching is handled privately by Just Company.\n\nWho can request companionship: any adult, for themselves, a family member, or someone they support. Every request is reviewed privately by Just Company for suitability, venue, timing and safety before a booking is confirmed.\n\nHow a request works: 1) the customer submits an enquiry at /booking/ with details like activity, preferred date/time, duration, location and identity verification (a government ID and a selfie); 2) Just Company reviews the request; 3) suitable Independent Companions are offered the opportunity and may accept or decline; 4) once a companion accepts and payment is verified, the booking is confirmed. Submitting an enquiry is not a confirmed booking.\n\nPricing: TT$95 per companionship hour, for one to five hours (1hr=TT$95, 2hr=TT$190, 3hr=TT$285, 4hr=TT$380, 5hr=TT$475). This service fee covers the companion's time and coordination only. Travel, meals, drinks, tickets or other activity costs are separate, discussed and agreed before the booking; the customer may offer to cover a reasonable companion expense, and the companion can accept or decline based on the arrangement. No cash payments are accepted — confirmed customers pay Just Company by Trinidad and Tobago bank transfer (Scotiabank, First Citizens, RBC, RBTT or JMMB) or PayPal, never directly to the companion.\n\nLocations: sessions happen at an approved public location or approved facility such as a cafe, restaurant, park, library, community centre, or cultural/shopping space. Private-home visits are not available at launch. Customers do not provide transportation for the companion, and companions do not transport customers unless a separate written safety arrangement is approved.\n\nSafety: the companion checks in on arrival and checks out when leaving. A private safety word/emergency phrase is provided to the companion beforehand. Either person may leave immediately if they feel unsafe or uncomfortable and should move to a safe public place and notify Just Company. Just Company is NOT an emergency service — if someone describes a real emergency or urgent danger, tell them clearly to contact Police at 999 or Ambulance at 811 in Trinidad and Tobago, and that this chat cannot help with emergencies.\n\nBecoming a companion: apply at /companions/. It is an application, not automatic approval — Just Company reviews the information, verifies identity (government ID, a selfie and a police character certificate are required) and contacts suitable applicants about screening and next steps. Approved companions must accept the Independent Companion Services Agreement before receiving opportunities, and they may accept or decline each individual opportunity offered to them. Do not state or guess specific companion pay/payout amounts or commission splits — that is discussed privately during the application process and is not published information; if asked, say so and point them to the application.\n\nCancellations and refunds (only mention if asked): before a companion is confirmed, the customer may withdraw; more than 48 hours before a session, a refund or rescheduling is generally possible minus unrecoverable costs; between 24 and 48 hours, a rescheduling credit or partial refund may be offered; under 24 hours, the fee may be retained because the companion reserved the time; if Just Company cancels or cannot find a suitable replacement, the customer may get a full refund or rescheduling option. Full details are in the terms at /terms.html.\n\nPrivacy: identity documents, selfies and other verification files are stored privately, never shown publicly, and never shared with companions. There is no public customer or companion directory.\n\nContact: justcompany@priscion.com. Key pages: /booking/ (make an enquiry), /companions/ (become a companion), /terms.html (full customer service terms, safety and privacy policy).\n\nImportant behaviour: you cannot create, confirm or modify an actual booking or application yourself — always direct people to the enquiry form or the companion application form for anything that requires real action. Never invent details, prices, availability, specific companion information or policies that were not given to you above. Never discuss the identity, founder, owner or internal business details of Just Company or Priscion; if asked, say you can only help with how the service works. Personality: warm, calm, respectful and reassuring, matching a brand about good company and real human connection — never salesy, clinical or pushy. Keep replies to 2-4 concise sentences unless safety or pricing detail genuinely needs more. If asked something unrelated to Just Company, gently redirect to what you can help with here.";

    let history = [];

    function send(preset) {
        const text = (typeof preset === 'string' ? preset : inp.value).trim();
        if (!text) return;
        inp.value = '';
        addMsg('user', text);
        history.push({ role: 'user', content: text });
        const typingEl = addTyping();

        fetch(SB_URL + '/functions/v1/chat-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ system: SYSTEM_PROMPT, messages: history, max_tokens: 320 })
        })
        .then(r => r.json())
        .then(data => {
            typingEl.remove();
            const reply = data && data.reply ? data.reply : fallback(text);
            history.push({ role: 'assistant', content: reply });
            addMsg('bot', reply);
        })
        .catch(() => {
            typingEl.remove();
            addMsg('bot', fallback(text));
        });
    }

    function fallback(text) {
        const s = text.toLowerCase();
        if (s.includes('what is') || s.includes('what does') || (s.includes('how') && s.includes('work'))) {
            return "Just Company is a managed, non-medical companionship service in Trinidad and Tobago. We arrange thoughtful company for conversation, walks, cafe visits and similar activities in approved public locations, always reviewed for safety and suitability first. It is not nursing, medical care, an emergency service, or dating.";
        }
        if (s.includes('dating') || s.includes('romance') || s.includes('sexual')) {
            return "No — Just Company is non-medical companionship, not dating, romance or sexual services. It's about real conversation and shared time in approved public locations, with clear boundaries.";
        }
        if (s.includes('cost') || s.includes('price') || s.includes('how much') || s.includes('fee')) {
            return "The customer service fee is TT$95 per hour, for one to five hours (so TT$190 for 2 hours, up to TT$475 for 5). That covers the companion's time and coordination — any travel, meals or activity costs are discussed separately. No cash is accepted; payment is by Trinidad bank transfer or PayPal after a companion accepts.";
        }
        if (s.includes('companion') && (s.includes('become') || s.includes('apply') || s.includes('join'))) {
            return "You can apply at /companions/. It's an application, not an automatic approval — Just Company reviews your details, verifies your ID, selfie and police certificate, and contacts suitable applicants about next steps.";
        }
        if (s.includes('safe') || s.includes('emergency') || s.includes('danger')) {
            return "Every session has check-in/check-out and a private safety word, and either person can leave anytime they feel unsafe. Just Company is not an emergency service though — for a real emergency in Trinidad and Tobago, call Police 999 or Ambulance 811.";
        }
        if (s.includes('contact') || s.includes('email') || s.includes('reach')) {
            return "You can reach the team at justcompany@priscion.com, or check /terms.html for full policy details.";
        }
        return "I'm having trouble reaching the assistant right now. In the meantime, you can email justcompany@priscion.com, make an enquiry at /booking/, or check /terms.html.";
    }
})();
