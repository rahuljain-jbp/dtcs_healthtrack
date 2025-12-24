/* HealthTracker app (vanilla JS)
   - Stores data in localStorage
   - Schedules medicine reminders using setInterval + Notification API
   - Simple beginner-friendly code with comments
*/

const STORAGE_KEYS = {
  ENTRIES: 'ht_entries',
  MEDS: 'ht_meds',
  DIET: 'ht_diet'
};

document.addEventListener('DOMContentLoaded', () => {
  // UI elements
  const entryForm = document.getElementById('entryForm');
  const entryDate = document.getElementById('entryDate');
  const weightEl = document.getElementById('weight');
  const heightEl = document.getElementById('height');
  const waterEl = document.getElementById('water');
  const sleepEl = document.getElementById('sleep');
  const diseaseEl = document.getElementById('disease');
  const btnFillToday = document.getElementById('btnFillToday');

  // Panels & nav
  const dashboard = document.getElementById('dashboard');
  const medRemindersPanel = document.getElementById('medRemindersPanel');
  const historyPanel = document.getElementById('historyPanel');
  const dietPanel = document.getElementById('dietPanel');
  const navButtons = document.querySelectorAll('.nav-btn');

  // Dashboard displays
  const bmiValue = document.getElementById('bmiValue');
  const bmiCategory = document.getElementById('bmiCategory');
  const bmiTip = document.getElementById('bmiTip');

  const waterAmount = document.getElementById('waterAmount');
  const waterGoal = document.getElementById('waterGoal');
  const waterBar = document.getElementById('waterBar');
  const waterTip = document.getElementById('waterTip');

  const sleepHours = document.getElementById('sleepHours');
  const sleepGoal = document.getElementById('sleepGoal');
  const sleepBar = document.getElementById('sleepBar');
  const sleepTip = document.getElementById('sleepTip');

  const diseaseList = document.getElementById('diseaseList');

  // History
  const historyList = document.getElementById('historyList');
  const historyFrom = document.getElementById('historyFrom');
  const historyTo = document.getElementById('historyTo');
  const btnFilter = document.getElementById('btnFilter');
  const btnClearFilter = document.getElementById('btnClearFilter');

  // Meds
  const medForm = document.getElementById('medForm');
  const medList = document.getElementById('medList');

  // Diet
  const dietForm = document.getElementById('dietForm');
  const dietList = document.getElementById('dietList');

  // Footer
  const notifStatus = document.getElementById('notifStatus');

  // Set default date to today
  entryDate.value = (new Date()).toISOString().slice(0,10);

  // Navigation
  function showPanel(panel){
    // hide all
    medRemindersPanel.classList.add('hidden');
    historyPanel.classList.add('hidden');
    dietPanel.classList.add('hidden');
    // show requested (dashboard is always visible)
    if(panel==='med') medRemindersPanel.classList.remove('hidden');
    if(panel==='history') historyPanel.classList.remove('hidden');
    if(panel==='diet') dietPanel.classList.remove('hidden');

    navButtons.forEach(b => b.classList.remove('active'));
    if(panel==='dash') document.getElementById('btnDashboard').classList.add('active');
    if(panel==='history') document.getElementById('btnHistory').classList.add('active');
    if(panel==='med') document.getElementById('btnMedReminders').classList.add('active');
    if(panel==='diet') document.getElementById('btnDiet').classList.add('active');
  }

  document.getElementById('btnDashboard').addEventListener('click', ()=> showPanel('dash'));
  document.getElementById('btnHistory').addEventListener('click', ()=> showPanel('history'));
  document.getElementById('btnMedReminders').addEventListener('click', ()=> showPanel('med'));
  document.getElementById('btnDiet').addEventListener('click', ()=> showPanel('diet'));

  // --- Storage helpers ---
  function read(key){
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch(e){
      return [];
    }
  }
  function write(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Entries management ---
  function saveEntry(entry){
    const entries = read(STORAGE_KEYS.ENTRIES);
    // If an entry exists for date, replace it (one entry per day)
    const idx = entries.findIndex(e => e.date === entry.date);
    if(idx >= 0) entries[idx] = entry;
    else entries.push(entry);
    write(STORAGE_KEYS.ENTRIES, entries);
    renderDashboard();
    renderHistory();
  }

  // --- Render dashboard from latest entry (today if exists) ---
  function getLatestEntry(){
    const entries = read(STORAGE_KEYS.ENTRIES);
    if(entries.length === 0) return null;
    // find by date descending
    entries.sort((a,b) => new Date(b.date) - new Date(a.date));
    return entries[0];
  }

  function computeBMI(weightKg, heightCm){
    if(!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    return +(weightKg / (heightM * heightM));
  }

  function bmiCategoryFromValue(bmi){
    if(bmi === null) return {label: 'No data', tip: 'Enter weight and height.'};
    if(bmi < 18.5) return {label:'Underweight', tip: 'Consider a balanced calorie-rich diet.'};
    if(bmi < 25) return {label:'Normal', tip: 'Great! Keep exercising and eating well.'};
    if(bmi < 30) return {label:'Overweight', tip: 'Try moderate activity and control portions.'};
    return {label:'Obese', tip: 'Speak with a healthcare provider for a plan.'};
  }

  function renderDashboard(){
    const latest = getLatestEntry();
    if(!latest){
      bmiValue.textContent = '—';
      bmiCategory.textContent = 'No data';
      bmiTip.textContent = 'Add your first entry today.';
      waterAmount.textContent = 0;
      waterGoal.textContent = 2000;
      waterBar.style.width = '0%';
      sleepHours.textContent = 0;
      sleepBar.style.width = '0%';
      diseaseList.innerHTML = '<li class="small">No diseases recorded</li>';
      return;
    }

    const bmi = computeBMI(latest.weight, latest.height);
    if(bmi){
      bmiValue.textContent = bmi.toFixed(1);
      const cat = bmiCategoryFromValue(bmi);
      bmiCategory.textContent = cat.label;
      bmiTip.textContent = cat.tip;
    } else {
      bmiValue.textContent = '—';
      bmiCategory.textContent = 'No data';
      bmiTip.textContent = 'Enter weight and height.';
    }

    // Water
    const goal = 2000; // ml default goal (could be customizable later)
    const water = Number(latest.water) || 0;
    waterAmount.textContent = water;
    waterGoal.textContent = goal;
    const waterPct = Math.min(100, Math.round((water/goal)*100));
    waterBar.style.width = `${waterPct}%`;
    if(waterPct < 50) waterTip.textContent = 'Keep sipping — aim for small frequent amounts.';
    else waterTip.textContent = 'Good! Keep a steady intake.';

    // Sleep
    const sGoal = 8;
    const s = Number(latest.sleep) || 0;
    sleepHours.textContent = s;
    sleepGoal.textContent = sGoal;
    const sPct = Math.min(100, Math.round((s/sGoal)*100));
    sleepBar.style.width = `${sPct}%`;
    if(s < 6) sleepTip.textContent = 'Try to add 30–60 minutes of sleep for recovery.';
    else sleepTip.textContent = 'Nice rest! Maintain a regular schedule.';

    // Diseases (show recent list)
    const diseases = read(STORAGE_KEYS.ENTRIES)
      .filter(e => e.disease && e.disease.trim())
      .map(e => ({date:e.date, disease:e.disease.trim()}));

    if(diseases.length === 0){
      diseaseList.innerHTML = '<li class="small">No diseases recorded</li>';
    } else {
      diseaseList.innerHTML = '';
      // unique by name (latest first)
      const unique = {};
      diseases.reverse().forEach(d => {
        if(!unique[d.disease]){
          unique[d.disease] = d.date;
          const li = document.createElement('li');
          li.innerHTML = `<div>${d.disease}</div><div class="small">${d.date}</div>`;
          diseaseList.appendChild(li);
        }
      });
    }
  }

  // --- History rendering ---
  function renderHistory(filterFrom, filterTo){
    const entries = read(STORAGE_KEYS.ENTRIES).slice().sort((a,b)=> new Date(b.date)-new Date(a.date));
    let filtered = entries;
    if(filterFrom) filtered = filtered.filter(e => new Date(e.date) >= new Date(filterFrom));
    if(filterTo) filtered = filtered.filter(e => new Date(e.date) <= new Date(filterTo));
    historyList.innerHTML = '';
    if(filtered.length === 0){
      historyList.innerHTML = '<li class="small">No history for selected range</li>';
      return;
    }
    filtered.forEach(e => {
      const bmi = computeBMI(e.weight, e.height);
      const li = document.createElement('li');
      li.innerHTML = `<div>
        <strong>${e.date}</strong><div class="small">Weight: ${e.weight} kg • Height: ${e.height} cm • BMI: ${bmi?bmi.toFixed(1):'—'}</div>
        <div class="small">Water: ${e.water} ml • Sleep: ${e.sleep} hrs</div>
        <div class="small">${e.disease? ('Diagnosed: ' + e.disease): ''}</div>
      </div>
      <div>
        <button class="small-btn" data-date="${e.date}">Delete</button>
      </div>`;
      historyList.appendChild(li);

      li.querySelector('.small-btn').addEventListener('click', () => {
        if(confirm(`Delete entry for ${e.date}?`)){
          const all = read(STORAGE_KEYS.ENTRIES).filter(x => x.date !== e.date);
          write(STORAGE_KEYS.ENTRIES, all);
          renderDashboard();
          renderHistory(historyFrom.value, historyTo.value);
        }
      });
    });
  }

  btnFilter.addEventListener('click', () => renderHistory(historyFrom.value, historyTo.value));
  btnClearFilter.addEventListener('click', () => {
    historyFrom.value = '';
    historyTo.value = '';
    renderHistory();
  });

  // --- Entry form submit ---
  entryForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const entry = {
      date: entryDate.value,
      weight: Number(weightEl.value),
      height: Number(heightEl.value),
      water: Number(waterEl.value),
      sleep: Number(sleepEl.value),
      disease: (diseaseEl.value || '').trim()
    };
    saveEntry(entry);
    entryForm.reset();
    entryDate.value = (new Date()).toISOString().slice(0,10);
    alert('Saved entry ✔');
  });

  btnFillToday.addEventListener('click', () => {
    const today = (new Date()).toISOString().slice(0,10);
    entryDate.value = today;
    weightEl.value = weightEl.value || '';
    heightEl.value = heightEl.value || '';
    waterEl.value = waterEl.value || 1500;
    sleepEl.value = sleepEl.value || 7.5;
  });

  // --- Med reminders ---
  const medName = document.getElementById('medName');
  const medTime = document.getElementById('medTime');
  const medDose = document.getElementById('medDose');
  const medRepeat = document.getElementById('medRepeat');
  const medStart = document.getElementById('medStart');

  function renderMeds(){
    const meds = read(STORAGE_KEYS.MEDS);
    medList.innerHTML = '';
    if(meds.length === 0){
      medList.innerHTML = '<li class="small">No medicine reminders</li>';
      return;
    }
    meds.sort((a,b)=>a.time.localeCompare(b.time));
    meds.forEach((m, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<div>
          <strong>${m.name}</strong>
          <div class="small">${m.dose || ''} • ${m.time} • ${m.repeat} ${m.start?('• from '+m.start):''}</div>
        </div>
        <div>
          <button class="small-btn" data-idx="${idx}">Delete</button>
        </div>`;
      medList.appendChild(li);
      li.querySelector('.small-btn').addEventListener('click', () => {
        if(confirm('Delete reminder?')){
          const arr = read(STORAGE_KEYS.MEDS);
          arr.splice(idx,1);
          write(STORAGE_KEYS.MEDS, arr);
          renderMeds();
        }
      });
    });
  }

  medForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const m = {
      name: medName.value.trim(),
      time: medTime.value,
      dose: medDose.value.trim(),
      repeat: medRepeat.value,
      start: medStart.value || null,
      // store lastNotified date to prevent multiple notifications the same minute
      lastNotified: null
    };
    const meds = read(STORAGE_KEYS.MEDS);
    meds.push(m);
    write(STORAGE_KEYS.MEDS, meds);
    medForm.reset();
    renderMeds();
    scheduleMeds(); // ensure scheduler picks up new med
  });

  // --- Diet plans (simple scalable structure) ---
  const dietTitle = document.getElementById('dietTitle');
  const dietItem = document.getElementById('dietItem');

  function renderDiet(){
    const arr = read(STORAGE_KEYS.DIET);
    dietList.innerHTML = '';
    if(arr.length === 0){
      dietList.innerHTML = '<li class="small">No diet items</li>';
      return;
    }
    arr.forEach((d, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${d.title}</strong><div class="small">${d.item}</div></div>
        <div><button class="small-btn" data-idx="${idx}">Delete</button></div>`;
      dietList.appendChild(li);
      li.querySelector('.small-btn').addEventListener('click', () => {
        if(confirm('Delete diet item?')){
          const a = read(STORAGE_KEYS.DIET);
          a.splice(idx,1);
          write(STORAGE_KEYS.DIET, a);
          renderDiet();
        }
      });
    });
  }

  dietForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const d = {title: dietTitle.value.trim(), item: dietItem.value.trim()};
    const arr = read(STORAGE_KEYS.DIET);
    arr.push(d);
    write(STORAGE_KEYS.DIET, arr);
    dietForm.reset();
    renderDiet();
  });

  // --- Notifications & Scheduler ---
  function isNotificationSupported(){
    return ("Notification" in window);
  }
  async function requestNotifPermission(){
    if(!isNotificationSupported()){
      notifStatus.textContent = 'Not supported';
      return;
    }
    const p = await Notification.requestPermission();
    notifStatus.textContent = p;
  }
  // try to request early (but don't spam)
  requestNotifPermission().catch(()=>{ notifStatus.textContent = 'denied' });

  function showNotification(title, body){
    if(isNotificationSupported() && Notification.permission === 'granted'){
      try{
        new Notification(title, {body, icon: null});
      }catch(e){
        alert(`${title}\n\n${body}`);
      }
    } else {
      // fallback UI alert
      alert(`${title}\n\n${body}`);
    }
  }

  // Scheduler: check meds every 15 seconds (fine for demo). Use lastNotified to avoid duplicates.
  let medCheckIntervalId = null;
  function scheduleMeds(){
    if(medCheckIntervalId) clearInterval(medCheckIntervalId);
    medCheckIntervalId = setInterval(() => {
      const meds = read(STORAGE_KEYS.MEDS);
      const now = new Date();
      const nowHHMM = now.toTimeString().slice(0,5);
      meds.forEach((m, idx) => {
        // if med has start date, ensure today >= start
        if(m.start && new Date(m.start) > new Date(now.toISOString().slice(0,10))) return;
        // repeat "once" — check lastNotified
        if(m.repeat === 'once' && m.lastNotified) return;

        // if time matches (we allow trigger within same minute)
        if(m.time === nowHHMM){
          const last = m.lastNotified || '';
          if(last === now.toISOString().slice(0,10)+' '+nowHHMM) return; // already notified this minute
          // notify
          const title = `Medicine: ${m.name}`;
          const body = `${m.dose ? (m.dose + ' • ') : ''}${m.time}`;
          showNotification(title, body);
          // update lastNotified for that med
          const all = read(STORAGE_KEYS.MEDS);
          if(all[idx]) {
            all[idx].lastNotified = now.toISOString().slice(0,10)+' '+nowHHMM;
            write(STORAGE_KEYS.MEDS, all);
          }
        }
      });
    }, 15000); // every 15 seconds — checks exact HH:MM equality
  }

  // Kick off schedule
  scheduleMeds();

  // Initialize UI
  renderDashboard();
  renderHistory();
  renderMeds();
  renderDiet();

  // Periodic dashboard update in case of changes
  setInterval(renderDashboard, 5000);
});