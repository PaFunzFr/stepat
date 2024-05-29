/*---------------*/
// NAVIGATION BAR

const getNavButton = document.querySelector('.navButton');
const getMenuButtonList = document.querySelector('.buttonMenuContainer');
const getDropDownContainer = document.querySelector('.menuButton');

function isMouseLeavingHorizontally(event, element) {
    const rect = element.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right;
}

// HOVER EVENT Computer
getNavButton.addEventListener('mouseover', () => {
    if (!isTouchDevice()) { // is Computer?
        setTimeout(() => {
            getMenuButtonList.style.top = '80px';
        }, 100);
    }
});

getNavButton.addEventListener('mouseleave', (event) => {
    if (!isTouchDevice() && isMouseLeavingHorizontally(event, getNavButton)) { // is Computer and mouse leacing in x?

        setTimeout(() => {
                getMenuButtonList.style.top = '';
        }, 200); 
    }
});

getDropDownContainer.addEventListener('mouseleave', () => {
    if (!isTouchDevice()) { // is Computer?
        
        setTimeout(() => {
                getMenuButtonList.style.top = '';
        }, 200); 
    }
});

// CLICK Event Mobile
let buttonActive = false;

function toggleMenuButton() {
    getNavButton.addEventListener('click', () => {
        if (isTouchDevice()) {
            if (buttonActive) {
                getMenuButtonList.style.top = '';
            } else {
                getMenuButtonList.style.top = '80px';
            }
            buttonActive = !buttonActive; // Toggle status
        }
    });
}

toggleMenuButton(); 

// check if mobile device
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/*---------------*/
//FREEZE SCROLL SNAP (SCROLL ISSUE ANCHOR BUTTONS)
document.querySelectorAll('.anchorLink').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        // temp deactivation of scrollSnapType
        const slider = document.getElementById('slider');
        slider.style.scrollSnapType = 'none';

        // scroll to target
        target.scrollIntoView({ behavior: 'smooth' });

        let scrollTimeout;
        slider.addEventListener('scroll', function onScroll() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                slider.style.scrollSnapType = 'x mandatory';
                slider.removeEventListener('scroll', onScroll);
            }, 100); // adjust the timeout as needed
        });
    });
});

/*---------------*/
// BUTTONS SLIDER

const buttonNext = document.querySelector('.btn-nxt');
const buttonPrevious = document.querySelector('.btn-pre');
const slider = document.querySelector('.topic-slider');
const sliderItems = document.querySelectorAll('.slider-item');

buttonNext.addEventListener('click', () => {
    const sliderVisibleWidth = slider.clientWidth;
    slider.scrollBy({ left: sliderVisibleWidth, behavior: 'smooth' });

    if (slider.scrollLeft + sliderVisibleWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
    }
});

buttonPrevious.addEventListener('click', () => {
    const sliderVisibleWidth = slider.clientWidth;
    slider.scrollBy({ left: -sliderVisibleWidth, behavior: 'smooth' });

    if (slider.scrollLeft === 0) {
        slider.scrollTo({ left: slider.scrollWidth - sliderVisibleWidth, behavior: 'smooth' });
    }
});

/*---------------*/
// HOVER EFFECT SLIDER

const hoveredItems = document.querySelectorAll('.report-item, .photos-item');

hoveredItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        const highlightedTexts = event.currentTarget.querySelector('.report-title, .photos-title');
        highlightedTexts.style.color = 'hsla(37, 65%, 62%, 1)';
        highlightedTexts.style.fontWeight = 'bolder';
    });

    item.addEventListener('mouseout', () => {
        const highlightedTexts = event.currentTarget.querySelector('.report-title, .photos-title');
        highlightedTexts.style.color = '';
        highlightedTexts.style.fontWeight = '';
    });
});

/*---------------*/
// TRAVEL REPORT SEARCH INPUT

document.getElementById('searchInput').addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const listItems = document.querySelectorAll('.report-item');

    listItems.forEach(function (entry) {
        const itemText = entry.textContent.toLowerCase();

        if (itemText.includes(searchTerm)) {
            entry.style.display = 'list-item';
            entry.parentNode.style.listStyleType = 'none';
        } else {
            entry.style.display = 'none';
        }
    });
});

/*---------------*/
// TRAVEL REPORT FILTER BY YEAR AND TAG

document.addEventListener("DOMContentLoaded", function() {
    // DROPDOWN FILTER BY YEAR
    var dropdownYearLinks = document.querySelectorAll('.dropdown-content li');
    var dropdownYearButton = document.querySelector('.dropdown button');
  
    dropdownYearLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault(); // verhindert Standardverhalten vom Link (keine URL)
        
        var year = link.textContent.trim(); // get text of link
        dropdownYearButton.textContent = year; // change button text
        toggleFilterByYear(year); // Filter by year
        applyFilters();
      });
    });
  
    // TAG TOGGLE
    var tagElements = document.querySelectorAll('.taglist li');
  
    tagElements.forEach(function(tagElement) {
      tagElement.addEventListener('click', toggleFilterByTag);
    });
    
    // Dropdown "- all -" selection
    var dropdownAllOption = document.querySelector('.dropdown-content li:first-child');
    dropdownAllOption.addEventListener('click', function(event) {
      event.preventDefault();
      dropdownYearButton.textContent = 'Year'; // reset Dropdown-Text
      resetFilterByYear(); 
      applyFilters(); 
    });
});

function toggleFilterByTag() {
    var isActive = this.classList.toggle('active');
    this.style.color = isActive ? 'hsla(190, 38%, 10%, 1)' : '';
    this.style.background = isActive ? 'hsla(188, 59%, 85%, 0.5)' : '';
    this.style.border = isActive ? '0.1vh solid hsla(190, 38%, 10%, 1)' : '';
    applyFilters();
}

function applyFilters() {
    var reportItems = document.querySelectorAll('.reports-grid .report-item');
    var activeTags = document.querySelectorAll('.taglist li.active');
    var activeTagNames = Array.from(activeTags).map(function(activeTag) {
      return activeTag.textContent.trim();
    });
    var selectedYear = document.querySelector('.dropdown button').textContent.trim();
    
    reportItems.forEach(function(reportItem) {
        var isActiveYear = selectedYear === 'Year' || reportItem.classList.contains('year' + selectedYear);
        var isActiveTag = activeTagNames.length === 0 || Array.from(reportItem.querySelectorAll('.content-tag a')).some(function(tagLink) {
            return activeTagNames.includes(tagLink.textContent.trim().substring(1));
        });
        var allActiveTagsPresent = activeTagNames.every(function(activeTagName) {
            return Array.from(reportItem.querySelectorAll('.content-tag a')).some(function(tagLink) {
                return activeTagName === tagLink.textContent.trim().substring(1);
            });
        });
        reportItem.style.display = isActiveYear && isActiveTag && allActiveTagsPresent ? 'block' : 'none'; // Cheack for year and also active tag names
    });
}

function toggleFilterByYear(year) {
    var reportItems = document.querySelectorAll('.reports-grid .report-item');
    reportItems.forEach(function(reportItem) {
        var isActiveYear = year === 'all' || reportItem.classList.contains('year' + year);
        reportItem.style.display = isActiveYear ? 'block' : 'none';
    });
}

function resetFilterByYear() {
    var reportItems = document.querySelectorAll('.reports-grid .report-item');
    reportItems.forEach(function(reportItem) {
        reportItem.style.display = 'block'; // show all repotItems
    });
}

/*--------------------------*/
/* REPORT POPUP PIC GALLERY HEIGHT */

document.addEventListener("DOMContentLoaded", function() {
    function setGalleryImageHeights() {
        const gallery = document.querySelector('.picture-gallery');
        const pics = gallery.querySelectorAll('.tourPic');
        const numPics = pics.length / 2; // 2 columns for each
        const gap = 5; // 10px gap
        const initialHeight = 152; // 152px / offset

        const picHeight = `calc((100vh - ${initialHeight}px - (${gap}px * (${numPics} - 1))) / ${numPics})`;

        pics.forEach(pic => {

            if (window.innerWidth > 1054) {
                    pic.style.height = picHeight;

            } else if (window.innerWidth > 550) {
                    pic.style.height = `calc(${picHeight} / 1.6)`;

            } else{
                    pic.style.height = '28vh';
                }

        });
    }
        setGalleryImageHeights();

    // Update heights on window resize
    window.addEventListener('resize', setGalleryImageHeights);
});