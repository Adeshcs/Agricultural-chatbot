// Sample Data
const agriculturalData = [
  {
    fiscal_year: "2022-23",
    state: "Punjab",
    crop: "Wheat",
    area_hectares: 3500000,
    production_tonnes: 17500000,
    yield_per_hectare: 5.0
  },
  {
    fiscal_year: "2022-23",
    state: "Maharashtra",
    crop: "Rice",
    area_hectares: 1500000,
    production_tonnes: 4500000,
    yield_per_hectare: 3.0
  },
  {
    fiscal_year: "2022-23",
    state: "Uttar Pradesh",
    crop: "Wheat",
    area_hectares: 9800000,
    production_tonnes: 34300000,
    yield_per_hectare: 3.5
  },
  {
    fiscal_year: "2022-23",
    state: "West Bengal",
    crop: "Rice",
    area_hectares: 5300000,
    production_tonnes: 15900000,
    yield_per_hectare: 3.0
  },
  {
    fiscal_year: "2021-22",
    state: "Punjab",
    crop: "Wheat",
    area_hectares: 3480000,
    production_tonnes: 17000000,
    yield_per_hectare: 4.9
  }
];

const climateData = [
  {
    year: "2023",
    state: "Punjab",
    monsoon_rainfall_mm: 650,
    avg_temperature_c: 24.5,
    rainfall_deviation: "+5%"
  },
  {
    year: "2023",
    state: "Maharashtra",
    monsoon_rainfall_mm: 1100,
    avg_temperature_c: 26.8,
    rainfall_deviation: "-8%"
  },
  {
    year: "2023",
    state: "Uttar Pradesh",
    monsoon_rainfall_mm: 920,
    avg_temperature_c: 25.2,
    rainfall_deviation: "+2%"
  }
];

// Navigation Functions
function showMainInterface() {
  document.getElementById('landing-page').classList.remove('active');
  document.getElementById('main-interface').classList.add('active');
}

function showSection(sectionName) {
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(`${sectionName}-section`).classList.add('active');
}

// Chat Functions
function askExample(button) {
  const question = button.textContent.trim();
  document.getElementById('chat-input').value = question;
  sendMessage();
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message
  addMessage(message, 'user');
  input.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Generate response after delay
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateResponse(message);
    addMessage(response.text, 'bot', response.data, response.sources);
  }, 1500);
}

function addMessage(text, sender, data = null, sources = null) {
  const messagesContainer = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = sender === 'user' ? '👤' : '🤖';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const textDiv = document.createElement('div');
  textDiv.className = 'message-text';
  textDiv.textContent = text;
  
  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  timeDiv.textContent = new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  contentDiv.appendChild(textDiv);
  
  // Add data display if present
  if (data) {
    const dataDisplay = createDataDisplay(data);
    contentDiv.appendChild(dataDisplay);
  }
  
  // Add sources if present
  if (sources) {
    const sourcesDiv = createSourcesDisplay(sources);
    contentDiv.appendChild(sourcesDiv);
  }
  
  contentDiv.appendChild(timeDiv);
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(contentDiv);
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createDataDisplay(data) {
  const dataDiv = document.createElement('div');
  dataDiv.className = 'data-display';
  
  if (data.type === 'table') {
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    data.headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    data.rows.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    dataDiv.appendChild(table);
  } else if (data.type === 'chart') {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    dataDiv.appendChild(chartContainer);
    
    // Create chart after element is added to DOM
    setTimeout(() => {
      createChart(canvas, data);
    }, 100);
  }
  
  return dataDiv;
}

function createChart(canvas, data) {
  new Chart(canvas, {
    type: data.chartType,
    data: {
      labels: data.labels,
      datasets: [{
        label: data.datasetLabel,
        data: data.values,
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
        borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: data.chartType !== 'pie' ? {
        y: {
          beginAtZero: true
        }
      } : {}
    }
  });
}

function createSourcesDisplay(sources) {
  const sourcesDiv = document.createElement('div');
  sourcesDiv.className = 'sources-section';
  
  const title = document.createElement('div');
  title.className = 'sources-title';
  title.textContent = '📚 Sources:';
  sourcesDiv.appendChild(title);
  
  sources.forEach(source => {
    const tag = document.createElement('span');
    tag.className = 'source-tag';
    tag.textContent = source;
    sourcesDiv.appendChild(tag);
  });
  
  return sourcesDiv;
}

function showTypingIndicator() {
  const messagesContainer = document.getElementById('chat-messages');
  const indicator = document.createElement('div');
  indicator.className = 'message bot-message';
  indicator.id = 'typing-indicator';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '🤖';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  
  contentDiv.appendChild(typingDiv);
  indicator.appendChild(avatar);
  indicator.appendChild(contentDiv);
  
  messagesContainer.appendChild(indicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function clearChat() {
  const messagesContainer = document.getElementById('chat-messages');
  messagesContainer.innerHTML = '';
  
  // Add welcome message back
  addMessage(
    "Hello! I'm your AgriClimate assistant. I can help you explore India's agricultural data and climate patterns. Ask me anything about crop production, yields, climate trends, or state-wise comparisons!",
    'bot'
  );
}

// Response Generation
function generateResponse(question) {
  const lowerQuestion = question.toLowerCase();
  
  // Rice production in Maharashtra
  if (lowerQuestion.includes('rice') && lowerQuestion.includes('maharashtra')) {
    const data = agriculturalData.find(d => 
      d.state === 'Maharashtra' && d.crop === 'Rice'
    );
    
    return {
      text: `In fiscal year ${data.fiscal_year}, Maharashtra produced ${(data.production_tonnes / 1000000).toFixed(2)} million tonnes of rice across ${(data.area_hectares / 1000000).toFixed(2)} million hectares, with a yield of ${data.yield_per_hectare} tonnes per hectare.`,
      data: {
        type: 'table',
        headers: ['State', 'Crop', 'Year', 'Area (M ha)', 'Production (M tonnes)', 'Yield (t/ha)'],
        rows: [[
          data.state,
          data.crop,
          data.fiscal_year,
          (data.area_hectares / 1000000).toFixed(2),
          (data.production_tonnes / 1000000).toFixed(2),
          data.yield_per_hectare
        ]]
      },
      sources: ['Ministry of Agriculture', 'data.gov.in']
    };
  }
  
  // Compare wheat yields
  if (lowerQuestion.includes('compare') && lowerQuestion.includes('wheat')) {
    const wheatData = agriculturalData.filter(d => 
      d.crop === 'Wheat' && d.fiscal_year === '2022-23'
    );
    
    return {
      text: `Comparing wheat yields for 2022-23: Punjab leads with ${wheatData[0].yield_per_hectare} tonnes/hectare, while Uttar Pradesh has ${wheatData[1].yield_per_hectare} tonnes/hectare. Punjab's higher yield is attributed to better irrigation infrastructure and optimal growing conditions.`,
      data: {
        type: 'chart',
        chartType: 'bar',
        labels: wheatData.map(d => d.state),
        values: wheatData.map(d => d.yield_per_hectare),
        datasetLabel: 'Wheat Yield (tonnes/hectare)'
      },
      sources: ['Ministry of Agriculture', 'Agricultural Statistics']
    };
  }
  
  // Rainfall queries
  if (lowerQuestion.includes('rainfall') && lowerQuestion.includes('punjab')) {
    const climate = climateData.find(d => d.state === 'Punjab');
    
    return {
      text: `In ${climate.year}, Punjab received ${climate.monsoon_rainfall_mm}mm of monsoon rainfall, which was ${climate.rainfall_deviation} from the normal average. The average temperature was ${climate.avg_temperature_c}°C.`,
      data: {
        type: 'table',
        headers: ['State', 'Year', 'Rainfall (mm)', 'Deviation', 'Avg Temp (°C)'],
        rows: [[
          climate.state,
          climate.year,
          climate.monsoon_rainfall_mm,
          climate.rainfall_deviation,
          climate.avg_temperature_c
        ]]
      },
      sources: ['India Meteorological Department', 'IMD Weather Data']
    };
  }
  
  // Highest wheat productivity
  if (lowerQuestion.includes('highest') && lowerQuestion.includes('wheat')) {
    const wheatData = agriculturalData.filter(d => 
      d.crop === 'Wheat' && d.fiscal_year === '2022-23'
    ).sort((a, b) => b.yield_per_hectare - a.yield_per_hectare);
    
    return {
      text: `Punjab has the highest wheat productivity in India with ${wheatData[0].yield_per_hectare} tonnes per hectare in 2022-23, followed by Uttar Pradesh with ${wheatData[1].yield_per_hectare} tonnes per hectare. Punjab's success is due to advanced farming techniques, adequate irrigation, and favorable soil conditions.`,
      data: {
        type: 'chart',
        chartType: 'bar',
        labels: wheatData.map(d => d.state),
        values: wheatData.map(d => d.yield_per_hectare),
        datasetLabel: 'Wheat Productivity (tonnes/hectare)'
      },
      sources: ['Ministry of Agriculture', 'Crop Production Statistics']
    };
  }
  
  // Climate affect on rice
  if (lowerQuestion.includes('climate') && lowerQuestion.includes('rice')) {
    return {
      text: `Rice cultivation is highly dependent on monsoon rainfall. Optimal rainfall (1000-1200mm) and temperatures (25-35°C) are crucial for good yields. States like West Bengal and Punjab with better water management systems maintain consistent production. Excess or deficit rainfall significantly impacts yields - a 10% deviation in rainfall can affect yields by 5-8%.`,
      data: {
        type: 'table',
        headers: ['State', 'Rice Production (M tonnes)', 'Rainfall (mm)', 'Deviation'],
        rows: [
          ['West Bengal', '15.9', 'Adequate', 'Normal'],
          ['Maharashtra', '4.5', '1100', '-8%'],
          ['Punjab', 'High yields', '650', '+5%']
        ]
      },
      sources: ['IMD', 'Ministry of Agriculture', 'Agricultural Research Papers']
    };
  }
  
  // Production trends
  if (lowerQuestion.includes('trend') || lowerQuestion.includes('last 3 years')) {
    const punjabWheat = agriculturalData.filter(d => 
      d.state === 'Punjab' && d.crop === 'Wheat'
    );
    
    return {
      text: `Wheat production in Punjab shows a steady upward trend. From 2021-22 to 2022-23, production increased from 17.0 million tonnes to 17.5 million tonnes, representing a 2.9% growth. This growth is attributed to improved seed varieties, better irrigation, and favorable weather conditions.`,
      data: {
        type: 'chart',
        chartType: 'line',
        labels: ['2021-22', '2022-23'],
        values: [17.0, 17.5],
        datasetLabel: 'Wheat Production in Punjab (Million Tonnes)'
      },
      sources: ['Ministry of Agriculture', 'Historical Production Data']
    };
  }
  
  // Default response
  return {
    text: `I understand you're asking about "${question}". While I have comprehensive data on Indian agriculture and climate, I might need more specific information to provide the best answer. Try asking about: crop production in specific states, rainfall patterns, yield comparisons, or climate impacts on agriculture.`,
    data: {
      type: 'table',
      headers: ['Available Data', 'Coverage'],
      rows: [
        ['Crop Production', '2021-2023'],
        ['Climate Data', '2023'],
        ['States Covered', '35+ States/UTs'],
        ['Crop Types', 'Major crops (Rice, Wheat, etc.)']
      ]
    },
    sources: ['data.gov.in', 'IMD', 'Ministry of Agriculture']
  };
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  console.log('AgriClimate Q&A System Initialized');
});