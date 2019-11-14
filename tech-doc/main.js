(function() {
  const sideBar = {
    node: document.getElementById('sidebar'),
    width: 296,
    isOpen: true,
    isSticky: false,
    navLinks: document.querySelectorAll('.nav-link'),
    close() {
      this.isOpen = false;
      this.width = 0;
      this.node.style.maxWidth = '0';
      this.node.style.minWidth = '0';
    },
    open() {
      this.isOpen = true;
      this.width = 296;
      this.node.style.maxWidth = '100%';
      this.node.style.minWidth = '296px';
    },
    toggle() {
      this.isOpen ? this.close() : this.open();
    },
    stick() {
      this.isSticky = true;
      this.node.classList.add('sticky');
    },
    unstick() {
      this.isSticky = false;
      this.node.classList.remove('sticky');
    },
    activateLink(i) {
      this.navLinks.forEach(l => l.classList.remove('active-nav-link'));
      i > -1 && this.navLinks[i].classList.add('active-nav-link');
    }
  };

  const topBar = {
    node: document.querySelector('header'),
    height: 72,
    isOpen: true,
    isSticky: false,
    close() {
      this.isOpen = false;
      this.heigth = 0;
      this.node.style.maxHeight = '0';
    },
    open() {
      this.isOpen = true;
      this.height = 72;
      this.node.style.maxHeight = '72px';
    },
    hardClose() {
      this.node.classList.remove('animate');
      this.close();
      setTimeout(() => this.node.classList.add('animate'), 201);
    },
    toggle() {
      this.isOpen ? this.close() : this.open();
    },
    stick() {
      this.isSticky = true;
      this.node.classList.add('sticky');
    },
    unstick() {
      this.isSticky = false;
      this.node.classList.remove('sticky');
    }
  };

  const mainPane = {
    node: document.querySelector('main'),
    top: 72,
    chapters: document.querySelectorAll('.page-anchor'),
    chapterOffsets: [],
    updateOffsets() {
      this.chapterOffsets = [];
      this.chapters.forEach(c => this.chapterOffsets.push(c.offsetTop));
      console.log(this.chapterOffsets[5]);
    },
    addChaptersMargin() {
      this.chapters.forEach(c => c.style.top = 'calc(-2em - 72px)');
    },
    removeChaptersMargin() {
      this.chapters.forEach(c => c.style.top = '-2em');
    },
    getCurrentChapter() {
      if (window.scrollY + window.innerHeight > document.body.clientHeight - 72) return this.chapterOffsets.length - 1;
      return this.chapterOffsets.filter(o => o - 72 < window.scrollY).length - 1;
    }
  };
  // Initialize charper offsets
  mainPane.chapters.forEach(c => mainPane.chapterOffsets.push(c.offsetTop));
  const navBtn = document.getElementById('navBtn');

  // EVENT LISTENERS
  // 1. Toggle sidebar
  navBtn.addEventListener('click', () => {
    sideBar.toggle();
    if (sideBar.isSticky && sideBar.isOpen) {
      mainPane.node.classList.add('animate');
      mainPane.node.style.marginLeft = '296px';
      setTimeout(() => mainPane.node.classList.remove('animate'), 201);
      mainPane.updateOffsets();
    } else if (sideBar.isSticky && !sideBar.isOpen) {
      mainPane.node.classList.add('animate');
      mainPane.node.style.marginLeft = '29.5px';
      setTimeout(() => mainPane.node.classList.remove('animate'), 201);
      mainPane.updateOffsets();
    } else {
      mainPane.node.classList.add('animate');
      mainPane.node.style.marginLeft = '0';
      setTimeout(() => mainPane.node.classList.remove('animate'), 201);
      mainPane.updateOffsets();
    }
    if (sideBar.isOpen) {
      navBtn.classList.add('burger');
      navBtn.classList.remove('arrow');
      if (window.innerWidth < 768) {
        mainPane.node.style.minWidth = '100%';
      } else {
        mainPane.node.style.minWidth = '296px';
      }
    } else {
      navBtn.classList.add('arrow');
      navBtn.classList.remove('burger');
    }
  });
  // 2. Resize events
  window.addEventListener('resize', () => {
    window.innerWidth < 768 && sideBar.isOpen && navBtn.click();
    mainPane.updateOffsets();
  });

  // 3. Scroll events
  let currentScrollY = 0;
  document.addEventListener('scroll', function() {
    // SCROLL STATE 1: ScrollY is more than topBar.height
    if (window.scrollY > topBar.height) {
      // Stick sidebar and fix main margins
      if (!sideBar.isSticky) {
        sideBar.stick();
        mainPane.node.style.marginLeft = sideBar.isOpen ? '296px' : '29.5px';
      }
      // Hide topBar on scroll down and show on scroll up
      if (window.scrollY > currentScrollY) {
        if (topBar.isOpen) {
          window.scrollY < topBar.height * 2 ? topBar.hardClose() : topBar.close();
        }
      } else {
        if (!topBar.isOpen) {
          topBar.open();
          
        }
      }
      // Stick topBar
      if (!topBar.isSticky) {
        topBar.stick();
        mainPane.node.style.marginTop = '72px';
      }

      
    } else {
    // SCROLL STATE 2: ScrollY is less or equal than topBar.height
      if (sideBar.isSticky && window.scrollY < 16) {
        sideBar.unstick();
        mainPane.node.style.marginLeft = '0';
      }
      if (topBar.isSticky && window.scrollY < 16) {
        topBar.unstick();
        mainPane.node.style.marginTop = '0';
      }
    }
    // Activate navigation links
    sideBar.activateLink(mainPane.getCurrentChapter());

    // Update currentScrollY
    currentScrollY = window.scrollY;
  });

  // 4. Nav links click
  sideBar.navLinks.forEach(l => l.addEventListener('click', function(e) {
    e.preventDefault();
    let pos = mainPane.chapterOffsets[[...sideBar.navLinks].indexOf(l)];
    pos > currentScrollY ? mainPane.removeChaptersMargin() : mainPane.addChaptersMargin();
    topBar.isSticky && mainPane.node.classList.add('animate');
    window.location.href = l.href;
    window.innerWidth < 768 && sideBar.isOpen && navBtn.click();
    setTimeout(() => mainPane.node.classList.remove('animate'), 201);
  }));
  //INIT
  window.innerWidth < 768 && sideBar.isOpen && navBtn.click();
})();