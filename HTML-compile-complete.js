#!/usr/bin/env node

/**
 * Complete HTML compiler that replicates the EXACT structure of
 * EnhancedPortfolio.tsx with all sub-components
 */

const fs = require('fs');
const path = require('path');

// Get the data file path from command line arguments
const dataFilePath = process.argv[2];
if (!dataFilePath) {
  console.error('Usage: node HTML-compile-complete.js <data-file-path>');
  process.exit(1);
}

// Read the portfolio data
const portfolioData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Get theme colors
const themeColors = portfolioData.themeColors || {};
const primaryColor = themeColors.primary || '#0B3D91';
const secondaryColor = themeColors.secondary || '#17A2B8';
const accentColor = themeColors.accent || '#F3F4F6';
const backgroundColor = themeColors.background || '#ffffff';
const textColor = themeColors.text || '#1f2937';

// Get section order
const sectionOrder = portfolioData.sectionOrder || ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];

// Generate CSS for dynamic colors
const dynamicCSS = `
  :root {
    --primary-theme: ${primaryColor};
    --secondary-theme: ${secondaryColor};
    --accent-theme: ${accentColor};
    --bg-theme: ${backgroundColor};
    --text-theme: ${textColor};
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  /* Card styles - matching shadcn/ui */
  .card {
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    background-color: white;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  /* Badge styles - matching shadcn/ui */
  .badge {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .badge-secondary {
    background-color: rgba(107, 114, 128, 0.1);
    color: rgb(107, 114, 128);
  }
  
  /* Skill Card Icon Colors */
  .skill-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-center;
    margin: 0 auto 1rem;
  }
  
  /* Skills Carousel Animation */
  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
  
  .skills-carousel {
    animation: scroll 60s linear infinite;
  }
  
  /* Timeline styles */
  .timeline-line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0.25rem;
    height: 100%;
    background-color: var(--secondary-theme);
    border-radius: 9999px;
  }
  
  .timeline-dot {
    width: 1rem;
    height: 1rem;
    background-color: #17A2B8;
    border-radius: 9999px;
    border: 4px solid white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  /* Hover effects */
  .hover-scale:hover {
    transform: scale(1.05);
  }
  
  .hover-translate:hover {
    transform: translateY(-4px);
  }
  
  .transition-all {
    transition: all 0.3s ease;
  }
  
  /* Line clamp */
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }
`;

// Generate complete HTML
function generateCompleteHTML() {
  const sections = sectionOrder.map(sectionId => {
    switch(sectionId) {
      case 'hero':
        return generateHeroSection();
      case 'about':
        return generateAboutSection();
      case 'skills':
        // Skills are part of About section, skip here
        return '';
      case 'projects':
        return generateProjectsSection();
      case 'timeline':
        return generateTimelineSection();
      case 'contact':
        return generateContactSection();
      default:
        return '';
    }
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(portfolioData.name || 'Portfolio')}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${dynamicCSS}</style>
</head>
<body>
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <button 
                    onclick="window.scrollTo({ top: 0, behavior: 'smooth' })"
                    class="font-bold text-xl transition-colors cursor-pointer"
                    style="color: ${primaryColor}; border: none; background: none;"
                    onmouseenter="this.style.color='${secondaryColor}'"
                    onmouseleave="this.style.color='${primaryColor}'">
                    ${escapeHtml(portfolioData.name || 'Portfolio')}
                </button>
                <div class="hidden md:flex space-x-8">
                    <a href="#about" 
                       class="text-gray-700 transition-colors"
                       style="color: #374151;"
                       onmouseenter="this.style.color='${primaryColor}'"
                       onmouseleave="this.style.color='#374151'">
                        About
                    </a>
                    <a href="#projects" 
                       class="text-gray-700 transition-colors"
                       style="color: #374151;"
                       onmouseenter="this.style.color='${primaryColor}'"
                       onmouseleave="this.style.color='#374151'">
                        Projects
                    </a>
                    <a href="#timeline" 
                       class="text-gray-700 transition-colors"
                       style="color: #374151;"
                       onmouseenter="this.style.color='${primaryColor}'"
                       onmouseleave="this.style.color='#374151'">
                        Resume
                    </a>
                    ${((portfolioData.referencesUrl && portfolioData.referencesUrl.trim() !== '') || (portfolioData.references && portfolioData.references.length > 0)) ? `
                        <a href="references.html" 
                           class="text-gray-700 transition-colors"
                           style="color: #374151;"
                           onmouseenter="this.style.color='${primaryColor}'"
                           onmouseleave="this.style.color='#374151'">
                            References
                        </a>
                    ` : ''}
                    <a href="#contact" 
                       class="text-gray-700 transition-colors"
                       style="color: #374151;"
                       onmouseenter="this.style.color='${primaryColor}'"
                       onmouseleave="this.style.color='#374151'">
                        Contact
                    </a>
                </div>
            </div>
        </div>
    </nav>
    
    <!-- Main Content -->
    <main class="min-h-screen">
        ${sections}
    </main>
    
    <!-- Footer -->
    ${generateFooter()}
    
    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>`;
}

function generateHeroSection() {
  return `
    <section id="hero" class="min-h-screen flex items-center justify-center text-white relative" style="background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <!-- Headshot - LEFT SIDE -->
                <div class="flex justify-center lg:justify-start order-2 lg:order-1">
                    <div class="opacity-100">
                        <div class="relative">
                            <div class="w-80 h-auto md:w-96 md:h-auto rounded-2xl overflow-hidden border-4 shadow-2xl" style="border-color: rgba(255, 255, 255, 0.2);">
                                ${portfolioData.headshotImage ? `
                                    <img src="${escapeHtml(portfolioData.headshotImage)}" 
                                         alt="${escapeHtml(portfolioData.name)} - Professional headshot" 
                                         class="w-full h-full object-contain">
                                ` : `
                                    <div class="w-full h-full rounded-2xl flex flex-col items-center justify-center text-white/70" style="background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3);">
                                        <svg class="w-20 h-20 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span class="text-sm font-medium">Add Headshot</span>
                                    </div>
                                `}
                            </div>
                            <div class="absolute inset-0 rounded-2xl blur-xl -z-10 scale-110" style="background: linear-gradient(to bottom right, rgba(23, 162, 184, 0.3), transparent);"></div>
                        </div>
                    </div>
                </div>

                <!-- Text Content - RIGHT SIDE -->
                <div class="text-center lg:text-left order-1 lg:order-2">
                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        ${escapeHtml(portfolioData.name || 'Your Name')}
                    </h1>
                    <h2 class="text-xl md:text-2xl lg:text-3xl font-light mb-8" style="color: ${accentColor};">
                        ${escapeHtml(portfolioData.title || 'Your Professional Title')}
                    </h2>
                    <p class="text-lg md:text-xl lg:text-2xl mb-12 leading-relaxed max-w-2xl" style="color: ${accentColor};">
                        ${escapeHtml(portfolioData.bio || 'Add your professional bio here to introduce yourself and highlight your expertise.')}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="#projects" 
                           class="inline-flex items-center justify-center text-white h-11 px-8 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg" 
                           style="background-color: ${secondaryColor};"
                           onmouseenter="this.style.backgroundColor='${primaryColor}'"
                           onmouseleave="this.style.backgroundColor='${secondaryColor}'">
                            View My Projects
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg class="w-8 h-8" style="color: rgba(255, 255, 255, 0.7);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
    </section>
  `;
}

function generateAboutSection() {
  if (!sectionOrder.includes('about')) return '';
  
  // Split about text into paragraphs
  const aboutText = portfolioData.aboutText || 'Add your about text here to tell your story and showcase your personality.';
  const paragraphs = aboutText.split('\n\n');
  
  // Check if we should render skills in this section
  const skillsDisplayMode = portfolioData.skillsDisplayMode || 'card';
  
  // Debug: Log skills data
  console.log('Skills data:', JSON.stringify(portfolioData.skills, null, 2));
  console.log('Skills display mode:', skillsDisplayMode);
  
  const hasSkills = portfolioData.skills && (
    (portfolioData.skills.categories && portfolioData.skills.categories.length > 0) ||
    (portfolioData.skills.skills && Object.keys(portfolioData.skills.skills).length > 0)
  );
  
  console.log('Has skills:', hasSkills);
  
  return `
    <section id="about" class="py-20 bg-white">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-6" style="color: ${primaryColor};">About Me</h2>
                <div class="max-w-4xl mx-auto">
                    ${paragraphs.map(paragraph => `
                        <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                            ${escapeHtml(paragraph)}
                        </p>
                    `).join('')}
                </div>
            </div>
            
            <!-- Skills Section -->
            ${hasSkills ? (skillsDisplayMode === 'rotating' ? generateSkillsCarousel() : generateSkillsCards()) : '<!-- No skills data -->'}
        </div>
    </section>
  `;
}

function generateSkillsCarousel() {
  console.log('Generating skills carousel...');
  
  if (!portfolioData.skills || !portfolioData.skills.skills) {
    console.log('No skills data for carousel');
    return '';
  }
  
  const allSkills = Object.values(portfolioData.skills.skills).flat();
  console.log('All skills for carousel:', allSkills);
  
  if (allSkills.length === 0) return '';
  
  // Triple the skills array for seamless looping
  const displaySkills = allSkills.concat(allSkills).concat(allSkills);
  
  return `
    <div class="text-center mt-8">
        <h3 class="text-2xl font-semibold mb-8" style="color: ${primaryColor};">Skills</h3>
        <div class="-mx-4 sm:-mx-6 lg:-mx-8">
            <div class="skills-carousel-container relative overflow-hidden bg-gray-50/50 rounded-lg py-4">
                <div class="skills-carousel flex gap-3 whitespace-nowrap" style="width: max-content;">
                    ${displaySkills.map(skill => `
                        <span class="badge px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 flex-shrink-0" 
                              style="background-color: ${secondaryColor}10; color: ${secondaryColor};">
                            ${escapeHtml(skill)}
                        </span>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
  `;
}

function generateSkillsCards() {
  console.log('Generating skills cards...');
  console.log('Skills object:', portfolioData.skills);
  
  if (!portfolioData.skills || !portfolioData.skills.categories) {
    console.log('No skills categories found');
    return '';
  }
  
  const categoriesWithSkills = portfolioData.skills.categories.filter(category => {
    const skills = portfolioData.skills.skills?.[category.id] || [];
    console.log(`Category ${category.name} (${category.id}):`, skills);
    return skills.length > 0;
  });
  
  console.log('Categories with skills:', categoriesWithSkills.length);
  
  if (categoriesWithSkills.length === 0) {
    return `
      <div class="text-center text-gray-500 py-8">
          <p>No skills added yet. Add some skills in the editor!</p>
      </div>
    `;
  }
  
  // NO "Skills" heading for cards mode - only for carousel
  
  // Group into rows of 3
  const rows = [];
  for (let i = 0; i < categoriesWithSkills.length; i += 3) {
    const rowCategories = categoriesWithSkills.slice(i, i + 3);
    const isPartialRow = rowCategories.length < 3;
    
    rows.push(`
      <div class="${isPartialRow ? 'flex justify-center gap-8 mb-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8'}">
          ${rowCategories.map((category, idx) => {
            const skills = portfolioData.skills.skills[category.id] || [];
            const globalIndex = i + idx;
            return `
              <div class="${isPartialRow ? 'w-80' : 'w-full'}">
                  <div class="bg-white rounded-lg border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                      <div class="p-8 flex flex-col h-full w-full">
                          <div class="text-center mb-6">
                              <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: ${primaryColor};">
                                  ${getCategoryIcon(category.icon, category.name, globalIndex)}
                              </div>
                              <h3 class="text-xl font-bold mb-4" style="color: ${primaryColor};">
                                  ${escapeHtml(category.name)}
                              </h3>
                          </div>
                          <div class="space-y-3 flex-1">
                              ${skills.map(skill => `
                                  <div class="flex items-center">
                                      <div class="w-2 h-2 rounded-full mr-3 flex-shrink-0" style="background-color: ${secondaryColor};"></div>
                                      <span class="text-gray-700 font-medium text-sm leading-tight">${escapeHtml(skill)}</span>
                                  </div>
                              `).join('')}
                          </div>
                      </div>
                  </div>
              </div>
            `;
          }).join('')}
      </div>
    `);
  }
  
  return `
    <div class="flex flex-col items-center">
        ${rows.join('\n')}
    </div>
  `;
}

// Skills are now part of the About section, no separate skills section needed

function getCategoryIcon(iconName, categoryName, categoryIndex = 0) {
  // Get icon by name (from database) or by category name (fallback for legacy data)
  const identifier = (iconName || categoryName || '').toLowerCase();
  
  // 5 default icons for rotation when no match found
  const defaultIcons = [
    `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
    </svg>`,
    `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`,
    `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>`,
    `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`,
    `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
    </svg>`
  ];
  
  // Map icon identifiers to SVGs
  switch (identifier) {
    case 'star':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
      </svg>`;
    case 'check':
    case 'testing':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`;
    case 'people':
    case 'professional':
    case 'professional skills':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>`;
    case 'code':
    case 'technical':
    case 'technical skills':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
      </svg>`;
    case 'tool':
    case 'engineering':
    case 'engineering expertise':
    case 'devops':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>`;
    case 'design':
    case 'creative':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
      </svg>`;
    case 'language':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
      </svg>`;
    case 'heart':
    case 'soft':
    case 'healthcare':
    case 'volunteer':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>`;
    case 'certification':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
      </svg>`;
    case 'framework':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>`;
    case 'database':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
      </svg>`;
    case 'cloud':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
      </svg>`;
    case 'mobile':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>`;
    case 'management':
    case 'analytics':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>`;
    case 'research':
    case 'ai':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>`;
    case 'communication':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>`;
    case 'leadership':
    case 'startup':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>`;
    case 'security':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>`;
    case 'blockchain':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
      </svg>`;
    case 'gaming':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`;
    case 'finance':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
      </svg>`;
    case 'education':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>`;
    case 'marketing':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
      </svg>`;
    case 'sales':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
      </svg>`;
    case 'consulting':
      return `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`;
    default:
      // For unrecognized icons, use default icons based on index
      return defaultIcons[categoryIndex % 5];
  }
}

function generateProjectsSection() {
  if (!sectionOrder.includes('projects') || !portfolioData.projects || portfolioData.projects.length === 0) return '';
  
  // Group projects into rows of 3
  const rows = [];
  for (let i = 0; i < portfolioData.projects.length; i += 3) {
    const rowProjects = portfolioData.projects.slice(i, i + 3);
    const isPartialRow = rowProjects.length < 3;
    
    rows.push(`
      <div class="${isPartialRow ? 'flex justify-center gap-8 mb-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8'}">
          ${rowProjects.map(project => `
            <div class="${isPartialRow ? 'w-80' : 'w-full'}">
                <div class="group card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                    <div class="h-48 overflow-hidden flex items-center justify-center ${project.imageBg === 'white' ? 'bg-white' : project.imageBg === 'black' ? 'bg-black' : 'bg-gray-100'}">
                        ${project.image ? `
                            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="w-full h-full object-${project.imageStyle || 'cover'} transition-transform duration-300 group-hover:scale-105">
                        ` : `
                            <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                            </svg>
                        `}
                    </div>
                    <div class="card-content p-6 flex flex-col h-full">
                        <h3 class="text-xl font-bold mb-3 group-hover:text-[var(--secondary-theme)] transition-colors duration-300" style="color: var(--primary-theme);">
                            ${escapeHtml(project.title)}
                        </h3>
                        <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4 flex-grow">
                            ${escapeHtml(project.summary || project.description || '')}
                        </p>
                        ${project.skills && project.skills.length > 0 ? `
                            <div class="flex flex-wrap gap-2 mb-4">
                                ${project.skills.slice(0, 3).map(skill => `
                                    <span class="badge badge-secondary px-3 py-1" style="background-color: ${secondaryColor}10; color: ${secondaryColor};">
                                        ${escapeHtml(skill)}
                                    </span>
                                `).join('')}
                                ${project.skills.length > 3 ? `
                                    <span class="badge badge-secondary px-3 py-1 bg-gray-100 text-gray-600">
                                        +${project.skills.length - 3} more
                                    </span>
                                ` : ''}
                            </div>
                        ` : ''}
                        <div class="flex items-center mt-auto" style="color: var(--primary-theme);">
                            <span class="text-sm font-semibold">View Project</span>
                            <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
          `).join('')}
      </div>
    `);
  }
  
  return `
    <section id="projects" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-6" style="color: ${primaryColor};">Featured Projects</h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    ${escapeHtml(portfolioData.projectsDescription || 'Explore some of my recent work and personal projects that showcase my skills and passion for development.')}
                </p>
            </div>
            ${rows.join('\n')}
            <div class="text-center mt-16">
                <p class="text-gray-600 mb-6">
                    Interested in learning more about my work or think I could be a good fit for your team?
                </p>
                <a href="#contact" class="inline-block px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 text-white" style="background-color: ${primaryColor};">
                    Get In Touch
                </a>
            </div>
        </div>
    </section>
  `;
}

function generateTimelineSection() {
  if (!sectionOrder.includes('timeline') || !portfolioData.timeline || portfolioData.timeline.length === 0) return '';
  
  // Generate dynamic timeline title based on available types
  function generateTimelineTitle(timelineData) {
    const types = [...new Set(timelineData.map(item => item.type))];
    
    if (types.length === 0) return "Education, Experience & Research";
    
    // Define the preferred order: Education, Experience, Research
    const typeOrder = ['education', 'experience', 'research'];
    
    // Filter and sort types according to the preferred order
    const orderedTypes = typeOrder.filter(type => types.includes(type));
    
    const typeNames = orderedTypes.map(type => {
      switch (type) {
        case 'education': return 'Education';
        case 'experience': return 'Experience';
        case 'research': return 'Research';
        default: return type;
      }
    });
    
    if (typeNames.length === 1) {
      return typeNames[0];
    } else if (typeNames.length === 2) {
      return `${typeNames[0]} & ${typeNames[1]}`;
    } else {
      // For 3 types, use the format: "Education, Experience, & Research"
      return `${typeNames.slice(0, -1).join(', ')}, & ${typeNames[typeNames.length - 1]}`;
    }
  }
  
  const timelineTitle = generateTimelineTitle(portfolioData.timeline);
  
  return `
    <section id="timeline" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-6" style="color: ${primaryColor};">Resume</h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                    ${portfolioData.references && portfolioData.references.length > 0 
                        ? 'Download my complete resume and references or explore my educational background and professional experience below.'
                        : 'Download my complete resume or explore my educational background and professional experience below.'}
                </p>
                ${portfolioData.resumeUrl || portfolioData.referencesUrl ? `
                    <div class="flex gap-4 justify-center mb-8">
                        ${portfolioData.resumeUrl ? `
                            <a href="${escapeHtml(portfolioData.resumeUrl)}" target="_blank" rel="noopener noreferrer">
                                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap h-11 px-8 py-3 rounded-lg shadow-lg border bg-transparent transition-all duration-300 hover:scale-105 text-sm font-medium" 
                                        style="border-color: ${secondaryColor}; color: ${secondaryColor};"
                                        onmouseenter="this.style.backgroundColor='${secondaryColor}'; this.style.color='white';"
                                        onmouseleave="this.style.backgroundColor='transparent'; this.style.color='${secondaryColor}';">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                    </svg>
                                    Download Resume PDF
                                </button>
                            </a>
                        ` : ''}
                        ${portfolioData.referencesUrl ? `
                            <a href="${escapeHtml(portfolioData.referencesUrl)}" target="_blank" rel="noopener noreferrer">
                                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap h-11 px-8 py-3 rounded-lg shadow-lg border bg-transparent transition-all duration-300 hover:scale-105 text-sm font-medium" 
                                        style="border-color: ${secondaryColor}; color: ${secondaryColor};"
                                        onmouseenter="this.style.backgroundColor='${secondaryColor}'; this.style.color='white';"
                                        onmouseleave="this.style.backgroundColor='transparent'; this.style.color='${secondaryColor}';">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                    </svg>
                                    Download References PDF
                                </button>
                            </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
            <div class="max-w-4xl mx-auto">
                <h3 class="text-2xl font-bold mb-8 text-center" style="color: ${primaryColor};">${escapeHtml(timelineTitle)}</h3>
                <div class="relative">
                    <div class="timeline-line"></div>
                    ${portfolioData.timeline.map((item, index) => {
                      const badgeColor = item.type === 'education' ? primaryColor : item.type === 'research' ? '#8b5cf6' : '#0ea5e9';
                      return `
                        <div class="flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}">
                            <div class="w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}">
                                <div class="card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div class="card-content p-6">
                                        <div class="flex items-center mb-2">
                                            <span class="badge text-white mr-3" style="background-color: ${badgeColor};">
                                                ${item.type === 'education' ? 'Education' : item.type === 'research' ? 'Research' : 'Experience'}
                                            </span>
                                            <span class="text-sm font-semibold text-gray-500">${escapeHtml(item.year)}</span>
                                        </div>
                                        <h4 class="text-lg font-bold mb-2" style="color: ${primaryColor};">${escapeHtml(item.title)}</h4>
                                        <p class="font-semibold mb-3" style="color: ${secondaryColor};">${escapeHtml(item.organization)}</p>
                                        ${item.description ? `<p class="text-gray-600 text-sm leading-relaxed">${escapeHtml(item.description)}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="relative z-10">
                                <div class="timeline-dot"></div>
                            </div>
                            <div class="w-1/2"></div>
                        </div>
                      `;
                    }).join('')}
                </div>
            </div>
        </div>
    </section>
  `;
}

function generateContactSection() {
  if (!sectionOrder.includes('contact')) return '';
  
  // Debug logging
  console.log('Contact data:', portfolioData.contact);
  console.log('Links data:', portfolioData.links);
  console.log('Areas of interest:', portfolioData.contact?.areasOfInterest);
  
  const hasEmail = Boolean(portfolioData.contact?.email);
  const hasLinkedin = Boolean(portfolioData.contact?.linkedin);
  const hasPhone = Boolean(portfolioData.contact?.phone);
  const hasGithub = Boolean(portfolioData.links?.github);
  const hasAreasOfInterest = portfolioData.contact?.areasOfInterest && portfolioData.contact.areasOfInterest.length > 0;
  
  console.log('Contact checks:', { hasEmail, hasLinkedin, hasPhone, hasGithub, hasAreasOfInterest });
  
  return `
    <section id="contact" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-6" style="color: ${primaryColor};">Get In Touch</h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    ${escapeHtml(portfolioData.contactIntro || "I'm always interested in discussing new opportunities or answering questions about my work. Feel free to reach out!")}
                </p>
            </div>
            <div class="max-w-3xl mx-auto">
                <div class="flex flex-wrap md:flex-nowrap justify-center gap-6 text-center">
                    ${hasEmail ? `
                        <div class="flex flex-col items-center w-56">
                            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background-color: ${primaryColor};">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">Email</h4>
                            <a href="mailto:${escapeHtml(portfolioData.contact.email)}" 
                               class="transition-colors" 
                               style="color: ${secondaryColor};"
                               onmouseenter="this.style.color='${primaryColor}'"
                               onmouseleave="this.style.color='${secondaryColor}'">
                                ${escapeHtml(portfolioData.contact.email)}
                            </a>
                        </div>
                    ` : ''}
                    ${hasLinkedin ? `
                        <div class="flex flex-col items-center w-56">
                            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background-color: ${primaryColor};">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                    <circle cx="4" cy="4" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">LinkedIn</h4>
                            <a href="${escapeHtml(portfolioData.contact.linkedin)}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="transition-colors" 
                               style="color: ${secondaryColor};"
                               onmouseenter="this.style.color='${primaryColor}'"
                               onmouseleave="this.style.color='${secondaryColor}'">
                                ${escapeHtml((portfolioData.contact.linkedin || '').replace('https://', '').replace('linkedin.com/in/', ''))}
                            </a>
                        </div>
                    ` : ''}
                    ${hasPhone ? `
                        <div class="flex flex-col items-center w-56">
                            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background-color: ${primaryColor};">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">Phone</h4>
                            <a href="tel:${escapeHtml(portfolioData.contact.phone)}" 
                               class="transition-colors" 
                               style="color: ${secondaryColor};"
                               onmouseenter="this.style.color='${primaryColor}'"
                               onmouseleave="this.style.color='${secondaryColor}'">
                                ${escapeHtml(portfolioData.contact.phone)}
                            </a>
                        </div>
                    ` : ''}
                    ${hasGithub ? `
                        <div class="flex flex-col items-center w-56">
                            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background-color: ${primaryColor};">
                                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">GitHub</h4>
                            <a href="${escapeHtml(portfolioData.links.github)}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="transition-colors" 
                               style="color: ${secondaryColor};"
                               onmouseenter="this.style.color='${primaryColor}'"
                               onmouseleave="this.style.color='${secondaryColor}'">
                                ${escapeHtml((portfolioData.links.github || '').replace('https://', '').replace('http://', '').replace('github.com/', ''))}
                            </a>
                        </div>
                    ` : ''}
                </div>
                
                ${hasAreasOfInterest ? `
                    <div class="mt-12 text-center">
                        <h4 class="font-semibold text-gray-900 mb-4">Areas of Interest</h4>
                        <div class="flex flex-wrap justify-center gap-2">
                            ${portfolioData.contact.areasOfInterest.map(interest => `
                                <span class="px-3 py-1 rounded-full text-sm font-medium transition-colors" 
                                      style="background-color: ${secondaryColor}10; color: ${secondaryColor};">
                                    ${escapeHtml(interest)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    </section>
  `;
}

function generateFooter() {
  const hasEmail = Boolean(portfolioData.contact?.email);
  const hasLinkedin = Boolean(portfolioData.contact?.linkedin);
  const hasGithub = Boolean(portfolioData.links?.github);
  
  // Format footer descriptors with '|' separator, or use title as fallback
  const footerText = portfolioData.footerDescriptors && portfolioData.footerDescriptors.length > 0 
    ? portfolioData.footerDescriptors.map(d => escapeHtml(d.trim())).filter(Boolean).join(' | ')
    : escapeHtml(portfolioData.title || '');
  
  return `
    <footer class="text-white py-12" style="background-color: ${primaryColor};">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4">${escapeHtml(portfolioData.name || '')}</h3>
                <p class="mb-6" style="color: ${accentColor};">
                    ${footerText}
                </p>
                <div class="flex justify-center space-x-6">
                    ${hasEmail ? `
                        <a href="mailto:${escapeHtml(portfolioData.contact.email)}" 
                           class="transition-colors" 
                           style="color: ${accentColor};"
                           onmouseenter="this.style.color='white'"
                           onmouseleave="this.style.color='${accentColor}'">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </a>
                    ` : ''}
                    ${hasLinkedin ? `
                        <a href="${escapeHtml(portfolioData.contact.linkedin)}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="transition-colors" 
                           style="color: ${accentColor};"
                           onmouseenter="this.style.color='white'"
                           onmouseleave="this.style.color='${accentColor}'">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                            </svg>
                        </a>
                    ` : ''}
                    ${hasGithub ? `
                        <a href="${escapeHtml(portfolioData.links.github)}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="transition-colors" 
                           style="color: ${accentColor};"
                           onmouseenter="this.style.color='white'"
                           onmouseleave="this.style.color='${accentColor}'">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                    ` : ''}
                </div>
                <div class="mt-8 pt-8" style="border-top: 1px solid ${secondaryColor};">
                    <p class="text-sm" style="color: ${accentColor};">
                        © 2025 ${escapeHtml(portfolioData.name || '')}. All rights reserved. Built with Next.js and Tailwind CSS.
                    </p>
                </div>
            </div>
        </div>
    </footer>
  `;
}

// Generate references page HTML (using same approach as local compile)
function generateReferencesHTML() {
  const themeColors = portfolioData.themeColors || {}
  const primaryColor = themeColors.primary || '#0B3D91'
  const secondaryColor = themeColors.secondary || '#17A2B8'
  const accentColor = themeColors.accent || '#F3F4F6'
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>References - ${escapeHtml(portfolioData.name)}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="index.html" 
                   class="font-bold text-xl transition-colors cursor-pointer"
                   style="color: ${primaryColor};"
                   onmouseenter="this.style.color='${secondaryColor}'"
                   onmouseleave="this.style.color='${primaryColor}'">
                    ${escapeHtml(portfolioData.name)}
                </a>
                <div class="hidden md:flex space-x-8">
                    <a href="index.html#about" class="text-gray-700 transition-colors" onmouseenter="this.style.color='${primaryColor}'" onmouseleave="this.style.color='#374151'">About</a>
                    <a href="index.html#projects" class="text-gray-700 transition-colors" onmouseenter="this.style.color='${primaryColor}'" onmouseleave="this.style.color='#374151'">Projects</a>
                    <a href="index.html#timeline" class="text-gray-700 transition-colors" onmouseenter="this.style.color='${primaryColor}'" onmouseleave="this.style.color='#374151'">Resume</a>
                    <span class="font-semibold" style="color: ${primaryColor};">References</span>
                    <a href="index.html#contact" class="text-gray-700 transition-colors" onmouseenter="this.style.color='${primaryColor}'" onmouseleave="this.style.color='#374151'">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header Section -->
    <section class="pt-24 pb-12 text-white" style="background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <a href="index.html" class="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-6">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                    Back to Portfolio
                </a>
                <h1 class="text-4xl md:text-5xl font-bold mb-6">Professional References</h1>
                <p class="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                    Below are professional references who can speak to my technical skills, work ethic, and contributions in academic and industry settings.
                </p>
                ${portfolioData.referencesUrl ? `
                    <a href="${escapeHtml(portfolioData.referencesUrl)}" download="References.pdf" target="_blank" rel="noopener noreferrer">
                        <button class="inline-flex items-center justify-center bg-white text-sm font-medium h-11 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:bg-gray-100"
                                style="color: ${primaryColor};">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Download References PDF
                        </button>
                    </a>
                ` : ''}
            </div>
        </div>
    </section>

    <!-- References Section -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${portfolioData.references.map((ref) => {
                    const initials = ref.name.split(' ').map((n) => n[0]).join('');
                    return `
                        <div class="bg-white rounded-lg border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div class="p-8">
                                <div class="text-center mb-6">
                                    <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: ${primaryColor};">
                                        <span class="text-white font-bold text-xl">${escapeHtml(initials)}</span>
                                    </div>
                                    <h3 class="text-xl font-bold mb-2" style="color: ${primaryColor};">${escapeHtml(ref.name)}</h3>
                                    <p class="font-semibold mb-1" style="color: ${secondaryColor};">${escapeHtml(ref.title)}</p>
                                    <p class="text-gray-600 font-medium mb-2">${escapeHtml(ref.company)}</p>
                                    <p class="text-sm text-gray-500 italic">${escapeHtml(ref.relationship || '')}</p>
                                </div>

                                <p class="text-gray-700 text-sm leading-relaxed mb-6">${escapeHtml(ref.description || ref.testimonial || '')}</p>

                                <div class="space-y-3">
                                    <div class="flex items-center text-sm">
                                        <svg class="w-4 h-4 mr-3" style="color: ${secondaryColor};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        <a href="mailto:${escapeHtml(ref.email)}" 
                                           class="text-gray-700 transition-colors"
                                           onmouseenter="this.style.color='${secondaryColor}'"
                                           onmouseleave="this.style.color='#374151'">
                                            ${escapeHtml(ref.email)}
                                        </a>
                                    </div>
                                    ${ref.phone ? `
                                        <div class="flex items-center text-sm">
                                            <svg class="w-4 h-4 mr-3" style="color: ${secondaryColor};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                            </svg>
                                            <a href="tel:${escapeHtml(ref.phone)}" 
                                               class="text-gray-700 transition-colors"
                                               onmouseenter="this.style.color='${secondaryColor}'"
                                               onmouseleave="this.style.color='#374151'">
                                                ${escapeHtml(ref.phone)}
                                            </a>
                                        </div>
                                    ` : ''}
                                    ${ref.linkedin ? `
                                        <div class="flex items-center text-sm">
                                            <svg class="w-4 h-4 mr-3" style="color: ${secondaryColor};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                                <circle cx="4" cy="4" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                                            </svg>
                                            <a href="https://${escapeHtml(ref.linkedin)}" 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               class="text-gray-700 transition-colors"
                                               onmouseenter="this.style.color='${secondaryColor}'"
                                               onmouseleave="this.style.color='#374151'">
                                                ${escapeHtml(ref.linkedin)}
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="text-center mt-16">
                <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
                    All references have given permission to be contacted regarding my professional qualifications. Please feel free to reach out to them directly or contact me if you need additional references.
                </p>
                <a href="index.html#contact">
                    <button class="inline-flex items-center justify-center text-white h-11 px-8 rounded-lg transition-all duration-300 hover:scale-105"
                            style="background-color: ${primaryColor};"
                            onmouseenter="this.style.backgroundColor='${secondaryColor}'"
                            onmouseleave="this.style.backgroundColor='${primaryColor}'">
                        Contact Me
                    </button>
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="text-white py-12" style="background-color: ${primaryColor};">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4">${escapeHtml(portfolioData.name)}</h3>
                <p class="mb-6" style="color: ${accentColor};">${escapeHtml(portfolioData.title || '')}</p>
                <div class="flex justify-center space-x-6">
                    ${portfolioData.contact?.email ? `
                        <a href="mailto:${escapeHtml(portfolioData.contact.email)}" 
                           class="transition-colors"
                           style="color: ${accentColor};"
                           onmouseenter="this.style.color='white'"
                           onmouseleave="this.style.color='${accentColor}'">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </a>
                    ` : ''}
                    ${portfolioData.contact?.phone ? `
                        <a href="tel:${escapeHtml(portfolioData.contact.phone)}" 
                           class="transition-colors"
                           style="color: ${accentColor};"
                           onmouseenter="this.style.color='white'"
                           onmouseleave="this.style.color='${accentColor}'">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                        </a>
                    ` : ''}
                    ${portfolioData.contact?.linkedin ? `
                        <a href="https://${escapeHtml(portfolioData.contact.linkedin)}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="transition-colors"
                           style="color: ${accentColor};"
                           onmouseenter="this.style.color='white'"
                           onmouseleave="this.style.color='${accentColor}'">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                            </svg>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

// Generate projects page HTML
function generateProjectsHTML() {
  const themeColors = portfolioData.themeColors || {}
  const primaryColor = themeColors.primary || '#0B3D91'
  const secondaryColor = themeColors.secondary || '#17A2B8'
  const accentColor = themeColors.accent || '#F3F4F6'
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects - ${escapeHtml(portfolioData.name)}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="index.html" 
                   class="font-bold text-xl transition-colors cursor-pointer"
                   style="color: ${primaryColor};"
                   onmouseenter="this.style.color='${secondaryColor}'"
                   onmouseleave="this.style.color='${primaryColor}'">
                    ${escapeHtml(portfolioData.name)}
                </a>
                <div class="hidden md:flex space-x-8">
                    <a href="index.html#about" class="text-gray-700 transition-colors" onmouseenter="this.style.color='${primaryColor}'" onmouseleave="this.style.color='#374151'">About</a>
                    <span class="font-semibold" style="color: ${primaryColor};">Projects</span>
                    <a href="index.html#timeline" class="text-gray-700 transition-colors" onmouseenter="this.style.color='${primaryColor}'" onmouseleave="this.style.color='#374151'">Resume</a>
                    <a href="references.html" class="text-gray-700 transition-colors" onmouseenter="this.style.color='${primaryColor}'" onmouseleave="this.style.color='#374151'">References</a>
                    <a href="index.html#contact" class="text-gray-700 transition-colors" onmouseenter="this.style.color='${primaryColor}'" onmouseleave="this.style.color='#374151'">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header Section -->
    <section class="pt-24 pb-12 text-white" style="background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <a href="index.html" class="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-6">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                    Back to Portfolio
                </a>
                <h1 class="text-4xl md:text-5xl font-bold mb-6">My Projects</h1>
                <p class="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                    ${escapeHtml(portfolioData.projectsDescription || 'Explore my recent work and projects')}
                </p>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${portfolioData.projects.map((project) => `
                    <div class="bg-white rounded-lg border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div class="p-8">
                            <h3 class="text-xl font-bold mb-2" style="color: ${primaryColor};">${escapeHtml(project.title)}</h3>
                            <p class="text-gray-600 mb-4">${escapeHtml(project.description)}</p>
                            ${project.technologies && project.technologies.length > 0 ? `
                                <div class="flex flex-wrap gap-2 mb-4">
                                    ${project.technologies.map(tech => `<span class="px-2 py-1 text-xs rounded-full" style="background-color: ${accentColor}; color: ${primaryColor};">${escapeHtml(tech)}</span>`).join('')}
                                </div>
                            ` : ''}
                            <div class="flex gap-2">
                                ${project.githubUrl ? `<a href="${escapeHtml(project.githubUrl)}" target="_blank" class="px-4 py-2 text-sm rounded-lg" style="background-color: ${primaryColor}; color: white;">GitHub</a>` : ''}
                                ${project.liveUrl ? `<a href="${escapeHtml(project.liveUrl)}" target="_blank" class="px-4 py-2 text-sm rounded-lg border" style="border-color: ${primaryColor}; color: ${primaryColor};">Live Demo</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="text-white py-12" style="background-color: ${primaryColor};">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4">${escapeHtml(portfolioData.name)}</h3>
                <p class="mb-6" style="color: ${accentColor};">${escapeHtml(portfolioData.title || '')}</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

// Generate and write multiple HTML files (in root directory for GitHub Pages)
const htmlContent = generateCompleteHTML();

// Write main index.html in root directory
const indexPath = path.join(process.cwd(), 'index.html');
fs.writeFileSync(indexPath, htmlContent);

// Generate references.html if references exist
if ((portfolioData.referencesUrl && portfolioData.referencesUrl.trim() !== '') || (portfolioData.references && portfolioData.references.length > 0)) {
  const referencesContent = generateReferencesHTML();
  const referencesPath = path.join(process.cwd(), 'references.html');
  fs.writeFileSync(referencesPath, referencesContent);
  console.log('References page generated:', referencesPath);
}

// Generate projects.html if projects exist
if (portfolioData.projects && portfolioData.projects.length > 0) {
  const projectsContent = generateProjectsHTML();
  const projectsPath = path.join(process.cwd(), 'projects.html');
  fs.writeFileSync(projectsPath, projectsContent);
  console.log('Projects page generated:', projectsPath);
}

console.log('Complete portfolio HTML generated successfully!');
console.log('Main file:', indexPath);

