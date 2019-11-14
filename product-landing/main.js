(function() {
  const slide = node => {
    let l = node.offsetLeft;
    let screeOffset = 1088 - node.parentElement.offsetWidth;
    const move = () => {
      let x = node.offsetLeft - l;
      if (x < -64 - screeOffset - l) {
        node.style.left = `calc(100% - ${l}px)`;
      } else {
        node.style.left = `${x - 1}px`;
      }
    }
    return setInterval(move, 50);
  };
  const icons = [...document.querySelectorAll('.sliding-icon')];
  icons.forEach(slide);
})();