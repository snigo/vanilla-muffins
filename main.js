document.getElementById('expandLink').addEventListener('click', (e) => {
  e.preventDefault();
  const expandableSection = document.getElementById('moreInfo');
  if ([...expandableSection.classList].includes('expanded-section')) {
    expandableSection.classList.remove('expanded-section');
    document.getElementById('chevronIcon').classList.add('look-down');
  } else {
    expandableSection.classList.add('expanded-section');
    document.getElementById('chevronIcon').classList.remove('look-down');
  }
});