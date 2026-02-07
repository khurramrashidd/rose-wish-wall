// Paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyA1b49Z3uOlqyjgpfiySc-G4JutEiBMoe4",
  authDomain: "my-project-448309.firebaseapp.com",
  projectId: "my-project-448309",
  storageBucket: "my-project-448309.firebasestorage.app",
  messagingSenderId: "551079504310",
  appId: "1:551079504310:web:6f8bf54187e059af40b917"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- VIDEO MODAL LOGIC ---
const sarcasmTrigger = document.getElementById("sarcasmTrigger");
const videoModal = document.getElementById("videoModal");
const youtubeFrame = document.getElementById("youtubeFrame");

// Open Modal
sarcasmTrigger.addEventListener("click", function () {
  videoModal.classList.remove("hidden");
  // Auto-play video
  youtubeFrame.src = "https://www.youtube.com/embed/qhy81Baj1jI?autoplay=1";
});

// Close Modal
function closeVideo() {
  videoModal.classList.add("hidden");
  // Stop video by resetting src
  youtubeFrame.src = "";
}

// --- ROSE INSIGHTS DATA ---
const ROSE_INSIGHTS = [
  {
    title: "🌍 How Roses Heal the Earth",
    content: [
      "🌿 1. Improve Air Quality: Roses absorb CO2 and trap dust, cleaning the air.",
      "🐝 2. Support Pollinators: They attract bees and butterflies crucial for ecosystems.",
      "🌱 3. Prevent Soil Erosion: Roots hold soil in place, reducing runoff.",
      "🌡️ 4. Regulate Climate: Transpiration helps cool the local surroundings.",
      "🐦 5. Provide Habitat: Bushes offer shelter for small birds and insects.",
      "🌼 6. Boost Biodiversity: Mixing roses creates a resilient ecosystem."
    ]
  },
  {
    title: "💚 A Green Love Promise",
    content: "True love nurtures like a garden. Let our love root deep to protect each other and our planet. <br><br><b>Let's bloom together for a greener, kinder Earth. Happy Rose Day! 🌹</b>"
  },
  {
    title: "🌹 Origins of Rose Day",
    content: "Derived from Victorian 'Floriography', Rose Day starts Valentine Week. Red for Love, Yellow for Friendship, White for Peace."
  }
];

// --- APP LOGIC ---

let stats = { total: 0 };

function initApp() {
  renderInsights();
}

function renderInsights() {
  const container = document.getElementById('insights-content');
  let html = '';
  
  ROSE_INSIGHTS.forEach(section => {
    let contentHtml = '';
    
    if (Array.isArray(section.content)) {
      contentHtml = `<ul class="clean-list">${section.content.map(i => `<li>${i}</li>`).join('')}</ul>`;
    } else {
      contentHtml = `<p class="message-text">${section.content}</p>`;
    }

    html += `
      <div class="insight-card">
        <h4>${section.title}</h4>
        ${contentHtml}
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function toggleInsights() {
  const panel = document.getElementById('insights-panel');
  const btn = document.getElementById('insight-btn');
  panel.classList.toggle('open');
  btn.innerText = panel.classList.contains('open') ? "❌ Close Insights" : "✨ View Daily Insights";
}

function addRose() {
  const color = document.getElementById('color').value;
  const message = document.getElementById('message').value.trim();
  const name = document.getElementById('name').value.trim() || 'Anonymous';
  const recipient = document.getElementById('recipient').value.trim() || 'Someone Special';

  if (!message) {
    alert('Please write a message first! 🌹');
    return;
  }

  db.ref('roses').push({
    color, message, name, recipient,
    timestamp: Date.now()
  });

  document.getElementById('message').value = '';
  document.getElementById('recipient').value = '';
}

db.ref('roses').orderByChild('timestamp').limitToLast(100).on('child_added', (snapshot) => {
  const data = snapshot.val();
  
  stats.total++;
  document.getElementById('total-count').innerText = `${stats.total} Roses Planted`;

  const roseDiv = document.createElement('div');
  roseDiv.className = `rose-card ${data.color}`;
  roseDiv.dataset.color = data.color;
  
  const timeStr = new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  roseDiv.innerHTML = `
    <div class="rose-meta">
      <span>To: ${data.recipient}</span>
      <span>${timeStr}</span>
    </div>
    <p class="rose-msg">"${data.message}"</p>
    <div class="rose-from">– ${data.name}</div>
  `;
  
  const wall = document.getElementById('wall');
  wall.insertBefore(roseDiv, wall.firstChild);
});

function filterRoses(filterColor) {
  document.querySelectorAll('.pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filterColor);
  });

  const allRoses = document.querySelectorAll('.rose-card');
  allRoses.forEach(rose => {
    if (filterColor === 'all' || rose.dataset.color === filterColor) {
      rose.style.display = 'block';
    } else {
      rose.style.display = 'none';
    }
  });
}

initApp();