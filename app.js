// School Website Interaction Script

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initStatsCounter();
  initAcademicResults();
});

// Sticky Header
function initStickyHeader() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Scroll Reveal Observer
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(element => {
    revealObserver.observe(element);
  });
}

// Stats Counter Animation
function initStatsCounter() {
  const statsSection = document.querySelector('.hero-stats');
  const stats = document.querySelectorAll('.stat-num');
  let started = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const speed = 100; // lower number = faster
    const increment = target / speed;
    let current = 0;

    const updateCount = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current) + suffix;
        setTimeout(updateCount, 15);
      } else {
        element.textContent = target + suffix;
      }
    };

    updateCount();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        stats.forEach(stat => countUp(stat));
        started = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) {
    observer.observe(statsSection);
  }
}

// Academic Results Tabs & Chart Rendering
function initAcademicResults() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const resultTableBody = document.getElementById('results-table-body');
  const chartContainer = document.getElementById('chart-container');

  // Dummy Data for Class X and Class XII
  const academicData = {
    classX: [
      { year: '2025', appeared: '210', passed: '210', percentage: '100%', avgScore: '89.4%' },
      { year: '2024', appeared: '195', passed: '194', percentage: '99.8%', avgScore: '87.8%' },
      { year: '2023', appeared: '188', passed: '187', percentage: '99.5%', avgScore: '86.2%' },
      { year: '2022', appeared: '175', passed: '173', percentage: '98.9%', avgScore: '85.5%' },
      { year: '2021', appeared: '160', passed: '157', percentage: '98.1%', avgScore: '84.0%' }
    ],
    classXII: [
      { year: '2025', appeared: '175', passed: '174', percentage: '99.4%', avgScore: '86.8%' },
      { year: '2024', appeared: '168', passed: '166', percentage: '98.8%', avgScore: '85.2%' },
      { year: '2023', appeared: '155', passed: '152', percentage: '98.1%', avgScore: '84.0%' },
      { year: '2022', appeared: '148', passed: '144', percentage: '97.3%', avgScore: '82.9%' },
      { year: '2021', appeared: '135', passed: '130', percentage: '96.3%', avgScore: '81.5%' }
    ]
  };

  // Switch tabs
  const renderData = (grade) => {
    const list = academicData[grade];
    // Render Table
    resultTableBody.innerHTML = '';
    list.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${row.year}</strong></td>
        <td>${row.appeared}</td>
        <td>${row.passed}</td>
        <td><strong style="color: var(--primary-accent);">${row.percentage}</strong></td>
        <td>${row.avgScore}</td>
      `;
      resultTableBody.appendChild(tr);
    });

    // Render / Animate CSS Chart Bars
    chartContainer.innerHTML = '';
    chartContainer.classList.remove('loaded');

    // We represent Class X in Blue, Class XII in Gold
    // Let's draw double bars for each year
    const years = ['2021', '2022', '2023', '2024', '2025'];
    
    years.forEach(yr => {
      const xInfo = academicData.classX.find(d => d.year === yr);
      const xiiInfo = academicData.classXII.find(d => d.year === yr);
      
      const xPct = parseFloat(xInfo.percentage);
      const xiiPct = parseFloat(xiiInfo.percentage);

      // Map percentage (e.g. 96% to 100%) to heights between 150px and 220px for visualization
      const minVal = 90;
      const xHeight = Math.max(20, ((xPct - minVal) / (100 - minVal)) * 180 + 40);
      const xiiHeight = Math.max(20, ((xiiPct - minVal) / (100 - minVal)) * 180 + 40);

      const barGroup = document.createElement('div');
      barGroup.className = 'chart-bar-group';
      barGroup.innerHTML = `
        <div class="chart-bars">
          <div class="chart-bar x-bar" style="height: 0px;" data-height="${xHeight}px">
            <span class="chart-bar-value">${xPct}%</span>
          </div>
          <div class="chart-bar xii-bar" style="height: 0px;" data-height="${xiiHeight}px">
            <span class="chart-bar-value">${xiiPct}%</span>
          </div>
        </div>
        <div class="chart-label">${yr}</div>
      `;
      chartContainer.appendChild(barGroup);
    });

    // Trigger height animation
    setTimeout(() => {
      chartContainer.classList.add('loaded');
      const bars = chartContainer.querySelectorAll('.chart-bar');
      bars.forEach(bar => {
        bar.style.height = bar.getAttribute('data-height');
      });
    }, 100);
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const grade = e.target.getAttribute('data-tab');
      renderData(grade);
    });
  });

  // Initial load
  renderData('classX');
}
