const toggleClass = (node, class1, class2) => {
  if (class1 === class2) return;
  if (node.classList.contains(class1)) {
    node.classList.add(class2);
    node.classList.remove(class1);
  } else {
    node.classList.add(class1);
    node.classList.remove(class2);
  }
};

const origin = {
  classSelector: document.getElementById('select-origin'),
  styleSelector: document.querySelectorAll('[name="origin-style"]'),
};
const dest = {
  classSelector: document.getElementById('select-dest'),
  styleSelector: document.querySelectorAll('[name="dest-style"]'),
};
const btn = document.getElementById('ni-btn');

btn._getCurrentClass = () => [...btn.classList].find(cls => cls.startsWith('ni-'));
btn._getCurrentStyle = () => btn._getCurrentClass().match(/--(.+)$/)[1];

const getClassName = target => `ni-${target.classSelector.value}--${[...target.styleSelector].find(n => n.checked).value}`;

origin.classSelector.addEventListener('change', function() {
  toggleClass(btn, btn._getCurrentClass(), getClassName(origin));
});

origin.styleSelector.forEach((rb) => {
  rb.addEventListener('change', function() {
    toggleClass(btn, btn._getCurrentClass(), getClassName(origin));
  });
});

dest.classSelector.addEventListener('change', function() {
  if (btn._getCurrentClass() !== getClassName(origin)) {
    toggleClass(btn, btn._getCurrentClass(), getClassName(dest));
  }
});

dest.styleSelector.forEach((rb) => {
  rb.addEventListener('change', function() {
    if (btn._getCurrentClass() !== getClassName(origin)) {
      toggleClass(btn, btn._getCurrentClass(), getClassName(dest));
    }
  });
});

btn.addEventListener('click', function() {
  toggleClass(this, getClassName(origin), getClassName(dest));
});