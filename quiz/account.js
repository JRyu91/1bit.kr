(function () {
  const guestKey = '1bit-aws-quiz-v1';
  const base = 'https://game-origin.1bit.kr/game';
  const $ = id => document.getElementById(id);
  class QuizAccount {
    constructor(questions, change) {
      this.questions = questions; this.change = change; this.user = null; this.key = guestKey;
      this.revision = 0; this.paused = false; this.queue = Promise.resolve(); this.sequence = 0;
      $('account-form').onsubmit = event => { event.preventDefault(); this.login(false); };
      $('account-signup').onclick = () => this.login(true);
      $('account-logout').onclick = () => this.logout();
      $('cloud-reload').onclick = () => this.reload();
      $('import-guest').onclick = () => this.importGuest();
      window.addEventListener('storage', event => {
        if (event.key === this.key || event.key === null) { this.paused = true; this.status('다른 탭에서 진도가 바뀌었어. 현재 기록을 백업하고 새로고침해 줘.'); }
      });
    }
    status(message) {
      $('quiz-content').hidden = !this.user;
      if (!this.user) $('account-panel').open = true;
      $('account-status').textContent = message;
      $('account-summary').textContent = this.user ? `${this.user.name} · ${message}` : '로그인 · 계정별 진도 저장';
      $('account-form').hidden = !!this.user; $('account-actions').hidden = !this.user;
      $('cloud-reload').hidden = !this.user || !this.paused;
      $('import-guest').hidden = !this.user;
    }
    async api(path, body) {
      const response = await fetch(base + path, { credentials: 'include', cache: 'no-store', ...(body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) });
      const result = response.status === 204 ? {} : await response.json();
      if (!response.ok) { const error = Error(result.err || '서버에 연결할 수 없어'); error.status = response.status; throw error; }
      return result;
    }
    read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
    cache(value) { try { localStorage.setItem(this.key, JSON.stringify(value)); } catch { this.status('브라우저 백업 저장 실패 · 서버 저장 상태를 확인해 줘'); } }
    valid(state) { return window.QuizEngine.valid(state, this.questions); }
    async start(guest) {
      this.latest = guest;
      try {
        const me = await this.api('/account/me');
        return await this.load(me.ok);
      } catch (e) { if (this.user) { this.paused = true; this.status(e.message); return this.latest; } this.status('로그인하거나 가입한 뒤 문제를 풀어 줘'); return guest; }
    }
    async load(user, discardPending = false) {
      this.user = user; this.key = guestKey + ':account:' + user.id;
      const cached = this.read(this.key);
      if (cached && this.valid(cached.state)) this.latest = cached.state;
      else this.latest = window.QuizEngine.fresh();
      const cloud = await this.api('/quiz/progress');
      if (cloud.accountId !== user.id || cloud.state !== null && !this.valid(cloud.state)) throw Error('계정 진도를 확인할 수 없어. 현재 기록을 백업해 줘');
      this.revision = cloud.revision;
      if (!discardPending && cached?.pending && this.valid(cached.state)) {
        this.latest = cached.state;
        if (cached.revision !== cloud.revision) {
          this.paused = true; this.status('미전송 기록과 서버 진도가 달라. 백업 후 서버 진도를 불러와 줘'); return this.latest;
        }
        this.paused = false; this.save(this.latest); return this.latest;
      }
      this.latest = cloud.state || window.QuizEngine.fresh(); this.paused = false;
      this.cache({ state: this.latest, revision: this.revision, pending: false });
      this.status('서버 저장 완료'); return this.latest;
    }
    canEdit() { if (!this.user) { $('account-panel').open = true; return false; } if (this.loading) return false; if (this.paused) { $('account-panel').open = true; return false; } return true; }
    save(state) {
      if (!this.canEdit()) return;
      this.latest = JSON.parse(JSON.stringify(state));
      const snapshot = this.latest, sequence = ++this.sequence;
      this.cache({ state: this.latest, revision: this.revision, pending: true }); this.status('저장 중');
      this.queue = this.queue.then(async () => {
        if (this.paused) return;
        try {
          const result = await this.api('/quiz/progress', { accountId: this.user.id, revision: this.revision, state: snapshot });
          this.revision = result.revision;
          const pending = sequence !== this.sequence;
          this.cache({ state: this.latest, revision: this.revision, pending });
          this.status(pending ? '저장 중' : '서버 저장 완료');
        } catch (e) { this.paused = true; if (e.status === 401 || e.status === 403) this.user = null; this.status(e.message + ' · 진도 백업으로 현재 기록을 보관해 줘'); $('account-panel').open = true; }
      });
    }
    async login(signup) {
      if (this.busy) return;
      this.busy = true;
      try {
        const id = $('account-id').value.trim(), pw = $('account-password').value;
        if (signup) {
          if (pw.length < 8) throw Error('가입 비밀번호는 8자 이상으로 정해 줘');
          await this.api('/account/signup', { id, pw, name: $('account-name').value.trim() || id.slice(0, 10), gender: 'male' });
        }
        const me = await this.api('/account/login', { id, pw });
        $('account-password').value = '';
        const state = await this.load(me.ok); this.change(state);
        if (!this.paused) $('account-panel').open = false;
      } catch (e) { if (this.user) { this.paused = true; this.change(this.latest); } this.status(e.message); }
      finally { this.busy = false; }
    }
    async logout() {
      if (this.busy) return;
      if (!confirm('로그아웃할까? 같은 브라우저의 게임 로그인도 함께 종료돼.')) return;
      this.busy = true; this.loading = true;
      try {
        await this.queue; await this.api('/account/logout', {});
        this.user = null; this.key = guestKey; this.paused = false;
        const guest = this.read(guestKey); this.latest = this.valid(guest) ? guest : window.QuizEngine.fresh();
        this.change(this.latest); this.status('로그아웃했어. 다시 로그인해 줘');
      } catch (e) { this.status(e.message); }
      finally { this.busy = false; this.loading = false; }
    }
    async reload() {
      if (this.busy || !this.user) return;
      if (!confirm('현재 미전송 진도를 서버 기록으로 바꿀까? 필요한 기록은 먼저 진도 백업으로 저장해 줘.')) return;
      this.busy = true; this.loading = true;
      try {
        await this.queue;
        const me = await this.api('/account/me');
        if (me.ok.id !== this.user.id) throw Error('로그인 계정이 바뀌었어. 진도를 백업하고 새로고침해 줘');
        this.change(await this.load(this.user, true));
      } catch (e) { this.status(e.message); }
      finally { this.busy = false; this.loading = false; }
    }
    importGuest() {
      if (!this.user || !this.canEdit()) return;
      const guest = this.read(guestKey);
      if (!this.valid(guest) || !Object.keys(guest.records).length) { this.status('가져올 기존 브라우저 진도가 없어'); return; }
      if (!confirm('이 계정의 진도를 기존 브라우저 기록으로 바꿀까?')) return;
      this.change(guest); this.save(guest);
    }
  }
  window.QuizAccount = QuizAccount;
})();
