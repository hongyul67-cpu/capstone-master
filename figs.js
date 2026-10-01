/* ══════════════════════════════════════════════════════════════
   캡스톤디자인 진행판 — 그림 모음 (보조10 · 2026-10-01)
   공용 그리기 도우미 links/fig.js 를 쓴다. 이 파일은 index.html · lesson.js 가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', cards:['카드 이름'…], draw:function(){ … } }
       cards — 이 그림을 붙일 곳. index.html 이 이 이름으로 찾아 붙인다.
               · 수업 안내 카드는 카드 제목(h3) 그대로 — 예) '마일스톤 6단계'
               · 주차 진행판은 '3차시' 처럼 차시 번호
               · 다른 탭은 '탭:ailog' · '탭:peer' · '탭:score'
     순서 = 화면에 나오는 순서.

   그림의 글자·수치는 전부 지도안 2종(index.html 위쪽 배열과 같음)에서 옮겼다.
     업무폴더\01_수업\2026_수업\3학년 프로젝트 수업\2번_캡스톤디자인_지도안.docx
     같은 폴더 2번_캡스톤디자인_차시별운영안.docx
   지도안에 없는 수치는 넣지 않았다.

   정답 이름표(ans:true · ansG) — 수업 슬라이드의 빈칸 {{ }} 이나 퀴즈 정답이 그림에 보이는 자리.
   슬라이드는 FIG.svgOf(키,{labels:false}) 로 불러 ? 로 가린다.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, route = F.route, callout = F.callout;

  /* 작은 도우미 */
  function ansG(body) { return '<g class="fig-ans">' + body + '</g>'; }   /* labels:false 면 숨는 도형 */
  function head(x, y, r, o) {                                             /* 사람 머리+어깨 */
    o = o || {};
    return F.circle(x, y, r, { fill: o.fill || C.grayL, c: o.c || C.ink, w: 1.6 }) +
      F.path('M' + (x - r * 1.5) + ',' + (y + r * 2.6) + ' Q' + x + ',' + (y + r * 0.6) + ' ' + (x + r * 1.5) + ',' + (y + r * 2.6),
        { fill: o.fill || C.grayL, c: o.c || C.ink, w: 1.6 });
  }
  function diamond(cx, cy, w, h, o) {
    o = o || {};
    return F.poly([[cx, cy - h / 2], [cx + w / 2, cy], [cx, cy + h / 2], [cx - w / 2, cy]],
      { close: 1, fill: o.fill || C.yellowL, c: o.c || C.ink, w: 1.6 });
  }
  function doc(x, y, w, h, o) {                                            /* 종이 한 장 + 글 줄 */
    o = o || {};
    var s = F.path('M' + x + ',' + y + ' H' + (x + w - 18) + ' L' + (x + w) + ',' + (y + 18) + ' V' + (y + h) + ' H' + x + ' Z',
      { fill: '#fff', c: o.c || C.ink, w: 1.6 });
    for (var i = 0; i < 6; i++) {
      var ly = y + 30 + i * 16, lw = (i % 3 === 2) ? w * 0.5 : w - 30;
      s += line(x + 14, ly, x + 14 + lw, ly, { c: (o.lines && o.lines[i]) || C.grayM, w: (o.lines && o.lines[i]) ? 3 : 2.4 });
    }
    return s;
  }

  return {

  /* ─────────── 수업 안내 ─────────── */

  milestones: { cards: ['마일스톤 6단계'],
    cap: '마일스톤 6단계 — 1학기 약 16주 가운데 어느 구간인지 막대로 본다',
    draw: function () {
      var M = [['킥오프', 1, 3], ['M1 주제 확정', 4, 5], ['M2 설계 검토', 6, 8],
               ['M3 프로토타입', 9, 11], ['M4 비판 검토', 12, 13], ['최종 발표', 14, 16]];
      var x0 = 150, pw = 19.5, s = t(16, 26, '1학기 약 16주', { size: 17, b: 1 });
      for (var w = 1; w <= 16; w++) {
        var cx = x0 + (w - 0.5) * pw;
        s += t(cx, 56, String(w), { a: 'm', size: 13, c: C.sub });
        if (w > 1) s += line(x0 + (w - 1) * pw, 66, x0 + (w - 1) * pw, 272, { c: C.edge, w: 1 });
      }
      s += t(x0 + 8 * pw, 38, '주', { a: 'm', size: 13, c: C.sub });
      M.forEach(function (m, i) {
        var y = 72 + i * 34, bx = x0 + (m[1] - 1) * pw, bw = (m[2] - m[1] + 1) * pw;
        var fin = i === 5;
        s += t(16, y + 14, m[0], { size: 15, b: 1, c: fin ? C.green : C.ink });
        s += box(bx + 1, y, bw - 2, 28, { fill: fin ? C.greenL : C.blueL, c: fin ? C.green : C.blue, w: 1.4, r: 6 });
      });
      s += t(240, 300, '산출물은 AI 로 초안을 만든 뒤 팀이 직접 수정·보완한다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 318, s);
    } },

  explore: { cards: ['주제는 이렇게 정합니다 (1~3주)', '2차시'],
    cap: '주제 정하는 흐름 — 재료 목록 → AI 질문 → 팀 논의 → 주제 확정 (AI 가 혼자 정하지 않는다)',
    draw: function () {
      var X = [14, 132, 250, 368], L = ['재료·장비\n목록 작성', 'AI 에게\n후보 질문', '팀 논의', '주제 확정'];
      var s = '';
      X.forEach(function (x, i) {
        s += box(x, 112, 100, 62, { fill: i === 2 ? C.yellowL : (i === 3 ? C.greenL : C.grayL),
          c: i === 3 ? C.green : C.ink, label: L[i], size: 16 });
        s += F.num(x + 12, 112, String(i + 1), { r: 11, size: 13 });
        if (i < 3) s += arrow(x + 102, 143, x + 130, 143, { head: 10 });
      });
      /* AI 가 혼자 정하는 지름길은 막는다 */
      s += route([[182, 110], [182, 70], [418, 70], [418, 108]], { c: C.red, w: 1.8, dash: '6 5', head: 10 });
      s += F.circle(300, 70, 13, { fill: '#fff', c: C.red, w: 2 }) +
        line(292, 62, 308, 78, { c: C.red, w: 2.4 }) + line(308, 62, 292, 78, { c: C.red, w: 2.4 });
      s += t(300, 40, 'AI 가 단독으로 주제를 정하지 않는다', { a: 'm', size: 15, b: 1, c: C.red });
      /* 칸마다 무엇을 하는가 */
      s += t(64, 196, '팀이 직접\n조사해 목록화', { a: 'm', size: 13, c: C.sub });
      s += t(182, 196, '후보 5가지\n(난이도와 함께)', { a: 'm', size: 13, c: C.sub });
      s += t(300, 190, '3기준', { a: 'm', size: 13, c: C.sub });
      s += t(300, 212, '실현 가능성', { a: 'm', size: 15, b: 1, ans: true });
      s += t(300, 234, '흥미도', { a: 'm', size: 15, b: 1, ans: true });
      s += t(300, 256, '차별성', { a: 'm', size: 15, b: 1, ans: true });
      s += t(418, 196, '기획서 작성\n교사 승인 후', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 276, s);
    } },

  funnel: { cards: ['주제는 이렇게 정합니다 (1~3주)', '3차시'],
    cap: '후보 좁히기 — AI 제안 5가지 → 상위 2개 → 최종 1개',
    draw: function () {
      var s = t(70, 34, 'AI 제안 5', { a: 'm', size: 15, b: 1 }) + t(240, 34, '상위 2', { a: 'm', size: 15, b: 1 }) +
        t(410, 34, '최종 1', { a: 'm', size: 15, b: 1, c: C.green });
      var keep = { 2: 1, 4: 1 };
      for (var i = 1; i <= 5; i++) {
        var y = 52 + (i - 1) * 32, k = keep[i];
        s += box(30, y, 80, 26, { fill: k ? C.blueL : C.grayL, c: k ? C.blue : C.line, w: 1.4, r: 5,
          label: '후보 ' + '①②③④⑤'.charAt(i - 1), size: 14, lc: k ? C.ink : C.sub });
      }
      s += arrow(118, 132, 190, 132, { head: 10 });
      s += box(200, 96, 80, 28, { fill: C.blueL, c: C.blue, w: 1.4, r: 5, label: '후보 ②', size: 14 }) +
        box(200, 140, 80, 28, { fill: C.blueL, c: C.blue, w: 1.4, r: 5, label: '후보 ④', size: 14 });
      s += arrow(288, 132, 360, 132, { head: 10 });
      s += box(370, 112, 80, 40, { fill: C.greenL, c: C.green, w: 2, r: 6, label: '후보 ④', size: 16 });
      s += t(154, 168, '3기준\n점수', { a: 'm', size: 13, c: C.sub });
      s += t(324, 168, '장단점\n정리', { a: 'm', size: 13, c: C.sub });
      s += t(410, 172, '한 문장으로\n표현', { a: 'm', size: 13, c: C.sub });
      s += box(20, 222, 440, 58, { fill: C.yellowL, c: C.orange, w: 1.4 });
      s += t(240, 238, '교사가 계속 묻는 기준', { a: 'm', size: 13, c: C.sub });
      s += t(240, 262, '1학기 50분 수업 16회 안에 완성 가능한가?', { a: 'm', size: 15, b: 1, ans: true });
      return F.svg(480, 296, s);
    } },

  roles: { cards: ['역할 분담 가이드', '1차시'],
    cap: '역할 분담 — 세 역할이 한 프로젝트를 나눠 맡는다 (겸임 가능, 책임은 명확히)',
    draw: function () {
      var s = '';
      s += line(160, 104, 214, 146, { c: C.line, w: 1.6 }) + line(320, 104, 266, 146, { c: C.line, w: 1.6 }) +
        line(240, 204, 240, 218, { c: C.line, w: 1.6 });
      s += F.circle(240, 162, 42, { fill: C.grayL, c: C.ink, w: 1.6, label: '우리 팀\n프로젝트', size: 15 });
      s += box(14, 22, 196, 84, { fill: C.blueL, c: C.blue });
      s += t(112, 44, '기계/하드웨어', { a: 'm', b: 1, c: C.blue });
      s += t(112, 80, '기구 설계 · 3D 모델링\n조립 및 제작', { a: 'm', size: 13 });
      s += box(270, 22, 196, 84, { fill: C.purpleL, c: C.purple });
      s += t(368, 44, '전자/코딩', { a: 'm', b: 1, c: C.purple });
      s += t(368, 80, '회로 설계\n아두이노·파이썬 코드', { a: 'm', size: 13 });
      s += box(142, 218, 196, 84, { fill: C.greenL, c: C.green });
      s += t(240, 240, '문서/발표', { a: 'm', b: 1, c: C.green, ans: true });
      s += t(240, 276, '회의록 · 기획서\n발표 자료 · 일정 관리', { a: 'm', size: 13 });
      s += t(240, 326, '각자 「내가 AI 를 어떻게 쓸지」 1줄을 적는다', { a: 'm', size: 14, c: C.sub });
      s += t(240, 350, '2인 팀 — 기계+문서 / 전자+문서 조합 권장', { a: 'm', size: 14, c: C.sub, ans: true });
      return F.svg(480, 368, s);
    } },

  slides5: { cards: ['최종 발표에 반드시 들어가는 것'],
    cap: '최종 발표 슬라이드 5장 — ★ ④ AI 활용 과정은 반드시 넣는다',
    draw: function () {
      var T = ['프로젝트\n개요', '설계·제작\n과정', '결과물\n시연', 'AI 활용\n과정', '배운 점·\n개선 방향'];
      var s = t(240, 26, '발표 순서대로', { a: 'm', size: 15, c: C.sub });
      T.forEach(function (tt, i) {
        var x = 12 + i * 92, must = i === 3;
        s += box(x, 46, 84, 62, { fill: must ? C.orangeL : '#fff', c: must ? C.orange : C.ink, w: must ? 2.4 : 1.6, r: 5 });
        s += t(x + 12, 62, String(i + 1), { size: 17, b: 1, c: must ? C.orange : C.ink, halo: false });
        s += line(x + 30, 64, x + 72, 64, { c: C.grayM, w: 2.4 }) + line(x + 14, 80, x + 72, 80, { c: C.grayM, w: 2.4 }) +
          line(x + 14, 94, x + 52, 94, { c: C.grayM, w: 2.4 });
        s += t(x + 42, 136, tt, { a: 'm', size: 14, b: must ? 1 : 0, c: must ? C.orange : C.ink });
        if (must) s += t(x + 42, 36, '★ 필수', { a: 'm', size: 15, b: 1, c: C.orange });
      });
      s += box(12, 172, 456, 62, { fill: C.redL, c: C.red, w: 1.4 });
      s += t(240, 190, '④ = 어떤 문제를 AI 로 풀었나 · AI 가 틀린 부분 · 어떻게 고쳤나', { a: 'm', size: 13 });
      s += t(240, 216, '④ 가 빠지면 발표 점수 최대 30% 감점', { a: 'm', size: 15, b: 1, c: C.red, ans: true });
      return F.svg(480, 250, s);
    } },

  'talk-time': { cards: ['최종 발표에 반드시 들어가는 것', '4차시', '13차시'],
    cap: '발표 시간 — 주제 발표(4차시)는 3분+2분, 최종 발표(14·15차시)는 10분+5분',
    draw: function () {
      var x0 = 120, pm = 22.4, s = '';
      for (var m = 0; m <= 15; m += 5) {
        s += line(x0 + m * pm, 44, x0 + m * pm, 196, { c: C.edge, w: 1 });
        s += t(x0 + m * pm, 34, m + '분', { a: 'm', size: 13, c: C.sub });
      }
      function bar(y, a, b, name, sub) {
        var o = t(14, y + 8, name, { size: 16, b: 1 }) + t(14, y + 30, sub, { size: 13, c: C.sub });
        o += box(x0, y, a * pm, 36, { fill: C.blueL, c: C.blue, w: 1.4, r: 4 });
        o += box(x0 + a * pm, y, b * pm, 36, { fill: C.orangeL, c: C.orange, w: 1.4, r: 4 });
        o += t(x0 + a * pm / 2, y + 18, a + '분', { a: 'm', size: 15, b: 1, ans: true });
        o += t(x0 + (a + b / 2) * pm, y + 18, b + '분', { a: 'm', size: 15, b: 1, ans: true });
        return o;
      }
      s += bar(64, 3, 2, '주제 발표', '4차시');
      s += bar(140, 10, 5, '최종 발표', '14·15차시');
      s += box(120, 214, 18, 14, { fill: C.blueL, c: C.blue, w: 1.2, r: 3 }) + t(144, 221, '발표', { size: 14 });
      s += box(210, 214, 18, 14, { fill: C.orangeL, c: C.orange, w: 1.2, r: 3 }) + t(234, 221, '질의응답(Q&A)', { size: 14 });
      return F.svg(480, 244, s);
    } },

  /* ─────────── 주차 진행판 ─────────── */

  'ai-draft': { cards: ['3차시', '9차시'],
    cap: 'AI 초안은 그대로 내지 않는다 — 우리 상황과 다른 곳을 표시하고 고쳐서 우리 것으로',
    draw: function () {
      var Y = C.yellowL, hi = '#fde047';
      var s = doc(20, 44, 110, 140) + doc(185, 44, 110, 140) + doc(350, 44, 110, 140, { c: C.green });
      s += ansG(box(197, 86, 80, 10, { fill: hi, c: hi, w: 1, r: 2 }) + box(197, 134, 80, 10, { fill: hi, c: hi, w: 1, r: 2 }));
      s += line(364, 90, 440, 90, { c: C.blue, w: 3 }) + line(364, 138, 440, 138, { c: C.blue, w: 3 });
      s += F.circle(444, 170, 13, { fill: C.greenL, c: C.green, w: 1.6 }) +
        F.poly([[437, 170], [442, 176], [452, 164]], { c: C.green, w: 2.4 });
      s += t(75, 30, 'AI 초안', { a: 'm', b: 1 });
      s += t(240, 30, '다른 곳 표시', { a: 'm', b: 1, c: C.orange, ans: true });
      s += t(405, 30, '우리 것', { a: 'm', b: 1, c: C.green });
      s += arrow(136, 114, 179, 114, { head: 10 }) + arrow(301, 114, 344, 114, { head: 10 });
      s += t(240, 204, '우리 상황과 다른 부분에 형광펜', { a: 'm', size: 13, c: C.sub, ans: true });
      s += t(405, 204, '직접 수정 또는\nAI 에 다시 요청', { a: 'm', size: 13, c: C.sub });
      s += t(240, 248, '3차시 기획서 · 9차시 후반 제작 계획 · 12차시 발표 자료', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 268, s);
    } },

  'design-check': { cards: ['5차시'],
    cap: 'AI 설계 검토 — AI 답변은 데이터시트와 대조하고, 다르면 데이터시트를 따른다',
    draw: function () {
      var s = '';
      s += box(14, 30, 120, 70, { fill: C.blueL, c: C.blue });
      s += t(74, 50, '설계도', { a: 'm', b: 1, c: C.blue }) + t(74, 78, '회로 / 기구', { a: 'm', size: 13 });
      s += arrow(138, 65, 176, 65, { head: 10 });
      s += box(180, 30, 120, 70, { fill: C.grayL });
      s += t(240, 50, 'AI 검토', { a: 'm', b: 1 }) + t(240, 78, '오류·개선점 요청', { a: 'm', size: 13 });
      s += box(346, 30, 120, 70, { fill: '#fff' });
      s += t(406, 50, '데이터시트', { a: 'm', b: 1 }) + t(406, 78, '부품 공식 문서', { a: 'm', size: 13 });
      s += arrow(240, 102, 240, 132, { head: 10 });
      s += route([[406, 102], [406, 164], [336, 164]], { c: C.sub, w: 1.6, dash: '6 5', head: 10 });
      s += diamond(240, 164, 190, 62);
      s += t(240, 164, 'AI 답변과 같은가?', { a: 'm', size: 15, b: 1, halo: false });
      s += route([[145, 164], [74, 164], [74, 214]], { c: C.green, head: 10 });
      s += t(108, 150, '같다', { a: 'm', size: 14, c: C.green, b: 1 });
      s += box(14, 216, 120, 56, { fill: C.greenL, c: C.green, label: '반영 →\n개선 설계도', size: 15 });
      s += arrow(240, 196, 240, 214, { head: 10, c: C.red });
      s += t(252, 204, '다르다', { size: 13, c: C.red, b: 1 });
      s += box(170, 216, 140, 56, { fill: C.redL, c: C.red });
      s += t(240, 244, '데이터시트 우선', { a: 'm', b: 1, c: C.red, ans: true });
      s += t(240, 298, 'AI 지적 가운데 타당한 것만 설계에 반영한다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 316, s);
    } },

  parts: { cards: ['6차시'],
    cap: '부품 목록 — 학교에 있는지부터 보고, 사야 하면 교사에게 먼저 승인받는다',
    draw: function () {
      var s = '';
      s += box(170, 16, 140, 40, { fill: C.blueL, c: C.blue, label: '필요한 부품', size: 16 });
      s += arrow(240, 58, 240, 80, { head: 10 });
      s += diamond(240, 112, 170, 60);
      s += t(240, 112, '학교에 있나?', { a: 'm', size: 15, b: 1, halo: false });
      s += route([[155, 112], [79, 112], [79, 146]], { c: C.green, head: 10 });
      s += t(118, 98, '있다', { a: 'm', size: 14, c: C.green, b: 1 });
      s += box(14, 148, 130, 50, { fill: C.greenL, c: C.green, label: '보유 → 사용', size: 15 });
      s += route([[325, 112], [401, 112], [401, 146]], { c: C.orange, head: 10 });
      s += t(362, 98, '없다', { a: 'm', size: 14, c: C.orange, b: 1 });
      s += box(336, 148, 130, 50, { fill: C.orangeL, c: C.orange, label: '구매 필요', size: 15 });
      s += arrow(401, 200, 401, 226, { head: 10, c: C.orange });
      s += box(336, 228, 130, 50, { fill: C.redL, c: C.red });
      s += t(401, 253, '교사 사전 승인', { a: 'm', size: 15, b: 1, c: C.red, ans: true });
      /* 대안 찾기 */
      s += route([[336, 186], [300, 186], [300, 228]], { c: C.sub, w: 1.6, dash: '6 5', head: 10 });
      s += box(160, 230, 150, 50, { fill: C.grayL });
      s += t(235, 246, 'AI 로 대안 찾기', { a: 'm', size: 14, b: 1 });
      s += t(235, 266, '아두이노 호환 필수', { a: 'm', size: 13, c: C.purple, b: 1, ans: true });
      s += t(240, 308, '목록표 칸 — 부품명 · 수량 · 보유 여부 · 구매 필요 여부', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 326, s);
    } },

  'solve-loop': { cards: ['7차시', '8차시', '10차시'],
    cap: 'AI 문제해결 세션 (7·8·10차시) — 막힌 것을 적고, 묻고, 해 보고, 안 되면 다시 묻는다',
    draw: function () {
      var X = [10, 128, 246, 364], s = '';
      s += box(X[0], 60, 106, 62, { fill: C.yellowL, c: C.orange });
      s += t(X[0] + 53, 80, '막힌 것', { a: 'm', size: 15, b: 1, ans: true }) + t(X[0] + 53, 104, '칠판에 키워드', { a: 'm', size: 13, ans: true });
      s += box(X[1], 60, 106, 62, { fill: C.grayL });
      s += t(X[1] + 53, 80, 'AI 에 질문', { a: 'm', size: 15, b: 1 }) + t(X[1] + 53, 104, '에러 그대로', { a: 'm', size: 13 });
      s += box(X[2], 60, 106, 62, { fill: C.blueL, c: C.blue, label: '적용 ·\n테스트', size: 15 });
      s += box(X[3], 60, 106, 62, { fill: C.greenL, c: C.green });
      s += t(X[3] + 53, 80, '해결', { a: 'm', size: 15, b: 1, c: C.green }) + t(X[3] + 53, 104, 'AI 활용 로그', { a: 'm', size: 13 });
      for (var i = 0; i < 3; i++) s += F.num(X[i] + 12, 60, String(i + 1), { r: 11, size: 13 });
      s += F.num(X[3] + 12, 60, '4', { r: 11, size: 13, c: C.green });
      s += arrow(118, 91, 126, 91, { head: 8 }) + arrow(236, 91, 244, 91, { head: 8 });
      s += arrow(354, 91, 362, 91, { head: 8, c: C.green });
      /* 안 되면 다시 */
      s += box(160, 180, 160, 56, { fill: '#fff', c: C.red, w: 1.4 });
      s += t(240, 198, '멀티턴 재질문', { a: 'm', size: 15, b: 1 }) + t(240, 220, '또는 교사 도움', { a: 'm', size: 13 });
      s += route([[299, 124], [299, 178]], { c: C.red, head: 10 });
      s += t(310, 152, '안 되면', { size: 14, c: C.red, b: 1 });
      s += route([[181, 178], [181, 124]], { c: C.sub, head: 10 });
      s += t(170, 152, '다시', { a: 'e', size: 14, c: C.sub, b: 1 });
      s += t(240, 26, '도입 10분 = ① · 전개 = ②③ · 정리 = 로그 기재', { a: 'm', size: 13, c: C.sub });
      s += t(240, 264, '목표 — 팀마다 막힌 문제를 ', { a: 'e', size: 14, c: C.sub }) +
        t(244, 264, '1개 이상 해결', { size: 14, b: 1, ans: true });
      return F.svg(480, 284, s);
    } },

  integration: { cards: ['8차시'],
    cap: '기계+전자 통합 — 따로는 되던 부품이 합치면 생기는 단골 문제 세 가지',
    draw: function () {
      var s = '';
      /* 아두이노 */
      s += box(24, 96, 120, 84, { fill: C.blueL, c: C.blue, label: '아두이노', size: 16 });
      /* 서보모터 + 팔 */
      s += box(300, 56, 64, 44, { fill: C.grayL, label: '서보', size: 14 });
      s += line(332, 56, 400, 34, { w: 5, c: C.ink }) + F.circle(332, 56, 5, { fill: C.ink });
      s += F.path('M400,34 A72,72 0 0 1 402,118', { c: C.red, w: 1.6, dash: '5 4' });
      /* 센서 */
      s += box(380, 118, 50, 52, { fill: '#fff', label: 'DHT11', size: 13 });
      s += line(388, 136, 422, 136, { c: C.grayM, w: 1 }) + line(388, 146, 422, 146, { c: C.grayM, w: 1 });
      /* 전원선 · 신호선 */
      s += F.poly([[144, 110], [250, 110], [250, 70], [300, 70]], { c: C.red, w: 2.4 });
      s += F.poly([[250, 110], [250, 150], [380, 150]], { c: C.red, w: 2.4 });
      s += F.poly([[144, 128], [240, 128], [240, 88], [300, 88]], { c: C.ink, w: 1.6 });
      s += F.poly([[144, 146], [232, 146], [232, 162], [380, 162]], { c: C.ink, w: 1.6 });
      s += t(196, 102, '5V', { a: 'm', size: 13, c: C.red, b: 1 });
      /* ① 전압 출렁임 */
      s += F.poly([[258, 44], [266, 36], [274, 50], [282, 36], [290, 44]], { c: C.red, w: 1.8 });
      s += F.num(270, 20, '1', { r: 11, size: 13, c: C.red });
      /* ② 신호 간섭 */
      s += F.path('M300,172 q6,-8 12,0 t12,0 t12,0', { c: C.orange, w: 1.8 });
      s += F.num(312, 196, '2', { r: 11, size: 13, c: C.orange });
      /* ③ 위치 충돌 */
      s += line(430, 108, 446, 124, { c: C.red, w: 2.4 }) + line(446, 108, 430, 124, { c: C.red, w: 2.4 });
      s += F.num(456, 100, '3', { r: 11, size: 13, c: C.red });
      /* 범례 */
      s += F.num(30, 234, '1', { r: 11, size: 13, c: C.red }) + t(48, 234, '전원 공급 불안정', { size: 15 });
      s += F.num(250, 234, '2', { r: 11, size: 13, c: C.orange }) + t(268, 234, '신호 간섭', { size: 15 });
      s += F.num(30, 266, '3', { r: 11, size: 13, c: C.red }) + t(48, 266, '기구와 센서 위치 충돌', { size: 15 });
      s += t(240, 300, '질문 예 — 「서보모터와 DHT11 동시 사용 시 전원 불안정 원인과 해결책」', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 318, s);
    } },

  'final-video': { cards: ['10차시'],
    cap: '최종 작동 영상 — 작동하는 부분을 최대한 담고, 팀명·주제·날짜 자막을 넣는다',
    draw: function () {
      var s = '';
      s += box(16, 40, 300, 170, { fill: C.grayL, c: C.ink, w: 2, r: 6 });
      /* 화면 속 결과물 */
      s += box(90, 110, 150, 16, { fill: C.grayM, r: 3, w: 1.2 });
      s += box(120, 76, 50, 34, { fill: C.blueL, c: C.blue, w: 1.4, r: 4 });
      s += line(145, 76, 190, 58, { w: 4 });
      s += F.circle(270, 84, 22, { fill: 'rgba(31,41,55,.72)', c: 'none', w: 0 }) +
        F.poly([[262, 72], [262, 96], [283, 84]], { close: 1, fill: '#fff', c: '#fff', w: 1 });
      s += box(16, 168, 300, 42, { fill: '#1f2937', c: '#1f2937', r: 0, w: 1 });
      s += t(166, 189, '팀명 · 주제 · 날짜', { a: 'm', size: 15, b: 1, c: '#fff', halo: false, ans: true });
      s += t(166, 26, '작동하는 부분을 최대한 담는다', { a: 'm', size: 14, c: C.sub });
      s += t(396, 40, '마무리 단골 문제', { a: 'm', size: 14, b: 1, c: C.red });
      s += box(336, 56, 124, 44, { fill: C.redL, c: C.red, w: 1.2, label: '전체 통합 후\n오류', size: 13 });
      s += box(336, 110, 124, 44, { fill: C.redL, c: C.red, w: 1.2, label: '전원 부족', size: 13 });
      s += box(336, 164, 124, 44, { fill: C.redL, c: C.red, w: 1.2, label: '3D 출력물\n조립 오차', size: 13 });
      s += t(240, 238, '완성이 어려우면 교사와 함께 범위를 줄인다', { a: 'm', size: 14, c: C.sub, ans: true });
      return F.svg(480, 256, s);
    } },

  critic: { cards: ['11차시'],
    cap: 'AI 비판 검토 — 지적을 받되, 받을지 말지는 팀이 판단한다',
    draw: function () {
      var s = '';
      s += box(14, 22, 170, 66, { fill: C.grayL });
      s += t(99, 42, 'AI 에게 역할 부여', { a: 'm', size: 14, b: 1 }) + t(99, 68, '「깐깐한 현장 책임자」', { a: 'm', size: 13 });
      s += arrow(188, 55, 216, 55, { head: 10 });
      s += box(220, 22, 246, 66, { fill: '#fff' });
      s += t(343, 42, '허점 · 빠진 부분 · 어려운 점', { a: 'm', size: 14, b: 1 }) + t(343, 68, '냉정하게 3가지 이상 지적', { a: 'm', size: 13 });
      s += route([[343, 90], [343, 110], [240, 110], [240, 120]], { head: 10 });
      s += diamond(240, 150, 150, 58);
      s += t(240, 150, '타당한가?', { a: 'm', size: 15, b: 1, halo: false });
      s += t(330, 142, '판단은', { size: 14, c: C.sub }) + t(382, 142, '사람(팀)', { size: 14, b: 1, c: C.orange, ans: true });
      s += route([[165, 150], [99, 150], [99, 196]], { c: C.green, head: 10 });
      s += t(132, 136, '타당', { a: 'm', size: 14, b: 1, c: C.green });
      s += box(14, 198, 170, 50, { fill: C.greenL, c: C.green, label: '결과물·문서 수정', size: 15 });
      s += route([[315, 150], [381, 150], [381, 196]], { c: C.sub, head: 10 });
      s += t(348, 172, '부당', { a: 'm', size: 14, b: 1, c: C.sub });
      s += box(296, 198, 170, 50, { fill: C.grayL, label: '「왜 맞지 않는지」\n1줄 기록', size: 14 });
      s += route([[99, 250], [99, 270], [150, 270]], { head: 9 }) + route([[381, 250], [381, 270], [330, 270]], { head: 9 });
      s += box(152, 252, 176, 40, { fill: C.blueL, c: C.blue });
      s += t(240, 272, '보완 전·후 비교 기록', { a: 'm', size: 15, b: 1, c: C.blue, ans: true });
      return F.svg(480, 308, s);
    } },

  log5: { cards: ['12차시', '탭:ailog'],
    cap: 'AI 활용 로그 다섯 칸 = 12차시 「AI 활용 과정」 슬라이드 다섯 칸',
    draw: function () {
      var R = [['어떤 문제가 있었나', '예) 서보가 불규칙하게 떨림'],
               ['어떤 프롬프트를 썼나', 'AI 에게 넣은 문장 그대로'],
               ['AI 답변 요약', '핵심만 두세 줄'],
               ['AI 가 틀린 부분은?', '없으면 「없음 — 데이터시트로 확인」'],
               ['최종 어떻게 해결했나', '우리가 실제로 한 조치']];
      var s = '';
      R.forEach(function (r, i) {
        var y = 16 + i * 46, bad = i === 3;
        s += box(12, y, 456, 38, { fill: C.grayL, c: C.line, w: 1.2 });
        if (bad) s += ansG(box(12, y, 456, 38, { fill: C.redL, c: C.red, w: 2 }));
        s += F.num(32, y + 19, '①②③④⑤'.charAt(i), { r: 12, size: 14, c: C.blue });
        s += t(54, y + 19, r[0], { size: 16, b: 1, ans: bad });
        s += t(456, y + 19, r[1], { a: 'e', size: 13, c: C.sub });
      });
      s += t(240, 262, '④ 가 비어 있으면 AI 답을 검증하지 않은 것이다', { a: 'm', size: 14, b: 1, c: C.red, ans: true });
      return F.svg(480, 282, s);
    } },

  'log-pipeline': { cards: ['12차시', '15차시'],
    cap: 'AI 활용 로그는 차시마다 쌓는다 — 쌓인 로그가 발표 ④번 슬라이드와 포트폴리오가 된다',
    draw: function () {
      var s = '';
      for (var i = 4; i >= 0; i--) {
        var x = 22 + i * 7, y = 52 + i * 12;
        s += box(x, y, 104, 104, { fill: '#fff', c: C.ink, w: 1.4, r: 5 });
      }
      for (var k = 0; k < 4; k++) s += line(64, 122 + k * 16, 140, 122 + k * 16, { c: C.grayM, w: 2.4 });
      s += t(84, 34, '차시마다 한 건씩', { a: 'm', size: 14, b: 1 });
      s += t(84, 222, '문제해결 세션마다\n로그 기재', { a: 'm', size: 13, c: C.sub });
      s += arrow(166, 130, 196, 130, { head: 10 });
      s += box(200, 96, 110, 68, { fill: C.yellowL, c: C.orange });
      s += t(255, 116, '인상적인 사례', { a: 'm', size: 14, b: 1 }) + t(255, 142, '2~3개 고르기', { a: 'm', size: 14, ans: true });
      s += route([[312, 118], [326, 118], [326, 76], [340, 76]], { head: 10 });
      s += route([[312, 142], [326, 142], [326, 184], [340, 184]], { head: 10 });
      s += box(342, 46, 126, 60, { fill: C.orangeL, c: C.orange, label: '★ ④ AI 활용\n과정 슬라이드', size: 14 });
      s += box(342, 154, 126, 60, { fill: C.blueL, c: C.blue, label: 'AI 활용\n포트폴리오', size: 14 });
      s += t(405, 124, '12차시', { a: 'm', size: 13, c: C.sub }) + t(405, 232, '15차시 제출', { a: 'm', size: 13, c: C.sub });
      s += t(240, 262, '평가(15점)도 누적으로 본다 — 마지막에 몰아 쓸 수 없다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 282, s);
    } },

  rehearsal: { cards: ['13차시'],
    cap: '리허설 — 팀당 10분을 재며 네 가지를 본다, 예상 질문 2가지는 미리 준비',
    draw: function () {
      var s = '';
      /* 화면 */
      s += box(24, 36, 164, 100, { fill: '#fff', c: C.ink, w: 1.8, r: 4 });
      s += line(40, 60, 150, 60, { c: C.grayM, w: 3 }) + line(40, 80, 172, 80, { c: C.grayM, w: 2.4 }) +
        line(40, 96, 160, 96, { c: C.grayM, w: 2.4 }) + line(40, 112, 120, 112, { c: C.grayM, w: 2.4 });
      /* 발표자 */
      s += F.circle(236, 104, 14, { fill: C.blueL, c: C.blue });
      s += line(236, 118, 236, 170, { c: C.blue, w: 2.6 }) + line(236, 132, 206, 118, { c: C.blue, w: 2.6 }) +
        line(236, 132, 262, 148, { c: C.blue, w: 2.6 }) + line(236, 170, 222, 202, { c: C.blue, w: 2.6 }) + line(236, 170, 250, 202, { c: C.blue, w: 2.6 });
      /* 목소리 */
      s += F.path('M256,96 q6,8 0,16', { c: C.orange, w: 1.8 }) + F.path('M264,90 q10,14 0,28', { c: C.orange, w: 1.8 });
      /* 시연물 */
      s += box(300, 168, 110, 12, { fill: C.grayM, r: 2, w: 1.2 }) + line(310, 180, 310, 204, { w: 1.6 }) + line(400, 180, 400, 204, { w: 1.6 });
      s += box(334, 140, 44, 28, { fill: C.greenL, c: C.green, w: 1.6, r: 4 });
      /* 타이머 */
      s += F.circle(424, 60, 26, { fill: '#fff', c: C.ink, w: 2 }) + line(424, 60, 424, 42, { w: 2 }) + line(424, 60, 438, 66, { w: 2 });
      s += t(434, 104, '10분', { size: 14, b: 1, ans: true });
      /* 청중 */
      for (var i = 0; i < 6; i++) s += head(96 + i * 58, 244, 11);
      s += line(236, 110, 212, 232, { c: C.purple, w: 1.4, dash: '5 4' }) + line(236, 110, 270, 232, { c: C.purple, w: 1.4, dash: '5 4' });
      /* 네 가지 */
      s += F.num(380, 104, '1', { r: 11, size: 13, c: C.orange }) + t(396, 104, '시간', { size: 15, b: 1, ans: true });
      s += F.num(292, 78, '2', { r: 11, size: 13, c: C.orange }) + t(308, 78, '목소리', { size: 15, b: 1, ans: true });
      s += F.num(142, 190, '3', { r: 11, size: 13, c: C.orange }) + t(158, 190, '눈 맞춤', { size: 15, b: 1, ans: true });
      s += F.num(420, 136, '4', { r: 11, size: 13, c: C.orange }) + t(420, 158, '시연 흐름', { a: 'm', size: 15, b: 1, ans: true });
      s += t(240, 292, '예상 Q&A 2가지를 미리 준비한다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 310, s);
    } },

  'final-talk': { cards: ['14차시', '탭:peer'],
    cap: '최종 발표 — 발표 팀 · 청중 팀 · 교사가 동시에 하는 일',
    draw: function () {
      var G = [
        { x: 12, n: '발표 팀', c: C.blue, f: C.blueL, k: 3, j: ['결과물 시연', '슬라이드 발표', 'Q&A 응답'] },
        { x: 166, n: '청중 팀', c: C.purple, f: C.purpleL, k: 3, j: ['동료 평가표 작성', '다섯 기준 점수', '좋은 점 · 조언'] },
        { x: 320, n: '교사', c: C.green, f: C.greenL, k: 1, j: ['타이머 · 평가표', '즉각 피드백 1가지', ''] }];
      var s = '';
      G.forEach(function (g) {
        var cx = g.x + 74;
        for (var i = 0; i < g.k; i++) s += head(cx + (i - (g.k - 1) / 2) * 34, 32, 11, { fill: g.f, c: g.c });
        s += box(g.x, 74, 148, 136, { fill: '#fff', c: g.c, w: 1.6 });
        s += box(g.x, 74, 148, 30, { fill: g.f, c: g.c, w: 1.6, label: g.n, size: 16, lc: g.c });
        g.j.forEach(function (j, i) {
          if (!j) return;
          var ans = g.n === '청중 팀' && i === 2;
          s += t(cx, 126 + i * 28, j, { a: 'm', size: 14, ans: ans });
        });
      });
      var x0 = 12, pm = 30.4;
      s += box(x0, 232, 15 * pm, 32, { fill: C.grayL, c: C.line, w: 1.4, r: 4 });
      s += ansG(box(x0, 232, 10 * pm, 32, { fill: C.blueL, c: C.blue, w: 1.4, r: 4 }) +
        box(x0 + 10 * pm, 232, 5 * pm, 32, { fill: C.orangeL, c: C.orange, w: 1.4, r: 4 }));
      s += t(x0 + 5 * pm - 22, 248, '발표', { a: 'e', size: 15 }) + t(x0 + 5 * pm - 16, 248, '10분', { size: 15, b: 1, ans: true });
      s += t(x0 + 12.5 * pm - 8, 248, 'Q&A', { a: 'e', size: 15 }) + t(x0 + 12.5 * pm - 2, 248, '5분', { size: 15, b: 1, ans: true });
      s += t(240, 284, '팀당 한 번 — 14·15차시 두 번에 나눠 발표', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 300, s);
    } },

  /* ─────────── 평가 기준 탭 ─────────── */

  'score-bar': { cards: ['탭:score'],
    cap: '평가 기준 100점 — 배점이 가장 큰 곳은 마일스톤별 산출물(기한 안에 냈는가)',
    draw: function () {
      var R = [['주제 선정 과정', 15], ['마일스톤별 산출물', 30], ['제작 완성도', 25], ['AI 활용 로그', 15], ['최종 발표', 15]];
      var x0 = 168, pp = 8.8, s = t(16, 26, '합계 100점', { size: 17, b: 1 });
      R.forEach(function (r, i) {
        var y = 50 + i * 40, top = i === 1;
        s += t(16, y + 14, r[0], { size: 15, b: top ? 1 : 0 });
        s += ansG(box(x0, y, r[1] * pp, 28, { fill: top ? C.orangeL : C.blueL, c: top ? C.orange : C.blue, w: 1.4, r: 4 }));
        s += t(x0 + r[1] * pp + 8, y + 14, r[1] + '점', { size: 15, b: 1, ans: true });
      });
      s += t(240, 270, '완성도가 낮아도 과정 기록이 충실하면 부분 점수를 인정한다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 290, s);
    } }

  };
})();
